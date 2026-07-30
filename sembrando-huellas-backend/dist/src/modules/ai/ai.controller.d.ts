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
export declare class AiController {
    private aiService;
    private assistant;
    private identifier;
    private generators;
    private recommender;
    private semanticSearch;
    private translator;
    private certificates;
    private summarizer;
    private impactAnalysis;
    private ragService;
    private queryLog;
    private config;
    constructor(aiService: AiService, assistant: AssistantService, identifier: IdentifierService, generators: GeneratorsService, recommender: RecommenderService, semanticSearch: SemanticSearchService, translator: TranslatorService, certificates: CertificatesService, summarizer: SummarizerService, impactAnalysis: ImpactAnalysisService, ragService: RAGService, queryLog: AiQueryLogService, config: AiConfigService);
    askAssistant(dto: AssistantQueryDto): Promise<import("./dto/ai-assistant.dto").AssistantResponseDto>;
    identify(file: Express.Multer.File): Promise<import("./dto").IdentifySpeciesResponseDto>;
    generateContent(dto: GenerateContentDto): Promise<any>;
    generateNews(dto: GenerateNewsDto): Promise<any>;
    recommend(query: string, limit?: number): Promise<Recommendation[]>;
    recommendForItem(type: string, id: string): Promise<Recommendation[]>;
    search(dto: SemanticSearchDto): Promise<import("./dto/semantic.dto").SemanticSearchResultDto[]>;
    translate(dto: TranslatorDto): Promise<{
        translatedText: string;
        sourceLanguage: string;
        targetLanguage: string;
    }>;
    getLanguages(): Promise<{
        code: string;
        name: string;
        nativeName: string;
        status: string;
    }[]>;
    generateCertificate(dto: GenerateCertificateDto): Promise<{
        content: string;
        verificationCode: string;
        qrDataUrl?: string;
        verificationUrl: string;
    }>;
    verifyCertificate(code: string): Promise<{
        valid: boolean;
        message: string;
    }>;
    summarize(dto: SummarizeDto): Promise<{
        summary: string;
        contentType?: string;
        keyPoints: string[];
        keywords: string[];
        readingTime: number;
    }>;
    impactReport(start?: string, end?: string): Promise<any>;
    indexAll(): Promise<{
        indexed: number;
        failed: number;
    }>;
    getStats(): Promise<{
        totalQueries: number;
        totalTokens: number;
        totalCost: number;
        queriesByProvider: Record<string, number>;
        tokensByProvider: Record<string, number>;
        costByProvider: Record<string, number>;
        averageLatency: number;
        topModels: Array<{
            model: string;
            count: number;
        }>;
        errorsLast24h: number;
        activeUsers24h: number;
    }>;
    getLogs(page?: number): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getConfig(): Promise<{
        activeProvider: string;
        providers: {
            openai: {
                available: boolean;
                model: string;
                models: string[];
            };
            gemini: {
                available: boolean;
                model: string;
                models: string[];
            };
            claude: {
                available: boolean;
                model: string;
                models: string[];
            };
            local: {
                available: boolean;
                model: string;
                models: string[];
            };
        };
        defaultTemperature: number;
        maxTokens: number;
        costLimit: number;
    }>;
    getProviders(): Promise<{
        type: import("./providers").AIProviderType;
        model: string;
        available: boolean;
    }[]>;
}
