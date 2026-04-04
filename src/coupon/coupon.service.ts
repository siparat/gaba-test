import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DatabaseService } from '../database/database.service';
import { CreateCouponRequestDto, CreateCouponResponseDto } from './dto/create-coupon.dto';
import { CodeConflictException } from './exceptions/code-conflict.exception';
import { CouponRepositoryMapper } from './mappers/coupon-repository.mapper';

@Injectable()
export class CouponService {
	constructor(
		private database: DatabaseService,
		private logger: Logger
	) {}

	async create(dto: CreateCouponRequestDto): Promise<CreateCouponResponseDto> {
		const isAlreadyWithCode = await this.database.coupon.findUnique({ where: { code: dto.code } });
		if (isAlreadyWithCode) {
			throw new CodeConflictException(dto.code);
		}

		const coupon = await this.database.coupon.create({ data: CouponRepositoryMapper.toCreate(dto) });
		this.logger.log('Купон создан', { couponId: coupon.id, code: coupon.code, discount: coupon.discount });
		return coupon;
	}
}
