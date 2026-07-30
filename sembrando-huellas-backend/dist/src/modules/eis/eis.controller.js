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
exports.EisController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
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
const knowledge_base_dto_1 = require("./dto/knowledge-base.dto");
const tutor_dto_1 = require("./dto/tutor.dto");
const document_analysis_dto_1 = require("./dto/document-analysis.dto");
const activity_planner_dto_1 = require("./dto/activity-planner.dto");
const species_v2_dto_1 = require("./dto/species-v2.dto");
const observatory_dto_1 = require("./dto/observatory.dto");
const validation_dto_1 = require("./dto/validation.dto");
const certificates_v2_dto_1 = require("./dto/certificates-v2.dto");
const analytics_v2_dto_1 = require("./dto/analytics-v2.dto");
const rag_v2_dto_1 = require("./dto/rag-v2.dto");
const recommender_v2_dto_1 = require("./dto/recommender-v2.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let EisController = class EisController {
    constructor(gateway, kb, tutor, docAnalysis, activityPlanner, speciesV2, observatory, validation, certificatesV2, analytics, rag, recommender) {
        this.gateway = gateway;
        this.kb = kb;
        this.tutor = tutor;
        this.docAnalysis = docAnalysis;
        this.activityPlanner = activityPlanner;
        this.speciesV2 = speciesV2;
        this.observatory = observatory;
        this.validation = validation;
        this.certificatesV2 = certificatesV2;
        this.analytics = analytics;
        this.rag = rag;
        this.recommender = recommender;
    }
    getGatewayProviders() {
        return this.gateway.getProviderStatus();
    }
    activateProvider(type) {
        this.gateway.setActiveProvider(type);
        return { active: type };
    }
    async addKnowledgeEntry(dto, user) {
        return this.kb.addEntry({ ...dto, userId: user?.id });
    }
    async searchKnowledge(dto) {
        return this.kb.search(dto.query, dto.category, dto.limit);
    }
    async findBySource(source, sourceType) {
        return this.kb.findBySource(source, sourceType);
    }
    async knowledgeStats() {
        return this.kb.getStats();
    }
    async verifyKnowledgeEntry(id, user) {
        return this.kb.verifyEntry(id, user?.id);
    }
    async createKnowledgeVersion(id, content) {
        return this.kb.createVersion(id, content);
    }
    async tutorAsk(dto) {
        const response = await this.tutor.ask(dto.query, dto.level, dto.sessionId);
        const validation = await this.validation.validateResponse(response.response, { query: dto.query });
        return {
            ...response,
            disclaimer: validation.disclaimer,
            validation: {
                confidence: validation.confidence,
                sources: validation.sources,
                warnings: validation.warnings,
            },
        };
    }
    async analyzeDocument(file, user) {
        return this.docAnalysis.analyzeDocument(file, user?.id);
    }
    async analyzeText(dto) {
        return this.docAnalysis.analyzeText(dto.text, dto.userId);
    }
    async planActivity(dto, user) {
        return this.activityPlanner.plan({ ...dto, userId: user?.id });
    }
    async activityRecommendations(dto) {
        return this.activityPlanner.getRecommendations(dto.level, dto.duration);
    }
    async identifySpecies(image, user) {
        return this.speciesV2.identify(image.buffer, image.mimetype, user?.id);
    }
    async speciesHistory(dto) {
        return this.speciesV2.getIdentificationHistory(dto.userId, dto.page, dto.limit);
    }
    async speciesStats() {
        return this.speciesV2.getStats();
    }
    async registerObservation(dto, user) {
        return this.observatory.register({ ...dto, userId: user?.id });
    }
    async listObservations(dto) {
        return this.observatory.findAll(dto.page, dto.limit, dto.status);
    }
    async observatoryMapData(status) {
        return this.observatory.getMapData(status);
    }
    async verifyObservation(id, dto, user) {
        return this.observatory.verifyObservation(id, user?.id, dto.status);
    }
    async observatoryStats() {
        return this.observatory.getStats();
    }
    async validateResponse(dto) {
        return this.validation.validateResponse(dto.response, {
            query: dto.query,
            provider: dto.provider,
            model: dto.model,
        });
    }
    async validateContent(dto) {
        return this.validation.validateContent(dto.content, dto.category);
    }
    async addDisclaimer(body) {
        const validation = await this.validation.validateResponse(body.response, {
            query: body.query,
            provider: body.provider,
            model: body.model,
        });
        return { content: this.validation.addDisclaimer(body.response, validation), validation };
    }
    async generateCertificate(dto) {
        return this.certificatesV2.generate(dto);
    }
    async verifyCertificate(code) {
        return this.certificatesV2.verify(code);
    }
    async revokeCertificate(code) {
        return this.certificatesV2.revoke(code);
    }
    async listCertificates(page = 1, limit = 20) {
        return this.certificatesV2.list(page, limit);
    }
    async certificatesStats() {
        return this.certificatesV2.getStats();
    }
    async analyticsDashboard() {
        return this.analytics.getDashboard();
    }
    async analyticsReport(dto) {
        return this.analytics.getFullReport(dto.startDate, dto.endDate);
    }
    async analyticsAIMetrics() {
        return this.analytics.getAIMetrics();
    }
    async ragSearch(dto) {
        return this.rag.search(dto.query, dto.collection, dto.limit, dto.threshold);
    }
    async ragIndexAll() {
        return this.rag.indexAll();
    }
    async ragIndexCollection(collection) {
        return this.rag.indexCollection(collection);
    }
    async ragStats() {
        return this.rag.getStats();
    }
    async ragSearchKB(dto) {
        return this.rag.searchKnowledgeBase(dto.query, dto.category, dto.limit);
    }
    async recommendByQuery(dto) {
        return this.recommender.recommend(dto.query, dto.limit);
    }
    async recommendForUser(userId, limit = 6) {
        return this.recommender.recommendForUser(userId, limit);
    }
    async recommendByCategory(category, limit = 4) {
        return this.recommender.recommendByCategory(category, limit);
    }
    async recommendForItem(type, id, limit = 4) {
        return this.recommender.recommendForItem(id, type, limit);
    }
};
exports.EisController = EisController;
__decorate([
    (0, common_1.Get)('gateway/providers'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Estado de proveedores AI Gateway' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EisController.prototype, "getGatewayProviders", null);
__decorate([
    (0, common_1.Post)('gateway/providers/:type/activate'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Activar proveedor específico' }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EisController.prototype, "activateProvider", null);
__decorate([
    (0, common_1.Post)('knowledge-base/entries'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar entrada a la base de conocimiento' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [knowledge_base_dto_1.AddKnowledgeEntryDto, Object]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "addKnowledgeEntry", null);
__decorate([
    (0, common_1.Get)('knowledge-base/entries'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar en base de conocimiento' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [knowledge_base_dto_1.KnowledgeSearchDto]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "searchKnowledge", null);
__decorate([
    (0, common_1.Get)('knowledge-base/entries/source'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar entradas por fuente' }),
    __param(0, (0, common_1.Query)('source')),
    __param(1, (0, common_1.Query)('sourceType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "findBySource", null);
__decorate([
    (0, common_1.Get)('knowledge-base/stats'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Estadísticas de la base de conocimiento' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EisController.prototype, "knowledgeStats", null);
__decorate([
    (0, common_1.Put)('knowledge-base/entries/:id/verify'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar entrada de conocimiento' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "verifyKnowledgeEntry", null);
__decorate([
    (0, common_1.Post)('knowledge-base/entries/:id/versions'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nueva versión de una entrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "createKnowledgeVersion", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('tutor/ask'),
    (0, swagger_1.ApiOperation)({ summary: 'Consultar tutor adaptativo IA' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tutor_dto_1.TutorAskDto]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "tutorAsk", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRADOR', 'EDITOR'),
    (0, common_1.Post)('documents/analyze-file'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Analizar documento (PDF/Word/PPT/texto)' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "analyzeDocument", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('documents/analyze-text'),
    (0, swagger_1.ApiOperation)({ summary: 'Analizar texto directamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [document_analysis_dto_1.AnalyzeTextDto]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "analyzeText", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRADOR', 'EDITOR'),
    (0, common_1.Post)('activities/plan'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Planificar actividad educativa' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [activity_planner_dto_1.PlanActivityDto, Object]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "planActivity", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('activities/recommendations'),
    (0, swagger_1.ApiOperation)({ summary: 'Recomendaciones de actividades' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [activity_planner_dto_1.ActivityRecommendDto]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "activityRecommendations", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('species-v2/identify'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiOperation)({ summary: 'Identificar especie v2 con taxonomía completa' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "identifySpecies", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('species-v2/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Historial de identificaciones' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [species_v2_dto_1.SpeciesHistoryQueryDto]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "speciesHistory", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('species-v2/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Estadísticas de identificaciones' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EisController.prototype, "speciesStats", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('observatory/observations'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar observación de biodiversidad' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [observatory_dto_1.RegisterObservationDto, Object]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "registerObservation", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('observatory/observations'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar observaciones' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [observatory_dto_1.ObservationQueryDto]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "listObservations", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('observatory/map'),
    (0, swagger_1.ApiOperation)({ summary: 'Datos para mapa de observaciones' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "observatoryMapData", null);
__decorate([
    (0, common_1.Put)('observatory/observations/:id/verify'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar/validar observación' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, observatory_dto_1.VerifyObservationDto, Object]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "verifyObservation", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('observatory/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Estadísticas del observatorio' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EisController.prototype, "observatoryStats", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('validate/response'),
    (0, swagger_1.ApiOperation)({ summary: 'Validar respuesta generada por IA' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validation_dto_1.ValidateResponseDto]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "validateResponse", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRADOR', 'EDITOR'),
    (0, common_1.Post)('validate/content'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Validar contenido educativo' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validation_dto_1.ValidateContentDto]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "validateContent", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('validate/add-disclaimer'),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar disclaimer de IA a una respuesta' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "addDisclaimer", null);
__decorate([
    (0, common_1.Post)('certificates/generate'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar certificado personalizado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [certificates_v2_dto_1.GenerateCertificateDto]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "generateCertificate", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('certificates/verify/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar certificado por código' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "verifyCertificate", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, common_1.Post)('certificates/:code/revoke'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Revocar certificado' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "revokeCertificate", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, common_1.Get)('certificates'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar certificados emitidos' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "listCertificates", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('certificates/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Estadísticas de certificados' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EisController.prototype, "certificatesStats", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, common_1.Get)('analytics/dashboard'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Dashboard de analítica IA' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EisController.prototype, "analyticsDashboard", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, common_1.Get)('analytics/report'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Reporte completo de analítica' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_v2_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "analyticsReport", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, common_1.Get)('analytics/ai-metrics'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Métricas de uso de IA' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EisController.prototype, "analyticsAIMetrics", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('rag/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar en RAG (búsqueda semántica)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rag_v2_dto_1.RAGSearchDto]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "ragSearch", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, common_1.Post)('rag/index-all'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Indexar todo el contenido en RAG' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EisController.prototype, "ragIndexAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, common_1.Post)('rag/index/:collection'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Indexar colección específica en RAG' }),
    __param(0, (0, common_1.Param)('collection')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "ragIndexCollection", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('rag/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Estadísticas del sistema RAG' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EisController.prototype, "ragStats", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('rag/search-knowledge-base'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar en knowledge base' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "ragSearchKB", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('recommender/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Recomendaciones por consulta' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recommender_v2_dto_1.RecommendQueryDto]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "recommendByQuery", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, common_1.Post)('recommender/user/:userId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Recomendaciones personalizadas para usuario' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "recommendForUser", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('recommender/category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Recomendaciones por categoría' }),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "recommendByCategory", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('recommender/item/:type/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Recomendaciones relacionadas a un item' }),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], EisController.prototype, "recommendForItem", null);
exports.EisController = EisController = __decorate([
    (0, swagger_1.ApiTags)('EIS - Environmental Intelligence Suite'),
    (0, common_1.Controller)('eis'),
    __metadata("design:paramtypes", [ai_gateway_service_1.AiGatewayService,
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
        recommender_v2_service_1.RecommenderV2Service])
], EisController);
//# sourceMappingURL=eis.controller.js.map