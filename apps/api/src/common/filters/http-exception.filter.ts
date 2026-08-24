import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionRes = exception.getResponse() as any;
      if (typeof exceptionRes === 'object' && exceptionRes !== null) {
        message = exceptionRes.message || exceptionRes;
        error = exceptionRes.error || error;
      } else {
        message = exceptionRes;
      }
    } else if (exception instanceof Error) {
      console.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      message: Array.isArray(message) ? message : [message],
      error,
    });
  }
}
