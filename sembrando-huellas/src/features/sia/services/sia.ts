import { ApiService } from '@/services/api';

export class SiaService {
  // Module 1: Dashboard
  static async getDashboard(params?: { startDate?: string; endDate?: string; region?: string; institution?: string; projectId?: string }) {
    const search = new URLSearchParams();
    if (params?.startDate) search.set('startDate', params.startDate);
    if (params?.endDate) search.set('endDate', params.endDate);
    if (params?.region) search.set('region', params.region);
    if (params?.institution) search.set('institution', params.institution);
    if (params?.projectId) search.set('projectId', params.projectId);
    const res = await ApiService.get<any>(`/sia/dashboard?${search}`);
    return res.data;
  }

  static async getTimeSeries(metric: string, startDate?: string, endDate?: string, interval?: string) {
    const params = new URLSearchParams({ metric });
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (interval) params.set('interval', interval);
    const res = await ApiService.get<any>(`/sia/dashboard/time-series?${params}`);
    return res.data;
  }

  // Module 2: Biodiversity
  static async getSpeciesDistribution() {
    const res = await ApiService.get<any>('/sia/biodiversity/species-distribution');
    return res.data;
  }

  static async getObservationsTimeline(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const res = await ApiService.get<any>(`/sia/biodiversity/timeline?${params}`);
    return res.data;
  }

  static async getHistoricalRecords(params?: { page?: number; limit?: number; speciesName?: string; region?: string; startDate?: string; endDate?: string }) {
    const search = new URLSearchParams();
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.speciesName) search.set('speciesName', params.speciesName);
    if (params?.region) search.set('region', params.region);
    if (params?.startDate) search.set('startDate', params.startDate);
    if (params?.endDate) search.set('endDate', params.endDate);
    const res = await ApiService.get<any>(`/sia/biodiversity/historical?${search}`);
    return res.data;
  }

  static async getConservationStatus() {
    const res = await ApiService.get<any>('/sia/biodiversity/conservation-status');
    return res.data;
  }

  static async getTemporalComparison(year1: number, year2: number) {
    const res = await ApiService.get<any>(`/sia/biodiversity/temporal-comparison?year1=${year1}&year2=${year2}`);
    return res.data;
  }

  static async getBiodiversityMapData() {
    const res = await ApiService.get<any>('/sia/biodiversity/map-data');
    return res.data;
  }

  // Module 3: Maps
  static async getLayers() {
    const res = await ApiService.get<any>('/sia/maps/layers');
    return res.data;
  }

  static async getLayerData(layer: string, region?: string) {
    const params = region ? `?region=${region}` : '';
    const res = await ApiService.get<any>(`/sia/maps/layers/${layer}${params}`);
    return res.data;
  }

  static async searchLocation(query: string) {
    const res = await ApiService.get<any>(`/sia/maps/search?q=${encodeURIComponent(query)}`);
    return res.data;
  }

  static async getMapLegend() {
    const res = await ApiService.get<any>('/sia/maps/legend');
    return res.data;
  }

  // Module 4: Analytics
  static async getLineChart(metric: string, period: string) {
    const res = await ApiService.get<any>(`/sia/analytics/line?metric=${metric}&period=${period}`);
    return res.data;
  }

  static async getBarChart(groupBy: string, metric: string) {
    const res = await ApiService.get<any>(`/sia/analytics/bar?groupBy=${groupBy}&metric=${metric}`);
    return res.data;
  }

  static async getPieChart(category: string) {
    const res = await ApiService.get<any>(`/sia/analytics/pie?category=${category}`);
    return res.data;
  }

  static async getRadarChart(dimensions: string[]) {
    const res = await ApiService.get<any>(`/sia/analytics/radar?dimensions=${dimensions.join(',')}`);
    return res.data;
  }

  static async getHeatmap(region?: string, date?: string) {
    const params = new URLSearchParams();
    if (region) params.set('region', region);
    if (date) params.set('date', date);
    const res = await ApiService.get<any>(`/sia/analytics/heatmap?${params}`);
    return res.data;
  }

  static async getAccumulatedIndicators() {
    const res = await ApiService.get<any>('/sia/analytics/accumulated');
    return res.data;
  }

  // Module 5: Reports
  static async generateReport(data: { title: string; type: string; description?: string; format?: string; filters?: any }) {
    const res = await ApiService.post<any>('/sia/reports', data);
    return res.data;
  }

  static async listReports(page = 1, limit = 20, type?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (type) params.set('type', type);
    const res = await ApiService.get<any>(`/sia/reports?${params}`);
    return res.data;
  }

  static async getReport(id: string) {
    const res = await ApiService.get<any>(`/sia/reports/${id}`);
    return res.data;
  }

  static async deleteReport(id: string) {
    const res = await ApiService.delete<any>(`/sia/reports/${id}`);
    return res.data;
  }

  static async getReportStats() {
    const res = await ApiService.get<any>('/sia/reports/stats');
    return res.data;
  }

  // Module 6: Indicators
  static async createIndicator(data: any) {
    const res = await ApiService.post<any>('/sia/indicators', data);
    return res.data;
  }

  static async updateIndicator(id: string, data: any) {
    const res = await ApiService.patch<any>(`/sia/indicators/${id}`, data);
    return res.data;
  }

  static async listIndicators(category?: string, active?: boolean, year?: number) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (active !== undefined) params.set('active', String(active));
    if (year) params.set('year', String(year));
    const res = await ApiService.get<any>(`/sia/indicators?${params}`);
    return res.data;
  }

  static async getIndicatorCategories() {
    const res = await ApiService.get<any>('/sia/indicators/categories');
    return res.data;
  }

  static async getIndicatorSummary() {
    const res = await ApiService.get<any>('/sia/indicators/summary');
    return res.data;
  }

  static async getIndicator(id: string) {
    const res = await ApiService.get<any>(`/sia/indicators/${id}`);
    return res.data;
  }

  static async deleteIndicator(id: string) {
    const res = await ApiService.delete<any>(`/sia/indicators/${id}`);
    return res.data;
  }

  static async addIndicatorRecord(indicatorId: string, data: { value: number; date: string; region?: string; institution?: string }) {
    const res = await ApiService.post<any>(`/sia/indicators/${indicatorId}/records`, data);
    return res.data;
  }

  static async getIndicatorRecords(indicatorId: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const res = await ApiService.get<any>(`/sia/indicators/${indicatorId}/records?${params}`);
    return res.data;
  }

  // Module 7: Citizen Science
  static async listCitizenObservations(params?: { page?: number; limit?: number; status?: string; speciesName?: string; region?: string; assignedTo?: string; startDate?: string; endDate?: string }) {
    const search = new URLSearchParams();
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.status) search.set('status', params.status);
    if (params?.speciesName) search.set('speciesName', params.speciesName);
    if (params?.region) search.set('region', params.region);
    if (params?.assignedTo) search.set('assignedTo', params.assignedTo);
    if (params?.startDate) search.set('startDate', params.startDate);
    if (params?.endDate) search.set('endDate', params.endDate);
    const res = await ApiService.get<any>(`/sia/citizen-science?${search}`);
    return res.data;
  }

  static async getCitizenObservation(id: string) {
    const res = await ApiService.get<any>(`/sia/citizen-science/${id}`);
    return res.data;
  }

  static async reviewObservation(id: string, data: { status: string; comments?: string; assignedTo?: string }) {
    const res = await ApiService.patch<any>(`/sia/citizen-science/${id}/review`, data);
    return res.data;
  }

  static async assignObservation(id: string, userId: string) {
    const res = await ApiService.post<any>(`/sia/citizen-science/${id}/assign`, { userId });
    return res.data;
  }

  static async getCitizenScienceStats() {
    const res = await ApiService.get<any>('/sia/citizen-science/stats');
    return res.data;
  }

  static async getReviewHistory(id: string) {
    const res = await ApiService.get<any>(`/sia/citizen-science/${id}/history`);
    return res.data;
  }

  // Module 8: Alerts
  static async createAlertRule(data: any) {
    const res = await ApiService.post<any>('/sia/alerts/rules', data);
    return res.data;
  }

  static async updateAlertRule(id: string, data: any) {
    const res = await ApiService.patch<any>(`/sia/alerts/rules/${id}`, data);
    return res.data;
  }

  static async listAlertRules(status?: string, severity?: string) {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (severity) params.set('severity', severity);
    const res = await ApiService.get<any>(`/sia/alerts/rules?${params}`);
    return res.data;
  }

  static async getAlertRule(id: string) {
    const res = await ApiService.get<any>(`/sia/alerts/rules/${id}`);
    return res.data;
  }

  static async deleteAlertRule(id: string) {
    const res = await ApiService.delete<any>(`/sia/alerts/rules/${id}`);
    return res.data;
  }

  static async getAlertLogs(params?: { ruleId?: string; severity?: string; read?: boolean; page?: number; limit?: number }) {
    const search = new URLSearchParams();
    if (params?.ruleId) search.set('ruleId', params.ruleId);
    if (params?.severity) search.set('severity', params.severity);
    if (params?.read !== undefined) search.set('read', String(params.read));
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    const res = await ApiService.get<any>(`/sia/alerts/logs?${search}`);
    return res.data;
  }

  static async markAlertRead(id: string) {
    const res = await ApiService.post<any>(`/sia/alerts/logs/${id}/read`, {});
    return res.data;
  }

  static async markAllAlertsRead() {
    const res = await ApiService.post<any>('/sia/alerts/logs/read-all', {});
    return res.data;
  }

  static async checkAlertThresholds() {
    const res = await ApiService.post<any>('/sia/alerts/check', {});
    return res.data;
  }

  static async getAlertStats() {
    const res = await ApiService.get<any>('/sia/alerts/stats');
    return res.data;
  }

  // Module 9: Comparator
  static async compare(data: { type: string; ids?: string[]; indicatorId?: string; startDate?: string; endDate?: string }) {
    const res = await ApiService.post<any>('/sia/comparator', data);
    return res.data;
  }

  static async getComparisonChart(type: string, dimension: string) {
    const res = await ApiService.get<any>(`/sia/comparator/chart?type=${type}&dimension=${dimension}`);
    return res.data;
  }

  // Module 10: Data Center
  static async createDataset(data: any) {
    const res = await ApiService.post<any>('/sia/data-center/datasets', data);
    return res.data;
  }

  static async updateDataset(id: string, data: any) {
    const res = await ApiService.patch<any>(`/sia/data-center/datasets/${id}`, data);
    return res.data;
  }

  static async listDatasets(category?: string, visibility?: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (visibility) params.set('visibility', visibility);
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    const res = await ApiService.get<any>(`/sia/data-center/datasets?${params}`);
    return res.data;
  }

  static async getDataset(id: string) {
    const res = await ApiService.get<any>(`/sia/data-center/datasets/${id}`);
    return res.data;
  }

  static async deleteDataset(id: string) {
    const res = await ApiService.delete<any>(`/sia/data-center/datasets/${id}`);
    return res.data;
  }

  static async getDataCenterMetadata() {
    const res = await ApiService.get<any>('/sia/data-center/metadata');
    return res.data;
  }

  static async getTimeSeriesData(indicatorId?: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (indicatorId) params.set('indicatorId', indicatorId);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const res = await ApiService.get<any>(`/sia/data-center/time-series?${params}`);
    return res.data;
  }

  static async getOpenDataCatalog() {
    const res = await ApiService.get<any>('/sia/data-center/open-data');
    return res.data;
  }

  // Module 11: Geospatial
  static async createZone(data: any) {
    const res = await ApiService.post<any>('/sia/geospatial/zones', data);
    return res.data;
  }

  static async updateZone(id: string, data: any) {
    const res = await ApiService.patch<any>(`/sia/geospatial/zones/${id}`, data);
    return res.data;
  }

  static async listZones(type?: string, active?: boolean) {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (active !== undefined) params.set('active', String(active));
    const res = await ApiService.get<any>(`/sia/geospatial/zones?${params}`);
    return res.data;
  }

  static async getZone(id: string) {
    const res = await ApiService.get<any>(`/sia/geospatial/zones/${id}`);
    return res.data;
  }

  static async deleteZone(id: string) {
    const res = await ApiService.delete<any>(`/sia/geospatial/zones/${id}`);
    return res.data;
  }

  static async getClustering(layer: string, zoom?: number, bounds?: { north: number; south: number; east: number; west: number }) {
    const params = new URLSearchParams({ layer });
    if (zoom) params.set('zoom', String(zoom));
    if (bounds) {
      params.set('north', String(bounds.north));
      params.set('south', String(bounds.south));
      params.set('east', String(bounds.east));
      params.set('west', String(bounds.west));
    }
    const res = await ApiService.get<any>(`/sia/geospatial/clustering?${params}`);
    return res.data;
  }

  static async getDensity(layer: string, region?: string) {
    const params = region ? `?layer=${layer}&region=${region}` : `?layer=${layer}`;
    const res = await ApiService.get<any>(`/sia/geospatial/density${params}`);
    return res.data;
  }

  static async spatialQuery(data: { layer: string; type: string; geometry: any }) {
    const res = await ApiService.post<any>('/sia/geospatial/query', data);
    return res.data;
  }

  static async bufferAnalysis(data: { layer: string; lat: number; lng: number; radiusKm: number }) {
    const res = await ApiService.post<any>('/sia/geospatial/buffer', data);
    return res.data;
  }

  // Module 12: AI Reports
  static async generateAiSummary(data: any) {
    const res = await ApiService.post<any>('/sia/ai-reports/summary', data);
    return res.data;
  }

  static async detectTrends(metric: string, period: string) {
    const res = await ApiService.post<any>('/sia/ai-reports/trends', { metric, period });
    return res.data;
  }

  static async generateDraft(type: string, filters?: any) {
    const res = await ApiService.post<any>('/sia/ai-reports/draft', { type, filters });
    return res.data;
  }

  static async explainChart(chartType: string, data: any) {
    const res = await ApiService.post<any>('/sia/ai-reports/explain-chart', { chartType, data });
    return res.data;
  }

  static async suggestActions(data: any) {
    const res = await ApiService.post<any>('/sia/ai-reports/suggest-actions', { data });
    return res.data;
  }

  // Module 13: Transparency
  static async getPublicIndicators() {
    const res = await ApiService.get<any>('/sia/transparency/indicators');
    return res.data;
  }

  static async getPublicProjects() {
    const res = await ApiService.get<any>('/sia/transparency/projects');
    return res.data;
  }

  static async getImpactSummary() {
    const res = await ApiService.get<any>('/sia/transparency/impact');
    return res.data;
  }

  static async getPublicDocuments() {
    const res = await ApiService.get<any>('/sia/transparency/documents');
    return res.data;
  }

  static async getOpenStats() {
    const res = await ApiService.get<any>('/sia/transparency/open-stats');
    return res.data;
  }

  static async getDownloadableData() {
    const res = await ApiService.get<any>('/sia/transparency/downloads');
    return res.data;
  }

  // Module 14: Monitoring
  static async getSystemStatus() {
    const res = await ApiService.get<any>('/sia/monitoring/status');
    return res.data;
  }

  static async getSyncStatus() {
    const res = await ApiService.get<any>('/sia/monitoring/sync');
    return res.data;
  }

  static async getActiveServices() {
    const res = await ApiService.get<any>('/sia/monitoring/services');
    return res.data;
  }

  static async getQueues() {
    const res = await ApiService.get<any>('/sia/monitoring/queues');
    return res.data;
  }

  static async getProcesses() {
    const res = await ApiService.get<any>('/sia/monitoring/processes');
    return res.data;
  }

  static async getErrors(page = 1, limit = 20) {
    const res = await ApiService.get<any>(`/sia/monitoring/errors?page=${page}&limit=${limit}`);
    return res.data;
  }

  static async getResourceUsage() {
    const res = await ApiService.get<any>('/sia/monitoring/resources');
    return res.data;
  }

  static async createMonitoringLog(data: any) {
    const res = await ApiService.post<any>('/sia/monitoring/logs', data);
    return res.data;
  }

  static async getMonitoringLogs(service?: string, status?: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (service) params.set('service', service);
    if (status) params.set('status', status);
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    const res = await ApiService.get<any>(`/sia/monitoring/logs?${params}`);
    return res.data;
  }
}
