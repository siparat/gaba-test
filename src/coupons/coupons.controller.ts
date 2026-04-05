import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	UseInterceptors,
	UsePipes
} from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { createZodDto, ZodValidationPipe } from 'nestjs-zod';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';
import { CouponsService } from './coupons.service';
import { CreateCouponRequestDto, CreateCouponResponseDto } from './dto/create-coupon.dto';
import { UpdateCouponRequestDto, UpdateCouponResponseDto } from './dto/update-coupon.dto';
import { ApiCodeConflictException } from './exceptions/code-conflict.exception';
import { ApiCouponNotFoundException } from './exceptions/coupon-not-found.exception';
import { ApiBadDatabaseException } from '../common/exceptions/bad-database.exception';
import { Coupon } from '../../generated/prisma/client';
import { couponSchema } from './schemas/coupon.schema';
import { GetListCouponsRequestDto, GetListCouponsResponseDto } from './dto/list-coupon.dto';
import { ActivateCouponRequestDto, ActivateCouponResponseDto } from './dto/activate-coupon.dto';
import { ApiMaxCouponActivatesException } from './exceptions/max-coupon-activates.exception';
import { ApiAlreadyActivatesException } from './exceptions/already-activates.exception';

@Controller('coupons')
export class CouponsController {
	constructor(private readonly couponService: CouponsService) {}

	@ApiHeader({ name: 'idempotency-key' })
	@ApiCreatedResponse({ type: CreateCouponResponseDto })
	@ApiCodeConflictException()
	@ApiBadDatabaseException()
	@ApiOperation({ summary: 'Создание промокода' })
	@UseInterceptors(IdempotencyInterceptor)
	@UsePipes(ZodValidationPipe)
	@Post()
	async create(@Body() dto: CreateCouponRequestDto): Promise<CreateCouponResponseDto> {
		const coupon = await this.couponService.create(dto);
		return CreateCouponResponseDto.schema.parseAsync(coupon);
	}

	@ApiHeader({ name: 'idempotency-key' })
	@ApiCreatedResponse({ type: UpdateCouponResponseDto })
	@ApiCouponNotFoundException()
	@ApiCodeConflictException()
	@ApiBadDatabaseException()
	@ApiOperation({ summary: 'Изменение промокода' })
	@UseInterceptors(IdempotencyInterceptor)
	@UsePipes(ZodValidationPipe)
	@Patch(':id')
	async update(
		@Body() dto: UpdateCouponRequestDto,
		@Param('id', ParseUUIDPipe) id: string
	): Promise<UpdateCouponResponseDto> {
		const coupon = await this.couponService.update(id, dto);
		return UpdateCouponResponseDto.schema.parseAsync(coupon);
	}

	@ApiOkResponse({ type: createZodDto(couponSchema) })
	@ApiCouponNotFoundException()
	@ApiOperation({ summary: 'Получение промокода по id' })
	@Get(':id')
	async get(@Param('id', ParseUUIDPipe) id: string): Promise<Coupon> {
		return this.couponService.getById(id);
	}

	@ApiOkResponse({ type: GetListCouponsResponseDto })
	@ApiOperation({ summary: 'Получение списка промокодов с пагинацией' })
	@Get()
	async list(@Query(ZodValidationPipe) query: GetListCouponsRequestDto): Promise<GetListCouponsResponseDto> {
		const list = await this.couponService.getList(query);
		return GetListCouponsResponseDto.schema.parseAsync(list);
	}

	@ApiMaxCouponActivatesException()
	@ApiAlreadyActivatesException()
	@ApiOperation({ summary: 'Активация промокода по коду' })
	@HttpCode(HttpStatus.OK)
	@UsePipes(ZodValidationPipe)
	@Post('activate')
	async activate(@Body() { email, code }: ActivateCouponRequestDto): Promise<ActivateCouponResponseDto> {
		await this.couponService.activate(email, code);
		return { success: true };
	}
}
