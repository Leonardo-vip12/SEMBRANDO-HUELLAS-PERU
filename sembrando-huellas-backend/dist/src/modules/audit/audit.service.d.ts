import { Logger } from '@nestjs/common';
import { AuditAction, AuditSeverity } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AuditService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
    log(params: {
        action: AuditAction;
        entity: string;
        entityId?: string;
        userId?: string;
        metadata?: any;
        severity?: AuditSeverity;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: import(".prisma/client").$Enums.AuditAction;
        entity: string;
        entityId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        severity: import(".prisma/client").$Enums.AuditSeverity;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: ({
            user: {
                id: string;
                name: string;
                email: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            action: import(".prisma/client").$Enums.AuditAction;
            entity: string;
            entityId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            severity: import(".prisma/client").$Enums.AuditSeverity;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
