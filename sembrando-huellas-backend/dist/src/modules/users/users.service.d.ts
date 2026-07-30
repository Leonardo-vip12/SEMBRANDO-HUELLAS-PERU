import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';
export declare class UsersService extends BaseCrudService<any> {
    protected prisma: PrismaService;
    protected logger: Logger;
    protected modelName: string;
    constructor(prisma: PrismaService);
    get prismaDelegate(): import(".prisma/client").Prisma.UserDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    create(dto: any): Promise<any>;
    findByEmail(email: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        avatar: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        refreshToken: string | null;
        roleId: string;
    } | null>;
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
