import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environmentSchema } from './common/schemas/environment.schema';
import { LoggerModule } from 'nestjs-pino';
import { getLoggerConfig } from './configs/logger.config';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from './database/database.module';

@Module({
	controllers: [AppController],
	imports: [
		DatabaseModule,
		TerminusModule.forRoot(),
		LoggerModule.forRootAsync(getLoggerConfig()),
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (config) => environmentSchema.parse(config)
		})
	]
})
export class AppModule {}
