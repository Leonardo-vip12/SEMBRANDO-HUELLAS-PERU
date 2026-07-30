import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TeamService {
  protected logger = new Logger(TeamService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.teamMember.findMany({ skip, take: limit, orderBy: { order: 'asc' as const } }),
      this.prisma.teamMember.count(),
    ]);
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const item = await this.prisma.teamMember.findUnique({ where: { id } });
    if (!item) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException('Miembro del Equipo no encontrado');
    }
    return item;
  }

  async create(data: any) {
    return this.prisma.teamMember.create({ data });
  }

  async update(id: string, data: any) {
    const item = await this.prisma.teamMember.findUnique({ where: { id } });
    if (!item) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException('Miembro del Equipo no encontrado');
    }
    return this.prisma.teamMember.update({ where: { id }, data });
  }

  async remove(id: string) {
    const item = await this.prisma.teamMember.findUnique({ where: { id } });
    if (!item) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException('Miembro del Equipo no encontrado');
    }
    await this.prisma.teamMember.delete({ where: { id } });
  }

  protected buildSearchFilter(search: string) {
    return {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { role: { contains: search, mode: 'insensitive' as const } },
      ],
    };
  }
}
