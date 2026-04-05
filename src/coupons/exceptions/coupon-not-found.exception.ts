import { applyDecorators, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

export class CouponNotFoundException extends NotFoundException {
	constructor(id: string) {
		super(CouponNotFoundException.name, { description: `Промокод ${id} не найден` });
	}
}

export const ApiCouponNotFoundException = (): MethodDecorator => {
	return applyDecorators(
		ApiNotFoundResponse({
			schema: {
				example: {
					statusCode: HttpStatus.NOT_FOUND,
					message: 'Промокод f47ac10b-58cc-4372-a567-0e02b2c3d479 не найден',
					error: CouponNotFoundException.name
				}
			}
		})
	);
};
