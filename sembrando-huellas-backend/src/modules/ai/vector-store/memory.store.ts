import { IVectorStore } from './vector-store.interface';
import { RAGDocument, RAGSearchResult } from '../rag/rag.service';

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB || 1);
}

export class MemoryVectorStore implements IVectorStore {
  readonly name = 'memory';
  private documents: RAGDocument[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    this.initialized = true;
  }

  async upsert(documents: RAGDocument[]): Promise<void> {
    for (const doc of documents) {
      const idx = this.documents.findIndex((d) => d.id === doc.id);
      if (idx >= 0) this.documents[idx] = doc;
      else this.documents.push(doc);
    }
  }

  async search(embedding: number[], collection?: string, limit = 10, threshold = 0.7): Promise<RAGSearchResult[]> {
    let candidates = this.documents;
    if (collection) candidates = candidates.filter((d) => d.collection === collection);
    if (!embedding || embedding.length === 0) return candidates.slice(0, limit).map((d) => ({ document: d, score: 0 }));

    const scored = candidates
      .filter((d) => d.embedding)
      .map((d) => ({ document: d, score: cosineSimilarity(embedding, d.embedding!) }))
      .filter((r) => r.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored;
  }

  async delete(ids: string[]): Promise<void> {
    this.documents = this.documents.filter((d) => !ids.includes(d.id));
  }

  async clearCollection(collection: string): Promise<void> {
    this.documents = this.documents.filter((d) => d.collection !== collection);
  }

  isAvailable(): boolean {
    return this.initialized;
  }
}
