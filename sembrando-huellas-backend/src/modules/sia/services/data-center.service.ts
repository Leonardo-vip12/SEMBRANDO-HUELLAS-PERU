import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';

@Injectable()
export class SiaDataCenterService {
  protected logger = new Logger(SiaDataCenterService.name);

  constructor(
    private prisma: PrismaService,
    private aiService?: AiService,
  ) {}

  async createDataset(dto: {
    title: string;
    slug: string;
    description?: string;
    category?: string;
    source?: string;
    format?: string;
    visibility?: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED';
  }) {
    try {
      const dataset = await (this.prisma as any).siaDataset.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          description: dto.description,
          category: dto.category || 'general',
          source: dto.source,
          format: dto.format || 'json',
          visibility: dto.visibility || 'INTERNAL',
        },
      });
      this.logger.log(`Dataset created: ${dataset.title}`);
      return dataset;
    } catch (error) {
      this.logger.error(`Error creating dataset: ${(error as Error).message}`);
      throw error;
    }
  }

  async updateDataset(id: string, dto: any) {
    const existing = await (this.prisma as any).siaDataset.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Dataset con ID "${id}" no encontrado`);
    try {
      return await (this.prisma as any).siaDataset.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      this.logger.error(`Error updating dataset ${id}: ${(error as Error).message}`);
      throw error;
    }
  }

  async findAllDatasets(category?: string, visibility?: string, page = 1, limit = 20) {
    const where: any = {};
    if (category) where.category = category;
    if (visibility) where.visibility = visibility;
    const skip = (page - 1) * limit;
    try {
      const [data, total] = await Promise.all([
        (this.prisma as any).siaDataset.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        (this.prisma as any).siaDataset.count({ where }),
      ]);
      return {
        data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      this.logger.error(`Error listing datasets: ${(error as Error).message}`);
      throw error;
    }
  }

  async findDataset(id: string) {
    const dataset = await (this.prisma as any).siaDataset.findUnique({ where: { id } });
    if (!dataset) throw new NotFoundException(`Dataset con ID "${id}" no encontrado`);
    return dataset;
  }

  async deleteDataset(id: string) {
    const existing = await (this.prisma as any).siaDataset.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Dataset con ID "${id}" no encontrado`);
    try {
      await (this.prisma as any).siaDataset.delete({ where: { id } });
      this.logger.log(`Dataset deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting dataset ${id}: ${(error as Error).message}`);
      throw error;
    }
  }

  async getMetadata() {
    try {
      const [total, categories, formats, lastUpdated] = await Promise.all([
        (this.prisma as any).siaDataset.count(),
        (this.prisma as any).siaDataset.groupBy({ by: ['category'], _count: true }),
        (this.prisma as any).siaDataset.groupBy({ by: ['format'], _count: true }),
        (this.prisma as any).siaDataset.findFirst({ orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
      ]);

      return {
        totalDatasets: total,
        categories: categories.map((c: any) => ({ category: c.category, count: c._count })),
        formats: formats.map((f: any) => ({ format: f.format, count: f._count })),
        lastUpdated: lastUpdated?.updatedAt || null,
      };
    } catch (error) {
      this.logger.error(`Error getting metadata: ${(error as Error).message}`);
      throw error;
    }
  }

  async getTimeSeriesData(indicatorId?: string, startDate?: string, endDate?: string) {
    try {
      const where: any = {};
      if (indicatorId) where.indicatorId = indicatorId;
      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate);
        if (endDate) where.date.lte = new Date(endDate);
      }

      const records = await (this.prisma as any).siaIndicatorRecord.findMany({
        where,
        include: { indicator: true },
        orderBy: { date: 'asc' },
      });

      return {
        title: 'Time Series Data',
        generatedAt: new Date().toISOString(),
        totalRecords: records.length,
        data: records.map((r: any) => ({
          date: r.date.toISOString(),
          value: r.value,
          indicator: r.indicator?.name || null,
          region: r.region,
          institution: r.institution,
        })),
      };
    } catch (error) {
      this.logger.error(`Error getting time series: ${(error as Error).message}`);
      throw error;
    }
  }

  async getOpenDataCatalog() {
    try {
      const datasets = await (this.prisma as any).siaDataset.findMany({
        where: { visibility: 'PUBLIC' },
        orderBy: { updatedAt: 'desc' },
      });

      return {
        catalog: {
          title: 'Catálogo de Datos Abiertos - Sembrando Huellas',
          description: 'Datos públicos del Sistema de Indicadores Ambientales',
          modified: new Date().toISOString(),
          publisher: 'Sembrando Huellas',
          license: 'Open Data',
        },
        datasets: datasets.map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          category: d.category,
          format: d.format,
          source: d.source,
          updatedAt: d.updatedAt,
          downloadUrl: `/api/sia/data-center/${d.id}/download`,
        })),
        total: datasets.length,
      };
    } catch (error) {
      this.logger.error(`Error getting open data catalog: ${(error as Error).message}`);
      throw error;
    }
  }
}
