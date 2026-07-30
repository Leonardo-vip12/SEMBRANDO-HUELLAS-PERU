import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../ai.service';
export declare class ImpactAnalysisService {
    private prisma;
    private aiService;
    private readonly logger;
    constructor(prisma: PrismaService, aiService: AiService);
    generateReport(startDate?: string, endDate?: string): Promise<any>;
    analyzeTrend(metricKey: string): Promise<any>;
}
