import { Module } from '@nestjs/common';
import { EisController } from './eis.controller';
import { AiGatewayService } from './gateway/ai-gateway.service';
import { KnowledgeBaseService } from './knowledge-base/knowledge-base.service';
import { TutorService } from './tutor/tutor.service';
import { DocumentAnalysisService } from './document-analysis/document-analysis.service';
import { ActivityPlannerService } from './activity-planner/activity-planner.service';
import { SpeciesV2Service } from './species-v2/species-v2.service';
import { ObservatoryService } from './observatory/observatory.service';
import { ValidationService } from './validation/validation.service';
import { CertificatesV2Service } from './certificates-v2/certificates-v2.service';
import { AnalyticsV2Service } from './analytics-v2/analytics-v2.service';
import { RagV2Service } from './rag-v2/rag-v2.service';
import { RecommenderV2Service } from './recommender-v2/recommender-v2.service';

@Module({
  controllers: [EisController],
  providers: [
    AiGatewayService,
    KnowledgeBaseService,
    TutorService,
    DocumentAnalysisService,
    ActivityPlannerService,
    SpeciesV2Service,
    ObservatoryService,
    ValidationService,
    CertificatesV2Service,
    AnalyticsV2Service,
    RagV2Service,
    RecommenderV2Service,
  ],
  exports: [
    AiGatewayService,
    KnowledgeBaseService,
    TutorService,
    DocumentAnalysisService,
    ActivityPlannerService,
    SpeciesV2Service,
    ObservatoryService,
    ValidationService,
    CertificatesV2Service,
    AnalyticsV2Service,
    RagV2Service,
    RecommenderV2Service,
  ],
})
export class EisModule {}
