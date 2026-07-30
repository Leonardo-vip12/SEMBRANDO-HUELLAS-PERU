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
import { RecommendQueryDto } from './dto/recommender-v2.dto';
export declare class EisController {
    private gateway;
    private kb;
    private tutor;
    private docAnalysis;
    private activityPlanner;
    private speciesV2;
    private observatory;
    private validation;
    private certificatesV2;
    private analytics;
    private rag;
    private recommender;
    constructor(gateway: AiGatewayService, kb: KnowledgeBaseService, tutor: TutorService, docAnalysis: DocumentAnalysisService, activityPlanner: ActivityPlannerService, speciesV2: SpeciesV2Service, observatory: ObservatoryService, validation: ValidationService, certificatesV2: CertificatesV2Service, analytics: AnalyticsV2Service, rag: RagV2Service, recommender: RecommenderV2Service);
    getGatewayProviders(): {
        type: import("../ai/providers").AIProviderType;
        model: string;
        available: boolean;
        healthy: boolean;
        failures: number;
        weight: number;
    }[];
    activateProvider(type: string): {
        active: string;
    };
    addKnowledgeEntry(dto: AddKnowledgeEntryDto, user?: any): Promise<any>;
    searchKnowledge(dto: KnowledgeSearchDto): Promise<any[]>;
    findBySource(source: string, sourceType: string): Promise<any[]>;
    knowledgeStats(): Promise<{
        total: number;
        verified: number;
        categories: Record<string, number>;
    }>;
    verifyKnowledgeEntry(id: string, user?: any): Promise<any>;
    createKnowledgeVersion(id: string, content: string): Promise<any>;
    tutorAsk(dto: TutorAskDto): Promise<{
        disclaimer: string;
        validation: {
            confidence: "alta" | "media" | "baja";
            sources: string[];
            warnings: string[];
        };
        response: string;
        level: string;
        model: string;
        confidence: string;
        sources: string[];
        suggestedMaterial: string[];
        followUpQuestions: string[];
    }>;
    analyzeDocument(file: Express.Multer.File, user?: any): Promise<any>;
    analyzeText(dto: AnalyzeTextDto): Promise<any>;
    planActivity(dto: PlanActivityDto, user?: any): Promise<any>;
    activityRecommendations(dto: ActivityRecommendDto): Promise<any>;
    identifySpecies(image: Express.Multer.File, user?: any): Promise<any>;
    speciesHistory(dto: SpeciesHistoryQueryDto): Promise<any>;
    speciesStats(): Promise<any>;
    registerObservation(dto: RegisterObservationDto, user?: any): Promise<any>;
    listObservations(dto: ObservationQueryDto): Promise<any>;
    observatoryMapData(status?: string): Promise<any[]>;
    verifyObservation(id: string, dto: VerifyObservationDto, user?: any): Promise<any>;
    observatoryStats(): Promise<any>;
    validateResponse(dto: ValidateResponseDto): Promise<import("./validation/validation.service").ValidationResult>;
    validateContent(dto: ValidateContentDto): Promise<{
        approved: boolean;
        suggestions: string[];
        issues: string[];
        score: number;
    }>;
    addDisclaimer(body: {
        response: string;
        query?: string;
        provider?: string;
        model?: string;
    }): Promise<{
        content: string;
        validation: import("./validation/validation.service").ValidationResult;
    }>;
    generateCertificate(dto: GenerateCertificateDto): Promise<{
        id: any;
        content: string;
        verificationCode: string;
        qrDataUrl?: string;
        verificationUrl: string;
    }>;
    verifyCertificate(code: string): Promise<{
        valid: boolean;
        message: string;
        revokedAt?: undefined;
        certificate?: undefined;
    } | {
        valid: boolean;
        message: string;
        revokedAt: any;
        certificate?: undefined;
    } | {
        valid: boolean;
        certificate: {
            recipientName: any;
            certificateType: any;
            programName: any;
            hours: any;
            issuedAt: any;
            verificationCode: any;
        };
        message: string;
        revokedAt?: undefined;
    }>;
    revokeCertificate(code: string): Promise<{
        revoked: boolean;
        code: string;
    }>;
    listCertificates(page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    certificatesStats(): Promise<{
        total: any;
        active: any;
        revoked: any;
    }>;
    analyticsDashboard(): Promise<{
        overview: {
            totalQueries: number;
            totalIdentifications: number;
            totalDocuments: number;
            totalActivities: number;
            totalObservations: number;
            totalCertificates: number;
            totalKnowledgeEntries: number;
        };
        speciesStats: any[];
        queryStats: any;
        activeUsers: {
            total: number;
            last24h: number;
            last7d: number;
        };
        recentActivity: any[];
    }>;
    analyticsReport(dto: AnalyticsQueryDto): Promise<{
        period: {
            start: string;
            end: string;
        };
        totals: {
            queries: number;
            identifications: number;
            observations: number;
            documents: number;
            activities: number;
            certificates: number;
        };
        trends: {
            queriesByDay: {
                date: string;
                count: number;
            }[];
            identificationsByDay: {
                date: string;
                count: number;
            }[];
        };
        topSpecies: any[];
        topTopics: {
            topic: string;
            count: number;
        }[];
    }>;
    analyticsAIMetrics(): Promise<{
        totalQueries: number;
        totalTokens: number;
        totalCost: number;
        averageLatency: number;
        queriesByFeature: Record<string, number>;
        queriesByProvider: Record<string, number>;
        errorsLast24h: number;
        activeUsers24h: number;
    }>;
    ragSearch(dto: RAGSearchDto): Promise<import("../ai/rag/rag.service").RAGSearchResult[]>;
    ragIndexAll(): Promise<{
        indexed: number;
        failed: number;
    }>;
    ragIndexCollection(collection: string): Promise<{
        collection: string;
        indexed: number;
        failed: number;
    }>;
    ragStats(): Promise<{
        vectorStore: {
            totalDocuments: number;
            collections: string[];
        };
        knowledgeBase: {
            total: number;
            verified: number;
            categories: Record<string, number>;
        };
    }>;
    ragSearchKB(dto: {
        query: string;
        category?: string;
        limit?: number;
    }): Promise<any[]>;
    recommendByQuery(dto: RecommendQueryDto): Promise<import("../ai/recommender/recommender.service").Recommendation[]>;
    recommendForUser(userId: string, limit?: number): Promise<import("../ai/recommender/recommender.service").Recommendation[]>;
    recommendByCategory(category: string, limit?: number): Promise<import("../ai/recommender/recommender.service").Recommendation[]>;
    recommendForItem(type: string, id: string, limit?: number): Promise<import("../ai/recommender/recommender.service").Recommendation[]>;
}
