import { CouponCreateInput } from '../../../generated/prisma/models';
import { CreateCouponRequestDto } from '../dto/create-coupon.dto';

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
}
