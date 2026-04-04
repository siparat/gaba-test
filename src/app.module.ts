import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { getCacheConfig } from './common/configs/cache.config';
import { getLoggerConfig } from './common/configs/logger.config';
import { DatabaseModule } from './common/database/database.module';
import { environmentSchema } from './common/schemas/environment.schema';
import { CouponModule } from './coupon/coupon.module';

@Module({
	controllers: [AppController],
	imports: [
		CacheModule.registerAsync(getCacheConfig()),
		DatabaseModule,
		TerminusModule.forRoot(),
		LoggerModule.forRootAsync(getLoggerConfig()),
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (config) => environmentSchema.parse(config)
		}),
		CouponModule
	]
})
export class AppModule {}
