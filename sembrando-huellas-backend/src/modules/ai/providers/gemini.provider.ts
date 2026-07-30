import {
  IAIProvider,
  AIProviderType,
  AIChatMessage,
  AICompletionOptions,
  AICompletionResult,
  AIEmbeddingResult,
  AIImageAnalysisResult,
  AIProviderConfig,
} from './ai-provider.interface';

export class GeminiProvider implements IAIProvider {
  readonly type = AIProviderType.GEMINI;
  readonly config: AIProviderConfig;
  private client: any;
  private initialized = false;

  constructor(config?: Partial<AIProviderConfig>) {
    this.config = {
      apiKey: config?.apiKey || process.env.GEMINI_API_KEY || '',
      baseUrl: config?.baseUrl || 'https://generativelanguage.googleapis.com/v1beta',
      defaultModel: config?.defaultModel || 'gemini-2.0-flash',
      maxRetries: config?.maxRetries ?? 3,
      timeout: config?.timeout ?? 60000,
    };
  }

  async initialize(): Promise<void> {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(this.config.apiKey || '');
    this.client = genAI.getGenerativeModel({ model: this.config.defaultModel });
    this.initialized = true;
  }

  async chat(messages: AIChatMessage[], options?: AICompletionOptions): Promise<AICompletionResult> {
    await this.ensureInitialized();
    const start = Date.now();

    const systemMsg = messages.find((m) => m.role === 'system');
    const history = messages
      .filter((m) => m.role !== 'system')
      .slice(0, -1)
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
    const lastUserMsg = messages.filter((m) => m.role !== 'system').pop();

    const chat = this.client.startChat({
      history,
      systemInstruction: systemMsg ? { parts: [{ text: systemMsg.content }] } : undefined,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens,
      },
    });

    const result = await chat.sendMessage(lastUserMsg?.content || '');
    const response = result.response;
    const content = response.text();

    return {
      content,
      model: this.config.defaultModel,
      provider: this.type,
      tokensUsed: 0,
      promptTokens: 0,
      completionTokens: 0,
      latencyMs: Date.now() - start,
      cost: 0,
    };
  }

  async *chatStream(messages: AIChatMessage[], options?: AICompletionOptions): AsyncIterable<string> {
    await this.ensureInitialized();
    const lastMsg = messages[messages.length - 1];
    const result = await this.client.generateContentStream(lastMsg?.content || '');
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  }

  async embed(texts: string[]): Promise<AIEmbeddingResult> {
    const start = Date.now();
    const embeddings: number[][] = [];
    for (const text of texts) {
      const result = await this.client.embedContent(text);
      embeddings.push(result.embedding.values);
    }
    return {
      embeddings,
      model: this.config.defaultModel,
      provider: this.type,
      tokensUsed: 0,
      latencyMs: Date.now() - start,
    };
  }

  async analyzeImage(imageBuffer: Buffer, mimeType: string, prompt: string): Promise<AIImageAnalysisResult> {
    await this.ensureInitialized();
    const base64 = imageBuffer.toString('base64');
    const result = await this.client.generateContent([{ text: prompt }, { inlineData: { mimeType, data: base64 } }]);
    const content = result.response.text();
    return { description: content, labels: [], objects: [] };
  }

  isAvailable(): boolean {
    return !!this.config.apiKey;
  }

  getModel(): string {
    return this.config.defaultModel;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) await this.initialize();
  }
}
