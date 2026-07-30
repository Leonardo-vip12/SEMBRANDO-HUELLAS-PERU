import { Module, Global } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AssistantService } from './assistant/assistant.service';
import { IdentifierService } from './identifier/identifier.service';
import { GeneratorsService } from './generators/generators.service';
import { RecommenderService } from './recommender/recommender.service';
import { SemanticSearchService } from './semantic-search/semantic-search.service';
import { TranslatorService } from './translator/translator.service';
import { CertificatesService } from './certificates/certificates.service';
import { SummarizerService } from './summarizer/summarizer.service';
import { ImpactAnalysisService } from './impact/impact-analysis.service';
import { RAGService } from './rag/rag.service';
import { AiQueryLogService } from './admin/ai-query-log.service';
import { AiConfigService } from './admin/ai-config.service';

@Global()
@Module({
  controllers: [AiController],
  providers: [
    AiService,
    AssistantService,
    IdentifierService,
    GeneratorsService,
    RecommenderService,
    SemanticSearchService,
    TranslatorService,
    CertificatesService,
    SummarizerService,
    ImpactAnalysisService,
    RAGService,
    AiQueryLogService,
    AiConfigService,
  ],
  exports: [
    AiService,
    AssistantService,
    IdentifierService,
    GeneratorsService,
    RecommenderService,
    SemanticSearchService,
    TranslatorService,
    CertificatesService,
    SummarizerService,
    ImpactAnalysisService,
    RAGService,
    AiQueryLogService,
    AiConfigService,
  ],
})
export class AiModule {}
