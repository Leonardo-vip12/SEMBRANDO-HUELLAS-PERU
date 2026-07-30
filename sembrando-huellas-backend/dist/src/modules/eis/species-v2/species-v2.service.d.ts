import { AiService } from '../../ai/ai.service';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class SpeciesV2Service {
    private aiService;
    private prisma;
    private readonly logger;
    constructor(aiService: AiService, prisma: PrismaService);
    identify(imageBuffer: Buffer, mimeType: string, userId?: string): Promise<any>;
    getIdentificationHistory(userId?: string, page?: number, limit?: number): Promise<any>;
    getStats(): Promise<any>;
    private parseResult;
    private findSimilarSpecies;
    private findBibliography;
}
