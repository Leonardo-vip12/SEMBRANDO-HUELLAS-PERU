import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

type SiaIndicatorCategory = 'EDUCACION' | 'AMBIENTAL' | 'SOCIAL' | 'ECONOMICO' | 'PARTICIPACION' | 'CONSERVACION';

@Injectable()
export class SiaIndicatorsService {
  protected logger = new Logger(SiaIndicatorsService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: {
    name: string;
    slug: string;
    description?: string;
    category: SiaIndicatorCategory;
    unit?: string;
    formula?: string;
    source?: string;
    target?: number;
    current?: number;
    year?: number;
    region?: string;
    institution?: string;
  }) {
    return this.prisma.siaIndicator.create({ data: dto });
  }

  async update(
    id: string,
    dto: Partial<{
      name: string;
      slug: string;
      description: string;
      category: SiaIndicatorCategory;
      unit: string;
      formula: string;
      source: string;
      target: number;
      current: number;
      year: number;
      region: string;
      institution: string;
      active: boolean;
    }>,
  ) {
    const indicator = await this.prisma.siaIndicator.findUnique({ where: { id } });
    if (!indicator) {
      throw new NotFoundException(`Indicador con ID "${id}" no encontrado`);
    }
    return this.prisma.siaIndicator.update({ where: { id }, data: dto });
  }

  async findAll(category?: SiaIndicatorCategory, active?: boolean, year?: number) {
    const where: any = {};
    if (category) where.category = category;
    if (active !== undefined) where.active = active;
    if (year) where.year = year;

    return this.prisma.siaIndicator.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { records: true } },
      },
    });
  }

  async findOne(id: string) {
    const indicator = await this.prisma.siaIndicator.findUnique({
      where: { id },
      include: {
        records: { orderBy: { date: 'desc' } },
        alertRules: { where: { status: 'ACTIVE' } },
      },
    });
    if (!indicator) {
      throw new NotFoundException(`Indicador con ID "${id}" no encontrado`);
    }
    return indicator;
  }

  async delete(id: string) {
    const indicator = await this.prisma.siaIndicator.findUnique({ where: { id } });
    if (!indicator) {
      throw new NotFoundException(`Indicador con ID "${id}" no encontrado`);
    }
    await this.prisma.siaIndicator.delete({ where: { id } });
    return { message: 'Indicador eliminado correctamente' };
  }

  async addRecord(indicatorId: string, dto: { value: number; date: string; region?: string; institution?: string }) {
    const indicator = await this.prisma.siaIndicator.findUnique({ where: { id: indicatorId } });
    if (!indicator) {
      throw new NotFoundException(`Indicador con ID "${indicatorId}" no encontrado`);
    }

    const record = await this.prisma.siaIndicatorRecord.create({
      data: {
        indicatorId,
        value: dto.value,
        date: new Date(dto.date),
        region: dto.region,
        institution: dto.institution,
      },
    });

    await this.prisma.siaIndicator.update({
      where: { id: indicatorId },
      data: { current: dto.value },
    });

    return record;
  }

  async getRecords(indicatorId: string, startDate?: string, endDate?: string) {
    const where: any = { indicatorId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    return this.prisma.siaIndicatorRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async getCategories() {
    const values: SiaIndicatorCategory[] = [
      'EDUCACION',
      'AMBIENTAL',
      'SOCIAL',
      'ECONOMICO',
      'PARTICIPACION',
      'CONSERVACION',
    ];
    return values;
  }

  async getSummary() {
    const indicators = await this.prisma.siaIndicator.findMany({
      where: { active: true },
      include: {
        records: { orderBy: { date: 'desc' }, take: 1 },
      },
      orderBy: { category: 'asc' },
    });

    const grouped: Record<string, any[]> = {};
    for (const indicator of indicators) {
      const cat = indicator.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({
        id: indicator.id,
        name: indicator.name,
        slug: indicator.slug,
        description: indicator.description,
        unit: indicator.unit,
        target: indicator.target,
        current: indicator.records[0]?.value ?? indicator.current,
        year: indicator.year,
        region: indicator.region,
        lastRecord: indicator.records[0] || null,
      });
    }

    return grouped;
  }
}
