import { generateQueryKey } from '../../common/utils/generate-query-key.util';
import { GetListCouponsRequestDto } from '../dto/list-coupon.dto';

const PREFIX = 'coupon';

export const CouponCacheKeys = {
	id: (id: string) => `${PREFIX}:${id}`,
	list: (version: number, query: GetListCouponsRequestDto) => `${PREFIX}:list:v${version}:${generateQueryKey(query)}`,
	LIST_VERSION: `${PREFIX}:list:version`
} as const;
