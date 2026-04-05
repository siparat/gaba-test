import { applyDecorators, ConflictException, HttpStatus } from '@nestjs/common';
import { ApiConflictResponse } from '@nestjs/swagger';

export class AlreadyActivatesException extends ConflictException {
	constructor() {
		super(AlreadyActivatesException.name, {
			description: `Вы уже активировали данный промокод`
		});
	}
}

export const ApiAlreadyActivatesException = (): MethodDecorator => {
	return applyDecorators(
		ApiConflictResponse({
			schema: {
				example: {
					statusCode: HttpStatus.CONFLICT,
					message: 'Вы уже активировали данный промокод',
					error: AlreadyActivatesException.name
				}
			}
		})
	);
};
