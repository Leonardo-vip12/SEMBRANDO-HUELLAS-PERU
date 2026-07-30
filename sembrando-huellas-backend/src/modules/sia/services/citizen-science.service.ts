import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

type SiaObservationStatus = 'PENDING' | 'VALIDATED' | 'APPROVED' | 'REJECTED' | 'NEEDS_CORRECTION';

@Injectable()
export class SiaCitizenScienceService {
  protected logger = new Logger(SiaCitizenScienceService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    status?: SiaObservationStatus;
    speciesName?: string;
    region?: string;
    assignedTo?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.speciesName) {
      where.OR = [
        { speciesName: { contains: query.speciesName, mode: 'insensitive' } },
        { scientificName: { contains: query.speciesName, mode: 'insensitive' } },
      ];
    }
    if (query.assignedTo) where.assignedTo = query.assignedTo;
    if (query.startDate || query.endDate) {
      where.observedAt = {};
      if (query.startDate) where.observedAt.gte = new Date(query.startDate);
      if (query.endDate) where.observedAt.lte = new Date(query.endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.siaCitizenObservation.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.siaCitizenObservation.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const observation = await this.prisma.siaCitizenObservation.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
    if (!observation) {
      throw new NotFoundException(`Observación con ID "${id}" no encontrada`);
    }
    return observation;
  }

  async review(
    id: string,
    dto: {
      status: SiaObservationStatus;
      comments?: string;
      assignedTo?: string;
    },
  ) {
    const observation = await this.prisma.siaCitizenObservation.findUnique({ where: { id } });
    if (!observation) {
      throw new NotFoundException(`Observación con ID "${id}" no encontrada`);
    }

    const historyEntry = {
      status: dto.status,
      comments: dto.comments,
      reviewedBy: dto.assignedTo || observation.assignedTo,
      reviewedAt: new Date().toISOString(),
    };

    const existingHistory = (observation.revisionHistory as any[]) || [];
    const revisionHistory = [...existingHistory, historyEntry];

    return this.prisma.siaCitizenObservation.update({
      where: { id },
      data: {
        status: dto.status,
        reviewedBy: dto.assignedTo || observation.reviewedBy,
        reviewedAt: new Date(),
        assignedTo: dto.assignedTo !== undefined ? dto.assignedTo : observation.assignedTo,
        revisionHistory,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async assign(id: string, userId: string) {
    const observation = await this.prisma.siaCitizenObservation.findUnique({ where: { id } });
    if (!observation) {
      throw new NotFoundException(`Observación con ID "${id}" no encontrada`);
    }

    const historyEntry = {
      action: 'ASSIGNED',
      assignedTo: userId,
      assignedAt: new Date().toISOString(),
    };

    const existingHistory = (observation.revisionHistory as any[]) || [];
    const revisionHistory = [...existingHistory, historyEntry];

    return this.prisma.siaCitizenObservation.update({
      where: { id },
      data: {
        assignedTo: userId,
        revisionHistory,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async getStats() {
    const counts = await this.prisma.siaCitizenObservation.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const total = counts.reduce((sum, c) => sum + c._count.id, 0);
    const stats: Record<string, number> = { total };
    for (const c of counts) {
      stats[c.status] = c._count.id;
    }

    return stats;
  }

  async getReviewHistory(id: string) {
    const observation = await this.prisma.siaCitizenObservation.findUnique({
      where: { id },
      select: { revisionHistory: true },
    });
    if (!observation) {
      throw new NotFoundException(`Observación con ID "${id}" no encontrada`);
    }
    return (observation.revisionHistory as any[]) || [];
  }

  async exportPending() {
    return this.prisma.siaCitizenObservation.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }
}
