import { Controller, Get, Post, Put, Patch, Delete, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SiaDashboardService } from './services/dashboard.service';
import { SiaBiodiversityService } from './services/biodiversity.service';
import { SiaMapsService } from './services/maps.service';
import { SiaAnalyticsService } from './services/analytics.service';
import { SiaReportsService } from './services/reports.service';
import { SiaIndicatorsService } from './services/indicators.service';
import { SiaCitizenScienceService } from './services/citizen-science.service';
import { SiaAlertsService } from './services/alerts.service';
import { SiaComparatorService } from './services/comparator.service';
import { SiaDataCenterService } from './services/data-center.service';
import { SiaGeospatialService } from './services/geospatial.service';
import { SiaAiReportsService } from './services/ai-reports.service';
import { SiaTransparencyService } from './services/transparency.service';
import { SiaMonitoringService } from './services/monitoring.service';

@ApiTags('SIA - Sistema Inteligente de Información Ambiental')
@Controller('sia')
export class SiaController {
  constructor(
    private readonly dashboardService: SiaDashboardService,
    private readonly biodiversityService: SiaBiodiversityService,
    private readonly mapsService: SiaMapsService,
    private readonly analyticsService: SiaAnalyticsService,
    private readonly reportsService: SiaReportsService,
    private readonly indicatorsService: SiaIndicatorsService,
    private readonly citizenScienceService: SiaCitizenScienceService,
    private readonly alertsService: SiaAlertsService,
    private readonly comparatorService: SiaComparatorService,
    private readonly dataCenterService: SiaDataCenterService,
    private readonly geospatialService: SiaGeospatialService,
    private readonly aiReportsService: SiaAiReportsService,
    private readonly transparencyService: SiaTransparencyService,
    private readonly monitoringService: SiaMonitoringService,
  ) {}

  // ========================
  // MÓDULO 1: DASHBOARD EJECUTIVO
  // ========================

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard ejecutivo con indicadores clave' })
  async getDashboard(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('region') region?: string,
    @Query('institution') institution?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.dashboardService.getExecutiveDashboard({ startDate, endDate, region, institution, projectId });
  }

  @Get('dashboard/time-series')
  @ApiOperation({ summary: 'Series temporales del dashboard' })
  async getTimeSeries(
    @Query('metric') metric: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('interval') interval?: string,
  ) {
    return this.dashboardService.getTimeSeries(metric, startDate, endDate, interval);
  }

  // ========================
  // MÓDULO 2: OBSERVATORIO DE BIODIVERSIDAD
  // ========================

  @Get('biodiversity/species-distribution')
  @ApiOperation({ summary: 'Distribución de especies' })
  async getSpeciesDistribution() {
    return this.biodiversityService.getSpeciesDistribution();
  }

  @Get('biodiversity/timeline')
  @ApiOperation({ summary: 'Línea de tiempo de observaciones' })
  async getObservationsTimeline(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.biodiversityService.getObservationsTimeline(startDate, endDate);
  }

  @Get('biodiversity/historical')
  @ApiOperation({ summary: 'Registros históricos' })
  async getHistoricalRecords(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('speciesName') speciesName?: string,
    @Query('region') region?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.biodiversityService.getHistoricalRecords(page, limit, speciesName, region, startDate, endDate);
  }

  @Get('biodiversity/conservation-status')
  @ApiOperation({ summary: 'Estado de conservación' })
  async getConservationStatus() {
    return this.biodiversityService.getConservationStatus();
  }

  @Get('biodiversity/temporal-comparison')
  @ApiOperation({ summary: 'Comparación temporal' })
  async getTemporalComparison(@Query('year1') year1: number, @Query('year2') year2: number) {
    return this.biodiversityService.getTemporalComparison(year1, year2);
  }

  @Get('biodiversity/map-data')
  @ApiOperation({ summary: 'Datos para mapa de biodiversidad' })
  async getBiodiversityMapData() {
    return this.biodiversityService.getMapData();
  }

  // ========================
  // MÓDULO 3: MAPAS TEMÁTICOS
  // ========================

  @Get('maps/layers')
  @ApiOperation({ summary: 'Capas disponibles para mapas' })
  async getLayers() {
    return this.mapsService.getLayers();
  }

  @Get('maps/layers/:layer')
  @ApiOperation({ summary: 'Datos de una capa específica' })
  async getLayerData(@Param('layer') layer: string, @Query('region') region?: string) {
    return this.mapsService.getLayerData(layer, { region });
  }

  @Get('maps/search')
  @ApiOperation({ summary: 'Búsqueda geográfica' })
  async searchLocation(@Query('q') query: string) {
    return this.mapsService.searchLocation(query);
  }

  @Get('maps/legend')
  @ApiOperation({ summary: 'Leyenda de mapas' })
  async getLegend() {
    return this.mapsService.getLegend();
  }

  // ========================
  // MÓDULO 4: ANÁLISIS ESTADÍSTICO
  // ========================

  @Get('analytics/line')
  @ApiOperation({ summary: 'Gráfico de líneas' })
  async getLineChart(@Query('metric') metric: string, @Query('period') period: string) {
    return this.analyticsService.getLineChart(metric, period);
  }

  @Get('analytics/bar')
  @ApiOperation({ summary: 'Gráfico de barras' })
  async getBarChart(@Query('groupBy') groupBy: string, @Query('metric') metric: string) {
    return this.analyticsService.getBarChart(groupBy, metric);
  }

  @Get('analytics/pie')
  @ApiOperation({ summary: 'Gráfico de pastel' })
  async getPieChart(@Query('category') category: string) {
    return this.analyticsService.getPieChart(category);
  }

  @Get('analytics/radar')
  @ApiOperation({ summary: 'Gráfico radar' })
  async getRadarChart(@Query('dimensions') dimensions: string) {
    const dims = dimensions ? dimensions.split(',') : [];
    return this.analyticsService.getRadarChart(dims);
  }

  @Get('analytics/heatmap')
  @ApiOperation({ summary: 'Mapa de calor' })
  async getHeatmap(@Query('region') region?: string, @Query('date') date?: string) {
    return this.analyticsService.getHeatmap(region, date);
  }

  @Get('analytics/accumulated')
  @ApiOperation({ summary: 'Indicadores acumulados' })
  async getAccumulatedIndicators() {
    return this.analyticsService.getAccumulatedIndicators();
  }

  // ========================
  // MÓDULO 5: REPORTES
  // ========================

  @Post('reports')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Generar reporte' })
  @ApiBearerAuth('JWT-auth')
  async generateReport(@Body() dto: any) {
    return this.reportsService.generateReport(dto);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Listar reportes' })
  async listReports(@Query('page') page?: number, @Query('limit') limit?: number, @Query('type') type?: string) {
    return this.reportsService.listReports(page, limit, type as any);
  }

  @Get('reports/:id')
  @ApiOperation({ summary: 'Obtener reporte' })
  async getReport(@Param('id') id: string) {
    return this.reportsService.getReport(id);
  }

  @Delete('reports/:id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Eliminar reporte' })
  @ApiBearerAuth('JWT-auth')
  async deleteReport(@Param('id') id: string) {
    return this.reportsService.deleteReport(id);
  }

  @Get('reports/stats')
  @ApiOperation({ summary: 'Estadísticas de reportes' })
  async getReportStats() {
    return this.reportsService.getReportStats();
  }

  // ========================
  // MÓDULO 6: INDICADORES
  // ========================

  @Post('indicators')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Crear indicador' })
  @ApiBearerAuth('JWT-auth')
  async createIndicator(@Body() dto: any) {
    return this.indicatorsService.create(dto);
  }

  @Patch('indicators/:id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Actualizar indicador' })
  @ApiBearerAuth('JWT-auth')
  async updateIndicator(@Param('id') id: string, @Body() dto: any) {
    return this.indicatorsService.update(id, dto);
  }

  @Get('indicators')
  @ApiOperation({ summary: 'Listar indicadores' })
  async listIndicators(
    @Query('category') category?: string,
    @Query('active') active?: string,
    @Query('year') year?: number,
  ) {
    return this.indicatorsService.findAll(category as any, active === 'true', year);
  }

  @Get('indicators/categories')
  @ApiOperation({ summary: 'Categorías de indicadores' })
  async getIndicatorCategories() {
    return this.indicatorsService.getCategories();
  }

  @Get('indicators/summary')
  @ApiOperation({ summary: 'Resumen de indicadores' })
  async getIndicatorSummary() {
    return this.indicatorsService.getSummary();
  }

  @Get('indicators/:id')
  @ApiOperation({ summary: 'Obtener indicador' })
  async getIndicator(@Param('id') id: string) {
    return this.indicatorsService.findOne(id);
  }

  @Delete('indicators/:id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Eliminar indicador' })
  @ApiBearerAuth('JWT-auth')
  async deleteIndicator(@Param('id') id: string) {
    return this.indicatorsService.delete(id);
  }

  @Post('indicators/:id/records')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Agregar registro a indicador' })
  @ApiBearerAuth('JWT-auth')
  async addIndicatorRecord(@Param('id') id: string, @Body() dto: any) {
    return this.indicatorsService.addRecord(id, dto);
  }

  @Get('indicators/:id/records')
  @ApiOperation({ summary: 'Registros de indicador' })
  async getIndicatorRecords(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.indicatorsService.getRecords(id, startDate, endDate);
  }

  // ========================
  // MÓDULO 7: CIENCIA CIUDADANA
  // ========================

  @Get('citizen-science')
  @ApiOperation({ summary: 'Listar observaciones ciudadanas' })
  async listCitizenObservations(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('speciesName') speciesName?: string,
    @Query('region') region?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.citizenScienceService.findAll({
      page,
      limit,
      status: status as any,
      speciesName,
      region,
      assignedTo,
      startDate,
      endDate,
    });
  }

  @Get('citizen-science/:id')
  @ApiOperation({ summary: 'Obtener observación ciudadana' })
  async getCitizenObservation(@Param('id') id: string) {
    return this.citizenScienceService.findOne(id);
  }

  @Patch('citizen-science/:id/review')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiOperation({ summary: 'Revisar/validar observación' })
  @ApiBearerAuth('JWT-auth')
  async reviewObservation(@Param('id') id: string, @Body() dto: any) {
    return this.citizenScienceService.review(id, dto);
  }

  @Post('citizen-science/:id/assign')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Asignar a especialista' })
  @ApiBearerAuth('JWT-auth')
  async assignObservation(@Param('id') id: string, @Body('userId') userId: string) {
    return this.citizenScienceService.assign(id, userId);
  }

  @Get('citizen-science/stats')
  @ApiOperation({ summary: 'Estadísticas de ciencia ciudadana' })
  async getCitizenScienceStats() {
    return this.citizenScienceService.getStats();
  }

  @Get('citizen-science/:id/history')
  @ApiOperation({ summary: 'Historial de revisión' })
  async getReviewHistory(@Param('id') id: string) {
    return this.citizenScienceService.getReviewHistory(id);
  }

  // ========================
  // MÓDULO 8: ALERTAS
  // ========================

  @Post('alerts/rules')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Crear regla de alerta' })
  @ApiBearerAuth('JWT-auth')
  async createAlertRule(@Body() dto: any) {
    return this.alertsService.createRule(dto);
  }

  @Patch('alerts/rules/:id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Actualizar regla de alerta' })
  @ApiBearerAuth('JWT-auth')
  async updateAlertRule(@Param('id') id: string, @Body() dto: any) {
    return this.alertsService.updateRule(id, dto);
  }

  @Get('alerts/rules')
  @ApiOperation({ summary: 'Listar reglas de alerta' })
  async listAlertRules(@Query('status') status?: string, @Query('severity') severity?: string) {
    return this.alertsService.findAllRules(status, severity);
  }

  @Get('alerts/rules/:id')
  @ApiOperation({ summary: 'Obtener regla de alerta' })
  async getAlertRule(@Param('id') id: string) {
    return this.alertsService.findOneRule(id);
  }

  @Delete('alerts/rules/:id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Eliminar regla de alerta' })
  @ApiBearerAuth('JWT-auth')
  async deleteAlertRule(@Param('id') id: string) {
    return this.alertsService.deleteRule(id);
  }

  @Get('alerts/logs')
  @ApiOperation({ summary: 'Registros de alertas' })
  async getAlertLogs(
    @Query('ruleId') ruleId?: string,
    @Query('severity') severity?: string,
    @Query('read') read?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.alertsService.getLogs(
      ruleId,
      severity,
      read === 'true' ? true : read === 'false' ? false : undefined,
      page,
      limit,
    );
  }

  @Post('alerts/logs/:id/read')
  @ApiOperation({ summary: 'Marcar alerta como leída' })
  async markAlertRead(@Param('id') id: string) {
    return this.alertsService.markAsRead(id);
  }

  @Post('alerts/logs/read-all')
  @ApiOperation({ summary: 'Marcar todas como leídas' })
  async markAllAlertsRead() {
    return this.alertsService.markAllAsRead();
  }

  @Post('alerts/check')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Verificar umbrales de alerta' })
  @ApiBearerAuth('JWT-auth')
  async checkAlertThresholds() {
    return this.alertsService.checkThresholds();
  }

  @Get('alerts/stats')
  @ApiOperation({ summary: 'Estadísticas de alertas' })
  async getAlertStats() {
    return this.alertsService.getStats();
  }

  // ========================
  // MÓDULO 9: COMPARADOR
  // ========================

  @Post('comparator')
  @ApiOperation({ summary: 'Comparar entidades' })
  async compare(@Body() dto: any) {
    return this.comparatorService.compare(dto);
  }

  @Get('comparator/chart')
  @ApiOperation({ summary: 'Datos para gráfico comparativo' })
  async getComparisonChart(@Query('type') type: string, @Query('dimension') dimension: string) {
    return this.comparatorService.getComparisonChart(type, dimension);
  }

  // ========================
  // MÓDULO 10: CENTRO DE DATOS
  // ========================

  @Post('data-center/datasets')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Crear dataset' })
  @ApiBearerAuth('JWT-auth')
  async createDataset(@Body() dto: any) {
    return this.dataCenterService.createDataset(dto);
  }

  @Patch('data-center/datasets/:id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Actualizar dataset' })
  @ApiBearerAuth('JWT-auth')
  async updateDataset(@Param('id') id: string, @Body() dto: any) {
    return this.dataCenterService.updateDataset(id, dto);
  }

  @Get('data-center/datasets')
  @ApiOperation({ summary: 'Listar datasets' })
  async listDatasets(
    @Query('category') category?: string,
    @Query('visibility') visibility?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.dataCenterService.findAllDatasets(category, visibility, page, limit);
  }

  @Get('data-center/datasets/:id')
  @ApiOperation({ summary: 'Obtener dataset' })
  async getDataset(@Param('id') id: string) {
    return this.dataCenterService.findDataset(id);
  }

  @Delete('data-center/datasets/:id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Eliminar dataset' })
  @ApiBearerAuth('JWT-auth')
  async deleteDataset(@Param('id') id: string) {
    return this.dataCenterService.deleteDataset(id);
  }

  @Get('data-center/metadata')
  @ApiOperation({ summary: 'Metadatos del centro de datos' })
  async getDataCenterMetadata() {
    return this.dataCenterService.getMetadata();
  }

  @Get('data-center/time-series')
  @ApiOperation({ summary: 'Series temporales exportables' })
  async getTimeSeriesData(
    @Query('indicatorId') indicatorId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dataCenterService.getTimeSeriesData(indicatorId, startDate, endDate);
  }

  @Get('data-center/open-data')
  @ApiOperation({ summary: 'Catálogo de datos abiertos' })
  async getOpenDataCatalog() {
    return this.dataCenterService.getOpenDataCatalog();
  }

  // ========================
  // MÓDULO 11: ANALÍTICA GEOESPACIAL
  // ========================

  @Post('geospatial/zones')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Crear zona geográfica' })
  @ApiBearerAuth('JWT-auth')
  async createZone(@Body() dto: any) {
    return this.geospatialService.createZone(dto);
  }

  @Patch('geospatial/zones/:id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Actualizar zona geográfica' })
  @ApiBearerAuth('JWT-auth')
  async updateZone(@Param('id') id: string, @Body() dto: any) {
    return this.geospatialService.updateZone(id, dto);
  }

  @Get('geospatial/zones')
  @ApiOperation({ summary: 'Listar zonas geográficas' })
  async listZones(@Query('type') type?: string, @Query('active') active?: string) {
    return this.geospatialService.findAllZones(type, active === 'true');
  }

  @Get('geospatial/zones/:id')
  @ApiOperation({ summary: 'Obtener zona geográfica' })
  async getZone(@Param('id') id: string) {
    return this.geospatialService.findZone(id);
  }

  @Delete('geospatial/zones/:id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Eliminar zona geográfica' })
  @ApiBearerAuth('JWT-auth')
  async deleteZone(@Param('id') id: string) {
    return this.geospatialService.deleteZone(id);
  }

  @Get('geospatial/clustering')
  @ApiOperation({ summary: 'Agrupación de puntos' })
  async getClustering(
    @Query('layer') layer: string,
    @Query('zoom') zoom?: number,
    @Query('north') north?: number,
    @Query('south') south?: number,
    @Query('east') east?: number,
    @Query('west') west?: number,
  ) {
    const bounds =
      north != null && south != null && east != null && west != null ? { north, south, east, west } : undefined;
    return this.geospatialService.getPointClustering(layer, zoom, bounds);
  }

  @Get('geospatial/density')
  @ApiOperation({ summary: 'Densidad de registros' })
  async getDensity(@Query('layer') layer: string, @Query('region') region?: string) {
    return this.geospatialService.getDensityHeatmap(layer, region);
  }

  @Post('geospatial/query')
  @ApiOperation({ summary: 'Consulta espacial' })
  async spatialQuery(@Body() dto: { layer: string; type: string; geometry: any }) {
    return this.geospatialService.getSpatialQuery(dto.layer, dto.type as any, dto.geometry);
  }

  @Post('geospatial/buffer')
  @ApiOperation({ summary: 'Análisis de buffer' })
  async bufferAnalysis(@Body() dto: { layer: string; lat: number; lng: number; radiusKm: number }) {
    return this.geospatialService.getBufferAnalysis(dto.layer, { lat: dto.lat, lng: dto.lng }, dto.radiusKm);
  }

  // ========================
  // MÓDULO 12: INFORMES CON IA
  // ========================

  @Post('ai-reports/summary')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiOperation({ summary: 'Generar resumen con IA' })
  @ApiBearerAuth('JWT-auth')
  async generateAiSummary(@Body() dto: any) {
    return this.aiReportsService.generateSummary(dto);
  }

  @Post('ai-reports/trends')
  @ApiOperation({ summary: 'Detectar tendencias' })
  async detectTrends(@Body() dto: { metric: string; period: string }) {
    return this.aiReportsService.detectTrends(dto.metric, dto.period);
  }

  @Post('ai-reports/draft')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiOperation({ summary: 'Generar borrador de informe' })
  @ApiBearerAuth('JWT-auth')
  async generateDraft(@Body() dto: any) {
    return this.aiReportsService.generateDraft(dto.type, dto.filters);
  }

  @Post('ai-reports/explain-chart')
  @ApiOperation({ summary: 'Explicar gráfico' })
  async explainChart(@Body() dto: { chartType: string; data: any }) {
    return this.aiReportsService.explainChart(dto.chartType, dto.data);
  }

  @Post('ai-reports/suggest-actions')
  @ApiOperation({ summary: 'Sugerir acciones basadas en datos' })
  async suggestActions(@Body() dto: { data: any }) {
    return this.aiReportsService.suggestActions(dto.data);
  }

  // ========================
  // MÓDULO 13: TRANSPARENCIA
  // ========================

  @Public()
  @Get('transparency/indicators')
  @ApiOperation({ summary: 'Indicadores públicos' })
  async getPublicIndicators() {
    return this.transparencyService.getPublicIndicators();
  }

  @Public()
  @Get('transparency/projects')
  @ApiOperation({ summary: 'Proyectos públicos' })
  async getPublicProjects() {
    return this.transparencyService.getPublicProjects();
  }

  @Public()
  @Get('transparency/impact')
  @ApiOperation({ summary: 'Impacto resumido' })
  async getImpactSummary() {
    return this.transparencyService.getImpactSummary();
  }

  @Public()
  @Get('transparency/documents')
  @ApiOperation({ summary: 'Documentos públicos' })
  async getPublicDocuments() {
    return this.transparencyService.getPublicDocuments();
  }

  @Public()
  @Get('transparency/open-stats')
  @ApiOperation({ summary: 'Estadísticas abiertas' })
  async getOpenStats() {
    return this.transparencyService.getOpenStats();
  }

  @Public()
  @Get('transparency/downloads')
  @ApiOperation({ summary: 'Datos descargables' })
  async getDownloadableData() {
    return this.transparencyService.getDownloadableData();
  }

  // ========================
  // MÓDULO 14: MONITOREO
  // ========================

  @Get('monitoring/status')
  @ApiOperation({ summary: 'Estado del sistema' })
  async getSystemStatus() {
    return this.monitoringService.getSystemStatus();
  }

  @Get('monitoring/sync')
  @ApiOperation({ summary: 'Estado de sincronización' })
  async getSyncStatus() {
    return this.monitoringService.getSyncStatus();
  }

  @Get('monitoring/services')
  @ApiOperation({ summary: 'Servicios activos' })
  async getActiveServices() {
    return this.monitoringService.getActiveServices();
  }

  @Get('monitoring/queues')
  @ApiOperation({ summary: 'Colas de proceso' })
  async getQueues() {
    return this.monitoringService.getQueues();
  }

  @Get('monitoring/processes')
  @ApiOperation({ summary: 'Procesos activos' })
  async getProcesses() {
    return this.monitoringService.getProcesses();
  }

  @Get('monitoring/errors')
  @ApiOperation({ summary: 'Errores recientes' })
  async getErrors(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.monitoringService.getErrors(page, limit);
  }

  @Get('monitoring/resources')
  @ApiOperation({ summary: 'Consumo de recursos' })
  async getResourceUsage() {
    return this.monitoringService.getResourceUsage();
  }

  @Post('monitoring/logs')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Crear registro de monitoreo' })
  @ApiBearerAuth('JWT-auth')
  async createMonitoringLog(@Body() dto: any) {
    return this.monitoringService.createLog(dto);
  }

  @Get('monitoring/logs')
  @ApiOperation({ summary: 'Registros de monitoreo' })
  async getMonitoringLogs(
    @Query('service') service?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.monitoringService.getLogs(service, status, page, limit);
  }
}
