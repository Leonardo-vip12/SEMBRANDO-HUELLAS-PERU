import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly service;
    constructor(service: AuditService);
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
