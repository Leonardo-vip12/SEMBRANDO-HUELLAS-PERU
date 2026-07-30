import { Injectable, Logger } from '@nestjs/common';
import { RAGService } from '../../ai/rag/rag.service';
import { AiService } from '../../ai/ai.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';

@Injectable()
export class RagV2Service {
  private readonly logger = new Logger(RagV2Service.name);

  constructor(
    private ragService: RAGService,
    private aiService: AiService,
    private prisma: PrismaService,
    private kbService: KnowledgeBaseService,
  ) {}

  async search(query: string, collection?: string, limit = 10, threshold = 0.7) {
    return this.ragService.searchSimilar(query, collection, limit, threshold);
  }

  async indexAll() {
    return this.ragService.indexAllContent();
  }

  async indexCollection(collection: string) {
    let indexed = 0;
    let failed = 0;

    const getData = () => {
      switch (collection) {
        case 'news':
          return this.prisma.news.findMany({ select: { id: true, title: true, excerpt: true, content: true } });
        case 'species':
          return this.prisma.species.findMany({ select: { id: true, name: true, description: true } });
        case 'programs':
          return this.prisma.program.findMany({ select: { id: true, title: true, description: true } });
        case 'faq':
          return this.prisma.faq.findMany({ select: { id: true, question: true, answer: true } });
        case 'resources':
          return (this.prisma as any).resource.findMany({ select: { id: true, title: true, description: true } });
        case 'projects':
          return (this.prisma as any).project.findMany({ select: { id: true, name: true, description: true } });
        default:
          return null;
      }
    };

    const data: any = await getData();
    if (!data) throw new Error(`Collection '${collection}' not recognized`);

    for (const item of data) {
      try {
        const content = Object.values(item)
          .filter((v) => typeof v === 'string')
          .join('. ');
        await this.ragService.indexDocument({
          id: `${collection}-${(item as any).id}`,
          content,
          source: (item as any).id,
          collection,
          metadata: item,
        });
        indexed++;
      } catch {
        failed++;
      }
    }

    return { collection, indexed, failed };
  }

  async getStats() {
    const kbStats = await this.kbService.getStats();

    const collections: string[] = ['news', 'species', 'programs', 'faq', 'resources', 'projects'];

    return {
      vectorStore: {
        totalDocuments: kbStats.total,
        collections,
      },
      knowledgeBase: kbStats,
    };
  }

  async searchKnowledgeBase(query: string, category?: string, limit = 10) {
    return this.kbService.search(query, category, limit);
  }
}
