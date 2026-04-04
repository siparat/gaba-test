import { createZodDto } from 'nestjs-zod';
import { couponSchema } from '../schemas/coupon.schema';
import { createCouponRequestSchema } from './create-coupon.dto';

export class UpdateCouponRequestDto extends createZodDto(createCouponRequestSchema.partial()) {}

export class UpdateCouponResponseDto extends createZodDto(couponSchema) {}
