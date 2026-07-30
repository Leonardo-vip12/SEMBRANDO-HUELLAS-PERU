import { PrismaService } from '../../../prisma/prisma.service';
import { AIProviderType } from '../providers/ai-provider.interface';
export declare class AiQueryLogService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    log(params: {
        feature: string;
        query: string;
        provider: AIProviderType;
        model: string;
        tokensUsed: number;
        cost: number;
        latencyMs: number;
        success: boolean;
        userId?: string;
        error?: string;
    }): Promise<void>;
    getStats(): Promise<{
        totalQueries: number;
        totalTokens: number;
        totalCost: number;
        queriesByProvider: Record<string, number>;
        tokensByProvider: Record<string, number>;
        costByProvider: Record<string, number>;
        averageLatency: number;
        topModels: Array<{
            model: string;
            count: number;
        }>;
        errorsLast24h: number;
        activeUsers24h: number;
    }>;
    getLogs(page?: number, limit?: number): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
