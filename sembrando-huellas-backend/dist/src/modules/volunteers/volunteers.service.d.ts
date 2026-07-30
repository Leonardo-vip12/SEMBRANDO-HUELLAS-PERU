import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';
export declare class VolunteersService extends BaseCrudService<any> {
    protected prisma: PrismaService;
    protected logger: Logger;
    protected modelName: string;
    constructor(prisma: PrismaService);
    get prismaDelegate(): import(".prisma/client").Prisma.VolunteerDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    protected buildSearchFilter(search: string): {
        OR: ({
            name: {
                contains: string;
                mode: "insensitive";
            };
            email?: undefined;
        } | {
            email: {
                contains: string;
                mode: "insensitive";
            };
            name?: undefined;
        })[];
    };
}
