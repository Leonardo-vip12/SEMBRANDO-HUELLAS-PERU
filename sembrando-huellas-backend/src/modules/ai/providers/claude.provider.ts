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

export class ClaudeProvider implements IAIProvider {
  readonly type = AIProviderType.CLAUDE;
  readonly config: AIProviderConfig;
  private client: any;
  private initialized = false;

  constructor(config?: Partial<AIProviderConfig>) {
    this.config = {
      apiKey: config?.apiKey || process.env.ANTHROPIC_API_KEY || '',
      baseUrl: config?.baseUrl || 'https://api.anthropic.com/v1',
      defaultModel: config?.defaultModel || 'claude-3-5-sonnet-20241022',
      maxRetries: config?.maxRetries ?? 3,
      timeout: config?.timeout ?? 60000,
    };
  }

  async initialize(): Promise<void> {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    this.client = new Anthropic({
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
    });
    this.initialized = true;
  }

  async chat(messages: AIChatMessage[], options?: AICompletionOptions): Promise<AICompletionResult> {
    await this.ensureInitialized();
    const start = Date.now();

    const systemMsg = messages.find((m) => m.role === 'system');
    const nonSystem = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const response = await this.client.messages.create({
      model: options?.model || this.config.defaultModel,
      system: systemMsg?.content,
      messages: nonSystem,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
    });

    const content = response.content
      .map((c: any) => c.text)
      .filter(Boolean)
      .join('');

    return {
      content,
      model: response.model,
      provider: this.type,
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0,
      promptTokens: response.usage?.input_tokens || 0,
      completionTokens: response.usage?.output_tokens || 0,
      latencyMs: Date.now() - start,
      cost: this.estimateCost(response.model, response.usage?.input_tokens || 0, response.usage?.output_tokens || 0),
    };
  }

  async *chatStream(messages: AIChatMessage[], options?: AICompletionOptions): AsyncIterable<string> {
    await this.ensureInitialized();
    const lastMsg = messages[messages.length - 1];
    const stream = await this.client.messages.create({
      model: options?.model || this.config.defaultModel,
      max_tokens: options?.maxTokens ?? 4096,
      messages: [{ role: 'user', content: lastMsg?.content || '' }],
      stream: true,
    });
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
        yield chunk.delta.text;
      }
    }
  }

  async embed(_texts: string[]): Promise<AIEmbeddingResult> {
    throw new Error('Claude does not support embeddings directly. Use OpenAI or Gemini for embeddings.');
  }

  async analyzeImage(imageBuffer: Buffer, mimeType: string, prompt: string): Promise<AIImageAnalysisResult> {
    await this.ensureInitialized();
    const base64 = imageBuffer.toString('base64');
    const response = await this.client.messages.create({
      model: this.config.defaultModel,
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
          ],
        },
      ],
    });
    const content = response.content
      .map((c: any) => c.text)
      .filter(Boolean)
      .join('');
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

  private estimateCost(model: string, inputTokens: number, outputTokens: number): number {
    const rates: Record<string, [number, number]> = {
      'claude-3-5-sonnet-20241022': [3 / 1_000_000, 15 / 1_000_000],
      'claude-3-haiku-20240307': [0.25 / 1_000_000, 1.25 / 1_000_000],
    };
    const [inputRate, outputRate] = rates[model] || [3 / 1_000_000, 15 / 1_000_000];
    return inputTokens * inputRate + outputTokens * outputRate;
  }
}
