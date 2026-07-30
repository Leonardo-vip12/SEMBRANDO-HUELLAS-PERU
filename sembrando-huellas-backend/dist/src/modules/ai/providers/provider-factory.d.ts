import { AIProviderType, IAIProvider, AIProviderConfig } from './ai-provider.interface';
export declare class AIProviderFactory {
    static createProvider(type: AIProviderType, config?: Partial<AIProviderConfig>): IAIProvider;
    static createDefaultProvider(): IAIProvider;
}
