import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIProviderType } from '../providers/ai-provider.interface';

@Injectable()
export class AiConfigService {
  private readonly logger = new Logger(AiConfigService.name);

  constructor(private configService: ConfigService) {}

  getConfig() {
    return {
      activeProvider: this.configService.get<string>('ai.provider', 'openai'),
      providers: {
        openai: {
          available: !!this.configService.get<string>('OPENAI_API_KEY'),
          model: this.configService.get<string>('ai.openai.model', 'gpt-4o'),
          models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        },
        gemini: {
          available: !!this.configService.get<string>('GEMINI_API_KEY'),
          model: this.configService.get<string>('ai.gemini.model', 'gemini-2.0-flash'),
          models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
        },
        claude: {
          available: !!this.configService.get<string>('ANTHROPIC_API_KEY'),
          model: this.configService.get<string>('ai.claude.model', 'claude-3-5-sonnet-20241022'),
          models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
        },
        local: {
          available: true,
          model: this.configService.get<string>('ai.local.model', 'llama3'),
          models: ['llama3', 'mistral', 'phi3'],
        },
      },
      defaultTemperature: this.configService.get<number>('ai.temperature', 0.7),
      maxTokens: this.configService.get<number>('ai.maxTokens', 4096),
      costLimit: this.configService.get<number>('ai.costLimit', 50),
    };
  }

  updateConfig(_updates: any): { success: boolean; message: string } {
    return { success: false, message: 'La configuración solo puede modificarse a través de variables de entorno.' };
  }
}
