import { AIProviderType, IAIProvider, AIProviderConfig } from './ai-provider.interface';
import { OpenAIProvider } from './openai.provider';
import { GeminiProvider } from './gemini.provider';
import { ClaudeProvider } from './claude.provider';
import { LocalProvider } from './local.provider';

export class AIProviderFactory {
  static createProvider(type: AIProviderType, config?: Partial<AIProviderConfig>): IAIProvider {
    switch (type) {
      case AIProviderType.OPENAI:
        return new OpenAIProvider(config);
      case AIProviderType.GEMINI:
        return new GeminiProvider(config);
      case AIProviderType.CLAUDE:
        return new ClaudeProvider(config);
      case AIProviderType.LOCAL:
        return new LocalProvider(config);
      default:
        throw new Error(`Unknown AI provider type: ${type}`);
    }
  }

  static createDefaultProvider(): IAIProvider {
    const envProvider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
    switch (envProvider) {
      case 'openai':
        return new OpenAIProvider({});
      case 'gemini':
        return new GeminiProvider({});
      case 'claude':
        return new ClaudeProvider({});
      case 'local':
        return new LocalProvider({});
      default:
        return new OpenAIProvider({});
    }
  }
}
