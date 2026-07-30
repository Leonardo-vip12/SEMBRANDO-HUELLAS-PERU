import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IAIProvider,
  AIProviderType,
  AIChatMessage,
  AICompletionOptions,
  AICompletionResult,
  AIEmbeddingResult,
  AIImageAnalysisResult,
} from './providers/ai-provider.interface';
import { AIProviderFactory } from './providers/provider-factory';
import { AiQueryLogService } from './admin/ai-query-log.service';

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private providers: Map<AIProviderType, IAIProvider> = new Map();
  private activeProvider: AIProviderType;

  constructor(
    private configService: ConfigService,
    private queryLogService: AiQueryLogService,
  ) {
    this.activeProvider =
      (this.configService.get<string>('ai.provider', 'openai') as AIProviderType) || AIProviderType.OPENAI;
  }

  async onModuleInit() {
    await this.initializeProviders();
  }

  private async initializeProviders() {
    const providerTypes = Object.values(AIProviderType);
    for (const type of providerTypes) {
      try {
        const provider = AIProviderFactory.createProvider(type);
        if (provider.isAvailable()) {
          await provider.initialize();
          this.providers.set(type, provider);
          this.logger.log(`Provider initialized: ${type} (model: ${provider.getModel()})`);
        }
      } catch (error) {
        this.logger.warn(`Failed to initialize provider ${type}: ${(error as Error).message}`);
      }
    }
  }

  getProvider(type?: AIProviderType): IAIProvider | undefined {
    if (type) return this.providers.get(type);
    return this.providers.get(this.activeProvider) || this.providers.values().next().value;
  }

  getAllProviders(): IAIProvider[] {
    return Array.from(this.providers.values());
  }

  getActiveProvider(): IAIProvider | undefined {
    return this.getProvider();
  }

  setActiveProvider(type: AIProviderType) {
    if (this.providers.has(type)) {
      this.activeProvider = type;
      this.logger.log(`Active provider changed to: ${type}`);
    }
  }

  getActiveProviderType(): AIProviderType {
    return this.activeProvider;
  }

  async chat(
    messages: AIChatMessage[],
    options?: AICompletionOptions & { provider?: AIProviderType; feature?: string; userId?: string },
  ): Promise<AICompletionResult> {
    const provider = this.getProvider(options?.provider);
    if (!provider) throw new Error('No AI provider available');

    const start = Date.now();
    try {
      const result = await provider.chat(messages, options);
      await this.logQuery({
        feature: options?.feature || 'chat',
        query: messages[messages.length - 1]?.content || '',
        provider: provider.type,
        model: result.model,
        tokensUsed: result.tokensUsed,
        cost: result.cost,
        latencyMs: result.latencyMs,
        success: true,
        userId: options?.userId,
      });
      return result;
    } catch (error) {
      const latencyMs = Date.now() - start;
      await this.logQuery({
        feature: options?.feature || 'chat',
        query: messages[messages.length - 1]?.content || '',
        provider: provider.type,
        model: options?.model || provider.getModel(),
        tokensUsed: 0,
        cost: 0,
        latencyMs,
        success: false,
        userId: options?.userId,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async embed(texts: string[], options?: { provider?: AIProviderType }): Promise<AIEmbeddingResult> {
    const provider = this.getProvider(options?.provider);
    if (!provider) throw new Error('No AI provider available for embeddings');
    return provider.embed(texts);
  }

  async analyzeImage(
    imageBuffer: Buffer,
    mimeType: string,
    prompt: string,
    options?: { provider?: AIProviderType },
  ): Promise<AIImageAnalysisResult> {
    const provider = this.getProvider(options?.provider);
    if (!provider) throw new Error('No AI provider available');
    return provider.analyzeImage(imageBuffer, mimeType, prompt);
  }

  isAnyProviderAvailable(): boolean {
    return this.providers.size > 0;
  }

  private async logQuery(params: {
    feature: string;
    query: string;
    provider: AIProviderType;
    model: string;
    tokensUsed: number;
    cost: number;
    latencyMs: number;
    success: boolean;
    userId?: string;
    error?: string;
  }) {
    try {
      await this.queryLogService.log(params);
    } catch (error) {
      this.logger.error(`Failed to log AI query: ${(error as Error).message}`);
    }
  }
}
