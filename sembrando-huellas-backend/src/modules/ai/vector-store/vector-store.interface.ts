import { RAGDocument, RAGSearchResult } from '../rag/rag.service';

export interface IVectorStore {
  readonly name: string;

  initialize(): Promise<void>;
  upsert(documents: RAGDocument[]): Promise<void>;
  search(embedding: number[], collection?: string, limit?: number, threshold?: number): Promise<RAGSearchResult[]>;
  delete(ids: string[]): Promise<void>;
  clearCollection(collection: string): Promise<void>;
  isAvailable(): boolean;
}
