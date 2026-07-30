import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AIProviderType } from '../providers/ai-provider.interface';

@Injectable()
export class AiQueryLogService {
  private readonly logger = new Logger(AiQueryLogService.name);

  constructor(private prisma: PrismaService) {}

  async log(params: {
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
  }) {
    try {
      await (this.prisma as any).aiQueryLog.create({
        data: {
          feature: params.feature,
          query: params.query.slice(0, 1000),
          provider: params.provider,
          model: params.model,
          tokensUsed: params.tokensUsed,
          cost: params.cost,
          latencyMs: params.latencyMs,
          success: params.success,
          userId: params.userId,
          error: params.error,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to save query log: ${(error as Error).message}`);
    }
  }

  async getStats(): Promise<{
    totalQueries: number;
    totalTokens: number;
    totalCost: number;
    queriesByProvider: Record<string, number>;
    tokensByProvider: Record<string, number>;
    costByProvider: Record<string, number>;
    averageLatency: number;
    topModels: Array<{ model: string; count: number }>;
    errorsLast24h: number;
    activeUsers24h: number;
  }> {
    const logs: any[] = await (this.prisma as any).aiQueryLog.findMany({ orderBy: { createdAt: 'desc' } });
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const queriesByProvider: Record<string, number> = {};
    const tokensByProvider: Record<string, number> = {};
    const costByProvider: Record<string, number> = {};
    const modelCount: Record<string, number> = {};
    let totalLatency = 0;
    let errors24h = 0;
    const activeUsers = new Set<string>();

    for (const log of logs) {
      queriesByProvider[log.provider] = (queriesByProvider[log.provider] || 0) + 1;
      tokensByProvider[log.provider] = (tokensByProvider[log.provider] || 0) + log.tokensUsed;
      costByProvider[log.provider] = (costByProvider[log.provider] || 0) + log.cost;
      modelCount[log.model] = (modelCount[log.model] || 0) + 1;
      totalLatency += log.latencyMs;
      if (new Date(log.createdAt) > last24h) {
        if (!log.success) errors24h++;
        if (log.userId) activeUsers.add(log.userId);
      }
    }

    const totalQueries = logs.length;
    const totalTokens = logs.reduce((s: number, l: any) => s + l.tokensUsed, 0);
    const totalCost = logs.reduce((s: number, l: any) => s + l.cost, 0);

    return {
      totalQueries,
      totalTokens,
      totalCost,
      queriesByProvider,
      tokensByProvider,
      costByProvider,
      averageLatency: totalQueries > 0 ? totalLatency / totalQueries : 0,
      topModels: Object.entries(modelCount)
        .map(([model, count]) => ({ model, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      errorsLast24h: errors24h,
      activeUsers24h: activeUsers.size,
    };
  }

  async getLogs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total]: [any[], number] = await Promise.all([
      (this.prisma as any).aiQueryLog.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      (this.prisma as any).aiQueryLog.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
