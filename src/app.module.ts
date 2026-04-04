import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environmentSchema } from './common/schemas/environment.schema';
import { LoggerModule } from 'nestjs-pino';
import { getLoggerConfig } from './configs/logger.config';

@Module({
	imports: [
		LoggerModule.forRootAsync(getLoggerConfig()),
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (config) => environmentSchema.parse(config)
		})
	]
})
export class AppModule {}
