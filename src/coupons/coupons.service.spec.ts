import { Logger } from 'nestjs-pino';
import { DatabaseService } from '../common/database/database.service';
import { Test } from '@nestjs/testing';
import { CouponsService } from './coupons.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker/locale/ru';
import { Coupon } from '../../generated/prisma/client';
import { Cache } from '@nestjs/cache-manager';
import { CouponCacheKeys } from './constants/coupon-cache.constants';
import { CouponNotFoundException } from './exceptions/coupon-not-found.exception';
import { GetListCouponsResponseDto } from './dto/list-coupon.dto';
import { CodeConflictException } from './exceptions/code-conflict.exception';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { CreateCouponRequestDto } from './dto/create-coupon.dto';
import { BadDatabaseException } from '../common/exceptions/bad-database.exception';
import { MaxCouponActivatesException } from './exceptions/max-coupon-activates.exception';
import { AlreadyActivatesException } from './exceptions/already-activates.exception';

describe('CouponsService', () => {
	let service: CouponsService;
	let database: DeepMocked<DatabaseService>;
	let logger: DeepMocked<Logger>;
	let cache: DeepMocked<Cache>;

	const coupon: Coupon = {
		id: randomUUID(),
		createdAt: new Date(),
		expiredAt: faker.date.future(),
		maxActivations: faker.number.int(),
		activatedCount: 0,
		code: faker.word.sample(),
		discount: faker.number.int({ min: 1, max: 100 })
	};

	const dto: CreateCouponRequestDto = {
		...coupon,
		expiredAt: coupon.expiredAt.toISOString()
	};

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				CouponsService,
				{ provide: DatabaseService, useValue: createMock<DatabaseService>() },
				{ provide: Logger, useValue: createMock<Logger>() },
				{ provide: Cache, useValue: createMock<Cache>() }
			]
		}).compile();
		service = module.get(CouponsService);
		database = module.get(DatabaseService);
		logger = module.get(Logger);
		cache = module.get(Cache);
	});

	describe('getById', () => {
		it('should return cached coupon if exists in cache', async () => {
			cache.get.mockResolvedValueOnce(coupon);

			const result = await service.getById(coupon.id);
			expect(result).toEqual(coupon);
			expect(cache.get).toHaveBeenCalledWith(CouponCacheKeys.id(coupon.id));
		});

		it('should throw CouponNotFoundException if coupon does not exist', async () => {
			cache.get.mockResolvedValueOnce(undefined);
			database.coupon.findUnique.mockResolvedValueOnce(null);

			await expect(service.getById(randomUUID())).rejects.toThrow(CouponNotFoundException);
		});

		it('should fetch from database and cache the coupon if not cached', async () => {
			cache.get.mockResolvedValueOnce(undefined);
			database.coupon.findUnique.mockResolvedValueOnce(coupon);
			cache.set.mockResolvedValueOnce(undefined);

			const result = await service.getById(coupon.id);
			expect(result).toEqual(coupon);
			expect(cache.set).toHaveBeenCalledWith(CouponCacheKeys.id(coupon.id), coupon, 60_000);
		});
	});

	describe('getList', () => {
		it('should return cached list if exists', async () => {
			const cached: GetListCouponsResponseDto = { coupons: [], meta: { page: 1, totalCount: 0, totalPages: 0 } };
			cache.get.mockResolvedValueOnce(1); // версия списка
			cache.get.mockResolvedValueOnce(cached);

			const result = await service.getList({ page: 1, perPage: 10 });
			expect(result).toEqual(cached);
		});

		it('should fetch list from database and cache it if not cached', async () => {
			const coupons = [coupon];
			cache.get.mockResolvedValueOnce(1);
			cache.get.mockResolvedValueOnce(undefined);
			database.coupon.findMany.mockResolvedValueOnce(coupons);
			database.coupon.count.mockResolvedValueOnce(1);
			cache.set.mockResolvedValueOnce(undefined);

			const result = await service.getList({ page: 1, perPage: 10 });
			expect(result.coupons).toEqual(coupons);
			expect(cache.set).toHaveBeenCalled();
		});
	});

	describe('create', () => {
		it('should throw CodeConflictException if code already exists', async () => {
			database.coupon.findUnique.mockResolvedValueOnce(coupon);

			await expect(service.create(dto)).rejects.toThrow(CodeConflictException);
		});

		it('should create coupon, increment version, and return coupon', async () => {
			database.coupon.findUnique.mockResolvedValueOnce(null);
			database.coupon.create.mockResolvedValueOnce(coupon);
			cache.get.mockResolvedValueOnce(1);
			cache.set.mockResolvedValue(undefined);

			const result = await service.create(dto);
			expect(result).toEqual(coupon);
			expect(cache.set).toHaveBeenCalledWith(CouponCacheKeys.LIST_VERSION, 2);
			expect(logger.log).toHaveBeenCalled();
		});

		it('should prisma conflict error be thrown', async () => {
			database.coupon.findUnique.mockResolvedValueOnce(null);
			database.coupon.create.mockRejectedValueOnce(
				new PrismaClientKnownRequestError('Какая-то ошибка при создании', { code: '', clientVersion: '' })
			);

			await expect(service.create(dto)).rejects.toThrow(BadDatabaseException);
			expect(logger.log).not.toHaveBeenCalled();
		});
	});

	describe('update', () => {
		it('should throw CodeConflictException if code already exists for another coupon', async () => {
			database.coupon.findUnique.mockResolvedValueOnce(coupon);

			await expect(service.update(randomUUID(), { code: coupon.code })).rejects.toThrow(CodeConflictException);
			expect(logger.log).not.toHaveBeenCalled();
		});

		it('should throw CouponNotFoundException if coupon does not exist', async () => {
			database.coupon.findUnique.mockResolvedValueOnce(null);

			await expect(service.update(coupon.id, {})).rejects.toThrow(CouponNotFoundException);
			expect(logger.log).not.toHaveBeenCalled();
		});

		it('should update coupon, increment version, delete cache by id and return coupon', async () => {
			database.coupon.findUnique.mockResolvedValueOnce(coupon);
			database.coupon.update.mockResolvedValueOnce(coupon);
			cache.get.mockResolvedValueOnce(1);
			cache.set.mockResolvedValue(undefined);
			cache.del.mockResolvedValue(true);

			const result = await service.update(coupon.id, { code: 'AAA' });
			expect(result).toEqual(coupon);
			expect(cache.set).toHaveBeenCalledWith(CouponCacheKeys.LIST_VERSION, 2);
			expect(cache.del).toHaveBeenCalledWith(CouponCacheKeys.id(coupon.id));
			expect(logger.log).toHaveBeenCalled();
		});
	});

	describe('activate', () => {
		const email = faker.internet.email();

		it('should activate coupon and log success', async () => {
			const tx = createMock<DatabaseService>();
			tx.coupon.findUnique.mockResolvedValueOnce(coupon);
			tx.coupon.updateMany.mockResolvedValueOnce({ count: 1 });
			tx.couponActivate.create.mockResolvedValueOnce({
				email,
				couponId: coupon.id,
				activatedAt: new Date()
			});
			database.$transaction.mockImplementationOnce(async (callback) => callback(tx));

			await expect(service.activate(email, coupon.code)).resolves.toBeUndefined();
			expect(tx.coupon.findUnique).toHaveBeenCalledWith({ where: { code: coupon.code } });
			expect(tx.coupon.updateMany).toHaveBeenCalledWith({
				where: {
					id: coupon.id,
					activatedCount: { lt: coupon.maxActivations }
				},
				data: {
					activatedCount: { increment: 1 }
				}
			});
			expect(tx.couponActivate.create).toHaveBeenCalledWith({
				data: { email, couponId: coupon.id }
			});
			expect(logger.log).toHaveBeenCalled();
		});

		it('should throw MaxCouponActivatesException if coupon does not exist', async () => {
			const tx = createMock<DatabaseService>();
			tx.coupon.findUnique.mockResolvedValueOnce(null);
			database.$transaction.mockImplementationOnce(async (callback) => callback(tx));

			await expect(service.activate(email, coupon.code)).rejects.toThrow(MaxCouponActivatesException);
			expect(tx.coupon.updateMany).not.toHaveBeenCalled();
			expect(logger.log).not.toHaveBeenCalled();
		});

		it('should throw MaxCouponActivatesException if max activations reached', async () => {
			const tx = createMock<DatabaseService>();
			tx.coupon.findUnique.mockResolvedValueOnce(coupon);
			tx.coupon.updateMany.mockResolvedValueOnce({ count: 0 });
			database.$transaction.mockImplementationOnce(async (callback) => callback(tx));

			await expect(service.activate(email, coupon.code)).rejects.toThrow(MaxCouponActivatesException);
			expect(tx.couponActivate.create).not.toHaveBeenCalled();
			expect(logger.log).not.toHaveBeenCalled();
		});

		it('should throw AlreadyActivatesException when activation already exists', async () => {
			const tx = createMock<DatabaseService>();
			tx.coupon.findUnique.mockResolvedValueOnce(coupon);
			tx.coupon.updateMany.mockResolvedValueOnce({ count: 1 });
			tx.couponActivate.create.mockRejectedValueOnce(new Error('duplicate key'));
			database.$transaction.mockImplementationOnce(async (callback) => callback(tx));

			await expect(service.activate(email, coupon.code)).rejects.toThrow(AlreadyActivatesException);
			expect(logger.log).not.toHaveBeenCalled();
		});
	});
});
