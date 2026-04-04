import { CouponCreateInput, CouponUpdateInput } from '../../../generated/prisma/models';
import { CreateCouponRequestDto } from '../dto/create-coupon.dto';
import { UpdateCouponRequestDto } from '../dto/update-coupon.dto';

export class CouponRepositoryMapper {
	static toCreate(dto: CreateCouponRequestDto): CouponCreateInput {
		return {
			code: dto.code,
			discount: dto.discount,
			activatedCount: 0,
			expiredAt: dto.expiredAt,
			maxActivations: dto.maxActivations
		};
	}

	// Не нерушает DRY - разные типы возвращаемых данных, разные DTO
	static toUpdate(dto: UpdateCouponRequestDto): CouponUpdateInput {
		return {
			code: dto.code,
			discount: dto.discount,
			activatedCount: 0,
			expiredAt: dto.expiredAt,
			maxActivations: dto.maxActivations
		};
	}
}
