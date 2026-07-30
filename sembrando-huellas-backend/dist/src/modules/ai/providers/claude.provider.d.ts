import { IAIProvider, AIProviderType, AIChatMessage, AICompletionOptions, AICompletionResult, AIEmbeddingResult, AIImageAnalysisResult, AIProviderConfig } from './ai-provider.interface';
export declare class ClaudeProvider implements IAIProvider {
    readonly type = AIProviderType.CLAUDE;
    readonly config: AIProviderConfig;
    private client;
    private initialized;
    constructor(config?: Partial<AIProviderConfig>);
    initialize(): Promise<void>;
    chat(messages: AIChatMessage[], options?: AICompletionOptions): Promise<AICompletionResult>;
    chatStream(messages: AIChatMessage[], options?: AICompletionOptions): AsyncIterable<string>;
    embed(_texts: string[]): Promise<AIEmbeddingResult>;
    analyzeImage(imageBuffer: Buffer, mimeType: string, prompt: string): Promise<AIImageAnalysisResult>;
    isAvailable(): boolean;
    getModel(): string;
    private ensureInitialized;
    private estimateCost;
}
