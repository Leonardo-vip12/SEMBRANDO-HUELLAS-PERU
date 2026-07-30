import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        name: string;
        role: {
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
        };
        permissions: string[];
    }>;
}
export {};
