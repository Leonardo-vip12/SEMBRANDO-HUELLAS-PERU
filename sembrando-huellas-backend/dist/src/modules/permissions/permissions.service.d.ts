import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';
export declare class PermissionsService extends BaseCrudService<any> {
    protected prisma: PrismaService;
    protected logger: Logger;
    protected modelName: string;
    constructor(prisma: PrismaService);
    get prismaDelegate(): import(".prisma/client").Prisma.PermissionDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
}
