import { IVectorStore } from './vector-store.interface';
export declare class VectorStoreFactory {
    private static instance;
    static create(type?: 'memory' | 'pgvector' | 'qdrant'): IVectorStore;
    static resetInstance(): void;
}
