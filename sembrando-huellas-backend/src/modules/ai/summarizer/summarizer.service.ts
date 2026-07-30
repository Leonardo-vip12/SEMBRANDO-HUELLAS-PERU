import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai.service';
import { SUMMARIZER_SYSTEM, SUMMARIZE_PROMPT } from '../prompts';

@Injectable()
export class SummarizerService {
  private readonly logger = new Logger(SummarizerService.name);

  constructor(private aiService: AiService) {}

  async summarize(dto: { text: string; length?: string; format?: string }): Promise<{
    summary: string;
    contentType?: string;
    keyPoints: string[];
    keywords: string[];
    readingTime: number;
  }> {
    const lengthInstruction =
      dto.length === 'short' ? '1-2 oraciones' : dto.length === 'medium' ? '1 párrafo (3-5 oraciones)' : '2-3 párrafos';

    const userMessage = `Texto a resumir:\n\n${dto.text.slice(0, 10000)}\n\nLongitud: ${lengthInstruction}
Formato: ${dto.format || 'texto'}

${SUMMARIZE_PROMPT}`;

    const result = await this.aiService.chat(
      [
        { role: 'system', content: SUMMARIZER_SYSTEM },
        { role: 'user', content: userMessage },
      ],
      { feature: 'summarizer', temperature: 0.3, maxTokens: 2000 },
    );

    try {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || result.content,
          contentType: parsed.contentType,
          keyPoints: parsed.keyPoints || [],
          keywords: parsed.keywords || [],
          readingTime: parsed.readingTime || Math.ceil((parsed.summary || result.content).split(' ').length / 200),
        };
      }
    } catch {}

    const wordCount = result.content.split(' ').length;
    return {
      summary: result.content,
      keyPoints: [],
      keywords: [],
      readingTime: Math.ceil(wordCount / 200),
    };
  }
}
