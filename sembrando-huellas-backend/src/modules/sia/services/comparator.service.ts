import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';

@Injectable()
export class SiaComparatorService {
  protected logger = new Logger(SiaComparatorService.name);

  constructor(
    private prisma: PrismaService,
    private aiService?: AiService,
  ) {}

  async compare(dto: {
    type: 'region' | 'institution' | 'campaign' | 'project' | 'period';
    ids?: string[];
    indicatorId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      switch (dto.type) {
        case 'region':
          return await this.compareByRegion(dto);
        case 'institution':
          return await this.compareByInstitution(dto);
        case 'campaign':
          return await this.compareByCampaign(dto);
        case 'project':
          return await this.compareByProject(dto);
        case 'period':
          return await this.compareByPeriod(dto);
        default:
          throw new BadRequestException(`Tipo de comparación "${dto.type}" no soportado`);
      }
    } catch (error) {
      this.logger.error(`Error in compare: ${(error as Error).message}`);
      throw error;
    }
  }

  private async compareByRegion(dto: any) {
    const where: any = {};
    if (dto.indicatorId) where.indicatorId = dto.indicatorId;
    if (dto.ids && dto.ids.length > 0) where.region = { in: dto.ids };
    if (dto.startDate || dto.endDate) {
      where.date = {};
      if (dto.startDate) where.date.gte = new Date(dto.startDate);
      if (dto.endDate) where.date.lte = new Date(dto.endDate);
    }

    const records = await (this.prisma as any).siaIndicatorRecord.findMany({
      where,
      include: { indicator: true },
      orderBy: { date: 'asc' },
    });

    const grouped: Record<string, { label: string; values: number[]; dates: string[] }> = {};
    for (const r of records) {
      const key = r.region || 'default';
      if (!grouped[key]) grouped[key] = { label: key, values: [], dates: [] };
      grouped[key].values.push(r.value);
      grouped[key].dates.push(r.date.toISOString());
    }

    return {
      type: 'region',
      labels: Object.keys(grouped),
      datasets: Object.entries(grouped).map(([region, data]) => ({
        label: region,
        data: data.values,
        dates: data.dates,
      })),
      total: Object.keys(grouped).length,
    };
  }

  private async compareByInstitution(dto: any) {
    const where: any = {};
    if (dto.indicatorId) where.indicatorId = dto.indicatorId;
    if (dto.ids && dto.ids.length > 0) where.institution = { in: dto.ids };
    if (dto.startDate || dto.endDate) {
      where.date = {};
      if (dto.startDate) where.date.gte = new Date(dto.startDate);
      if (dto.endDate) where.date.lte = new Date(dto.endDate);
    }

    const records = await (this.prisma as any).siaIndicatorRecord.findMany({
      where,
      include: { indicator: true },
      orderBy: { date: 'asc' },
    });

    const grouped: Record<string, { label: string; values: number[]; dates: string[] }> = {};
    for (const r of records) {
      const key = r.institution || 'default';
      if (!grouped[key]) grouped[key] = { label: key, values: [], dates: [] };
      grouped[key].values.push(r.value);
      grouped[key].dates.push(r.date.toISOString());
    }

    return {
      type: 'institution',
      labels: Object.keys(grouped),
      datasets: Object.entries(grouped).map(([inst, data]) => ({
        label: inst,
        data: data.values,
        dates: data.dates,
      })),
      total: Object.keys(grouped).length,
    };
  }

  private async compareByCampaign(dto: any) {
    if (!dto.ids || dto.ids.length === 0) {
      throw new BadRequestException('Se requieren IDs de campañas para comparar');
    }
    const campaigns = await (this.prisma as any).event.findMany({
      where: { id: { in: dto.ids } },
      include: {
        impactMetrics: {
          ...(dto.indicatorId ? { where: { indicatorId: dto.indicatorId } } : {}),
        },
      },
    });

    return {
      type: 'campaign',
      labels: campaigns.map((c: any) => c.name),
      datasets: campaigns.map((c: any) => ({
        label: c.name,
        data: c.impactMetrics.map((m: any) => m.value),
        metrics: c.impactMetrics,
      })),
      total: campaigns.length,
    };
  }

  private async compareByProject(dto: any) {
    if (!dto.ids || dto.ids.length === 0) {
      throw new BadRequestException('Se requieren IDs de proyectos para comparar');
    }
    const projects = await (this.prisma as any).project.findMany({
      where: { id: { in: dto.ids } },
      include: {
        impactMetrics: {
          ...(dto.indicatorId ? { where: { indicatorId: dto.indicatorId } } : {}),
        },
      },
    });

    return {
      type: 'project',
      labels: projects.map((p: any) => p.name),
      datasets: projects.map((p: any) => ({
        label: p.name,
        data: p.impactMetrics.map((m: any) => m.value),
        metrics: p.impactMetrics,
      })),
      total: projects.length,
    };
  }

  private async compareByPeriod(dto: any) {
    if (!dto.startDate || !dto.endDate) {
      throw new BadRequestException('Se requieren fechas de inicio y fin para comparar periodos');
    }
    const midDate = new Date((new Date(dto.startDate).getTime() + new Date(dto.endDate).getTime()) / 2);
    const where: any = {};
    if (dto.indicatorId) where.indicatorId = dto.indicatorId;

    const firstHalf = await (this.prisma as any).siaIndicatorRecord.findMany({
      where: { ...where, date: { gte: new Date(dto.startDate), lt: midDate } },
      orderBy: { date: 'asc' },
    });
    const secondHalf = await (this.prisma as any).siaIndicatorRecord.findMany({
      where: { ...where, date: { gte: midDate, lte: new Date(dto.endDate) } },
      orderBy: { date: 'asc' },
    });

    const avg = (arr: any[]) => (arr.length > 0 ? arr.reduce((s: number, r: any) => s + r.value, 0) / arr.length : 0);

    return {
      type: 'period',
      labels: ['Primer periodo', 'Segundo periodo'],
      datasets: [
        {
          label: 'Primer periodo',
          data: firstHalf.map((r: any) => r.value),
          dates: firstHalf.map((r: any) => r.date.toISOString()),
          average: avg(firstHalf),
          count: firstHalf.length,
        },
        {
          label: 'Segundo periodo',
          data: secondHalf.map((r: any) => r.value),
          dates: secondHalf.map((r: any) => r.date.toISOString()),
          average: avg(secondHalf),
          count: secondHalf.length,
        },
      ],
      variation: avg(secondHalf) - avg(firstHalf),
      variationPercent: avg(firstHalf) !== 0 ? ((avg(secondHalf) - avg(firstHalf)) / avg(firstHalf)) * 100 : 0,
    };
  }

  async getComparisonChart(type: string, dimension: string) {
    try {
      const records = await (this.prisma as any).siaIndicatorRecord.findMany({
        where: { [dimension]: { not: null } },
        orderBy: { date: 'asc' },
        take: 100,
      });

      const grouped: Record<string, { values: number[]; dates: string[] }> = {};
      for (const r of records) {
        const key = r[dimension] || 'unknown';
        if (!grouped[key]) grouped[key] = { values: [], dates: [] };
        grouped[key].values.push(r.value);
        grouped[key].dates.push(r.date.toISOString());
      }

      return {
        type,
        dimension,
        chartType: 'line',
        labels: Object.keys(grouped),
        datasets: Object.entries(grouped).map(([key, data]) => ({
          label: key,
          data: data.values,
          dates: data.dates,
        })),
      };
    } catch (error) {
      this.logger.error(`Error getting comparison chart: ${(error as Error).message}`);
      throw error;
    }
  }
}
