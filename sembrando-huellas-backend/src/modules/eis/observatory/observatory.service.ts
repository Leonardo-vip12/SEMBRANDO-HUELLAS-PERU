import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ObservatoryService {
  private readonly logger = new Logger(ObservatoryService.name);

  constructor(private prisma: PrismaService) {}

  async register(dto: {
    speciesName?: string;
    scientificName?: string;
    quantity?: number;
    latitude: number;
    longitude: number;
    observedAt?: string;
    habitat?: string;
    weather?: string;
    comments?: string;
    images?: string[];
    userId?: string;
  }): Promise<any> {
    if (!dto.latitude || !dto.longitude) {
      throw new BadRequestException('La ubicación es obligatoria');
    }

    return (this.prisma as any).biodiversityObservation.create({
      data: {
        speciesName: dto.speciesName,
        scientificName: dto.scientificName,
        quantity: dto.quantity || 1,
        latitude: dto.latitude,
        longitude: dto.longitude,
        observedAt: dto.observedAt ? new Date(dto.observedAt) : new Date(),
        habitat: dto.habitat,
        weather: dto.weather,
        comments: dto.comments,
        images: dto.images || [],
        status: 'PENDING',
        userId: dto.userId,
      },
    });
  }

  async findAll(page = 1, limit = 50, status?: string): Promise<any> {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const [data, total] = await Promise.all([
      (this.prisma as any).biodiversityObservation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true } } },
      }),
      (this.prisma as any).biodiversityObservation.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getMapData(status?: string): Promise<any[]> {
    const where: any = {};
    if (status) where.status = status;
    const observations: any[] = await (this.prisma as any).biodiversityObservation.findMany({
      where,
      select: {
        id: true,
        speciesName: true,
        scientificName: true,
        latitude: true,
        longitude: true,
        quantity: true,
        observedAt: true,
        status: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });
    return observations.map((o) => ({
      id: o.id,
      speciesName: o.speciesName,
      scientificName: o.scientificName,
      lat: o.latitude,
      lng: o.longitude,
      quantity: o.quantity,
      date: o.observedAt,
      status: o.status,
      images: o.images,
    }));
  }

  async verifyObservation(
    id: string,
    reviewerId: string,
    status: 'VERIFIED' | 'REJECTED' | 'NEEDS_REVIEW',
  ): Promise<any> {
    return (this.prisma as any).biodiversityObservation.update({
      where: { id },
      data: { status, reviewedBy: reviewerId, reviewedAt: new Date() },
    });
  }

  async getStats(): Promise<any> {
    const [total, verified, pending, speciesCount] = await Promise.all([
      (this.prisma as any).biodiversityObservation.count(),
      (this.prisma as any).biodiversityObservation.count({ where: { status: 'VERIFIED' } }),
      (this.prisma as any).biodiversityObservation.count({ where: { status: 'PENDING' } }),
      (this.prisma as any).biodiversityObservation.groupBy({
        by: ['scientificName'],
        _count: true,
        orderBy: { _count: { scientificName: 'desc' } },
        take: 10,
      }),
    ]);
    return { total, verified, pending, topSpecies: speciesCount.filter((s: any) => s.scientificName) };
  }
}
