import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DatabaseService } from '../common/database/database.service';
import { CreateCouponRequestDto, CreateCouponResponseDto } from './dto/create-coupon.dto';
import { UpdateCouponRequestDto } from './dto/update-coupon.dto';
import { CodeConflictException } from './exceptions/code-conflict.exception';
import { CouponRepositoryMapper } from './mappers/coupon-repository.mapper';
import { Coupon } from '../../generated/prisma/client';
import { CouponCacheKeys } from './constants/coupon-cache.constants';
import { Cache } from '@nestjs/cache-manager';
import { BadDatabaseException } from '../common/exceptions/bad-database.exception';
import { CouponNotFoundException } from './exceptions/coupon-not-found.exception';
import { GetListCouponsRequestDto, GetListCouponsResponseDto } from './dto/list-coupon.dto';

@Injectable()
export class CouponService {
	constructor(
		private database: DatabaseService,
		private logger: Logger,
		private cache: Cache
	) {}

	async getById(id: string): Promise<Coupon> {
		const cacheKey = CouponCacheKeys.id(id);
		const cachedValue = await this.cache.get<Coupon>(cacheKey);
		if (cachedValue) {
			return cachedValue;
		}

		const coupon = await this.database.coupon.findUnique({ where: { id } });
		if (!coupon) {
			throw new CouponNotFoundException(id);
		}

		await this.cache.set(cacheKey, coupon, 60_000);

		return coupon;
	}

	async getList(query: GetListCouponsRequestDto): Promise<GetListCouponsResponseDto> {
		const { page, perPage } = query;
		const listVersion = (await this.cache.get<number>(CouponCacheKeys.LIST_VERSION)) || 1;
		const cacheKey = CouponCacheKeys.list(listVersion, query);
		const cachedValue = await this.cache.get<GetListCouponsResponseDto>(cacheKey);
		if (cachedValue) {
			return cachedValue;
		}

		const [coupons, totalCount] = await Promise.all([
			this.database.coupon.findMany({
				take: perPage,
				skip: perPage * (page - 1)
			}),
			this.database.coupon.count()
		]);

		const result = {
			coupons,
			meta: {
				page,
				totalCount,
				totalPages: Math.ceil(totalCount / perPage)
			}
		};
		await this.cache.set(cacheKey, result, 60_000);
		return result;
	}

	async create(dto: CreateCouponRequestDto): Promise<CreateCouponResponseDto> {
		const isAlreadyWithCode = await this.database.coupon.findUnique({ where: { code: dto.code } });
		if (isAlreadyWithCode) {
			throw new CodeConflictException(dto.code);
		}

		try {
			const coupon = await this.database.coupon.create({ data: CouponRepositoryMapper.toCreate(dto) });

			const version = (await this.cache.get<number>(CouponCacheKeys.LIST_VERSION)) || 1;
			await this.cache.set(CouponCacheKeys.LIST_VERSION, version + 1);

			this.logger.log('Купон создан', { couponId: coupon.id, code: coupon.code, discount: coupon.discount });
			return coupon;
		} catch (error) {
			this.logger.error(error);
			throw new BadDatabaseException();
		}
	}

	async update(id: string, dto: UpdateCouponRequestDto): Promise<CreateCouponResponseDto> {
		if (dto.code) {
			const isAlreadyWithCode = await this.database.coupon.findUnique({ where: { code: dto.code } });
			if (isAlreadyWithCode && isAlreadyWithCode.id !== id) {
				throw new CodeConflictException(dto.code);
			}
		}

		const isExistsCoupon = await this.database.coupon.findUnique({ where: { id } });
		if (!isExistsCoupon) {
			throw new CouponNotFoundException(id);
		}

		try {
			const coupon = await this.database.coupon.update({
				where: { id },
				data: CouponRepositoryMapper.toUpdate(dto)
			});

			const version = (await this.cache.get<number>(CouponCacheKeys.LIST_VERSION)) || 1;
			await Promise.all([
				this.cache.set(CouponCacheKeys.LIST_VERSION, version + 1),
				this.cache.del(CouponCacheKeys.id(coupon.id))
			]);

			this.logger.log('Купон обновлен', {
				newData: dto,
				couponId: id,
				code: coupon.code,
				discount: coupon.discount
			});
			return coupon;
		} catch (error) {
			this.logger.error(error);
			throw new BadDatabaseException();
		}
	}
}
