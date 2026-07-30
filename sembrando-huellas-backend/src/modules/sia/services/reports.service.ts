import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

type SiaReportType = 'INSTITUCIONAL' | 'CAMPANA' | 'PROYECTO' | 'EDUCATIVO' | 'BIODIVERSIDAD';
type SiaReportFormat = 'PDF' | 'EXCEL' | 'CSV';

@Injectable()
export class SiaReportsService {
  protected logger = new Logger(SiaReportsService.name);

  constructor(private prisma: PrismaService) {}

  async generateReport(dto: {
    title: string;
    type: SiaReportType;
    description?: string;
    format?: SiaReportFormat;
    filters?: Record<string, any>;
  }) {
    const report = await this.prisma.siaReport.create({
      data: {
        title: dto.title,
        type: dto.type,
        description: dto.description,
        format: dto.format || 'PDF',
        filters: dto.filters || {},
        generatedAt: new Date(),
        metadata: { status: 'generating' },
      },
    });

    const data = await this.collectReportData(dto.type, dto.filters);

    await this.prisma.siaReport.update({
      where: { id: report.id },
      data: {
        metadata: { status: 'completed', data, generatedAt: new Date().toISOString() },
        fileUrl: `/api/sia/reports/${report.id}/download`,
      },
    });

    return this.prisma.siaReport.findUnique({ where: { id: report.id } });
  }

  async listReports(page: number = 1, limit: number = 10, type?: SiaReportType) {
    const where = type ? { type } : {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.siaReport.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.siaReport.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getReport(id: string) {
    const report = await this.prisma.siaReport.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Reporte con ID "${id}" no encontrado`);
    }
    return report;
  }

  async deleteReport(id: string) {
    const report = await this.prisma.siaReport.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Reporte con ID "${id}" no encontrado`);
    }
    await this.prisma.siaReport.delete({ where: { id } });
    return { message: 'Reporte eliminado correctamente' };
  }

  async getReportStats() {
    const reports = await this.prisma.siaReport.groupBy({
      by: ['type'],
      _count: { id: true },
    });

    const stats: Record<string, number> = {};
    for (const r of reports) {
      stats[r.type] = r._count.id;
    }

    return stats;
  }

  private async collectReportData(type: SiaReportType, filters?: Record<string, any>) {
    const baseFilters: any = {};
    if (filters?.startDate || filters?.endDate) {
      baseFilters.createdAt = {};
      if (filters.startDate) baseFilters.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) baseFilters.createdAt.lte = new Date(filters.endDate);
    }
    if (filters?.region) baseFilters.region = filters.region;

    switch (type) {
      case 'INSTITUCIONAL':
        return {
          projects: await this.prisma.project.count({ where: baseFilters }),
          events: await this.prisma.event.count({ where: baseFilters }),
          news: await this.prisma.news.count({ where: { ...baseFilters, status: 'PUBLISHED' } }),
          partners: await this.prisma.partner.count({ where: { active: true } }),
          volunteers: await this.prisma.volunteer.count({ where: baseFilters }),
          users: await this.prisma.user.count({ where: baseFilters }),
        };

      case 'CAMPANA':
        return {
          campaigns: await this.prisma.news.count({ where: { ...baseFilters, status: 'PUBLISHED' } }),
          totalViews: 0,
          interactions: 0,
        };

      case 'PROYECTO':
        return {
          total: await this.prisma.project.count({ where: baseFilters }),
          byStatus: await this.prisma.project.groupBy({
            by: ['status'],
            _count: { id: true },
            where: baseFilters,
          }),
        };

      case 'EDUCATIVO':
        return {
          resources: await this.prisma.resource.count({ where: baseFilters }),
          totalStudents: await this.prisma.user.count({ where: { ...baseFilters, role: { name: 'ESTUDIANTE' } } }),
          totalTeachers: await this.prisma.user.count({ where: { ...baseFilters, role: { name: 'DOCENTE' } } }),
        };

      case 'BIODIVERSIDAD':
        return {
          species: await this.prisma.species.count({ where: baseFilters }),
          observations: await this.prisma.biodiversityObservation.count({ where: baseFilters }),
          conservationStatus: await this.prisma.species.groupBy({
            by: ['conservationStatus'],
            _count: { id: true },
            where: baseFilters,
          }),
        };

      default:
        return {};
    }
  }
}
