import { Controller, Post, Get, Body, Param, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

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

import { Recommendation } from './recommender/recommender.service';
import { AssistantQueryDto } from './dto/ai-assistant.dto';
import { GenerateContentDto, GenerateNewsDto, GenerateCertificateDto } from './dto/generator.dto';
import { SemanticSearchDto, TranslatorDto, SummarizeDto } from './dto/semantic.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(
    private aiService: AiService,
    private assistant: AssistantService,
    private identifier: IdentifierService,
    private generators: GeneratorsService,
    private recommender: RecommenderService,
    private semanticSearch: SemanticSearchService,
    private translator: TranslatorService,
    private certificates: CertificatesService,
    private summarizer: SummarizerService,
    private impactAnalysis: ImpactAnalysisService,
    private ragService: RAGService,
    private queryLog: AiQueryLogService,
    private config: AiConfigService,
  ) {}

  @Public()
  @Post('assistant')
  @ApiOperation({ summary: 'Consultar asistente IA' })
  async askAssistant(@Body() dto: AssistantQueryDto) {
    return this.assistant.query(dto);
  }

  @Public()
  @Post('identify')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Identificar especie por imagen' })
  async identify(@UploadedFile() file: Express.Multer.File) {
    return this.identifier.identifySpecies(file.buffer, file.mimetype);
  }

  @Post('generate/content')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Generar contenido educativo' })
  async generateContent(@Body() dto: GenerateContentDto) {
    return this.generators.generateEducationalContent(dto);
  }

  @Post('generate/news')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Generar borrador de noticia' })
  async generateNews(@Body() dto: GenerateNewsDto) {
    return this.generators.generateNewsDraft(dto);
  }

  @Get('recommend')
  @Public()
  @ApiOperation({ summary: 'Recomendaciones inteligentes' })
  async recommend(@Query('q') query: string, @Query('limit') limit = 6) {
    return this.recommender.recommend(query, limit);
  }

  @Get('recommend/:type/:id')
  @Public()
  @ApiOperation({ summary: 'Recomendaciones relacionadas a un item' })
  async recommendForItem(@Param('type') type: string, @Param('id') id: string) {
    return this.recommender.recommendForItem(id, type);
  }

  @Post('search')
  @Public()
  @ApiOperation({ summary: 'Búsqueda semántica' })
  async search(@Body() dto: SemanticSearchDto) {
    return this.semanticSearch.search(dto);
  }

  @Post('translate')
  @Public()
  @ApiOperation({ summary: 'Traducir texto' })
  async translate(@Body() dto: TranslatorDto) {
    return this.translator.translate(dto);
  }

  @Get('languages')
  @Public()
  @ApiOperation({ summary: 'Idiomas soportados' })
  async getLanguages() {
    return this.translator.getSupportedLanguages();
  }

  @Post('certificate/generate')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Generar certificado' })
  async generateCertificate(@Body() dto: GenerateCertificateDto) {
    return this.certificates.generateCertificate(dto);
  }

  @Get('certificate/verify/:code')
  @Public()
  @ApiOperation({ summary: 'Verificar certificado' })
  async verifyCertificate(@Param('code') code: string) {
    return this.certificates.verifyCertificate(code);
  }

  @Post('summarize')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Resumir texto' })
  async summarize(@Body() dto: SummarizeDto) {
    return this.summarizer.summarize(dto);
  }

  @Get('impact/report')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Generar informe de impacto' })
  async impactReport(@Query('start') start?: string, @Query('end') end?: string) {
    return this.impactAnalysis.generateReport(start, end);
  }

  @Get('rag/index')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Indexar todo el contenido en RAG' })
  async indexAll() {
    return this.ragService.indexAllContent();
  }

  @Get('admin/stats')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Estadísticas de uso IA' })
  async getStats() {
    return this.queryLog.getStats();
  }

  @Get('admin/logs')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logs de consultas IA' })
  async getLogs(@Query('page') page = 1) {
    return this.queryLog.getLogs(page);
  }

  @Get('admin/config')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Configuración IA' })
  async getConfig() {
    return this.config.getConfig();
  }

  @Get('providers')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Estado de proveedores IA' })
  async getProviders() {
    const providers = this.aiService.getAllProviders();
    return providers.map((p) => ({
      type: p.type,
      model: p.getModel(),
      available: p.isAvailable(),
    }));
  }
}
