"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
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
const ai_assistant_dto_1 = require("./dto/ai-assistant.dto");
const generator_dto_1 = require("./dto/generator.dto");
const semantic_dto_1 = require("./dto/semantic.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let AiController = class AiController {
    constructor(aiService, assistant, identifier, generators, recommender, semanticSearch, translator, certificates, summarizer, impactAnalysis, ragService, queryLog, config) {
        this.aiService = aiService;
        this.assistant = assistant;
        this.identifier = identifier;
        this.generators = generators;
        this.recommender = recommender;
        this.semanticSearch = semanticSearch;
        this.translator = translator;
        this.certificates = certificates;
        this.summarizer = summarizer;
        this.impactAnalysis = impactAnalysis;
        this.ragService = ragService;
        this.queryLog = queryLog;
        this.config = config;
    }
    async askAssistant(dto) {
        return this.assistant.query(dto);
    }
    async identify(file) {
        return this.identifier.identifySpecies(file.buffer, file.mimetype);
    }
    async generateContent(dto) {
        return this.generators.generateEducationalContent(dto);
    }
    async generateNews(dto) {
        return this.generators.generateNewsDraft(dto);
    }
    async recommend(query, limit = 6) {
        return this.recommender.recommend(query, limit);
    }
    async recommendForItem(type, id) {
        return this.recommender.recommendForItem(id, type);
    }
    async search(dto) {
        return this.semanticSearch.search(dto);
    }
    async translate(dto) {
        return this.translator.translate(dto);
    }
    async getLanguages() {
        return this.translator.getSupportedLanguages();
    }
    async generateCertificate(dto) {
        return this.certificates.generateCertificate(dto);
    }
    async verifyCertificate(code) {
        return this.certificates.verifyCertificate(code);
    }
    async summarize(dto) {
        return this.summarizer.summarize(dto);
    }
    async impactReport(start, end) {
        return this.impactAnalysis.generateReport(start, end);
    }
    async indexAll() {
        return this.ragService.indexAllContent();
    }
    async getStats() {
        return this.queryLog.getStats();
    }
    async getLogs(page = 1) {
        return this.queryLog.getLogs(page);
    }
    async getConfig() {
        return this.config.getConfig();
    }
    async getProviders() {
        const providers = this.aiService.getAllProviders();
        return providers.map((p) => ({
            type: p.type,
            model: p.getModel(),
            available: p.isAvailable(),
        }));
    }
};
exports.AiController = AiController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('assistant'),
    (0, swagger_1.ApiOperation)({ summary: 'Consultar asistente IA' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_assistant_dto_1.AssistantQueryDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "askAssistant", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('identify'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiOperation)({ summary: 'Identificar especie por imagen' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "identify", null);
__decorate([
    (0, common_1.Post)('generate/content'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar contenido educativo' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generator_dto_1.GenerateContentDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateContent", null);
__decorate([
    (0, common_1.Post)('generate/news'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar borrador de noticia' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generator_dto_1.GenerateNewsDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateNews", null);
__decorate([
    (0, common_1.Get)('recommend'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Recomendaciones inteligentes' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "recommend", null);
__decorate([
    (0, common_1.Get)('recommend/:type/:id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Recomendaciones relacionadas a un item' }),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "recommendForItem", null);
__decorate([
    (0, common_1.Post)('search'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Búsqueda semántica' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [semantic_dto_1.SemanticSearchDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "search", null);
__decorate([
    (0, common_1.Post)('translate'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Traducir texto' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [semantic_dto_1.TranslatorDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "translate", null);
__decorate([
    (0, common_1.Get)('languages'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Idiomas soportados' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getLanguages", null);
__decorate([
    (0, common_1.Post)('certificate/generate'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar certificado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generator_dto_1.GenerateCertificateDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateCertificate", null);
__decorate([
    (0, common_1.Get)('certificate/verify/:code'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar certificado' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "verifyCertificate", null);
__decorate([
    (0, common_1.Post)('summarize'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Resumir texto' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [semantic_dto_1.SummarizeDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "summarize", null);
__decorate([
    (0, common_1.Get)('impact/report'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar informe de impacto' }),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "impactReport", null);
__decorate([
    (0, common_1.Get)('rag/index'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Indexar todo el contenido en RAG' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "indexAll", null);
__decorate([
    (0, common_1.Get)('admin/stats'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Estadísticas de uso IA' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('admin/logs'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Logs de consultas IA' }),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)('admin/config'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Configuración IA' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Get)('providers'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Estado de proveedores IA' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getProviders", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('AI'),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService,
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
        ai_config_service_1.AiConfigService])
], AiController);
//# sourceMappingURL=ai.controller.js.map