import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class RAGService {
  private readonly logger = new Logger(RAGService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async indexDocument(document: Omit<RAGDocument, 'embedding'>): Promise<void> {
    try {
      const embeddings = await this.aiService.embed([document.content]);
      if (embeddings.embeddings.length > 0) {
        const doc: RAGDocument = { ...document, embedding: embeddings.embeddings[0] };
        await this.saveToVectorStore(doc);
      }
    } catch (error) {
      this.logger.error(`Failed to index document ${document.id}: ${(error as Error).message}`);
    }
  }

  async searchSimilar(query: string, collection?: string, limit = 10, threshold = 0.7): Promise<RAGSearchResult[]> {
    try {
      const embeddings = await this.aiService.embed([query]);
      if (embeddings.embeddings.length === 0) return [];
      const queryEmbedding = embeddings.embeddings[0];
      return this.searchVectorStore(queryEmbedding, collection, limit, threshold);
    } catch (error) {
      this.logger.error(`Failed to search: ${(error as Error).message}`);
      return [];
    }
  }

  async indexAllContent(): Promise<{ indexed: number; failed: number }> {
    let indexed = 0;
    let failed = 0;

    const collections = [
      {
        name: 'news',
        data: await this.prisma.news.findMany({ select: { id: true, title: true, excerpt: true, content: true } }),
      },
      {
        name: 'species',
        data: await this.prisma.species.findMany({ select: { id: true, name: true, description: true } }),
      },
      {
        name: 'programs',
        data: await this.prisma.program.findMany({ select: { id: true, title: true, description: true } }),
      },
      { name: 'faq', data: await this.prisma.faq.findMany({ select: { id: true, question: true, answer: true } }) },
    ];

    for (const { name, data } of collections) {
      for (const item of data) {
        try {
          const content = Object.values(item)
            .filter((v) => typeof v === 'string')
            .join('. ');
          const doc: Omit<RAGDocument, 'embedding'> = {
            id: `${name}-${(item as any).id}`,
            content,
            source: (item as any).id,
            collection: name,
            metadata: item,
          };
          await this.indexDocument(doc);
          indexed++;
        } catch {
          failed++;
        }
      }
    }

    return { indexed, failed };
  }

  private async saveToVectorStore(document: RAGDocument): Promise<void> {
    const { VectorStoreFactory } = await import('../vector-store/vector-store.factory');
    const store = VectorStoreFactory.create();
    await store.upsert([document]);
  }

  private async searchVectorStore(
    embedding: number[],
    collection?: string,
    limit = 10,
    threshold = 0.7,
  ): Promise<RAGSearchResult[]> {
    const { VectorStoreFactory } = await import('../vector-store/vector-store.factory');
    const store = VectorStoreFactory.create();
    return store.search(embedding, collection, limit, threshold);
  }
}
