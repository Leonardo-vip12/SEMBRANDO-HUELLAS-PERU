import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAIProvider, AIProviderType, AIChatMessage, AICompletionOptions, AICompletionResult, AIEmbeddingResult, AIImageAnalysisResult } from './providers/ai-provider.interface';
import { AiQueryLogService } from './admin/ai-query-log.service';
export declare class AiService implements OnModuleInit {
    private configService;
    private queryLogService;
    private readonly logger;
    private providers;
    private activeProvider;
    constructor(configService: ConfigService, queryLogService: AiQueryLogService);
    onModuleInit(): Promise<void>;
    private initializeProviders;
    getProvider(type?: AIProviderType): IAIProvider | undefined;
    getAllProviders(): IAIProvider[];
    getActiveProvider(): IAIProvider | undefined;
    setActiveProvider(type: AIProviderType): void;
    getActiveProviderType(): AIProviderType;
    chat(messages: AIChatMessage[], options?: AICompletionOptions & {
        provider?: AIProviderType;
        feature?: string;
        userId?: string;
    }): Promise<AICompletionResult>;
    embed(texts: string[], options?: {
        provider?: AIProviderType;
    }): Promise<AIEmbeddingResult>;
    analyzeImage(imageBuffer: Buffer, mimeType: string, prompt: string, options?: {
        provider?: AIProviderType;
    }): Promise<AIImageAnalysisResult>;
    isAnyProviderAvailable(): boolean;
    private logQuery;
}
