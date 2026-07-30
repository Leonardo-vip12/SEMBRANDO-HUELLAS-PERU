import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiUsageGuard implements CanActivate {
  private dailyQueries: Map<string, number> = new Map();
  private lastReset = Date.now();

  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    this.resetIfNeeded();
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id || 'anonymous';
    const limit = this.configService.get<number>('ai.rateLimit', 100);
    const current = this.dailyQueries.get(userId) || 0;

    if (current >= limit) {
      throw new HttpException('Límite de consultas IA diarias alcanzado', HttpStatus.TOO_MANY_REQUESTS);
    }

    this.dailyQueries.set(userId, current + 1);
    return true;
  }

  private resetIfNeeded() {
    if (Date.now() - this.lastReset > 24 * 60 * 60 * 1000) {
      this.dailyQueries.clear();
      this.lastReset = Date.now();
    }
  }
}
