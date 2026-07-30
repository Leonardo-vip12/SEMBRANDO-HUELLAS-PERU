import { IVectorStore } from './vector-store.interface';
import { MemoryVectorStore } from './memory.store';

export class VectorStoreFactory {
  private static instance: IVectorStore;

  static create(type?: 'memory' | 'pgvector' | 'qdrant'): IVectorStore {
    if (this.instance) return this.instance;

    const storeType = type || process.env.VECTOR_STORE || 'memory';

    switch (storeType) {
      case 'pgvector':
        throw new Error('pgvector support not yet implemented. Set VECTOR_STORE=memory or implement PgVectorStore.');
      case 'qdrant':
        throw new Error('Qdrant support not yet implemented. Set VECTOR_STORE=memory or implement QdrantStore.');
      case 'memory':
      default:
        this.instance = new MemoryVectorStore();
        this.instance.initialize();
        return this.instance;
    }
  }

  static resetInstance(): void {
    this.instance = undefined as any;
  }
}
