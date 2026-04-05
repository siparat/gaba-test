import z from 'zod';
import { createCouponRequestSchema } from './create-coupon.dto';
import { createZodDto } from 'nestjs-zod';

export const activateCouponRequestSchema = z.object({
	code: createCouponRequestSchema.shape.code,
	email: z.string().email()
});

export class ActivateCouponRequestDto extends createZodDto(activateCouponRequestSchema) {}

export const activateCouponResponseSchema = z.object({
	success: z.literal(true)
});

export class ActivateCouponResponseDto extends createZodDto(activateCouponResponseSchema) {}
