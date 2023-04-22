import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: object, host: ArgumentsHost) {
    console.log('caught an error');
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse()
    const request = ctx.getRequest();
    response
    .getResponse()
    .status(exception['statusCode'])
    .json({
      message: exception['message'],
      statusCode: exception['statusCode'],
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}