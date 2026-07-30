import { RAGService } from '../../ai/rag/rag.service';
import { AiService } from '../../ai/ai.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
export declare class RagV2Service {
    private ragService;
    private aiService;
    private prisma;
    private kbService;
    private readonly logger;
    constructor(ragService: RAGService, aiService: AiService, prisma: PrismaService, kbService: KnowledgeBaseService);
    search(query: string, collection?: string, limit?: number, threshold?: number): Promise<import("../../ai/rag/rag.service").RAGSearchResult[]>;
    indexAll(): Promise<{
        indexed: number;
        failed: number;
    }>;
    indexCollection(collection: string): Promise<{
        collection: string;
        indexed: number;
        failed: number;
    }>;
    getStats(): Promise<{
        vectorStore: {
            totalDocuments: number;
            collections: string[];
        };
        knowledgeBase: {
            total: number;
            verified: number;
            categories: Record<string, number>;
        };
    }>;
    searchKnowledgeBase(query: string, category?: string, limit?: number): Promise<any[]>;
}
