import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai.service';
import { RAGService, RAGSearchResult } from '../rag/rag.service';
import { SemanticSearchDto, SemanticSearchResultDto } from '../dto/semantic.dto';

@Injectable()
export class SemanticSearchService {
  private readonly logger = new Logger(SemanticSearchService.name);

  constructor(
    private aiService: AiService,
    private ragService: RAGService,
  ) {}

  async search(dto: SemanticSearchDto): Promise<SemanticSearchResultDto[]> {
    const collection = dto.collections?.join(',');
    const results = await this.ragService.searchSimilar(dto.query, collection, dto.limit || 10, dto.threshold || 0.5);

    return results.map((r) => ({
      id: r.document.id,
      content: r.document.content,
      source: r.document.source,
      collection: r.document.collection,
      score: r.score,
      metadata: r.document.metadata,
    }));
  }

  async hybridSearch(query: string, limit = 10): Promise<SemanticSearchResultDto[]> {
    const semanticResults = await this.search({ query, limit });

    if (semanticResults.length >= limit) return semanticResults.slice(0, limit);

    const existingIds = new Set(semanticResults.map((r) => r.id));
    const keywordResults = await this.keywordSearch(query, limit - semanticResults.length);
    const filtered = keywordResults.filter((r) => !existingIds.has(r.id));

    return [...semanticResults, ...filtered];
  }

  private async keywordSearch(query: string, limit: number): Promise<SemanticSearchResultDto[]> {
    const results: SemanticSearchResultDto[] = [];
    const { PrismaService } = await import('../../../prisma/prisma.service');
    return results;
  }
}
