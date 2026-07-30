import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  protected logger = new Logger(AnalyticsService.name);

  constructor(private prisma: PrismaService) {}

  async getContentByMonth() {
    const news = await this.prisma.news.findMany({ select: { createdAt: true } });
    const events = await this.prisma.event.findMany({ select: { createdAt: true } });
    const projects = await this.prisma.project.findMany({ select: { createdAt: true } });

    interface MonthlyCounts {
      news: number;
      events: number;
      projects: number;
      [key: string]: number;
    }

    const monthlyMap = new Map<string, MonthlyCounts>();

    const addToMap = (items: { createdAt: Date }[], key: 'news' | 'events' | 'projects') => {
      items.forEach((item) => {
        const month = item.createdAt.toISOString().slice(0, 7);
        if (!monthlyMap.has(month)) {
          monthlyMap.set(month, { news: 0, events: 0, projects: 0 });
        }
        monthlyMap.get(month)![key]++;
      });
    };

    addToMap(news, 'news');
    addToMap(events, 'events');
    addToMap(projects, 'projects');

    return Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, counts]) => ({ month, ...counts }));
  }

  async getDonationTrend() {
    const donations = await this.prisma.donation.findMany({
      where: { status: 'COMPLETED' },
      select: { amount: true, createdAt: true },
    });

    const monthlyMap = new Map<string, number>();
    donations.forEach((d) => {
      const month = d.createdAt.toISOString().slice(0, 7);
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + d.amount);
    });

    return Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total }));
  }

  async getTopPartners() {
    return this.prisma.partner.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  }
}
