import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';
export declare class TestimonialsService extends BaseCrudService<any> {
    protected prisma: PrismaService;
    protected logger: Logger;
    protected modelName: string;
    constructor(prisma: PrismaService);
    get prismaDelegate(): import(".prisma/client").Prisma.TestimonialDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    protected buildSearchFilter(search: string): {
        OR: ({
            author: {
                contains: string;
                mode: "insensitive";
            };
            content?: undefined;
        } | {
            content: {
                contains: string;
                mode: "insensitive";
            };
            author?: undefined;
        })[];
    };
}
