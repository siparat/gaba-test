import { applyDecorators, ForbiddenException, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';

export class MaxCouponActivatesException extends ForbiddenException {
	constructor(code: string) {
		super(MaxCouponActivatesException.name, {
			description: `Промокод ${code} не существует, либо все активации использованы`
		});
	}
}

export const ApiMaxCouponActivatesException = (): MethodDecorator => {
	return applyDecorators(
		ApiForbiddenResponse({
			schema: {
				example: {
					statusCode: HttpStatus.FORBIDDEN,
					message: 'Промокод ABC123 не существует, либо все активации использованы',
					error: MaxCouponActivatesException.name
				}
			}
		})
	);
};
