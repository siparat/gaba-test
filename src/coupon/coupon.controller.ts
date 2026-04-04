import { Body, Controller, Param, ParseUUIDPipe, Patch, Post, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';
import { CouponService } from './coupon.service';
import { CreateCouponRequestDto, CreateCouponResponseDto } from './dto/create-coupon.dto';
import { UpdateCouponRequestDto, UpdateCouponResponseDto } from './dto/update-coupon.dto';
import { ApiCodeConflictException } from './exceptions/code-conflict.exception';
import { ApiCouponNotFoundException } from './exceptions/coupon-not-found.exception';

@Controller('coupon')
export class CouponController {
	constructor(private readonly couponService: CouponService) {}

	@ApiHeader({ name: 'idempotency-key' })
	@ApiCreatedResponse({ type: CreateCouponResponseDto })
	@ApiCodeConflictException()
	@ApiOperation({ summary: 'Создание купона' })
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
	@ApiOperation({ summary: 'Изменение купона' })
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
}
