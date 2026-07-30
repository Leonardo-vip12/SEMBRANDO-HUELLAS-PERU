import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
export declare class NewsService extends BaseCrudService<any> {
    protected prisma: PrismaService;
    protected logger: Logger;
    protected modelName: string;
    constructor(prisma: PrismaService);
    get prismaDelegate(): import(".prisma/client").Prisma.NewsDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    create(dto: CreateNewsDto, userId: string): Promise<any>;
    update(id: string, dto: UpdateNewsDto): Promise<any>;
    protected buildSearchFilter(search: string): {
        OR: ({
            title: {
                contains: string;
                mode: "insensitive";
            };
            excerpt?: undefined;
        } | {
            excerpt: {
                contains: string;
                mode: "insensitive";
            };
            title?: undefined;
        })[];
    };
}
