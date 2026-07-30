import { IAIProvider, AIProviderType, AIChatMessage, AICompletionOptions, AICompletionResult, AIEmbeddingResult, AIImageAnalysisResult, AIProviderConfig } from './ai-provider.interface';
export declare class GeminiProvider implements IAIProvider {
    readonly type = AIProviderType.GEMINI;
    readonly config: AIProviderConfig;
    private client;
    private initialized;
    constructor(config?: Partial<AIProviderConfig>);
    initialize(): Promise<void>;
    chat(messages: AIChatMessage[], options?: AICompletionOptions): Promise<AICompletionResult>;
    chatStream(messages: AIChatMessage[], options?: AICompletionOptions): AsyncIterable<string>;
    embed(texts: string[]): Promise<AIEmbeddingResult>;
    analyzeImage(imageBuffer: Buffer, mimeType: string, prompt: string): Promise<AIImageAnalysisResult>;
    isAvailable(): boolean;
    getModel(): string;
    private ensureInitialized;
}
