import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AiCostInterceptor implements NestInterceptor {
  private totalCost = 0;
  private lastReset = Date.now();

  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.resetIfNeeded();
    return next.handle().pipe(
      tap((response: any) => {
        if (response?.cost) {
          this.totalCost += response.cost;
          const limit = this.configService.get<number>('ai.costLimit', 50);
          if (this.totalCost > limit) {
            throw new HttpException('Límite de costos IA diario alcanzado', HttpStatus.TOO_MANY_REQUESTS);
          }
        }
      }),
    );
  }

  private resetIfNeeded() {
    if (Date.now() - this.lastReset > 24 * 60 * 60 * 1000) {
      this.totalCost = 0;
      this.lastReset = Date.now();
    }
  }
}
