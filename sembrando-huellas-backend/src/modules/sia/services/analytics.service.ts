import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SiaAnalyticsService {
  protected logger = new Logger(SiaAnalyticsService.name);

  constructor(private prisma: PrismaService) {}

  async getLineChart(metric: string, period: string) {
    const entityMap: Record<string, any> = {
      news: this.prisma.news,
      projects: this.prisma.project,
      events: this.prisma.event,
      observations: this.prisma.biodiversityObservation,
      species: this.prisma.species,
      volunteers: this.prisma.volunteer,
      donations: this.prisma.donation,
      users: this.prisma.user,
    };

    const delegate = entityMap[metric];
    if (!delegate) {
      return { metric, period, data: [] };
    }

    const years = period === 'year' ? 5 : 2;
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - years);

    const items = await delegate.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const grouped = new Map<string, number>();
    for (const item of items) {
      const key =
        period === 'year' ? item.createdAt.toISOString().slice(0, 4) : item.createdAt.toISOString().slice(0, 7);
      grouped.set(key, (grouped.get(key) || 0) + 1);
    }

    return {
      metric,
      period,
      data: Array.from(grouped.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, value]) => ({ label, value })),
    };
  }

  async getBarChart(groupBy: string, metric: string) {
    switch (groupBy) {
      case 'conservationStatus': {
        const species = await this.prisma.species.findMany({
          select: { conservationStatus: true },
        });
        const counts: Record<string, number> = {};
        for (const s of species) {
          const key = s.conservationStatus || 'UNKNOWN';
          counts[key] = (counts[key] || 0) + 1;
        }
        return { groupBy, metric, data: Object.entries(counts).map(([label, value]) => ({ label, value })) };
      }

      case 'speciesCategory': {
        const species = await this.prisma.species.findMany({
          select: { category: true },
        });
        const counts: Record<string, number> = {};
        for (const s of species) {
          const key = s.category || 'OTROS';
          counts[key] = (counts[key] || 0) + 1;
        }
        return { groupBy, metric, data: Object.entries(counts).map(([label, value]) => ({ label, value })) };
      }

      case 'eventType': {
        const events = await this.prisma.event.findMany({
          select: { type: true },
        });
        const counts: Record<string, number> = {};
        for (const e of events) {
          const key = e.type || 'OTROS';
          counts[key] = (counts[key] || 0) + 1;
        }
        return { groupBy, metric, data: Object.entries(counts).map(([label, value]) => ({ label, value })) };
      }

      case 'donationStatus': {
        const donations = await this.prisma.donation.findMany({
          select: { status: true },
        });
        const counts: Record<string, number> = {};
        for (const d of donations) {
          counts[d.status] = (counts[d.status] || 0) + 1;
        }
        return { groupBy, metric, data: Object.entries(counts).map(([label, value]) => ({ label, value })) };
      }

      case 'region': {
        const projects = await this.prisma.project.findMany({
          where: { region: { not: null } },
          select: { region: true },
        });
        const counts: Record<string, number> = {};
        for (const p of projects) {
          const key = p.region || 'SIN REGIÓN';
          counts[key] = (counts[key] || 0) + 1;
        }
        return { groupBy, metric, data: Object.entries(counts).map(([label, value]) => ({ label, value })) };
      }

      default: {
        const items = await (this.prisma as any)[metric]?.findMany({ select: { [groupBy]: true } });
        if (!items) return { groupBy, metric, data: [] };
        const counts: Record<string, number> = {};
        for (const item of items) {
          const key = item[groupBy] || 'OTROS';
          counts[key] = (counts[key] || 0) + 1;
        }
        return { groupBy, metric, data: Object.entries(counts).map(([label, value]) => ({ label, value })) };
      }
    }
  }

  async getPieChart(category: string) {
    switch (category) {
      case 'conservationStatus':
        return this.getBarChart('conservationStatus', 'species');

      case 'speciesCategory':
        return this.getBarChart('speciesCategory', 'species');

      case 'eventType':
        return this.getBarChart('eventType', 'events');

      case 'observationStatus': {
        const observations = await this.prisma.biodiversityObservation.findMany({
          select: { status: true },
        });
        const counts: Record<string, number> = {};
        for (const o of observations) {
          counts[o.status] = (counts[o.status] || 0) + 1;
        }
        return { category, data: Object.entries(counts).map(([label, value]) => ({ label, value })) };
      }

      case 'partnerType': {
        const partners = await this.prisma.partner.findMany({
          select: { type: true },
        });
        const counts: Record<string, number> = {};
        for (const p of partners) {
          const key = p.type || 'OTROS';
          counts[key] = (counts[key] || 0) + 1;
        }
        return { category, data: Object.entries(counts).map(([label, value]) => ({ label, value })) };
      }

      default:
        return { category, data: [] };
    }
  }

  async getRadarChart(dimensions: string[]) {
    const validDimensions = [
      'projects',
      'events',
      'species',
      'observations',
      'volunteers',
      'donations',
      'resources',
      'news',
    ];

    const results: Record<string, number> = {};
    const counts = await Promise.all(
      dimensions.map(async (dim) => {
        if (!validDimensions.includes(dim)) return null;
        const delegate = (this.prisma as any)[dim];
        if (!delegate) return null;
        const count = await delegate.count();
        return { dim, count };
      }),
    );
    for (const entry of counts) {
      if (entry) results[entry.dim] = entry.count;
    }

    return {
      dimensions,
      data: Object.entries(results).map(([dimension, value]) => ({ dimension, value })),
    };
  }

  async getHeatmap(region?: string, date?: string) {
    const where: any = {
      latitude: { not: null },
      longitude: { not: null },
    };

    if (region) {
      where.region = region;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setMonth(end.getMonth() + 1);
      where.observedAt = { gte: start, lte: end };
    }

    const observations = await this.prisma.biodiversityObservation.findMany({
      where,
      select: { latitude: true, longitude: true, quantity: true, speciesName: true, observedAt: true },
      take: 2000,
    });

    return {
      type: 'FeatureCollection',
      features: observations.map((o: any) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [o.longitude, o.latitude] },
        properties: { weight: o.quantity || 1, speciesName: o.speciesName, date: o.observedAt },
      })),
    };
  }

  async getAccumulatedIndicators() {
    const indicators = await this.prisma.siaIndicator.findMany({
      where: { active: true },
      include: {
        records: { orderBy: { date: 'asc' } },
      },
    });

    return indicators.map((indicator: any) => {
      let runningTotal = 0;
      const accumulated = indicator.records.map((r: any) => {
        runningTotal += r.value;
        return { date: r.date, value: r.value, accumulated: runningTotal };
      });

      return {
        id: indicator.id,
        name: indicator.name,
        slug: indicator.slug,
        category: indicator.category,
        unit: indicator.unit,
        currentTotal: runningTotal,
        target: indicator.target,
        progress: indicator.target ? Math.round((runningTotal / indicator.target) * 100) : null,
        data: accumulated,
      };
    });
  }
}
