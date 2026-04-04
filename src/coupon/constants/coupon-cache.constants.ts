const PREFIX = 'coupon';

export const CouponCacheKeys = {
	id: (id: string) => `${PREFIX}:${id}`
} as const;
