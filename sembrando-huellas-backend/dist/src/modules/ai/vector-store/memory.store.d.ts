import { IVectorStore } from './vector-store.interface';
import { RAGDocument, RAGSearchResult } from '../rag/rag.service';
export declare class MemoryVectorStore implements IVectorStore {
    readonly name = "memory";
    private documents;
    private initialized;
    initialize(): Promise<void>;
    upsert(documents: RAGDocument[]): Promise<void>;
    search(embedding: number[], collection?: string, limit?: number, threshold?: number): Promise<RAGSearchResult[]>;
    delete(ids: string[]): Promise<void>;
    clearCollection(collection: string): Promise<void>;
    isAvailable(): boolean;
}
