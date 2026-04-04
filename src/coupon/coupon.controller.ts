import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { CouponService } from './coupon.service';
import { CreateCouponRequestDto, CreateCouponResponseDto } from './dto/create-coupon.dto';
import { ApiCodeConflictException } from './exceptions/code-conflict.exception';

@Controller('coupon')
export class CouponController {
	constructor(private readonly couponService: CouponService) {}

	@ApiCreatedResponse({ type: CreateCouponResponseDto })
	@ApiCodeConflictException()
	@ApiOperation({ summary: 'Создание купона' })
	@UsePipes(ZodValidationPipe)
	@Post()
	async create(@Body() dto: CreateCouponRequestDto): Promise<CreateCouponResponseDto> {
		return this.couponService.create(dto);
	}
}
