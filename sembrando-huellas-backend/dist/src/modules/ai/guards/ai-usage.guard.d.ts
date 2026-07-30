import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class AiUsageGuard implements CanActivate {
    private configService;
    private dailyQueries;
    private lastReset;
    constructor(configService: ConfigService);
    canActivate(context: ExecutionContext): boolean;
    private resetIfNeeded;
}
