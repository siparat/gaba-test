import { Controller, Get } from '@nestjs/common';
import {
	HealthCheck,
	HealthCheckResult,
	HealthCheckService,
	HealthIndicatorResult,
	PrismaHealthIndicator
} from '@nestjs/terminus';
import { DatabaseService } from './common/database/database.service';

@Controller()
export class AppController {
	constructor(
		private prismaIndicator: PrismaHealthIndicator,
		private health: HealthCheckService,
		private database: DatabaseService
	) {}

	@HealthCheck()
	@Get('/health')
	healthChech(): Promise<HealthCheckResult> {
		return this.health.check([
			(): Promise<HealthIndicatorResult> => this.prismaIndicator.pingCheck('database', this.database)
		]);
	}
}
