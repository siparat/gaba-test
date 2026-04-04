import { Cache } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
	constructor(private cache: Cache) {}

	async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<unknown>> {
		const request = context.switchToHttp().getRequest();
		const key = request.headers['idempotency-key'];
		if (!key) return next.handle();

		const cached = await this.cache.get<string>(key);
		if (cached) {
			return of(JSON.parse(cached));
		}

		return next.handle().pipe(
			tap(async (response) => {
				await this.cache.set(key, JSON.stringify(response), 1_440_000);
			})
		);
	}
}
