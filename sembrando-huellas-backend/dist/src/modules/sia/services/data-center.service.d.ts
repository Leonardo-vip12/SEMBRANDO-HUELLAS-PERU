import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';
export declare class SiaDataCenterService {
    private prisma;
    private aiService?;
    protected logger: Logger;
    constructor(prisma: PrismaService, aiService?: AiService | undefined);
    createDataset(dto: {
        title: string;
        slug: string;
        description?: string;
        category?: string;
        source?: string;
        format?: string;
        visibility?: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED';
    }): Promise<any>;
    updateDataset(id: string, dto: any): Promise<any>;
    findAllDatasets(category?: string, visibility?: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findDataset(id: string): Promise<any>;
    deleteDataset(id: string): Promise<void>;
    getMetadata(): Promise<{
        totalDatasets: any;
        categories: any;
        formats: any;
        lastUpdated: any;
    }>;
    getTimeSeriesData(indicatorId?: string, startDate?: string, endDate?: string): Promise<{
        title: string;
        generatedAt: string;
        totalRecords: any;
        data: any;
    }>;
    getOpenDataCatalog(): Promise<{
        catalog: {
            title: string;
            description: string;
            modified: string;
            publisher: string;
            license: string;
        };
        datasets: any;
        total: any;
    }>;
}
