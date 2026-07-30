import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';
import { RAGService } from '../../ai/rag/rag.service';

@Injectable()
export class KnowledgeBaseService {
  private readonly logger = new Logger(KnowledgeBaseService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private ragService: RAGService,
  ) {}

  async addEntry(data: {
    title: string;
    content: string;
    source: string;
    sourceType: string;
    category?: string;
    tags?: string[];
    metadata?: any;
    userId?: string;
  }): Promise<any> {
    const entry = await (this.prisma as any).knowledgeBase.create({
      data: {
        title: data.title,
        content: data.content,
        source: data.source,
        sourceType: data.sourceType,
        category: data.category,
        tags: data.tags || [],
        metadata: data.metadata || {},
      },
    });

    try {
      const embeddings = await this.aiService.embed([data.content]);
      if (embeddings.embeddings.length > 0) {
        await (this.prisma as any).knowledgeBase.update({
          where: { id: entry.id },
          data: { embedding: embeddings.embeddings[0] },
        });
      }
    } catch (error) {
      this.logger.warn(`Failed to generate embedding for KB entry ${entry.id}`);
    }

    return entry;
  }

  async search(query: string, category?: string, limit = 10): Promise<any[]> {
    try {
      const embeddings = await this.aiService.embed([query]);
      if (embeddings.embeddings.length === 0) return [];

      const allEntries: any[] = await (this.prisma as any).knowledgeBase.findMany({
        where: category ? { category } : {},
      });

      const scored = allEntries
        .filter((e) => e.embedding && e.embedding.length > 0)
        .map((e) => ({
          ...e,
          score: this.cosineSimilarity(embeddings.embeddings[0], e.embedding),
        }))
        .filter((e) => e.score > 0.5)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return scored;
    } catch (error) {
      this.logger.error(`KB search failed: ${(error as Error).message}`);
      return [];
    }
  }

  async findBySource(source: string, sourceType: string): Promise<any[]> {
    return (this.prisma as any).knowledgeBase.findMany({
      where: { source, sourceType },
      orderBy: { version: 'desc' },
    });
  }

  async verifyEntry(id: string, userId: string): Promise<any> {
    return (this.prisma as any).knowledgeBase.update({
      where: { id },
      data: { isVerified: true, verifiedBy: userId, verifiedAt: new Date() },
    });
  }

  async createVersion(id: string, newContent: string): Promise<any> {
    const original = await (this.prisma as any).knowledgeBase.findUnique({ where: { id } });
    if (!original) throw new Error('Entry not found');
    return this.addEntry({
      title: original.title,
      content: newContent,
      source: original.source,
      sourceType: original.sourceType,
      category: original.category,
      tags: original.tags,
      metadata: original.metadata,
    });
  }

  async getStats(): Promise<{ total: number; verified: number; categories: Record<string, number> }> {
    const entries: any[] = await (this.prisma as any).knowledgeBase.findMany();
    const categories: Record<string, number> = {};
    entries.forEach((e) => {
      if (e.category) categories[e.category] = (categories[e.category] || 0) + 1;
    });
    return {
      total: entries.length,
      verified: entries.filter((e) => e.isVerified).length,
      categories,
    };
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB || 1);
  }
}
