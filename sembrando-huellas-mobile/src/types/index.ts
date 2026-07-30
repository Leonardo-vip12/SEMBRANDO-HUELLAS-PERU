export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: string;
  category?: string;
  publishedAt: string;
  createdAt: string;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  status: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  location?: string;
  status: string;
}

export interface Species {
  id: string;
  name: string;
  scientificName: string;
  image?: string;
  category?: string;
  conservationStatus?: string;
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  image?: string;
  type?: string;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: string;
  file?: string;
  url?: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  description?: string;
  type: 'pdf' | 'infographic' | 'video' | 'audio' | 'guide';
  file?: string;
  thumbnail?: string;
  downloadable: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  description?: string;
  category?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  image?: string;
  duration?: string;
  level?: string;
  progress?: number;
  modules?: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  completed: boolean;
  duration?: string;
}

export interface Certificate {
  id: string;
  title: string;
  recipientName: string;
  programName: string;
  issuedAt: string;
  verificationCode: string;
  qrDataUrl?: string;
}

export interface BiodiversityObservation {
  id: string;
  speciesName?: string;
  scientificName?: string;
  quantity: number;
  latitude: number;
  longitude: number;
  observedAt: string;
  habitat?: string;
  weather?: string;
  comments?: string;
  images?: string[];
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_REVIEW';
}

export interface SpeciesIdentification {
  id: string;
  scientificName?: string;
  commonName?: string;
  confidence?: number;
  conservationStatus?: string;
  description?: string;
  curiosities?: string[];
  threats?: string[];
  habitat?: string;
  imageUrl?: string;
}

export interface AIAssistantQuery {
  query: string;
  context?: string;
  sessionId?: string;
}

export interface AIAssistantResponse {
  response: string;
  context: string;
  model: string;
  suggestions: string[];
  sources: string[];
  latencyMs: number;
}

export interface TutorResponse {
  response: string;
  level: string;
  model: string;
  confidence: string;
  sources: string[];
  suggestedMaterial: string[];
  followUpQuestions: string[];
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description?: string;
  date?: string;
  location?: string;
  spots?: number;
  requirements?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  data?: any;
  createdAt: string;
}

export interface GamificationProfile {
  xp: number;
  level: number;
  badges: Badge[];
  challenges: Challenge[];
  rank?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: { xp: number; badge?: string };
  expiresAt?: string;
}

export interface SyncQueueItem {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  createdAt: string;
  retries: number;
}

export type ActivityType = 'charla' | 'campana' | 'taller' | 'sesion_educativa' | 'juego' | 'dinamica';
export type UserLevel = 'primaria' | 'secundaria' | 'universidad' | 'docente' | 'investigador' | 'voluntario' | 'empresa' | 'general';
export type ContentType = 'infografia' | 'ficha_educativa' | 'cuestionario' | 'guia' | 'resumen' | 'actividad';

export interface DocumentAnalysis {
  id: string;
  filename: string;
  fileType: string;
  summary?: string;
  concepts?: string[];
  questions?: string[];
  mindMap?: { nodes: Array<{ id: string; label: string }>; edges: Array<{ from: string; to: string }> };
  glossary?: Array<{ term: string; definition: string }>;
  activities?: string[];
  createdAt: string;
}

export interface KnowledgeBaseEntry {
  id: string;
  title: string;
  content: string;
  source: string;
  sourceType: string;
  category?: string;
  tags?: string[];
  isVerified: boolean;
  version: number;
  createdAt: string;
}

export interface ValidationResult {
  isValidated: boolean;
  confidence: 'alta' | 'media' | 'baja';
  sources: string[];
  warnings: string[];
  disclaimer: string;
}

export interface AIMetrics {
  totalQueries: number;
  totalTokens: number;
  totalCost: number;
  averageLatency: number;
  queriesByFeature: Record<string, number>;
  queriesByProvider: Record<string, number>;
  errorsLast24h: number;
  activeUsers24h: number;
}

export interface Recommendation {
  type: string;
  id: string;
  title: string;
  description: string;
  image?: string;
  score: number;
  reason: string;
}

export interface RAGSearchResult {
  document: {
    id: string;
    content: string;
    source: string;
    collection: string;
    metadata?: Record<string, any>;
  };
  score: number;
}

export interface RAGStats {
  vectorStore: {
    totalDocuments: number;
    collections: string[];
  };
  knowledgeBase: {
    total: number;
    verified: number;
    categories: Record<string, number>;
  };
}
