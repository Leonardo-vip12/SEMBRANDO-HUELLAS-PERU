import { Controller, Post, Get, Put, Body, Param, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

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

import { AddKnowledgeEntryDto, KnowledgeSearchDto } from './dto/knowledge-base.dto';
import { TutorAskDto } from './dto/tutor.dto';
import { AnalyzeTextDto } from './dto/document-analysis.dto';
import { PlanActivityDto, ActivityRecommendDto } from './dto/activity-planner.dto';
import { SpeciesHistoryQueryDto } from './dto/species-v2.dto';
import { RegisterObservationDto, ObservationQueryDto, VerifyObservationDto } from './dto/observatory.dto';
import { ValidateResponseDto, ValidateContentDto } from './dto/validation.dto';
import { GenerateCertificateDto } from './dto/certificates-v2.dto';
import { AnalyticsQueryDto } from './dto/analytics-v2.dto';
import { RAGSearchDto } from './dto/rag-v2.dto';
import { RecommendQueryDto, RecommendByCategoryDto } from './dto/recommender-v2.dto';

import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('EIS - Environmental Intelligence Suite')
@Controller('eis')
export class EisController {
  constructor(
    private gateway: AiGatewayService,
    private kb: KnowledgeBaseService,
    private tutor: TutorService,
    private docAnalysis: DocumentAnalysisService,
    private activityPlanner: ActivityPlannerService,
    private speciesV2: SpeciesV2Service,
    private observatory: ObservatoryService,
    private validation: ValidationService,
    private certificatesV2: CertificatesV2Service,
    private analytics: AnalyticsV2Service,
    private rag: RagV2Service,
    private recommender: RecommenderV2Service,
  ) {}

  @Get('gateway/providers')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Estado de proveedores AI Gateway' })
  getGatewayProviders() {
    return this.gateway.getProviderStatus();
  }

  @Post('gateway/providers/:type/activate')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Activar proveedor específico' })
  activateProvider(@Param('type') type: string) {
    this.gateway.setActiveProvider(type as any);
    return { active: type };
  }

  @Post('knowledge-base/entries')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Agregar entrada a la base de conocimiento' })
  async addKnowledgeEntry(@Body() dto: AddKnowledgeEntryDto, @CurrentUser() user?: any) {
    return this.kb.addEntry({ ...dto, userId: user?.id });
  }

  @Get('knowledge-base/entries')
  @Public()
  @ApiOperation({ summary: 'Buscar en base de conocimiento' })
  async searchKnowledge(@Query() dto: KnowledgeSearchDto) {
    return this.kb.search(dto.query, dto.category, dto.limit);
  }

  @Get('knowledge-base/entries/source')
  @Public()
  @ApiOperation({ summary: 'Buscar entradas por fuente' })
  async findBySource(@Query('source') source: string, @Query('sourceType') sourceType: string) {
    return this.kb.findBySource(source, sourceType);
  }

  @Get('knowledge-base/stats')
  @Public()
  @ApiOperation({ summary: 'Estadísticas de la base de conocimiento' })
  async knowledgeStats() {
    return this.kb.getStats();
  }

  @Put('knowledge-base/entries/:id/verify')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Verificar entrada de conocimiento' })
  async verifyKnowledgeEntry(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.kb.verifyEntry(id, user?.id);
  }

  @Post('knowledge-base/entries/:id/versions')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear nueva versión de una entrada' })
  async createKnowledgeVersion(@Param('id') id: string, @Body('content') content: string) {
    return this.kb.createVersion(id, content);
  }

  @Public()
  @Post('tutor/ask')
  @ApiOperation({ summary: 'Consultar tutor adaptativo IA' })
  async tutorAsk(@Body() dto: TutorAskDto) {
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

  @Roles('ADMINISTRADOR', 'EDITOR')
  @Post('documents/analyze-file')
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Analizar documento (PDF/Word/PPT/texto)' })
  async analyzeDocument(@UploadedFile() file: Express.Multer.File, @CurrentUser() user?: any) {
    return this.docAnalysis.analyzeDocument(file, user?.id);
  }

  @Public()
  @Post('documents/analyze-text')
  @ApiOperation({ summary: 'Analizar texto directamente' })
  async analyzeText(@Body() dto: AnalyzeTextDto) {
    return this.docAnalysis.analyzeText(dto.text, dto.userId);
  }

  @Roles('ADMINISTRADOR', 'EDITOR')
  @Post('activities/plan')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Planificar actividad educativa' })
  async planActivity(@Body() dto: PlanActivityDto, @CurrentUser() user?: any) {
    return this.activityPlanner.plan({ ...dto, userId: user?.id });
  }

  @Public()
  @Get('activities/recommendations')
  @ApiOperation({ summary: 'Recomendaciones de actividades' })
  async activityRecommendations(@Query() dto: ActivityRecommendDto) {
    return this.activityPlanner.getRecommendations(dto.level, dto.duration);
  }

  @Public()
  @Post('species-v2/identify')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Identificar especie v2 con taxonomía completa' })
  async identifySpecies(@UploadedFile() image: Express.Multer.File, @CurrentUser() user?: any) {
    return this.speciesV2.identify(image.buffer, image.mimetype, user?.id);
  }

  @Public()
  @Get('species-v2/history')
  @ApiOperation({ summary: 'Historial de identificaciones' })
  async speciesHistory(@Query() dto: SpeciesHistoryQueryDto) {
    return this.speciesV2.getIdentificationHistory(dto.userId, dto.page, dto.limit);
  }

  @Public()
  @Get('species-v2/stats')
  @ApiOperation({ summary: 'Estadísticas de identificaciones' })
  async speciesStats() {
    return this.speciesV2.getStats();
  }

  @Public()
  @Post('observatory/observations')
  @ApiOperation({ summary: 'Registrar observación de biodiversidad' })
  async registerObservation(@Body() dto: RegisterObservationDto, @CurrentUser() user?: any) {
    return this.observatory.register({ ...dto, userId: user?.id });
  }

  @Public()
  @Get('observatory/observations')
  @ApiOperation({ summary: 'Listar observaciones' })
  async listObservations(@Query() dto: ObservationQueryDto) {
    return this.observatory.findAll(dto.page, dto.limit, dto.status);
  }

  @Public()
  @Get('observatory/map')
  @ApiOperation({ summary: 'Datos para mapa de observaciones' })
  async observatoryMapData(@Query('status') status?: string) {
    return this.observatory.getMapData(status);
  }

  @Put('observatory/observations/:id/verify')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Verificar/validar observación' })
  async verifyObservation(@Param('id') id: string, @Body() dto: VerifyObservationDto, @CurrentUser() user?: any) {
    return this.observatory.verifyObservation(id, user?.id, dto.status);
  }

  @Public()
  @Get('observatory/stats')
  @ApiOperation({ summary: 'Estadísticas del observatorio' })
  async observatoryStats() {
    return this.observatory.getStats();
  }

  @Public()
  @Post('validate/response')
  @ApiOperation({ summary: 'Validar respuesta generada por IA' })
  async validateResponse(@Body() dto: ValidateResponseDto) {
    return this.validation.validateResponse(dto.response, {
      query: dto.query,
      provider: dto.provider,
      model: dto.model,
    });
  }

  @Roles('ADMINISTRADOR', 'EDITOR')
  @Post('validate/content')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Validar contenido educativo' })
  async validateContent(@Body() dto: ValidateContentDto) {
    return this.validation.validateContent(dto.content, dto.category);
  }

  @Public()
  @Post('validate/add-disclaimer')
  @ApiOperation({ summary: 'Agregar disclaimer de IA a una respuesta' })
  async addDisclaimer(@Body() body: { response: string; query?: string; provider?: string; model?: string }) {
    const validation = await this.validation.validateResponse(body.response, {
      query: body.query,
      provider: body.provider,
      model: body.model,
    });
    return { content: this.validation.addDisclaimer(body.response, validation), validation };
  }

  @Post('certificates/generate')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Generar certificado personalizado' })
  async generateCertificate(@Body() dto: GenerateCertificateDto) {
    return this.certificatesV2.generate(dto);
  }

  @Public()
  @Get('certificates/verify/:code')
  @ApiOperation({ summary: 'Verificar certificado por código' })
  async verifyCertificate(@Param('code') code: string) {
    return this.certificatesV2.verify(code);
  }

  @Roles('ADMINISTRADOR')
  @Post('certificates/:code/revoke')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Revocar certificado' })
  async revokeCertificate(@Param('code') code: string) {
    return this.certificatesV2.revoke(code);
  }

  @Roles('ADMINISTRADOR')
  @Get('certificates')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar certificados emitidos' })
  async listCertificates(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.certificatesV2.list(page, limit);
  }

  @Public()
  @Get('certificates/stats')
  @ApiOperation({ summary: 'Estadísticas de certificados' })
  async certificatesStats() {
    return this.certificatesV2.getStats();
  }

  @Roles('ADMINISTRADOR')
  @Get('analytics/dashboard')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Dashboard de analítica IA' })
  async analyticsDashboard() {
    return this.analytics.getDashboard();
  }

  @Roles('ADMINISTRADOR')
  @Get('analytics/report')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reporte completo de analítica' })
  async analyticsReport(@Query() dto: AnalyticsQueryDto) {
    return this.analytics.getFullReport(dto.startDate, dto.endDate);
  }

  @Roles('ADMINISTRADOR')
  @Get('analytics/ai-metrics')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Métricas de uso de IA' })
  async analyticsAIMetrics() {
    return this.analytics.getAIMetrics();
  }

  @Public()
  @Post('rag/search')
  @ApiOperation({ summary: 'Buscar en RAG (búsqueda semántica)' })
  async ragSearch(@Body() dto: RAGSearchDto) {
    return this.rag.search(dto.query, dto.collection, dto.limit, dto.threshold);
  }

  @Roles('ADMINISTRADOR')
  @Post('rag/index-all')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Indexar todo el contenido en RAG' })
  async ragIndexAll() {
    return this.rag.indexAll();
  }

  @Roles('ADMINISTRADOR')
  @Post('rag/index/:collection')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Indexar colección específica en RAG' })
  async ragIndexCollection(@Param('collection') collection: string) {
    return this.rag.indexCollection(collection);
  }

  @Public()
  @Get('rag/stats')
  @ApiOperation({ summary: 'Estadísticas del sistema RAG' })
  async ragStats() {
    return this.rag.getStats();
  }

  @Public()
  @Post('rag/search-knowledge-base')
  @ApiOperation({ summary: 'Buscar en knowledge base' })
  async ragSearchKB(@Body() dto: { query: string; category?: string; limit?: number }) {
    return this.rag.searchKnowledgeBase(dto.query, dto.category, dto.limit);
  }

  @Public()
  @Post('recommender/search')
  @ApiOperation({ summary: 'Recomendaciones por consulta' })
  async recommendByQuery(@Body() dto: RecommendQueryDto) {
    return this.recommender.recommend(dto.query, dto.limit);
  }

  @Roles('ADMINISTRADOR')
  @Post('recommender/user/:userId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Recomendaciones personalizadas para usuario' })
  async recommendForUser(@Param('userId') userId: string, @Query('limit') limit = 6) {
    return this.recommender.recommendForUser(userId, limit);
  }

  @Public()
  @Get('recommender/category/:category')
  @ApiOperation({ summary: 'Recomendaciones por categoría' })
  async recommendByCategory(@Param('category') category: string, @Query('limit') limit = 4) {
    return this.recommender.recommendByCategory(category, limit);
  }

  @Public()
  @Get('recommender/item/:type/:id')
  @ApiOperation({ summary: 'Recomendaciones relacionadas a un item' })
  async recommendForItem(@Param('type') type: string, @Param('id') id: string, @Query('limit') limit = 4) {
    return this.recommender.recommendForItem(id, type, limit);
  }
}
