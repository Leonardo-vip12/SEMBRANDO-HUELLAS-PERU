import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginatedResult } from '../interfaces/pagination.interface';
export declare abstract class BaseCrudService<T> {
    protected prisma: PrismaService;
    protected abstract readonly logger: Logger;
    protected abstract readonly modelName: string;
    protected abstract readonly prismaDelegate: any;
    constructor(prisma: PrismaService);
    findAll(query: PaginationDto, include?: any, where?: any): Promise<PaginatedResult<T>>;
    findById(id: string, include?: any): Promise<T>;
    findBySlug(slug: string, include?: any): Promise<T>;
    create(data: any, include?: any): Promise<T>;
    update(id: string, data: any, include?: any): Promise<T>;
    remove(id: string): Promise<void>;
    count(where?: any): Promise<number>;
    protected buildSearchFilter(search: string): any;
}
