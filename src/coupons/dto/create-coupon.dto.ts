import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { couponSchema } from '../schemas/coupon.schema';

export const createCouponRequestSchema = z.object({
	code: z
		.string()
		.trim()
		.regex(/^[a-zA-Z0-9]+$/)
		.min(4)
		.max(256)
		.describe('Уникальный код купона, от 4 до 256 символов, на латинице и цифрха'),
	discount: z.number().min(1).max(100).describe('Скидка в процентах, от 1 до 100'),
	maxActivations: z
		.number()
		.min(1)
		.max(2_147_483_647)
		.describe('Макс колво активаций купона, максимально 2147483647 чтобы ошибка бд не возникала'),
	expiredAt: z.string().datetime().describe('Дата окончания срока действия купона')
});

export class CreateCouponRequestDto extends createZodDto(createCouponRequestSchema) {}

export class CreateCouponResponseDto extends createZodDto(couponSchema) {}
