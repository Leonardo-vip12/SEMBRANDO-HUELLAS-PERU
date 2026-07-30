import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';
export declare class SpeciesService extends BaseCrudService<any> {
    protected prisma: PrismaService;
    protected logger: Logger;
    protected modelName: string;
    constructor(prisma: PrismaService);
    get prismaDelegate(): import(".prisma/client").Prisma.SpeciesDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    protected buildSearchFilter(search: string): {
        OR: ({
            commonName: {
                contains: string;
                mode: "insensitive";
            };
            scientificName?: undefined;
        } | {
            scientificName: {
                contains: string;
                mode: "insensitive";
            };
            commonName?: undefined;
        })[];
    };
}
