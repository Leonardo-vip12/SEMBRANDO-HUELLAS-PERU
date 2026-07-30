import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class SiaAnalyticsService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
    getLineChart(metric: string, period: string): Promise<{
        metric: string;
        period: string;
        data: {
            label: string;
            value: number;
        }[];
    }>;
    getBarChart(groupBy: string, metric: string): Promise<{
        groupBy: string;
        metric: string;
        data: {
            label: string;
            value: number;
        }[];
    }>;
    getPieChart(category: string): Promise<{
        groupBy: string;
        metric: string;
        data: {
            label: string;
            value: number;
        }[];
    } | {
        category: "observationStatus";
        data: {
            label: string;
            value: number;
        }[];
    } | {
        category: "partnerType";
        data: {
            label: string;
            value: number;
        }[];
    } | {
        category: string;
        data: never[];
    }>;
    getRadarChart(dimensions: string[]): Promise<{
        dimensions: string[];
        data: {
            dimension: string;
            value: number;
        }[];
    }>;
    getHeatmap(region?: string, date?: string): Promise<{
        type: string;
        features: {
            type: string;
            geometry: {
                type: string;
                coordinates: any[];
            };
            properties: {
                weight: any;
                speciesName: any;
                date: any;
            };
        }[];
    }>;
    getAccumulatedIndicators(): Promise<{
        id: any;
        name: any;
        slug: any;
        category: any;
        unit: any;
        currentTotal: number;
        target: any;
        progress: number | null;
        data: any;
    }[]>;
}
