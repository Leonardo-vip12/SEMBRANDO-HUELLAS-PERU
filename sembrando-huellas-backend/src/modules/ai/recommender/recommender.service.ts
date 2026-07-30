import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../ai.service';

export interface Recommendation {
  type: string;
  id: string;
  title: string;
  description: string;
  image?: string;
  score: number;
  reason: string;
}

@Injectable()
export class RecommenderService {
  private readonly logger = new Logger(RecommenderService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async recommend(query: string, limit = 6): Promise<Recommendation[]> {
    try {
      const embedding = await this.aiService.embed([query]);
      if (!embedding.embeddings.length) return this.fallback(query, limit);

      const vectorResults = await this.searchAllCollections(embedding.embeddings[0], limit);
      return vectorResults;
    } catch (error) {
      this.logger.error(`Recommendation failed: ${(error as Error).message}`);
      return this.fallback(query, limit);
    }
  }

  async recommendForItem(itemId: string, itemType: string, limit = 4): Promise<Recommendation[]> {
    let content = '';
    switch (itemType) {
      case 'species': {
        const s = await this.prisma.species.findUnique({ where: { id: itemId } });
        if (s) content = `${s.name} ${s.description || ''}`;
        break;
      }
      case 'news': {
        const n = await this.prisma.news.findUnique({ where: { id: itemId } });
        if (n) content = `${n.title} ${n.excerpt || ''}`;
        break;
      }
      case 'program': {
        const p = await this.prisma.program.findUnique({ where: { id: itemId } });
        if (p) content = `${p.title} ${p.description || ''}`;
        break;
      }
    }
    if (!content) return [];
    return this.recommend(content, limit);
  }

  private async searchAllCollections(embedding: number[], limit: number): Promise<Recommendation[]> {
    const { VectorStoreFactory } = await import('../vector-store/vector-store.factory');
    const store = VectorStoreFactory.create();
    const results = await store.search(embedding, undefined, limit, 0.5);
    return results.map((r) => ({
      type: r.document.collection,
      id: r.document.id.replace(/^[a-z]+-/, ''),
      title: r.document.content.slice(0, 100),
      description: r.document.content.slice(0, 200),
      score: r.score,
      reason: 'Contenido relacionado',
    }));
  }

  private async fallback(query: string, limit: number): Promise<Recommendation[]> {
    const results: Recommendation[] = [];
    const species = await this.prisma.species.findMany({
      take: limit,
      where: { description: { contains: query, mode: 'insensitive' } },
    });
    species.forEach((s) =>
      results.push({
        type: 'species',
        id: s.id,
        title: s.name,
        description: s.description || '',
        score: 0.5,
        reason: 'Coincidencia de búsqueda',
      }),
    );
    return results.slice(0, limit);
  }
}
