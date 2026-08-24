import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface ResponseShape<T> {
  data: T;
  meta?: Record<string, unknown>;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ResponseShape<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseShape<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Skip transformation for 204 No Content
    if (response.statusCode === 204) {
      return next.handle() as Observable<ResponseShape<T>>;
    }

    return (next.handle() as Observable<T | ResponseShape<T>>).pipe(
      map((res) => {
        // If the service already wraps the response with { data, meta }, return it as is
        if (res && typeof res === 'object' && 'data' in res) {
          return res;
        }
        // Otherwise, wrap it in { data }
        return { data: res };
      }),
    );
  }
}
