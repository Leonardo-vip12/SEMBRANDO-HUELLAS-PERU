import { PrismaService } from '../../../prisma/prisma.service';
export declare class AnalyticsV2Service {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        overview: {
            totalQueries: number;
            totalIdentifications: number;
            totalDocuments: number;
            totalActivities: number;
            totalObservations: number;
            totalCertificates: number;
            totalKnowledgeEntries: number;
        };
        speciesStats: any[];
        queryStats: any;
        activeUsers: {
            total: number;
            last24h: number;
            last7d: number;
        };
        recentActivity: any[];
    }>;
    getFullReport(startDate?: string, endDate?: string): Promise<{
        period: {
            start: string;
            end: string;
        };
        totals: {
            queries: number;
            identifications: number;
            observations: number;
            documents: number;
            activities: number;
            certificates: number;
        };
        trends: {
            queriesByDay: {
                date: string;
                count: number;
            }[];
            identificationsByDay: {
                date: string;
                count: number;
            }[];
        };
        topSpecies: any[];
        topTopics: {
            topic: string;
            count: number;
        }[];
    }>;
    getAIMetrics(): Promise<{
        totalQueries: number;
        totalTokens: number;
        totalCost: number;
        averageLatency: number;
        queriesByFeature: Record<string, number>;
        queriesByProvider: Record<string, number>;
        errorsLast24h: number;
        activeUsers24h: number;
    }>;
    private getTotalQueries;
    private getTotalIdentifications;
    private getTotalDocuments;
    private getTotalActivities;
    private getTotalObservations;
    private getTotalCertificates;
    private getTotalKnowledgeEntries;
    private getTopSpecies;
    private getQueryStats;
    private getActiveUsers;
    private getRecentActivity;
    private countInRange;
    private getDailyCounts;
    private getTopTopics;
}
