import z from 'zod';

export const environmentSchema = z.object({
	DATABASE_URL: z.string().url(),
	REDIS_URL: z.string().url(),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
});
