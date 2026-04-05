import z from 'zod';

export const couponSchema = z
	.object({
		id: z.string().describe('Уникальный идентификатор промокода'),
		code: z.string().describe('Код промокода'),
		discount: z.number().describe('Скидка в процентах'),
		activatedCount: z.number().describe('Кол-во активаций промокода'),
		maxActivations: z.number().describe('Максимальное кол-во активаций'),
		expiredAt: z.coerce.date().describe('Дата окончания срока действия промокода'),
		createdAt: z.coerce.date().describe('Дата создания промокода')
	})
	.strip();
