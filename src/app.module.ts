import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { environmentSchema } from './common/schemas/environment.schema';
import { getLoggerConfig } from './configs/logger.config';
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
