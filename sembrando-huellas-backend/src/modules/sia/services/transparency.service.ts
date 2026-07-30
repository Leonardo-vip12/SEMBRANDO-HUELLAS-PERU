import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';

@Injectable()
export class SiaTransparencyService {
  protected logger = new Logger(SiaTransparencyService.name);

  constructor(
    private prisma: PrismaService,
    private aiService?: AiService,
  ) {}

  async getPublicIndicators() {
    try {
      const indicators = await (this.prisma as any).siaIndicator.findMany({
        where: { active: true },
        include: {
          records: { orderBy: { date: 'desc' }, take: 1 },
        },
      });

      return indicators.map((i: any) => ({
        id: i.id,
        name: i.name,
        slug: i.slug,
        category: i.category,
        unit: i.unit,
        description: i.description,
        currentValue: i.records[0]?.value || null,
        lastUpdated: i.records[0]?.date || null,
        target: i.target,
        source: i.source,
      }));
    } catch (error) {
      this.logger.error(`Error getting public indicators: ${(error as Error).message}`);
      throw error;
    }
  }

  async getPublicProjects() {
    try {
      const projects = await (this.prisma as any).project.findMany({
        where: { published: true },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          startDate: true,
          endDate: true,
          region: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        total: projects.length,
        projects,
      };
    } catch (error) {
      this.logger.error(`Error getting public projects: ${(error as Error).message}`);
      throw error;
    }
  }

  async getImpactSummary() {
    try {
      const [impactMetrics, indicators] = await Promise.all([
        (this.prisma as any).impactMetric.findMany({
          include: { indicator: true },
          orderBy: { createdAt: 'desc' },
        }),
        (this.prisma as any).siaIndicator.findMany({
          include: { records: { orderBy: { date: 'desc' }, take: 1 } },
        }),
      ]);

      const totalImpact = impactMetrics.reduce((s: number, m: any) => s + (m.value || 0), 0);
      const categories = [...new Set(indicators.map((i: any) => i.category).filter(Boolean))];

      const byCategory: Record<string, { count: number; total: number; items: any[] }> = {};
      for (const indicator of indicators) {
        const cat = indicator.category || 'general';
        if (!byCategory[cat]) byCategory[cat] = { count: 0, total: 0, items: [] };
        byCategory[cat].count++;
        byCategory[cat].total += indicator.records[0]?.value || 0;
        byCategory[cat].items.push({
          name: indicator.name,
          value: indicator.records[0]?.value || 0,
          unit: indicator.unit,
        });
      }

      return {
        totalImpactMetrics: impactMetrics.length,
        totalIndicators: indicators.length,
        totalImpactValue: totalImpact,
        categories: Object.entries(byCategory).map(([name, data]) => ({
          name,
          count: data.count,
          total: data.total,
          indicators: data.items,
        })),
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error getting impact summary: ${(error as Error).message}`);
      throw error;
    }
  }

  async getPublicDocuments() {
    try {
      const [resources, knowledgeEntries] = await Promise.all([
        (this.prisma as any).resource.count({
          where: { published: true },
        }),
        (this.prisma as any).knowledgeBase.count({
          where: { published: true },
        }),
      ]);

      return {
        totalDocuments: resources + knowledgeEntries,
        resources,
        knowledgeBaseEntries: knowledgeEntries,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error getting public documents: ${(error as Error).message}`);
      throw error;
    }
  }

  async getOpenStats() {
    try {
      const [totalIndicators, totalProjects, totalVolunteers, totalEvents, totalObservations, totalDatasets] =
        await Promise.all([
          (this.prisma as any).siaIndicator.count({ where: { active: true } }),
          (this.prisma as any).project.count({ where: { published: true } }),
          (this.prisma as any).volunteer.count(),
          (this.prisma as any).event.count(),
          (this.prisma as any).siaCitizenObservation.count(),
          (this.prisma as any).siaDataset.count({ where: { visibility: 'PUBLIC' } }),
        ]);

      return {
        totals: {
          indicators: totalIndicators,
          projects: totalProjects,
          volunteers: totalVolunteers,
          events: totalEvents,
          citizenObservations: totalObservations,
          publicDatasets: totalDatasets,
        },
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error getting open stats: ${(error as Error).message}`);
      throw error;
    }
  }

  async getDownloadableData() {
    try {
      const datasets = await (this.prisma as any).siaDataset.findMany({
        where: { visibility: 'PUBLIC' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          category: true,
          format: true,
          source: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
      });

      return {
        availableDatasets: datasets.length,
        datasets: datasets.map((d: any) => ({
          ...d,
          downloadUrl: `/api/sia/data-center/${d.id}/download`,
        })),
        formats: [...new Set(datasets.map((d: any) => d.format).filter(Boolean))],
      };
    } catch (error) {
      this.logger.error(`Error getting downloadable data: ${(error as Error).message}`);
      throw error;
    }
  }
}
