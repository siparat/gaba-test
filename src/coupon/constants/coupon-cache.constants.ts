import { generateQueryKey } from '../../common/utils/generate-query-key.util';
import { GetListCouponsRequestDto } from '../dto/list-coupon.dto';

const PREFIX = 'coupon';

export const CouponCacheKeys = {
	id: (id: string) => `${PREFIX}:${id}`,
	list: (query: GetListCouponsRequestDto) => `${PREFIX}:${generateQueryKey(query)}`
} as const;
