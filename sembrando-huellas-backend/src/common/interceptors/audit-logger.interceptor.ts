import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditSecurity');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, user } = request;
    const userAgent = request.get('user-agent') || 'unknown';
    const now = Date.now();

    // Only audit mutating methods (POST, PUT, PATCH, DELETE) or sensitive paths
    const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    return next.handle().pipe(
      tap({
        next: () => {
          if (isMutating) {
            const delay = Date.now() - now;
            this.logger.log(
              JSON.stringify({
                level: 'INFO',
                category: 'AUDIT',
                method,
                url,
                status: 'SUCCESS',
                userId: user?.id || 'anonymous',
                userRole: user?.role || 'public',
                ip,
                userAgent,
                durationMs: delay,
                timestamp: new Date().toISOString(),
              }),
            );
          }
        },
        error: (err) => {
          const delay = Date.now() - now;
          this.logger.warn(
            JSON.stringify({
              level: 'WARN',
              category: 'SECURITY_AUDIT',
              method,
              url,
              status: 'FAILURE',
              errorCode: err.status || 500,
              errorMessage: err.message,
              userId: user?.id || 'anonymous',
              ip,
              userAgent,
              durationMs: delay,
              timestamp: new Date().toISOString(),
            }),
          );
        },
      }),
    );
  }
}
