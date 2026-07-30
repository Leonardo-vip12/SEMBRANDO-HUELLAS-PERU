import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';
export declare class GalleryService extends BaseCrudService<any> {
    protected prisma: PrismaService;
    protected logger: Logger;
    protected modelName: string;
    constructor(prisma: PrismaService);
    get prismaDelegate(): import(".prisma/client").Prisma.GalleryDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    protected buildSearchFilter(search: string): {
        OR: ({
            title: {
                contains: string;
                mode: "insensitive";
            };
            description?: undefined;
        } | {
            description: {
                contains: string;
                mode: "insensitive";
            };
            title?: undefined;
        })[];
    };
}
