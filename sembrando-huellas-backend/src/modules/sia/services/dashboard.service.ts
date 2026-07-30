import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SiaDashboardService {
  protected logger = new Logger(SiaDashboardService.name);

  constructor(private prisma: PrismaService) {}

  async getExecutiveDashboard(query: {
    startDate?: string;
    endDate?: string;
    region?: string;
    institution?: string;
    projectId?: string;
  }) {
    const dateFilter = this.buildDateFilter(query.startDate, query.endDate);
    const regionFilter = query.region ? { region: query.region } : {};
    const institutionFilter = query.institution ? { institution: query.institution } : {};

    const [
      totalActivities,
      totalInstitutions,
      totalStudents,
      totalTeachers,
      totalTreesPlanted,
      totalSpecies,
      totalObservations,
      totalCampaigns,
      totalResources,
      totalVolunteerHours,
      totalProjects,
      totalEvents,
    ] = await Promise.all([
      this.prisma.news.count({ where: { ...dateFilter, status: 'PUBLISHED' } }),
      this.prisma.partner.count({ where: { active: true } }),
      this.prisma.user.count({ where: { ...dateFilter, role: { name: 'ESTUDIANTE' } } }),
      this.prisma.user.count({ where: { ...dateFilter, role: { name: 'DOCENTE' } } }),
      this.prisma.impactMetric.count({ where: { label: { contains: 'árbol' } } }),
      this.prisma.species.count({ where: { ...dateFilter } }),
      this.prisma.biodiversityObservation.count({ where: { ...dateFilter } }),
      this.prisma.project.count({ where: { ...dateFilter, status: 'PUBLISHED' } }),
      this.prisma.resource.count({ where: { ...dateFilter } }),
      this.prisma.volunteer.count({ where: { ...dateFilter } }),
      this.prisma.project.count({ where: { ...dateFilter } }),
      this.prisma.event.count({ where: { ...dateFilter } }),
    ]);

    return {
      activities: totalActivities,
      institutions: totalInstitutions || 0,
      students: totalStudents || 0,
      teachers: totalTeachers || 0,
      treesPlanted: totalTreesPlanted || 0,
      speciesRegistered: totalSpecies,
      observations: totalObservations,
      campaignsExecuted: totalCampaigns,
      resourcesPublished: totalResources,
      volunteerHours: totalVolunteerHours,
      totalProjects,
      totalEvents,
    };
  }

  async getTimeSeries(metric: string, startDate?: string, endDate?: string, interval: string = 'month') {
    const dateFilter = this.buildDateFilter(startDate, endDate);
    const entityMap: Record<string, any> = {
      news: this.prisma.news,
      projects: this.prisma.project,
      events: this.prisma.event,
      observations: this.prisma.biodiversityObservation,
      species: this.prisma.species,
      volunteers: this.prisma.volunteer,
      donations: this.prisma.donation,
      resources: this.prisma.resource,
      users: this.prisma.user,
      partners: this.prisma.partner,
    };

    const delegate = entityMap[metric];
    if (!delegate) {
      return [];
    }

    const items = await delegate.findMany({
      where: { ...dateFilter },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const grouped = new Map<string, number>();
    for (const item of items) {
      let key: string;
      if (interval === 'year') {
        key = item.createdAt.toISOString().slice(0, 4);
      } else if (interval === 'week') {
        const d = new Date(item.createdAt);
        const startOfWeek = new Date(d);
        startOfWeek.setDate(d.getDate() - d.getDay());
        key = startOfWeek.toISOString().slice(0, 7);
      } else {
        key = item.createdAt.toISOString().slice(0, 7);
      }
      grouped.set(key, (grouped.get(key) || 0) + 1);
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, count]) => ({ period, count }));
  }

  private buildDateFilter(startDate?: string, endDate?: string) {
    const filter: any = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.gte = new Date(startDate);
      if (endDate) filter.createdAt.lte = new Date(endDate);
    }
    return filter;
  }
}
