import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class SiaDashboardService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
    getExecutiveDashboard(query: {
        startDate?: string;
        endDate?: string;
        region?: string;
        institution?: string;
        projectId?: string;
    }): Promise<{
        activities: number;
        institutions: number;
        students: number;
        teachers: number;
        treesPlanted: number;
        speciesRegistered: number;
        observations: number;
        campaignsExecuted: number;
        resourcesPublished: number;
        volunteerHours: number;
        totalProjects: number;
        totalEvents: number;
    }>;
    getTimeSeries(metric: string, startDate?: string, endDate?: string, interval?: string): Promise<{
        period: string;
        count: number;
    }[]>;
    private buildDateFilter;
}
