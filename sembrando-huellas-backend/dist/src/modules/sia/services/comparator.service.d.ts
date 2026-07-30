import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';
export declare class SiaComparatorService {
    private prisma;
    private aiService?;
    protected logger: Logger;
    constructor(prisma: PrismaService, aiService?: AiService | undefined);
    compare(dto: {
        type: 'region' | 'institution' | 'campaign' | 'project' | 'period';
        ids?: string[];
        indicatorId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        type: string;
        labels: any;
        datasets: any;
        total: any;
    } | {
        type: string;
        labels: string[];
        datasets: {
            label: string;
            data: any;
            dates: any;
            average: number;
            count: any;
        }[];
        variation: number;
        variationPercent: number;
    }>;
    private compareByRegion;
    private compareByInstitution;
    private compareByCampaign;
    private compareByProject;
    private compareByPeriod;
    getComparisonChart(type: string, dimension: string): Promise<{
        type: string;
        dimension: string;
        chartType: string;
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            dates: string[];
        }[];
    }>;
}
