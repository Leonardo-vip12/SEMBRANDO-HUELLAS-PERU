import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
    getContentByMonth(): Promise<{
        news: number;
        events: number;
        projects: number;
        month: string;
    }[]>;
    getDonationTrend(): Promise<{
        month: string;
        total: number;
    }[]>;
    getTopPartners(): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        logo: string | null;
        website: string | null;
        order: number;
        active: boolean;
    }[]>;
}
