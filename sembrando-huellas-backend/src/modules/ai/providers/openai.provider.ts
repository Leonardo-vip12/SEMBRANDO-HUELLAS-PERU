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

export class OpenAIProvider implements IAIProvider {
  readonly type = AIProviderType.OPENAI;
  readonly config: AIProviderConfig;
  private client: any;
  private initialized = false;

  constructor(config?: Partial<AIProviderConfig>) {
    this.config = {
      apiKey: config?.apiKey || process.env.OPENAI_API_KEY || '',
      baseUrl: config?.baseUrl || 'https://api.openai.com/v1',
      defaultModel: config?.defaultModel || 'gpt-4o',
      maxRetries: config?.maxRetries ?? 3,
      timeout: config?.timeout ?? 60000,
    };
  }

  async initialize(): Promise<void> {
    const { default: OpenAI } = await import('openai');
    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      maxRetries: this.config.maxRetries,
    });
    this.initialized = true;
  }

  async chat(messages: AIChatMessage[], options?: AICompletionOptions): Promise<AICompletionResult> {
    await this.ensureInitialized();
    const start = Date.now();

    const response = await this.client.chat.completions.create({
      model: options?.model || this.config.defaultModel,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens,
      stream: false,
    });

    const result = response.choices[0];
    return {
      content: result.message.content || '',
      model: response.model,
      provider: this.type,
      tokensUsed: response.usage?.total_tokens || 0,
      promptTokens: response.usage?.prompt_tokens || 0,
      completionTokens: response.usage?.completion_tokens || 0,
      latencyMs: Date.now() - start,
      cost: this.estimateCost(
        response.model,
        response.usage?.prompt_tokens || 0,
        response.usage?.completion_tokens || 0,
      ),
    };
  }

  async *chatStream(messages: AIChatMessage[], options?: AICompletionOptions): AsyncIterable<string> {
    await this.ensureInitialized();
    const stream = await this.client.chat.completions.create({
      model: options?.model || this.config.defaultModel,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens,
      stream: true,
    });
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }

  async embed(texts: string[]): Promise<AIEmbeddingResult> {
    await this.ensureInitialized();
    const start = Date.now();
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    });
    return {
      embeddings: response.data.map((d: any) => d.embedding),
      model: response.model,
      provider: this.type,
      tokensUsed: response.usage?.total_tokens || 0,
      latencyMs: Date.now() - start,
    };
  }

  async analyzeImage(imageBuffer: Buffer, mimeType: string, prompt: string): Promise<AIImageAnalysisResult> {
    await this.ensureInitialized();
    const base64 = imageBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '';
    return this.parseImageAnalysis(content);
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

  private parseImageAnalysis(content: string): AIImageAnalysisResult {
    return {
      description: content,
      labels: [],
      objects: [],
    };
  }

  private estimateCost(model: string, promptTokens: number, completionTokens: number): number {
    const rates: Record<string, [number, number]> = {
      'gpt-4o': [2.5 / 1_000_000, 10 / 1_000_000],
      'gpt-4o-mini': [0.15 / 1_000_000, 0.6 / 1_000_000],
    };
    const [promptRate, completionRate] = rates[model] || [2.5 / 1_000_000, 10 / 1_000_000];
    return promptTokens * promptRate + completionTokens * completionRate;
  }
}
