import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModuleAsyncParams, Params } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { IncomingMessage } from 'node:http';
import { ReqId } from 'pino-http';

export const getLoggerConfig = (): LoggerModuleAsyncParams => ({
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: (config: ConfigService): Params => {
		const isProduction = config.get('NODE_ENV') === 'production';
		return {
			pinoHttp: {
				genReqId: (request: IncomingMessage): ReqId => request.headers['x-request-id'] ?? randomUUID(),
				level: isProduction ? 'info' : 'debug',
				transport: isProduction
					? undefined
					: {
							target: 'pino-pretty',
							options: {
								colorize: true,
								singleLine: false,
								translateTime: 'SYS:standard'
							}
						},
				autoLogging: {
					ignore: (request: IncomingMessage) => request.url === '/health'
				}
			}
		};
	}
});
