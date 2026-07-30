import { Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto } from '../dto/pagination.dto';
import { paginate, PaginatedResult } from '../interfaces/pagination.interface';

export abstract class BaseCrudService<T> {
  protected abstract readonly logger: Logger;
  protected abstract readonly modelName: string;
  protected abstract readonly prismaDelegate: any;

  constructor(protected prisma: PrismaService) {}

  async findAll(query: PaginationDto, include?: any, where?: any): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10, sort, order = 'asc', search } = query;

    const skip = (page - 1) * limit;

    const orderBy = sort ? { [sort]: order } : { createdAt: 'desc' as const };

    const [data, total] = await Promise.all([
      this.prismaDelegate.findMany({
        skip,
        take: limit,
        orderBy,
        where: { ...where, ...(search ? this.buildSearchFilter(search) : {}) },
        include,
      }),
      this.prismaDelegate.count({ where: { ...where, ...(search ? this.buildSearchFilter(search) : {}) } }),
    ]);

    return paginate(data, total, query);
  }

  async findById(id: string, include?: any): Promise<T> {
    const item = await this.prismaDelegate.findUnique({
      where: { id },
      include,
    });
    if (!item) {
      throw new NotFoundException(`${this.modelName} con ID "${id}" no encontrado`);
    }
    return item;
  }

  async findBySlug(slug: string, include?: any): Promise<T> {
    const item = await this.prismaDelegate.findUnique({
      where: { slug },
      include,
    });
    if (!item) {
      throw new NotFoundException(`${this.modelName} con slug "${slug}" no encontrado`);
    }
    return item;
  }

  async create(data: any, include?: any): Promise<T> {
    return this.prismaDelegate.create({ data, include });
  }

  async update(id: string, data: any, include?: any): Promise<T> {
    const item = await this.prismaDelegate.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`${this.modelName} con ID "${id}" no encontrado`);
    }
    return this.prismaDelegate.update({ where: { id }, data, include });
  }

  async remove(id: string): Promise<void> {
    const item = await this.prismaDelegate.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`${this.modelName} con ID "${id}" no encontrado`);
    }
    await this.prismaDelegate.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prismaDelegate.count({ where });
  }

  protected buildSearchFilter(search: string): any {
    return { name: { contains: search, mode: 'insensitive' } };
  }
}
