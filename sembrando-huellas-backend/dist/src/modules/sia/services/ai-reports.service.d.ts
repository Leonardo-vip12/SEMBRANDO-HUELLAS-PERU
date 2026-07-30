import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';
export declare class SiaAiReportsService {
    private prisma;
    private aiService?;
    protected logger: Logger;
    private readonly disclaimer;
    constructor(prisma: PrismaService, aiService?: AiService | undefined);
    generateSummary(dto: {
        type: string;
        startDate?: string;
        endDate?: string;
        region?: string;
        indicators?: string[];
        includeCharts?: boolean;
    }): Promise<{
        summary: string;
        disclaimer: string;
        data: {
            type: string;
            period: {
                start: string | null;
                end: string | null;
            };
            region: string | null;
            indicators: any;
            aiQueryStats: {
                total: any;
                averageLatency: number;
            };
        };
        charts: any[];
    } | {
        summary: string;
        disclaimer: string;
        data: null;
        charts: never[];
    }>;
    private buildSummaryText;
    detectTrends(metric: string, period: string): Promise<{
        metric: string;
        period: string;
        trends: never[];
        message: string;
        dataPoints?: undefined;
    } | {
        metric: string;
        period: string;
        trends: {
            indicator: any;
            direction: "up" | "down" | "stable";
            magnitude: number;
            confidence: number;
            period: string;
            startValue: any;
            endValue: any;
            average: number;
            change: number;
            changePercent: number;
        }[];
        dataPoints: any;
        message?: undefined;
    }>;
    generateDraft(type: string, filters?: any): Promise<{
        draft: boolean;
        type: string;
        filters: any;
        generatedAt: string;
        sections: {
            title: string;
            type: string;
            data: any;
        }[];
    }>;
    explainChart(chartType: string, data: any): Promise<{
        chartType: string;
        explanation: string;
        disclaimer: string;
        stats?: undefined;
    } | {
        chartType: string;
        explanation: string;
        disclaimer: string;
        stats: {
            min: number;
            max: number;
            avg: number;
            trend: string;
        };
    }>;
    suggestActions(data: any): Promise<{
        suggestions: never[];
        disclaimer: string;
        total?: undefined;
    } | {
        suggestions: {
            indicator: string;
            action: string;
            priority: string;
        }[];
        total: number;
        disclaimer: string;
    }>;
}
