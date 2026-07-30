import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';
import { RAGService } from '../../ai/rag/rag.service';
export declare class KnowledgeBaseService {
    private prisma;
    private aiService;
    private ragService;
    private readonly logger;
    constructor(prisma: PrismaService, aiService: AiService, ragService: RAGService);
    addEntry(data: {
        title: string;
        content: string;
        source: string;
        sourceType: string;
        category?: string;
        tags?: string[];
        metadata?: any;
        userId?: string;
    }): Promise<any>;
    search(query: string, category?: string, limit?: number): Promise<any[]>;
    findBySource(source: string, sourceType: string): Promise<any[]>;
    verifyEntry(id: string, userId: string): Promise<any>;
    createVersion(id: string, newContent: string): Promise<any>;
    getStats(): Promise<{
        total: number;
        verified: number;
        categories: Record<string, number>;
    }>;
    private cosineSimilarity;
}
