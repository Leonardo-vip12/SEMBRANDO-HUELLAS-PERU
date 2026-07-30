export declare class AiAdminStatsDto {
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
}
export declare class AiQueryLogDto {
    id: string;
    feature: string;
    query: string;
    provider: string;
    model: string;
    tokensUsed: number;
    cost: number;
    latencyMs: number;
    success: boolean;
    userId?: string;
    createdAt: Date;
}
export declare class AiConfigUpdateDto {
    provider?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    costLimit?: number;
}
