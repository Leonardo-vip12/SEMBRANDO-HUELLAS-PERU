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
exports.SiaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const dashboard_service_1 = require("./services/dashboard.service");
const biodiversity_service_1 = require("./services/biodiversity.service");
const maps_service_1 = require("./services/maps.service");
const analytics_service_1 = require("./services/analytics.service");
const reports_service_1 = require("./services/reports.service");
const indicators_service_1 = require("./services/indicators.service");
const citizen_science_service_1 = require("./services/citizen-science.service");
const alerts_service_1 = require("./services/alerts.service");
const comparator_service_1 = require("./services/comparator.service");
const data_center_service_1 = require("./services/data-center.service");
const geospatial_service_1 = require("./services/geospatial.service");
const ai_reports_service_1 = require("./services/ai-reports.service");
const transparency_service_1 = require("./services/transparency.service");
const monitoring_service_1 = require("./services/monitoring.service");
let SiaController = class SiaController {
    constructor(dashboardService, biodiversityService, mapsService, analyticsService, reportsService, indicatorsService, citizenScienceService, alertsService, comparatorService, dataCenterService, geospatialService, aiReportsService, transparencyService, monitoringService) {
        this.dashboardService = dashboardService;
        this.biodiversityService = biodiversityService;
        this.mapsService = mapsService;
        this.analyticsService = analyticsService;
        this.reportsService = reportsService;
        this.indicatorsService = indicatorsService;
        this.citizenScienceService = citizenScienceService;
        this.alertsService = alertsService;
        this.comparatorService = comparatorService;
        this.dataCenterService = dataCenterService;
        this.geospatialService = geospatialService;
        this.aiReportsService = aiReportsService;
        this.transparencyService = transparencyService;
        this.monitoringService = monitoringService;
    }
    async getDashboard(startDate, endDate, region, institution, projectId) {
        return this.dashboardService.getExecutiveDashboard({ startDate, endDate, region, institution, projectId });
    }
    async getTimeSeries(metric, startDate, endDate, interval) {
        return this.dashboardService.getTimeSeries(metric, startDate, endDate, interval);
    }
    async getSpeciesDistribution() {
        return this.biodiversityService.getSpeciesDistribution();
    }
    async getObservationsTimeline(startDate, endDate) {
        return this.biodiversityService.getObservationsTimeline(startDate, endDate);
    }
    async getHistoricalRecords(page, limit, speciesName, region, startDate, endDate) {
        return this.biodiversityService.getHistoricalRecords(page, limit, speciesName, region, startDate, endDate);
    }
    async getConservationStatus() {
        return this.biodiversityService.getConservationStatus();
    }
    async getTemporalComparison(year1, year2) {
        return this.biodiversityService.getTemporalComparison(year1, year2);
    }
    async getBiodiversityMapData() {
        return this.biodiversityService.getMapData();
    }
    async getLayers() {
        return this.mapsService.getLayers();
    }
    async getLayerData(layer, region) {
        return this.mapsService.getLayerData(layer, { region });
    }
    async searchLocation(query) {
        return this.mapsService.searchLocation(query);
    }
    async getLegend() {
        return this.mapsService.getLegend();
    }
    async getLineChart(metric, period) {
        return this.analyticsService.getLineChart(metric, period);
    }
    async getBarChart(groupBy, metric) {
        return this.analyticsService.getBarChart(groupBy, metric);
    }
    async getPieChart(category) {
        return this.analyticsService.getPieChart(category);
    }
    async getRadarChart(dimensions) {
        const dims = dimensions ? dimensions.split(',') : [];
        return this.analyticsService.getRadarChart(dims);
    }
    async getHeatmap(region, date) {
        return this.analyticsService.getHeatmap(region, date);
    }
    async getAccumulatedIndicators() {
        return this.analyticsService.getAccumulatedIndicators();
    }
    async generateReport(dto) {
        return this.reportsService.generateReport(dto);
    }
    async listReports(page, limit, type) {
        return this.reportsService.listReports(page, limit, type);
    }
    async getReport(id) {
        return this.reportsService.getReport(id);
    }
    async deleteReport(id) {
        return this.reportsService.deleteReport(id);
    }
    async getReportStats() {
        return this.reportsService.getReportStats();
    }
    async createIndicator(dto) {
        return this.indicatorsService.create(dto);
    }
    async updateIndicator(id, dto) {
        return this.indicatorsService.update(id, dto);
    }
    async listIndicators(category, active, year) {
        return this.indicatorsService.findAll(category, active === 'true', year);
    }
    async getIndicatorCategories() {
        return this.indicatorsService.getCategories();
    }
    async getIndicatorSummary() {
        return this.indicatorsService.getSummary();
    }
    async getIndicator(id) {
        return this.indicatorsService.findOne(id);
    }
    async deleteIndicator(id) {
        return this.indicatorsService.delete(id);
    }
    async addIndicatorRecord(id, dto) {
        return this.indicatorsService.addRecord(id, dto);
    }
    async getIndicatorRecords(id, startDate, endDate) {
        return this.indicatorsService.getRecords(id, startDate, endDate);
    }
    async listCitizenObservations(page, limit, status, speciesName, region, assignedTo, startDate, endDate) {
        return this.citizenScienceService.findAll({
            page,
            limit,
            status: status,
            speciesName,
            region,
            assignedTo,
            startDate,
            endDate,
        });
    }
    async getCitizenObservation(id) {
        return this.citizenScienceService.findOne(id);
    }
    async reviewObservation(id, dto) {
        return this.citizenScienceService.review(id, dto);
    }
    async assignObservation(id, userId) {
        return this.citizenScienceService.assign(id, userId);
    }
    async getCitizenScienceStats() {
        return this.citizenScienceService.getStats();
    }
    async getReviewHistory(id) {
        return this.citizenScienceService.getReviewHistory(id);
    }
    async createAlertRule(dto) {
        return this.alertsService.createRule(dto);
    }
    async updateAlertRule(id, dto) {
        return this.alertsService.updateRule(id, dto);
    }
    async listAlertRules(status, severity) {
        return this.alertsService.findAllRules(status, severity);
    }
    async getAlertRule(id) {
        return this.alertsService.findOneRule(id);
    }
    async deleteAlertRule(id) {
        return this.alertsService.deleteRule(id);
    }
    async getAlertLogs(ruleId, severity, read, page, limit) {
        return this.alertsService.getLogs(ruleId, severity, read === 'true' ? true : read === 'false' ? false : undefined, page, limit);
    }
    async markAlertRead(id) {
        return this.alertsService.markAsRead(id);
    }
    async markAllAlertsRead() {
        return this.alertsService.markAllAsRead();
    }
    async checkAlertThresholds() {
        return this.alertsService.checkThresholds();
    }
    async getAlertStats() {
        return this.alertsService.getStats();
    }
    async compare(dto) {
        return this.comparatorService.compare(dto);
    }
    async getComparisonChart(type, dimension) {
        return this.comparatorService.getComparisonChart(type, dimension);
    }
    async createDataset(dto) {
        return this.dataCenterService.createDataset(dto);
    }
    async updateDataset(id, dto) {
        return this.dataCenterService.updateDataset(id, dto);
    }
    async listDatasets(category, visibility, page, limit) {
        return this.dataCenterService.findAllDatasets(category, visibility, page, limit);
    }
    async getDataset(id) {
        return this.dataCenterService.findDataset(id);
    }
    async deleteDataset(id) {
        return this.dataCenterService.deleteDataset(id);
    }
    async getDataCenterMetadata() {
        return this.dataCenterService.getMetadata();
    }
    async getTimeSeriesData(indicatorId, startDate, endDate) {
        return this.dataCenterService.getTimeSeriesData(indicatorId, startDate, endDate);
    }
    async getOpenDataCatalog() {
        return this.dataCenterService.getOpenDataCatalog();
    }
    async createZone(dto) {
        return this.geospatialService.createZone(dto);
    }
    async updateZone(id, dto) {
        return this.geospatialService.updateZone(id, dto);
    }
    async listZones(type, active) {
        return this.geospatialService.findAllZones(type, active === 'true');
    }
    async getZone(id) {
        return this.geospatialService.findZone(id);
    }
    async deleteZone(id) {
        return this.geospatialService.deleteZone(id);
    }
    async getClustering(layer, zoom, north, south, east, west) {
        const bounds = north != null && south != null && east != null && west != null ? { north, south, east, west } : undefined;
        return this.geospatialService.getPointClustering(layer, zoom, bounds);
    }
    async getDensity(layer, region) {
        return this.geospatialService.getDensityHeatmap(layer, region);
    }
    async spatialQuery(dto) {
        return this.geospatialService.getSpatialQuery(dto.layer, dto.type, dto.geometry);
    }
    async bufferAnalysis(dto) {
        return this.geospatialService.getBufferAnalysis(dto.layer, { lat: dto.lat, lng: dto.lng }, dto.radiusKm);
    }
    async generateAiSummary(dto) {
        return this.aiReportsService.generateSummary(dto);
    }
    async detectTrends(dto) {
        return this.aiReportsService.detectTrends(dto.metric, dto.period);
    }
    async generateDraft(dto) {
        return this.aiReportsService.generateDraft(dto.type, dto.filters);
    }
    async explainChart(dto) {
        return this.aiReportsService.explainChart(dto.chartType, dto.data);
    }
    async suggestActions(dto) {
        return this.aiReportsService.suggestActions(dto.data);
    }
    async getPublicIndicators() {
        return this.transparencyService.getPublicIndicators();
    }
    async getPublicProjects() {
        return this.transparencyService.getPublicProjects();
    }
    async getImpactSummary() {
        return this.transparencyService.getImpactSummary();
    }
    async getPublicDocuments() {
        return this.transparencyService.getPublicDocuments();
    }
    async getOpenStats() {
        return this.transparencyService.getOpenStats();
    }
    async getDownloadableData() {
        return this.transparencyService.getDownloadableData();
    }
    async getSystemStatus() {
        return this.monitoringService.getSystemStatus();
    }
    async getSyncStatus() {
        return this.monitoringService.getSyncStatus();
    }
    async getActiveServices() {
        return this.monitoringService.getActiveServices();
    }
    async getQueues() {
        return this.monitoringService.getQueues();
    }
    async getProcesses() {
        return this.monitoringService.getProcesses();
    }
    async getErrors(page, limit) {
        return this.monitoringService.getErrors(page, limit);
    }
    async getResourceUsage() {
        return this.monitoringService.getResourceUsage();
    }
    async createMonitoringLog(dto) {
        return this.monitoringService.createLog(dto);
    }
    async getMonitoringLogs(service, status, page, limit) {
        return this.monitoringService.getLogs(service, status, page, limit);
    }
};
exports.SiaController = SiaController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Dashboard ejecutivo con indicadores clave' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('region')),
    __param(3, (0, common_1.Query)('institution')),
    __param(4, (0, common_1.Query)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('dashboard/time-series'),
    (0, swagger_1.ApiOperation)({ summary: 'Series temporales del dashboard' }),
    __param(0, (0, common_1.Query)('metric')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('interval')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getTimeSeries", null);
__decorate([
    (0, common_1.Get)('biodiversity/species-distribution'),
    (0, swagger_1.ApiOperation)({ summary: 'Distribución de especies' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getSpeciesDistribution", null);
__decorate([
    (0, common_1.Get)('biodiversity/timeline'),
    (0, swagger_1.ApiOperation)({ summary: 'Línea de tiempo de observaciones' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getObservationsTimeline", null);
__decorate([
    (0, common_1.Get)('biodiversity/historical'),
    (0, swagger_1.ApiOperation)({ summary: 'Registros históricos' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('speciesName')),
    __param(3, (0, common_1.Query)('region')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getHistoricalRecords", null);
__decorate([
    (0, common_1.Get)('biodiversity/conservation-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Estado de conservación' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getConservationStatus", null);
__decorate([
    (0, common_1.Get)('biodiversity/temporal-comparison'),
    (0, swagger_1.ApiOperation)({ summary: 'Comparación temporal' }),
    __param(0, (0, common_1.Query)('year1')),
    __param(1, (0, common_1.Query)('year2')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getTemporalComparison", null);
__decorate([
    (0, common_1.Get)('biodiversity/map-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Datos para mapa de biodiversidad' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getBiodiversityMapData", null);
__decorate([
    (0, common_1.Get)('maps/layers'),
    (0, swagger_1.ApiOperation)({ summary: 'Capas disponibles para mapas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getLayers", null);
__decorate([
    (0, common_1.Get)('maps/layers/:layer'),
    (0, swagger_1.ApiOperation)({ summary: 'Datos de una capa específica' }),
    __param(0, (0, common_1.Param)('layer')),
    __param(1, (0, common_1.Query)('region')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getLayerData", null);
__decorate([
    (0, common_1.Get)('maps/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Búsqueda geográfica' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "searchLocation", null);
__decorate([
    (0, common_1.Get)('maps/legend'),
    (0, swagger_1.ApiOperation)({ summary: 'Leyenda de mapas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getLegend", null);
__decorate([
    (0, common_1.Get)('analytics/line'),
    (0, swagger_1.ApiOperation)({ summary: 'Gráfico de líneas' }),
    __param(0, (0, common_1.Query)('metric')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getLineChart", null);
__decorate([
    (0, common_1.Get)('analytics/bar'),
    (0, swagger_1.ApiOperation)({ summary: 'Gráfico de barras' }),
    __param(0, (0, common_1.Query)('groupBy')),
    __param(1, (0, common_1.Query)('metric')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getBarChart", null);
__decorate([
    (0, common_1.Get)('analytics/pie'),
    (0, swagger_1.ApiOperation)({ summary: 'Gráfico de pastel' }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getPieChart", null);
__decorate([
    (0, common_1.Get)('analytics/radar'),
    (0, swagger_1.ApiOperation)({ summary: 'Gráfico radar' }),
    __param(0, (0, common_1.Query)('dimensions')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getRadarChart", null);
__decorate([
    (0, common_1.Get)('analytics/heatmap'),
    (0, swagger_1.ApiOperation)({ summary: 'Mapa de calor' }),
    __param(0, (0, common_1.Query)('region')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getHeatmap", null);
__decorate([
    (0, common_1.Get)('analytics/accumulated'),
    (0, swagger_1.ApiOperation)({ summary: 'Indicadores acumulados' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getAccumulatedIndicators", null);
__decorate([
    (0, common_1.Post)('reports'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar reporte' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)('reports'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar reportes' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "listReports", null);
__decorate([
    (0, common_1.Get)('reports/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener reporte' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getReport", null);
__decorate([
    (0, common_1.Delete)('reports/:id'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar reporte' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "deleteReport", null);
__decorate([
    (0, common_1.Get)('reports/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Estadísticas de reportes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getReportStats", null);
__decorate([
    (0, common_1.Post)('indicators'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear indicador' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "createIndicator", null);
__decorate([
    (0, common_1.Patch)('indicators/:id'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar indicador' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "updateIndicator", null);
__decorate([
    (0, common_1.Get)('indicators'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar indicadores' }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('active')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "listIndicators", null);
__decorate([
    (0, common_1.Get)('indicators/categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Categorías de indicadores' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getIndicatorCategories", null);
__decorate([
    (0, common_1.Get)('indicators/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Resumen de indicadores' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getIndicatorSummary", null);
__decorate([
    (0, common_1.Get)('indicators/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener indicador' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getIndicator", null);
__decorate([
    (0, common_1.Delete)('indicators/:id'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar indicador' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "deleteIndicator", null);
__decorate([
    (0, common_1.Post)('indicators/:id/records'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar registro a indicador' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "addIndicatorRecord", null);
__decorate([
    (0, common_1.Get)('indicators/:id/records'),
    (0, swagger_1.ApiOperation)({ summary: 'Registros de indicador' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getIndicatorRecords", null);
__decorate([
    (0, common_1.Get)('citizen-science'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar observaciones ciudadanas' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('speciesName')),
    __param(4, (0, common_1.Query)('region')),
    __param(5, (0, common_1.Query)('assignedTo')),
    __param(6, (0, common_1.Query)('startDate')),
    __param(7, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "listCitizenObservations", null);
__decorate([
    (0, common_1.Get)('citizen-science/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener observación ciudadana' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getCitizenObservation", null);
__decorate([
    (0, common_1.Patch)('citizen-science/:id/review'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR', 'EDITOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Revisar/validar observación' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "reviewObservation", null);
__decorate([
    (0, common_1.Post)('citizen-science/:id/assign'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Asignar a especialista' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "assignObservation", null);
__decorate([
    (0, common_1.Get)('citizen-science/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Estadísticas de ciencia ciudadana' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getCitizenScienceStats", null);
__decorate([
    (0, common_1.Get)('citizen-science/:id/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Historial de revisión' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getReviewHistory", null);
__decorate([
    (0, common_1.Post)('alerts/rules'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear regla de alerta' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "createAlertRule", null);
__decorate([
    (0, common_1.Patch)('alerts/rules/:id'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar regla de alerta' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "updateAlertRule", null);
__decorate([
    (0, common_1.Get)('alerts/rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar reglas de alerta' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('severity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "listAlertRules", null);
__decorate([
    (0, common_1.Get)('alerts/rules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener regla de alerta' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getAlertRule", null);
__decorate([
    (0, common_1.Delete)('alerts/rules/:id'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar regla de alerta' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "deleteAlertRule", null);
__decorate([
    (0, common_1.Get)('alerts/logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Registros de alertas' }),
    __param(0, (0, common_1.Query)('ruleId')),
    __param(1, (0, common_1.Query)('severity')),
    __param(2, (0, common_1.Query)('read')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getAlertLogs", null);
__decorate([
    (0, common_1.Post)('alerts/logs/:id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar alerta como leída' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "markAlertRead", null);
__decorate([
    (0, common_1.Post)('alerts/logs/read-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar todas como leídas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "markAllAlertsRead", null);
__decorate([
    (0, common_1.Post)('alerts/check'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar umbrales de alerta' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "checkAlertThresholds", null);
__decorate([
    (0, common_1.Get)('alerts/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Estadísticas de alertas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getAlertStats", null);
__decorate([
    (0, common_1.Post)('comparator'),
    (0, swagger_1.ApiOperation)({ summary: 'Comparar entidades' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "compare", null);
__decorate([
    (0, common_1.Get)('comparator/chart'),
    (0, swagger_1.ApiOperation)({ summary: 'Datos para gráfico comparativo' }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('dimension')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getComparisonChart", null);
__decorate([
    (0, common_1.Post)('data-center/datasets'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear dataset' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "createDataset", null);
__decorate([
    (0, common_1.Patch)('data-center/datasets/:id'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar dataset' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "updateDataset", null);
__decorate([
    (0, common_1.Get)('data-center/datasets'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar datasets' }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('visibility')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "listDatasets", null);
__decorate([
    (0, common_1.Get)('data-center/datasets/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener dataset' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getDataset", null);
__decorate([
    (0, common_1.Delete)('data-center/datasets/:id'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar dataset' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "deleteDataset", null);
__decorate([
    (0, common_1.Get)('data-center/metadata'),
    (0, swagger_1.ApiOperation)({ summary: 'Metadatos del centro de datos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getDataCenterMetadata", null);
__decorate([
    (0, common_1.Get)('data-center/time-series'),
    (0, swagger_1.ApiOperation)({ summary: 'Series temporales exportables' }),
    __param(0, (0, common_1.Query)('indicatorId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getTimeSeriesData", null);
__decorate([
    (0, common_1.Get)('data-center/open-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Catálogo de datos abiertos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getOpenDataCatalog", null);
__decorate([
    (0, common_1.Post)('geospatial/zones'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear zona geográfica' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "createZone", null);
__decorate([
    (0, common_1.Patch)('geospatial/zones/:id'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar zona geográfica' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "updateZone", null);
__decorate([
    (0, common_1.Get)('geospatial/zones'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar zonas geográficas' }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "listZones", null);
__decorate([
    (0, common_1.Get)('geospatial/zones/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener zona geográfica' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getZone", null);
__decorate([
    (0, common_1.Delete)('geospatial/zones/:id'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar zona geográfica' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "deleteZone", null);
__decorate([
    (0, common_1.Get)('geospatial/clustering'),
    (0, swagger_1.ApiOperation)({ summary: 'Agrupación de puntos' }),
    __param(0, (0, common_1.Query)('layer')),
    __param(1, (0, common_1.Query)('zoom')),
    __param(2, (0, common_1.Query)('north')),
    __param(3, (0, common_1.Query)('south')),
    __param(4, (0, common_1.Query)('east')),
    __param(5, (0, common_1.Query)('west')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getClustering", null);
__decorate([
    (0, common_1.Get)('geospatial/density'),
    (0, swagger_1.ApiOperation)({ summary: 'Densidad de registros' }),
    __param(0, (0, common_1.Query)('layer')),
    __param(1, (0, common_1.Query)('region')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getDensity", null);
__decorate([
    (0, common_1.Post)('geospatial/query'),
    (0, swagger_1.ApiOperation)({ summary: 'Consulta espacial' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "spatialQuery", null);
__decorate([
    (0, common_1.Post)('geospatial/buffer'),
    (0, swagger_1.ApiOperation)({ summary: 'Análisis de buffer' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "bufferAnalysis", null);
__decorate([
    (0, common_1.Post)('ai-reports/summary'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR', 'EDITOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar resumen con IA' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "generateAiSummary", null);
__decorate([
    (0, common_1.Post)('ai-reports/trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Detectar tendencias' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "detectTrends", null);
__decorate([
    (0, common_1.Post)('ai-reports/draft'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR', 'EDITOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar borrador de informe' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "generateDraft", null);
__decorate([
    (0, common_1.Post)('ai-reports/explain-chart'),
    (0, swagger_1.ApiOperation)({ summary: 'Explicar gráfico' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "explainChart", null);
__decorate([
    (0, common_1.Post)('ai-reports/suggest-actions'),
    (0, swagger_1.ApiOperation)({ summary: 'Sugerir acciones basadas en datos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "suggestActions", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('transparency/indicators'),
    (0, swagger_1.ApiOperation)({ summary: 'Indicadores públicos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getPublicIndicators", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('transparency/projects'),
    (0, swagger_1.ApiOperation)({ summary: 'Proyectos públicos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getPublicProjects", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('transparency/impact'),
    (0, swagger_1.ApiOperation)({ summary: 'Impacto resumido' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getImpactSummary", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('transparency/documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Documentos públicos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getPublicDocuments", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('transparency/open-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Estadísticas abiertas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getOpenStats", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('transparency/downloads'),
    (0, swagger_1.ApiOperation)({ summary: 'Datos descargables' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getDownloadableData", null);
__decorate([
    (0, common_1.Get)('monitoring/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Estado del sistema' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getSystemStatus", null);
__decorate([
    (0, common_1.Get)('monitoring/sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Estado de sincronización' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getSyncStatus", null);
__decorate([
    (0, common_1.Get)('monitoring/services'),
    (0, swagger_1.ApiOperation)({ summary: 'Servicios activos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getActiveServices", null);
__decorate([
    (0, common_1.Get)('monitoring/queues'),
    (0, swagger_1.ApiOperation)({ summary: 'Colas de proceso' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getQueues", null);
__decorate([
    (0, common_1.Get)('monitoring/processes'),
    (0, swagger_1.ApiOperation)({ summary: 'Procesos activos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getProcesses", null);
__decorate([
    (0, common_1.Get)('monitoring/errors'),
    (0, swagger_1.ApiOperation)({ summary: 'Errores recientes' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getErrors", null);
__decorate([
    (0, common_1.Get)('monitoring/resources'),
    (0, swagger_1.ApiOperation)({ summary: 'Consumo de recursos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getResourceUsage", null);
__decorate([
    (0, common_1.Post)('monitoring/logs'),
    (0, roles_decorator_1.Roles)('ADMINISTRADOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear registro de monitoreo' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "createMonitoringLog", null);
__decorate([
    (0, common_1.Get)('monitoring/logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Registros de monitoreo' }),
    __param(0, (0, common_1.Query)('service')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], SiaController.prototype, "getMonitoringLogs", null);
exports.SiaController = SiaController = __decorate([
    (0, swagger_1.ApiTags)('SIA - Sistema Inteligente de Información Ambiental'),
    (0, common_1.Controller)('sia'),
    __metadata("design:paramtypes", [dashboard_service_1.SiaDashboardService,
        biodiversity_service_1.SiaBiodiversityService,
        maps_service_1.SiaMapsService,
        analytics_service_1.SiaAnalyticsService,
        reports_service_1.SiaReportsService,
        indicators_service_1.SiaIndicatorsService,
        citizen_science_service_1.SiaCitizenScienceService,
        alerts_service_1.SiaAlertsService,
        comparator_service_1.SiaComparatorService,
        data_center_service_1.SiaDataCenterService,
        geospatial_service_1.SiaGeospatialService,
        ai_reports_service_1.SiaAiReportsService,
        transparency_service_1.SiaTransparencyService,
        monitoring_service_1.SiaMonitoringService])
], SiaController);
//# sourceMappingURL=sia.controller.js.map