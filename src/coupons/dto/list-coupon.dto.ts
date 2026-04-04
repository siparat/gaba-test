import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { couponSchema } from '../schemas/coupon.schema';

export const getListCouponsRequestSchema = z.object({
	page: z.coerce.number().positive().default(1).describe('Страница с купонами'),
	perPage: z.coerce.number().positive().max(30).default(20).describe('Количество купонов на странице')
});

export class GetListCouponsRequestDto extends createZodDto(getListCouponsRequestSchema) {}

export const getListCouponsResponseSchema = z.object({
	coupons: couponSchema.array(),
	meta: z.object({
		page: z.number().positive(),
		totalPages: z.number().min(0),
		totalCount: z.number().min(0)
	})
});

export class GetListCouponsResponseDto extends createZodDto(getListCouponsResponseSchema) {}
