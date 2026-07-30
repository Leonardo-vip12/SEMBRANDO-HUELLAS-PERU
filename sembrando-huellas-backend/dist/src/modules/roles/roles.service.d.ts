import { Logger } from '@nestjs/common';
import { RoleName } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';
export declare class RolesService extends BaseCrudService<any> {
    protected prisma: PrismaService;
    protected logger: Logger;
    protected modelName: string;
    constructor(prisma: PrismaService);
    get prismaDelegate(): import(".prisma/client").Prisma.RoleDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    findByName(name: RoleName): Promise<({
        rolePermissions: ({
            permission: {
                id: string;
                name: string;
                description: string | null;
                key: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            createdAt: Date;
            permissionId: string;
            roleId: string;
        })[];
    } & {
        id: string;
        name: import(".prisma/client").$Enums.RoleName;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isSystem: boolean;
    }) | null>;
}
