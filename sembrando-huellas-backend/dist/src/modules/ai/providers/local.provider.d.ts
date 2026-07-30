import { IAIProvider, AIProviderType, AIChatMessage, AICompletionOptions, AICompletionResult, AIEmbeddingResult, AIImageAnalysisResult, AIProviderConfig } from './ai-provider.interface';
export declare class LocalProvider implements IAIProvider {
    readonly type = AIProviderType.LOCAL;
    readonly config: AIProviderConfig;
    private initialized;
    constructor(config?: Partial<AIProviderConfig>);
    initialize(): Promise<void>;
    chat(messages: AIChatMessage[], options?: AICompletionOptions): Promise<AICompletionResult>;
    chatStream(messages: AIChatMessage[], _options?: AICompletionOptions): AsyncIterable<string>;
    embed(texts: string[]): Promise<AIEmbeddingResult>;
    analyzeImage(_imageBuffer: Buffer, _mimeType: string, prompt: string): Promise<AIImageAnalysisResult>;
    isAvailable(): boolean;
    getModel(): string;
    private queryOllama;
}
