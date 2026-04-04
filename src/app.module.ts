import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environmentSchema } from './common/schemas/environment.schema';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (config) => environmentSchema.parse(config)
		})
	]
})
export class AppModule {}
