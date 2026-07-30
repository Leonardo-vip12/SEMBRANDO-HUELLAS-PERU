import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';
export declare class SiaMonitoringService {
    private prisma;
    private aiService?;
    protected logger: Logger;
    private startTime;
    private activeServices;
    constructor(prisma: PrismaService, aiService?: AiService | undefined);
    private registerCoreServices;
    getSystemStatus(): Promise<{
        api: {
            status: string;
            uptime: string;
        };
        database: {
            status: string;
        };
        redis: {
            status: string;
        };
        aiProviders: {
            name: string;
            healthy: boolean;
        }[];
        uptime: string;
        timestamp: string;
    }>;
    getSyncStatus(): Promise<{
        status: string;
        lastSync: string;
        stats: {
            indicators: any;
            records: any;
            alertLogs: any;
            reports: any;
        };
        error?: undefined;
    } | {
        status: string;
        lastSync: null;
        error: string;
        stats?: undefined;
    }>;
    getActiveServices(): Promise<{
        services: {
            name: string;
            status: string;
            lastHeartbeat: Date;
            uptime: string;
        }[];
        total: number;
    }>;
    getQueues(): Promise<{
        queues: {
            name: string;
            pending: number;
            processing: number;
            failed: number;
        }[];
        note: string;
    }>;
    getProcesses(): Promise<{
        processes: {
            name: string;
            status: string;
            lastRun: null;
            interval: string;
        }[];
    }>;
    getErrors(page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getResourceUsage(): Promise<{
        cpu: {
            usage: number;
            cores: number;
        };
        memory: {
            used: number;
            total: number;
            percent: number;
        };
        disk: {
            used: number;
            total: number;
            percent: number;
        };
        note: string;
        timestamp: string;
    }>;
    createLog(entry: {
        service: string;
        status: string;
        latency?: number;
        errorCount?: number;
        message?: string;
    }): Promise<any>;
    getLogs(service?: string, status?: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    private getUptime;
}
