import { apiClient } from '@/src/lib/api';

export const authService = {
  login: (email: string, password: string) => apiClient.post('/api/v1/auth/login', { email, password }),
  register: (data: any) => apiClient.post('/api/v1/auth/register', data),
  refresh: (token: string) => apiClient.post('/api/v1/auth/refresh', { refreshToken: token }),
  profile: () => apiClient.get('/api/v1/auth/profile'),
  updateProfile: (data: any) => apiClient.put('/api/v1/auth/profile', data),
};

export const newsService = {
  list: (page = 1, limit = 20) => apiClient.get(`/api/v1/news?page=${page}&limit=${limit}`),
  getBySlug: (slug: string) => apiClient.get(`/api/v1/news/${slug}`),
  featured: () => apiClient.get('/api/v1/news?featured=true&limit=5'),
};

export const speciesService = {
  list: (page = 1, limit = 20, category?: string) => {
    let q = `/api/v1/species?page=${page}&limit=${limit}`;
    if (category) q += `&category=${category}`;
    return apiClient.get(q);
  },
  getBySlug: (slug: string) => apiClient.get(`/api/v1/species/${slug}`),
  categories: () => apiClient.get('/api/v1/species/categories'),
};

export const programsService = {
  list: () => apiClient.get('/api/v1/programs'),
  getBySlug: (slug: string) => apiClient.get(`/api/v1/programs/${slug}`),
};

export const projectsService = {
  list: (page = 1) => apiClient.get(`/api/v1/projects?page=${page}`),
  getBySlug: (slug: string) => apiClient.get(`/api/v1/projects/${slug}`),
};

export const eventsService = {
  list: (page = 1) => apiClient.get(`/api/v1/events?page=${page}`),
  upcoming: () => apiClient.get('/api/v1/events?upcoming=true&limit=10'),
};

export const libraryService = {
  list: (page = 1) => apiClient.get(`/api/v1/resources?page=${page}`),
  getById: (id: string) => apiClient.get(`/api/v1/resources/${id}`),
};

export const galleryService = {
  list: (page = 1) => apiClient.get(`/api/v1/gallery?page=${page}`),
  getById: (id: string) => apiClient.get(`/api/v1/gallery/${id}`),
};

export const volunteersService = {
  list: () => apiClient.get('/api/v1/volunteers'),
  register: (data: any) => apiClient.post('/api/v1/volunteers', data),
};

export const aiService = {
  ask: (query: string, sessionId?: string) => apiClient.post('/api/v1/ai/assistant', { query, sessionId }),
  identify: (formData: FormData) => apiClient.upload('/api/v1/ai/identify', formData),
  recommend: (query: string, limit = 6) => apiClient.get(`/api/v1/ai/recommend?q=${encodeURIComponent(query)}&limit=${limit}`),
  search: (query: string, collections?: string[]) => apiClient.post('/api/v1/ai/search', { query, collections }),
  translate: (text: string, targetLanguage: string) => apiClient.post('/api/v1/ai/translate', { text, targetLanguage }),
  summarize: (text: string, length?: string) => apiClient.post('/api/v1/ai/summarize', { text, length }),
};

export const eisService = {
  tutorAsk: (query: string, level?: string) => apiClient.post('/api/v1/eis/tutor/ask', { query, level }),
  identifySpecies: (formData: FormData) => apiClient.upload('/api/v1/eis/species-v2/identify', formData),
  registerObservation: (data: any) => apiClient.post('/api/v1/eis/observatory/observations', data),
  listObservations: (page = 1, status?: string) => {
    let q = `/api/v1/eis/observatory/observations?page=${page}`;
    if (status) q += `&status=${status}`;
    return apiClient.get(q);
  },
  observatoryMapData: (status?: string) => apiClient.get(`/api/v1/eis/observatory/map${status ? `?status=${status}` : ''}`),
  observatoryStats: () => apiClient.get('/api/v1/eis/observatory/stats'),
  analyzeText: (text: string) => apiClient.post('/api/v1/eis/documents/analyze-text', { text }),
  planActivity: (data: any) => apiClient.post('/api/v1/eis/activities/plan', data),
  searchKnowledge: (query: string) => apiClient.get(`/api/v1/eis/knowledge-base/entries?query=${encodeURIComponent(query)}`),
  generateCertificate: (data: any) => apiClient.post('/api/v1/eis/certificates/generate', data),
  verifyCertificate: (code: string) => apiClient.get(`/api/v1/eis/certificates/verify/${code}`),
  recommend: (query: string, limit = 6) => apiClient.post('/api/v1/eis/recommender/search', { query, limit }),
  recommendByCategory: (category: string) => apiClient.get(`/api/v1/eis/recommender/category/${category}`),
  ragSearch: (query: string, collection?: string) => apiClient.post('/api/v1/eis/rag/search', { query, collection }),
};

export const coursesService = {
  list: () => apiClient.get('/api/v1/courses'),
  getById: (id: string) => apiClient.get(`/api/v1/courses/${id}`),
};
