import { applyDecorators, ConflictException, HttpStatus } from '@nestjs/common';
import { ApiConflictResponse } from '@nestjs/swagger';

export class CodeConflictException extends ConflictException {
	constructor(code: string) {
		super(CodeConflictException.name, { description: `Купон с кодом ${code} уже существует` });
	}
}

export const ApiCodeConflictException = (): MethodDecorator => {
	return applyDecorators(
		ApiConflictResponse({
			schema: {
				example: {
					statusCode: HttpStatus.CONFLICT,
					message: 'Купон с кодом ABC123 уже существует',
					error: CodeConflictException.name
				}
			}
		})
	);
};
