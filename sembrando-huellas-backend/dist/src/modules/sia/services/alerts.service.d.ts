import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';
export declare class SiaAlertsService {
    private prisma;
    private aiService?;
    protected logger: Logger;
    constructor(prisma: PrismaService, aiService?: AiService | undefined);
    createRule(dto: {
        name: string;
        description?: string;
        condition: string;
        threshold: number;
        severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        channel?: string;
        cooldown?: number;
        indicatorId?: string;
    }): Promise<any>;
    updateRule(id: string, dto: any): Promise<any>;
    findAllRules(status?: string, severity?: string): Promise<any>;
    findOneRule(id: string): Promise<any>;
    deleteRule(id: string): Promise<void>;
    getLogs(ruleId?: string, severity?: string, read?: boolean, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    markAsRead(id: string): Promise<any>;
    markAllAsRead(): Promise<{
        updated: any;
    }>;
    checkThresholds(): Promise<any[]>;
    getStats(): Promise<{
        severity: Record<string, number>;
        status: Record<string, number>;
        totalLogs: any;
        unreadLogs: any;
    }>;
}
