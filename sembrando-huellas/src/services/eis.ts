import { ApiService } from './api';

export class EisService {
  static async tutorAsk(query: string, level?: string, sessionId?: string) {
    const res = await ApiService.post('/eis/tutor/ask', { query, level, sessionId });
    return res.data;
  }

  static async identifySpecies(formData: FormData) {
    const res = await ApiService.post('/eis/species-v2/identify', formData);
    return res.data;
  }

  static async speciesHistory(params?: { userId?: string; page?: number; limit?: number }) {
    const search = new URLSearchParams();
    if (params?.userId) search.set('userId', params.userId);
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    const res = await ApiService.get(`/eis/species-v2/history?${search}`);
    return res.data;
  }

  static async speciesStats() {
    const res = await ApiService.get('/eis/species-v2/stats');
    return res.data;
  }

  static async registerObservation(data: {
    speciesName?: string;
    scientificName?: string;
    quantity?: number;
    latitude: number;
    longitude: number;
    observedAt?: string;
    habitat?: string;
    weather?: string;
    comments?: string;
    images?: string[];
  }) {
    const res = await ApiService.post('/eis/observatory/observations', data);
    return res.data;
  }

  static async listObservations(params?: { page?: number; limit?: number; status?: string }) {
    const search = new URLSearchParams();
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.status) search.set('status', params.status);
    const res = await ApiService.get(`/eis/observatory/observations?${search}`);
    return res.data;
  }

  static async observatoryMapData(status?: string) {
    const qs = status ? `?status=${status}` : '';
    const res = await ApiService.get(`/eis/observatory/map${qs}`);
    return res.data;
  }

  static async observatoryStats() {
    const res = await ApiService.get('/eis/observatory/stats');
    return res.data;
  }

  static async planActivity(data: {
    activityType: string;
    topic: string;
    level?: string;
    duration?: string;
    participants?: number;
    objectives?: string[];
    additionalContext?: string;
  }) {
    const res = await ApiService.post('/eis/activities/plan', data);
    return res.data;
  }

  static async activityRecommendations(level?: string, duration?: string) {
    const search = new URLSearchParams();
    if (level) search.set('level', level);
    if (duration) search.set('duration', duration);
    const res = await ApiService.get(`/eis/activities/recommendations?${search}`);
    return res.data;
  }

  static async analyzeText(text: string) {
    const res = await ApiService.post('/eis/documents/analyze-text', { text });
    return res.data;
  }

  static async analyzeDocument(formData: FormData) {
    const res = await ApiService.post('/eis/documents/analyze-file', formData);
    return res.data;
  }

  static async addKnowledgeEntry(data: {
    title: string;
    content: string;
    source: string;
    sourceType: string;
    category?: string;
    tags?: string[];
  }) {
    const res = await ApiService.post('/eis/knowledge-base/entries', data);
    return res.data;
  }

  static async searchKnowledge(query: string, category?: string, limit?: number) {
    const search = new URLSearchParams({ query });
    if (category) search.set('category', category);
    if (limit) search.set('limit', String(limit));
    const res = await ApiService.get(`/eis/knowledge-base/entries?${search}`);
    return res.data;
  }

  static async knowledgeStats() {
    const res = await ApiService.get('/eis/knowledge-base/stats');
    return res.data;
  }

  static async validateResponse(response: string, query?: string) {
    const res = await ApiService.post('/eis/validate/response', { response, query });
    return res.data;
  }

  static async addDisclaimer(response: string, query?: string) {
    const res = await ApiService.post('/eis/validate/add-disclaimer', { response, query });
    return res.data;
  }

  static async getGatewayProviders() {
    const res = await ApiService.get('/eis/gateway/providers');
    return res.data;
  }

  static async activateProvider(type: string) {
    const res = await ApiService.post(`/eis/gateway/providers/${type}/activate`, {});
    return res.data;
  }

  static async generateCertificate(data: {
    recipientName: string;
    recipientEmail?: string;
    certificateType: string;
    programName: string;
    hours?: string;
    eventDate?: string;
  }) {
    const res = await ApiService.post('/eis/certificates/generate', data);
    return res.data;
  }

  static async verifyCertificate(code: string) {
    const res = await ApiService.get(`/eis/certificates/verify/${code}`);
    return res.data;
  }

  static async revokeCertificate(code: string) {
    const res = await ApiService.post(`/eis/certificates/${code}/revoke`, {});
    return res.data;
  }

  static async listCertificates(page = 1, limit = 20) {
    const res = await ApiService.get(`/eis/certificates?page=${page}&limit=${limit}`);
    return res.data;
  }

  static async certificatesStats() {
    const res = await ApiService.get('/eis/certificates/stats');
    return res.data;
  }

  static async analyticsDashboard() {
    const res = await ApiService.get('/eis/analytics/dashboard');
    return res.data;
  }

  static async analyticsReport(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const res = await ApiService.get(`/eis/analytics/report?${params}`);
    return res.data;
  }

  static async analyticsAIMetrics() {
    const res = await ApiService.get('/eis/analytics/ai-metrics');
    return res.data;
  }

  static async ragSearch(query: string, collection?: string, limit = 10, threshold = 0.7) {
    const res = await ApiService.post('/eis/rag/search', { query, collection, limit, threshold });
    return res.data;
  }

  static async ragIndexAll() {
    const res = await ApiService.post('/eis/rag/index-all', {});
    return res.data;
  }

  static async ragIndexCollection(collection: string) {
    const res = await ApiService.post(`/eis/rag/index/${collection}`, {});
    return res.data;
  }

  static async ragStats() {
    const res = await ApiService.get('/eis/rag/stats');
    return res.data;
  }

  static async ragSearchKB(query: string, category?: string, limit?: number) {
    const res = await ApiService.post('/eis/rag/search-knowledge-base', { query, category, limit });
    return res.data;
  }

  static async recommend(query: string, limit = 6) {
    const res = await ApiService.post('/eis/recommender/search', { query, limit });
    return res.data;
  }

  static async recommendByCategory(category: string, limit = 4) {
    const res = await ApiService.get(`/eis/recommender/category/${category}?limit=${limit}`);
    return res.data;
  }

  static async recommendForItem(type: string, id: string, limit = 4) {
    const res = await ApiService.get(`/eis/recommender/item/${type}/${id}?limit=${limit}`);
    return res.data;
  }
}
