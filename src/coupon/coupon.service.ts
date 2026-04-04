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

@Injectable()
export class CouponService {
	constructor(
		private database: DatabaseService,
		private logger: Logger,
		private cache: Cache
	) {}

	async create(dto: CreateCouponRequestDto): Promise<CreateCouponResponseDto> {
		const isAlreadyWithCode = await this.database.coupon.findUnique({ where: { code: dto.code } });
		if (isAlreadyWithCode) {
			throw new CodeConflictException(dto.code);
		}

		try {
			const coupon = await this.database.coupon.create({ data: CouponRepositoryMapper.toCreate(dto) });
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
