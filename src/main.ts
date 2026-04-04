import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true
	});
	app.enableShutdownHooks();
	app.useLogger(app.get(Logger));

	const config = new DocumentBuilder().setTitle('Тестовое задание Gaba').setVersion('0.1').build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('openapi', app, document);

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
