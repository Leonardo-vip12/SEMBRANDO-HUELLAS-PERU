import { ApiService } from './api';

export interface AssistantQuery {
  query: string;
  context?: string;
  sessionId?: string;
}

export interface AssistantResponse {
  response: string;
  context: string;
  model: string;
  suggestions: string[];
  latencyMs: number;
}

export interface SpeciesIdentification {
  scientificName: string;
  commonName: string;
  category?: string;
  conservationStatus?: string;
  confidence: number;
  description?: string;
  curiosities?: string[];
  threats?: string[];
  ecologicalImportance?: string;
}

export interface AiStats {
  totalQueries: number;
  totalTokens: number;
  totalCost: number;
  queriesByProvider: Record<string, number>;
  averageLatency: number;
  topModels: Array<{ model: string; count: number }>;
  errorsLast24h: number;
  activeUsers24h?: number;
}

export class AiService {
  static async askAssistant(data: AssistantQuery): Promise<AssistantResponse> {
    const res = await ApiService.post<AssistantResponse>('/ai/assistant', data);
    return res.data;
  }

  static async identifySpecies(formData: FormData): Promise<any> {
    const res = await ApiService.post('/ai/identify', formData);
    return res.data;
  }

  static async generateContent(data: { topic: string; contentType: string; level?: string }): Promise<any> {
    const res = await ApiService.post('/ai/generate/content', data);
    return res.data;
  }

  static async generateNews(data: { topic: string; keywords?: string; tone?: string }): Promise<any> {
    const res = await ApiService.post('/ai/generate/news', data);
    return res.data;
  }

  static async recommend(query: string, limit = 6): Promise<any> {
    const res = await ApiService.get(`/ai/recommend?q=${encodeURIComponent(query)}&limit=${limit}`);
    return res.data;
  }

  static async search(data: { query: string; collections?: string[]; limit?: number }): Promise<any> {
    const res = await ApiService.post('/ai/search', data);
    return res.data;
  }

  static async translate(data: { text: string; targetLanguage: string; sourceLanguage?: string }): Promise<any> {
    const res = await ApiService.post('/ai/translate', data);
    return res.data;
  }

  static async getLanguages(): Promise<any> {
    const res = await ApiService.get('/ai/languages');
    return res.data;
  }

  static async summarize(data: { text: string; length?: string }): Promise<any> {
    const res = await ApiService.post('/ai/summarize', data);
    return res.data;
  }

  static async generateCertificate(data: { recipientName: string; certificateType: string; programName: string; hours?: string; eventDate?: string }): Promise<any> {
    const res = await ApiService.post('/ai/certificate/generate', data);
    return res.data;
  }

  static async verifyCertificate(code: string): Promise<any> {
    const res = await ApiService.get(`/ai/certificate/verify/${code}`);
    return res.data;
  }

  static async getStats(): Promise<AiStats> {
    const res = await ApiService.get<AiStats>('/ai/admin/stats');
    return res.data;
  }

  static async getLogs(page = 1): Promise<any> {
    const res = await ApiService.get(`/ai/admin/logs?page=${page}`);
    return res.data;
  }

  static async getAiConfig(): Promise<any> {
    const res = await ApiService.get('/ai/admin/config');
    return res.data;
  }

  static async getProviders(): Promise<any> {
    const res = await ApiService.get('/ai/providers');
    return res.data;
  }

  static async getImpactReport(start?: string, end?: string): Promise<any> {
    const params = new URLSearchParams();
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    const res = await ApiService.get(`/ai/impact/report?${params}`);
    return res.data;
  }

  static async indexAllContent(): Promise<any> {
    const res = await ApiService.get('/ai/rag/index');
    return res.data;
  }
}
