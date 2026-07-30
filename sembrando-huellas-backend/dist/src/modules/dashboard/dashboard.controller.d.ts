import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly service;
    constructor(service: DashboardService);
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
    getRecentActivity(): Promise<({
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
