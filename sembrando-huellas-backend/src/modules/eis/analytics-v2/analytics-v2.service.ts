import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AnalyticsV2Service {
  private readonly logger = new Logger(AnalyticsV2Service.name);

  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalQueries,
      totalIdentifications,
      totalDocuments,
      totalActivities,
      totalObservations,
      totalCertificates,
      totalKnowledgeEntries,
      speciesStats,
      queryStats,
      activeUsers,
      recentActivity,
    ] = await Promise.all([
      this.getTotalQueries(),
      this.getTotalIdentifications(),
      this.getTotalDocuments(),
      this.getTotalActivities(),
      this.getTotalObservations(),
      this.getTotalCertificates(),
      this.getTotalKnowledgeEntries(),
      this.getTopSpecies(),
      this.getQueryStats(),
      this.getActiveUsers(),
      this.getRecentActivity(),
    ]);

    return {
      overview: {
        totalQueries,
        totalIdentifications,
        totalDocuments,
        totalActivities,
        totalObservations,
        totalCertificates,
        totalKnowledgeEntries,
      },
      speciesStats,
      queryStats,
      activeUsers,
      recentActivity,
    };
  }

  async getFullReport(startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const [
      queries,
      identifications,
      observations,
      documents,
      activities,
      certificates,
      queriesByDay,
      identificationsByDay,
      topSpecies,
      topTopics,
    ] = await Promise.all([
      this.countInRange('aiQueryLog', start, end),
      this.countInRange('speciesIdentification', start, end),
      this.countInRange('biodiversityObservation', start, end),
      this.countInRange('documentAnalysis', start, end),
      this.countInRange('activityPlan', start, end),
      this.countInRange('issuedCertificate', start, end),
      this.getDailyCounts('aiQueryLog', start, end),
      this.getDailyCounts('speciesIdentification', start, end),
      this.getTopSpecies(10),
      this.getTopTopics(10),
    ]);

    return {
      period: { start: start.toISOString(), end: end.toISOString() },
      totals: { queries, identifications, observations, documents, activities, certificates },
      trends: { queriesByDay, identificationsByDay },
      topSpecies,
      topTopics,
    };
  }

  async getAIMetrics() {
    const logs: any[] = await (this.prisma as any).aiQueryLog.findMany({ orderBy: { createdAt: 'desc' } });
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const queriesByFeature: Record<string, number> = {};
    const queriesByProvider: Record<string, number> = {};
    let totalTokens = 0;
    let totalCost = 0;
    let totalLatency = 0;
    let errors24h = 0;
    const activeUsers24h = new Set<string>();

    for (const log of logs) {
      queriesByFeature[log.feature] = (queriesByFeature[log.feature] || 0) + 1;
      queriesByProvider[log.provider] = (queriesByProvider[log.provider] || 0) + 1;
      totalTokens += log.tokensUsed;
      totalCost += log.cost;
      totalLatency += log.latencyMs;
      if (new Date(log.createdAt) > last24h) {
        if (!log.success) errors24h++;
        if (log.userId) activeUsers24h.add(log.userId);
      }
    }

    return {
      totalQueries: logs.length,
      totalTokens,
      totalCost,
      averageLatency: logs.length > 0 ? totalLatency / logs.length : 0,
      queriesByFeature,
      queriesByProvider,
      errorsLast24h: errors24h,
      activeUsers24h: activeUsers24h.size,
    };
  }

  private async getTotalQueries(): Promise<number> {
    return (this.prisma as any).aiQueryLog.count();
  }

  private async getTotalIdentifications(): Promise<number> {
    return (this.prisma as any).speciesIdentification.count();
  }

  private async getTotalDocuments(): Promise<number> {
    return (this.prisma as any).documentAnalysis.count();
  }

  private async getTotalActivities(): Promise<number> {
    return (this.prisma as any).activityPlan.count();
  }

  private async getTotalObservations(): Promise<number> {
    return (this.prisma as any).biodiversityObservation.count();
  }

  private async getTotalCertificates(): Promise<number> {
    return (this.prisma as any).issuedCertificate.count();
  }

  private async getTotalKnowledgeEntries(): Promise<number> {
    return (this.prisma as any).knowledgeBase.count();
  }

  private async getTopSpecies(limit = 10): Promise<any[]> {
    return (this.prisma as any).speciesIdentification.groupBy({
      by: ['scientificName'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });
  }

  private async getQueryStats(): Promise<any> {
    const logs: any[] = await (this.prisma as any).aiQueryLog.findMany({
      select: { feature: true, provider: true, createdAt: true },
    });
    const features: Record<string, number> = {};
    const providers: Record<string, number> = {};
    logs.forEach((l: any) => {
      features[l.feature] = (features[l.feature] || 0) + 1;
      providers[l.provider] = (providers[l.provider] || 0) + 1;
    });
    return { features, providers };
  }

  private async getActiveUsers(): Promise<{ total: number; last24h: number; last7d: number }> {
    const logs: any[] = await (this.prisma as any).aiQueryLog.findMany({
      where: { userId: { not: null } },
      select: { userId: true, createdAt: true },
      distinct: ['userId'],
    });
    const now = Date.now();
    return {
      total: logs.length,
      last24h: logs.filter((l: any) => now - new Date(l.createdAt).getTime() < 86400000).length,
      last7d: logs.filter((l: any) => now - new Date(l.createdAt).getTime() < 604800000).length,
    };
  }

  private async getRecentActivity(limit = 10): Promise<any[]> {
    const types = [
      'aiQueryLog',
      'speciesIdentification',
      'documentAnalysis',
      'activityPlan',
      'biodiversityObservation',
    ] as const;
    const results: any[] = [];

    for (const type of types) {
      const items = await (this.prisma as any)[type].findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, createdAt: true },
      });
      items.forEach((i: any) => results.push({ ...i, type }));
    }

    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
  }

  private async countInRange(model: string, start: Date, end: Date): Promise<number> {
    return (this.prisma as any)[model].count({
      where: { createdAt: { gte: start, lte: end } },
    });
  }

  private async getDailyCounts(model: string, start: Date, end: Date): Promise<Array<{ date: string; count: number }>> {
    const items: any[] = await (this.prisma as any)[model].findMany({
      where: { createdAt: { gte: start, lte: end } },
      select: { createdAt: true },
    });

    const counts: Record<string, number> = {};
    items.forEach((i: any) => {
      const date = i.createdAt.toISOString().slice(0, 10);
      counts[date] = (counts[date] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private async getTopTopics(limit = 10): Promise<Array<{ topic: string; count: number }>> {
    const logs: any[] = await (this.prisma as any).aiQueryLog.findMany({
      select: { query: true },
      where: { query: { not: '' } },
    });

    const words: Record<string, number> = {};
    logs.forEach((l: any) => {
      const tokens = l.query
        .toLowerCase()
        .split(/\s+/)
        .filter((w: string) => w.length > 3);
      tokens.forEach((w: string) => {
        words[w] = (words[w] || 0) + 1;
      });
    });

    return Object.entries(words)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}
