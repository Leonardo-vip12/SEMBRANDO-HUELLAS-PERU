export declare enum AIProviderType {
    OPENAI = "openai",
    GEMINI = "gemini",
    CLAUDE = "claude",
    LOCAL = "local"
}
export interface AIChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface AICompletionOptions {
    temperature?: number;
    maxTokens?: number;
    model?: string;
    stream?: boolean;
}
export interface AICompletionResult {
    content: string;
    model: string;
    provider: AIProviderType;
    tokensUsed: number;
    promptTokens: number;
    completionTokens: number;
    latencyMs: number;
    cost: number;
}
export interface AIEmbeddingResult {
    embeddings: number[][];
    model: string;
    provider: AIProviderType;
    tokensUsed: number;
    latencyMs: number;
}
export interface AIImageAnalysisResult {
    description: string;
    labels: string[];
    objects: Array<{
        name: string;
        confidence: number;
    }>;
    text?: string;
}
export interface AIProviderConfig {
    apiKey?: string;
    baseUrl?: string;
    defaultModel: string;
    maxRetries: number;
    timeout: number;
}
export interface IAIProvider {
    readonly type: AIProviderType;
    readonly config: AIProviderConfig;
    initialize(): Promise<void>;
    chat(messages: AIChatMessage[], options?: AICompletionOptions): Promise<AICompletionResult>;
    chatStream(messages: AIChatMessage[], options?: AICompletionOptions): AsyncIterable<string>;
    embed(texts: string[]): Promise<AIEmbeddingResult>;
    analyzeImage(imageBuffer: Buffer, mimeType: string, prompt: string): Promise<AIImageAnalysisResult>;
    isAvailable(): boolean;
    getModel(): string;
}
