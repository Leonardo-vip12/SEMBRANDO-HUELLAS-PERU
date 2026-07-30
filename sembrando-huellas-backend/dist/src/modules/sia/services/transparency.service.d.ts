import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';
export declare class SiaTransparencyService {
    private prisma;
    private aiService?;
    protected logger: Logger;
    constructor(prisma: PrismaService, aiService?: AiService | undefined);
    getPublicIndicators(): Promise<any>;
    getPublicProjects(): Promise<{
        total: any;
        projects: any;
    }>;
    getImpactSummary(): Promise<{
        totalImpactMetrics: any;
        totalIndicators: any;
        totalImpactValue: any;
        categories: {
            name: string;
            count: number;
            total: number;
            indicators: any[];
        }[];
        lastUpdated: string;
    }>;
    getPublicDocuments(): Promise<{
        totalDocuments: any;
        resources: any;
        knowledgeBaseEntries: any;
        lastUpdated: string;
    }>;
    getOpenStats(): Promise<{
        totals: {
            indicators: any;
            projects: any;
            volunteers: any;
            events: any;
            citizenObservations: any;
            publicDatasets: any;
        };
        lastUpdated: string;
    }>;
    getDownloadableData(): Promise<{
        availableDatasets: any;
        datasets: any;
        formats: unknown[];
    }>;
}
