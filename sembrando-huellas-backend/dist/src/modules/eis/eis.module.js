"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EisModule = void 0;
const common_1 = require("@nestjs/common");
const eis_controller_1 = require("./eis.controller");
const ai_gateway_service_1 = require("./gateway/ai-gateway.service");
const knowledge_base_service_1 = require("./knowledge-base/knowledge-base.service");
const tutor_service_1 = require("./tutor/tutor.service");
const document_analysis_service_1 = require("./document-analysis/document-analysis.service");
const activity_planner_service_1 = require("./activity-planner/activity-planner.service");
const species_v2_service_1 = require("./species-v2/species-v2.service");
const observatory_service_1 = require("./observatory/observatory.service");
const validation_service_1 = require("./validation/validation.service");
const certificates_v2_service_1 = require("./certificates-v2/certificates-v2.service");
const analytics_v2_service_1 = require("./analytics-v2/analytics-v2.service");
const rag_v2_service_1 = require("./rag-v2/rag-v2.service");
const recommender_v2_service_1 = require("./recommender-v2/recommender-v2.service");
let EisModule = class EisModule {
};
exports.EisModule = EisModule;
exports.EisModule = EisModule = __decorate([
    (0, common_1.Module)({
        controllers: [eis_controller_1.EisController],
        providers: [
            ai_gateway_service_1.AiGatewayService,
            knowledge_base_service_1.KnowledgeBaseService,
            tutor_service_1.TutorService,
            document_analysis_service_1.DocumentAnalysisService,
            activity_planner_service_1.ActivityPlannerService,
            species_v2_service_1.SpeciesV2Service,
            observatory_service_1.ObservatoryService,
            validation_service_1.ValidationService,
            certificates_v2_service_1.CertificatesV2Service,
            analytics_v2_service_1.AnalyticsV2Service,
            rag_v2_service_1.RagV2Service,
            recommender_v2_service_1.RecommenderV2Service,
        ],
        exports: [
            ai_gateway_service_1.AiGatewayService,
            knowledge_base_service_1.KnowledgeBaseService,
            tutor_service_1.TutorService,
            document_analysis_service_1.DocumentAnalysisService,
            activity_planner_service_1.ActivityPlannerService,
            species_v2_service_1.SpeciesV2Service,
            observatory_service_1.ObservatoryService,
            validation_service_1.ValidationService,
            certificates_v2_service_1.CertificatesV2Service,
            analytics_v2_service_1.AnalyticsV2Service,
            rag_v2_service_1.RagV2Service,
            recommender_v2_service_1.RecommenderV2Service,
        ],
    })
], EisModule);
//# sourceMappingURL=eis.module.js.map