import { ConfigService } from '@nestjs/config';
import { AIProviderType, IAIProvider, AIChatMessage, AICompletionOptions, AICompletionResult, AIEmbeddingResult } from '../../ai/providers/ai-provider.interface';
export declare class AiGatewayService {
    private configService;
    private readonly logger;
    private providers;
    private activeProvider;
    private readonly FAILURE_THRESHOLD;
    private readonly COOLDOWN_MS;
    constructor(configService: ConfigService);
    initialize(): Promise<void>;
    chat(messages: AIChatMessage[], options?: AICompletionOptions & {
        feature?: string;
        userId?: string;
        requireProvider?: AIProviderType;
    }): Promise<AICompletionResult>;
    embed(texts: string[], options?: {
        provider?: AIProviderType;
    }): Promise<AIEmbeddingResult>;
    getActiveProvider(): IAIProvider | undefined;
    getProviderStatus(): Array<{
        type: AIProviderType;
        model: string;
        available: boolean;
        healthy: boolean;
        failures: number;
        weight: number;
    }>;
    setActiveProvider(type: AIProviderType): void;
    private isHealthy;
    private recordFailure;
    private getOrderedProviders;
    private executeWithRetry;
}
