import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';
export declare class ProgramsService extends BaseCrudService<any> {
    protected prisma: PrismaService;
    protected logger: Logger;
    protected modelName: string;
    constructor(prisma: PrismaService);
    get prismaDelegate(): import(".prisma/client").Prisma.ProgramDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    create(dto: any): Promise<any>;
    protected buildSearchFilter(search: string): {
        OR: ({
            name: {
                contains: string;
                mode: "insensitive";
            };
            description?: undefined;
        } | {
            description: {
                contains: string;
                mode: "insensitive";
            };
            name?: undefined;
        })[];
    };
}
