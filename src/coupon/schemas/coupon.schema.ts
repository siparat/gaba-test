import z from 'zod';

export const couponSchema = z.object({
	id: z.string().describe('Уникальный идентификатор купона'),
	code: z.string().describe('Код купона'),
	discount: z.number().describe('Скидка в процентах'),
	maxActivations: z.number().describe('Максимальное кол-во активаций'),
	expiredAt: z.coerce.date().describe('Дата окончания срока действия купона'),
	createdAt: z.coerce.date().describe('Дата создания купона')
});
