import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AIProviderType,
  IAIProvider,
  AIChatMessage,
  AICompletionOptions,
  AICompletionResult,
  AIEmbeddingResult,
} from '../../ai/providers/ai-provider.interface';
import { AIProviderFactory } from '../../ai/providers/provider-factory';

interface ProviderInstance {
  provider: IAIProvider;
  type: AIProviderType;
  weight: number;
  failures: number;
  lastFailure: number;
}

@Injectable()
export class AiGatewayService {
  private readonly logger = new Logger(AiGatewayService.name);
  private providers: Map<AIProviderType, ProviderInstance> = new Map();
  private activeProvider: AIProviderType;
  private readonly FAILURE_THRESHOLD = 3;
  private readonly COOLDOWN_MS = 60000;

  constructor(private configService: ConfigService) {
    this.activeProvider = (this.configService.get<string>('AI_PROVIDER') || 'openai') as AIProviderType;
  }

  async initialize(): Promise<void> {
    const types = Object.values(AIProviderType);
    for (const type of types) {
      try {
        const provider = AIProviderFactory.createProvider(type);
        if (provider.isAvailable()) {
          await provider.initialize();
          this.providers.set(type, { provider, type, weight: 1, failures: 0, lastFailure: 0 });
          this.logger.log(`Gateway: ${type} initialized (${provider.getModel()})`);
        }
      } catch (error) {
        this.logger.warn(`Gateway: ${type} failed to initialize: ${(error as Error).message}`);
      }
    }
  }

  async chat(
    messages: AIChatMessage[],
    options?: AICompletionOptions & { feature?: string; userId?: string; requireProvider?: AIProviderType },
  ): Promise<AICompletionResult> {
    const targetType = options?.requireProvider;
    if (targetType) {
      const instance = this.providers.get(targetType);
      if (instance && this.isHealthy(instance)) {
        return this.executeWithRetry(instance, messages, options);
      }
      throw new Error(`Provider ${targetType} not available`);
    }

    const ordered = this.getOrderedProviders();
    const errors: string[] = [];

    for (const instance of ordered) {
      if (!this.isHealthy(instance)) continue;
      try {
        return await this.executeWithRetry(instance, messages, options);
      } catch (error) {
        this.recordFailure(instance);
        errors.push(`${instance.type}: ${(error as Error).message}`);
      }
    }

    throw new Error(`All AI providers failed: ${errors.join('; ')}`);
  }

  async embed(texts: string[], options?: { provider?: AIProviderType }): Promise<AIEmbeddingResult> {
    const provider = options?.provider || this.activeProvider;
    const instance = this.providers.get(provider);
    if (!instance || !this.isHealthy(instance)) throw new Error(`Provider ${provider} not available for embeddings`);
    return instance.provider.embed(texts);
  }

  getActiveProvider(): IAIProvider | undefined {
    return this.providers.get(this.activeProvider)?.provider;
  }

  getProviderStatus(): Array<{
    type: AIProviderType;
    model: string;
    available: boolean;
    healthy: boolean;
    failures: number;
    weight: number;
  }> {
    return Array.from(this.providers.values()).map((i) => ({
      type: i.type,
      model: i.provider.getModel(),
      available: i.provider.isAvailable(),
      healthy: this.isHealthy(i),
      failures: i.failures,
      weight: i.weight,
    }));
  }

  setActiveProvider(type: AIProviderType): void {
    if (this.providers.has(type)) {
      this.activeProvider = type;
      this.logger.log(`Gateway: Active provider changed to ${type}`);
    }
  }

  private isHealthy(instance: ProviderInstance): boolean {
    if (instance.failures < this.FAILURE_THRESHOLD) return true;
    return Date.now() - instance.lastFailure > this.COOLDOWN_MS;
  }

  private recordFailure(instance: ProviderInstance): void {
    instance.failures++;
    instance.lastFailure = Date.now();
    instance.weight = Math.max(0.1, instance.weight - 0.2);
    this.logger.warn(`Gateway: ${instance.type} failure #${instance.failures}`);
  }

  private getOrderedProviders(): ProviderInstance[] {
    return Array.from(this.providers.values())
      .filter((p) => p.provider.isAvailable())
      .sort((a, b) => {
        if (a.type === this.activeProvider) return -1;
        if (b.type === this.activeProvider) return 1;
        return b.weight - a.weight;
      });
  }

  private async executeWithRetry(
    instance: ProviderInstance,
    messages: AIChatMessage[],
    options?: AICompletionOptions,
  ): Promise<AICompletionResult> {
    const maxRetries = 2;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await instance.provider.chat(messages, options);
        instance.failures = Math.max(0, instance.failures - 1);
        instance.weight = Math.min(1, instance.weight + 0.05);
        return result;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries - 1) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }
    throw lastError || new Error('Max retries exceeded');
  }
}
