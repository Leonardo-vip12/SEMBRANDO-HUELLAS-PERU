import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../ai.service';
export interface Recommendation {
    type: string;
    id: string;
    title: string;
    description: string;
    image?: string;
    score: number;
    reason: string;
}
export declare class RecommenderService {
    private prisma;
    private aiService;
    private readonly logger;
    constructor(prisma: PrismaService, aiService: AiService);
    recommend(query: string, limit?: number): Promise<Recommendation[]>;
    recommendForItem(itemId: string, itemType: string, limit?: number): Promise<Recommendation[]>;
    private searchAllCollections;
    private fallback;
}
