import { applyDecorators, ConflictException } from '@nestjs/common';
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
					statusCode: 409,
					message: 'Купон с кодом ABC123 уже существует',
					error: CodeConflictException.name
				}
			}
		})
	);
};
