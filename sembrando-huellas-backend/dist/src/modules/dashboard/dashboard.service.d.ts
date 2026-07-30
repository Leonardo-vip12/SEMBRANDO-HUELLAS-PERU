import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        content: {
            news: number;
            projects: number;
            events: number;
            species: number;
            gallery: number;
            resources: number;
        };
        engagement: {
            volunteers: number;
            partners: number;
            users: number;
        };
        donations: {
            total: number;
            completedAmount: number;
        };
    }>;
    getRecentActivity(limit?: number): Promise<({
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
    })[]>;
}
