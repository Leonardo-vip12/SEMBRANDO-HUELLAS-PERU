import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../ai.service';
import { IMPACT_ANALYSIS_SYSTEM, IMPACT_REPORT_PROMPT } from '../prompts';

@Injectable()
export class ImpactAnalysisService {
  private readonly logger = new Logger(ImpactAnalysisService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async generateReport(startDate?: string, endDate?: string): Promise<any> {
    const metrics = await this.prisma.impactMetric.findMany();
    const donations = await this.prisma.donation.aggregate({
      _sum: { amount: true },
      _count: true,
      where: { status: 'COMPLETED' },
    });
    const volunteersCount = await this.prisma.volunteer.count();
    const newsCount = await this.prisma.news.count();

    const data = {
      metrics: metrics.map((m) => ({ label: m.label, value: m.value, icon: m.icon })),
      donations: { total: donations._sum.amount || 0, count: donations._count },
      volunteers: volunteersCount,
      news: newsCount,
      period: { start: startDate || 'inicio', end: endDate || 'actualidad' },
    };

    const result = await this.aiService.chat(
      [
        { role: 'system', content: IMPACT_ANALYSIS_SYSTEM },
        { role: 'user', content: `${IMPACT_REPORT_PROMPT}\n\nDatos del período:\n${JSON.stringify(data, null, 2)}` },
      ],
      { feature: 'impact-analysis', temperature: 0.5, maxTokens: 3000 },
    );

    try {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) return { ...JSON.parse(jsonMatch[0]), data };
    } catch {}

    return { narrative: result.content, data };
  }

  async analyzeTrend(metricKey: string): Promise<any> {
    const metrics = await this.prisma.impactMetric.findMany({ orderBy: { year: 'asc' } });
    return {
      metric: metricKey,
      data: metrics,
      analysis: 'Análisis de tendencia no disponible sin proveedor IA configurado.',
    };
  }
}
