import { applyDecorators, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

export class BadDatabaseException extends InternalServerErrorException {
	constructor() {
		super(BadDatabaseException.name, { description: 'Ошибка при запросе к базе данных, попробуйте позже' });
	}
}

export const ApiBadDatabaseException = (): MethodDecorator => {
	return applyDecorators(
		ApiInternalServerErrorResponse({
			schema: {
				example: {
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
					message: 'Ошибка при запросе к базе данных, попробуйте позже',
					error: BadDatabaseException.name
				}
			}
		})
	);
};
