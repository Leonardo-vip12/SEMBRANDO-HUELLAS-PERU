import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../ai.service';
export interface RAGDocument {
    id: string;
    content: string;
    source: string;
    collection: string;
    metadata?: Record<string, any>;
    embedding?: number[];
}
export interface RAGSearchResult {
    document: RAGDocument;
    score: number;
}
export declare class RAGService {
    private prisma;
    private aiService;
    private readonly logger;
    constructor(prisma: PrismaService, aiService: AiService);
    indexDocument(document: Omit<RAGDocument, 'embedding'>): Promise<void>;
    searchSimilar(query: string, collection?: string, limit?: number, threshold?: number): Promise<RAGSearchResult[]>;
    indexAllContent(): Promise<{
        indexed: number;
        failed: number;
    }>;
    private saveToVectorStore;
    private searchVectorStore;
}
