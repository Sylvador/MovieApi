import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { createLogger, transports } from 'winston';

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: '../../../../logs/error.log' }),
  ],
});

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error: any = exception.getError();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response
    .status(error?.statusCode || 500)
    .json(error);

    logger.error(error?.message, { stack: exception?.stack });
  }
}
