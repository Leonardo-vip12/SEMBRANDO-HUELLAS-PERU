import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai.service';
import {
  GENERATOR_SYSTEM_PROMPT,
  INFOGRAPHIC_PROMPT,
  EDUCATIONAL_CARD_PROMPT,
  QUIZ_PROMPT,
  GUIDE_PROMPT,
} from '../prompts';
import { NEWS_DRAFT_PROMPT, NEWS_GENERATOR_SYSTEM } from '../prompts';
import { GenerateContentDto, ContentType, GenerateNewsDto } from '../dto/generator.dto';

@Injectable()
export class GeneratorsService {
  private readonly logger = new Logger(GeneratorsService.name);

  constructor(private aiService: AiService) {}

  async generateEducationalContent(dto: GenerateContentDto): Promise<any> {
    const promptMap: Record<string, string> = {
      [ContentType.INFOGRAPHIC]: INFOGRAPHIC_PROMPT,
      [ContentType.EDUCATIONAL_CARD]: EDUCATIONAL_CARD_PROMPT,
      [ContentType.QUIZ]: QUIZ_PROMPT,
      [ContentType.GUIDE]: GUIDE_PROMPT,
      [ContentType.SUMMARY]: 'Crea un resumen educativo sobre el tema.',
      [ContentType.ACTIVITY]: 'Crea una actividad educativa práctica.',
    };

    const contentPrompt = promptMap[dto.contentType] || INFOGRAPHIC_PROMPT;

    const userMessage = `Tema: ${dto.topic}
Nivel: ${dto.level || 'general'}
Audiencia: ${dto.audience || 'público general'}
Contexto adicional: ${dto.additionalContext || 'Ninguno'}

${contentPrompt}

Devuelve el resultado en formato JSON.`;

    const result = await this.aiService.chat(
      [
        { role: 'system', content: GENERATOR_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      { feature: 'generator', temperature: 0.7, maxTokens: 4000 },
    );

    return this.parseJsonResult(result.content);
  }

  async generateNewsDraft(dto: GenerateNewsDto): Promise<any> {
    const userMessage = `Tema: ${dto.topic}
Keywords: ${dto.keywords || 'No especificadas'}
Tono: ${dto.tone || 'Informativo'}

${NEWS_DRAFT_PROMPT}`;

    const result = await this.aiService.chat(
      [
        { role: 'system', content: NEWS_GENERATOR_SYSTEM },
        { role: 'user', content: userMessage },
      ],
      { feature: 'news-generator', temperature: 0.7, maxTokens: 3000 },
    );

    return this.parseJsonResult(result.content);
  }

  async summarizeEvent(eventDescription: string): Promise<any> {
    const result = await this.aiService.chat(
      [
        { role: 'system', content: NEWS_GENERATOR_SYSTEM },
        { role: 'user', content: `Resume el siguiente evento en formato noticia:\n\n${eventDescription}` },
      ],
      { feature: 'news-summarizer', temperature: 0.5, maxTokens: 1500 },
    );

    return { summary: result.content, model: result.model };
  }

  private parseJsonResult(content: string): any {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return { content };
    } catch {
      return { content };
    }
  }
}
