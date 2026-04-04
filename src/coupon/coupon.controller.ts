import { Body, Controller, Post, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';
import { CouponService } from './coupon.service';
import { CreateCouponRequestDto, CreateCouponResponseDto } from './dto/create-coupon.dto';
import { ApiCodeConflictException } from './exceptions/code-conflict.exception';

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
		return this.couponService.create(dto);
	}
}
