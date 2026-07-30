"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const ai_controller_1 = require("./ai.controller");
const ai_service_1 = require("./ai.service");
const assistant_service_1 = require("./assistant/assistant.service");
const identifier_service_1 = require("./identifier/identifier.service");
const generators_service_1 = require("./generators/generators.service");
const recommender_service_1 = require("./recommender/recommender.service");
const semantic_search_service_1 = require("./semantic-search/semantic-search.service");
const translator_service_1 = require("./translator/translator.service");
const certificates_service_1 = require("./certificates/certificates.service");
const summarizer_service_1 = require("./summarizer/summarizer.service");
const impact_analysis_service_1 = require("./impact/impact-analysis.service");
const rag_service_1 = require("./rag/rag.service");
const ai_query_log_service_1 = require("./admin/ai-query-log.service");
const ai_config_service_1 = require("./admin/ai-config.service");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        controllers: [ai_controller_1.AiController],
        providers: [
            ai_service_1.AiService,
            assistant_service_1.AssistantService,
            identifier_service_1.IdentifierService,
            generators_service_1.GeneratorsService,
            recommender_service_1.RecommenderService,
            semantic_search_service_1.SemanticSearchService,
            translator_service_1.TranslatorService,
            certificates_service_1.CertificatesService,
            summarizer_service_1.SummarizerService,
            impact_analysis_service_1.ImpactAnalysisService,
            rag_service_1.RAGService,
            ai_query_log_service_1.AiQueryLogService,
            ai_config_service_1.AiConfigService,
        ],
        exports: [
            ai_service_1.AiService,
            assistant_service_1.AssistantService,
            identifier_service_1.IdentifierService,
            generators_service_1.GeneratorsService,
            recommender_service_1.RecommenderService,
            semantic_search_service_1.SemanticSearchService,
            translator_service_1.TranslatorService,
            certificates_service_1.CertificatesService,
            summarizer_service_1.SummarizerService,
            impact_analysis_service_1.ImpactAnalysisService,
            rag_service_1.RAGService,
            ai_query_log_service_1.AiQueryLogService,
            ai_config_service_1.AiConfigService,
        ],
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map