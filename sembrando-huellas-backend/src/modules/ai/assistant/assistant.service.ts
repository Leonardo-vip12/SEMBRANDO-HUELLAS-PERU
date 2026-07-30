import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai.service';
import { ASSISTANT_SYSTEM_PROMPT, ASSISTANT_CONTEXT_PROMPTS, ASSISTANT_FOLLOW_UP_PROMPT } from '../prompts';
import { AssistantQueryDto, AssistantContext, AssistantResponseDto } from '../dto/ai-assistant.dto';

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);
  private sessions: Map<string, Array<{ role: string; content: string }>> = new Map();

  constructor(private aiService: AiService) {}

  async query(dto: AssistantQueryDto): Promise<AssistantResponseDto> {
    const context = dto.context || AssistantContext.GENERAL;
    const history = this.sessions.get(dto.sessionId || 'default') || [];

    const systemMessage = this.buildSystemPrompt(context);
    const messages = [
      { role: 'system' as const, content: systemMessage },
      ...history.slice(-10).map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: dto.query },
    ];

    const start = Date.now();
    const result = await this.aiService.chat(messages, {
      feature: 'assistant',
      userId: dto.sessionId,
      temperature: 0.7,
      maxTokens: 2000,
    });

    this.saveToSession(dto.sessionId, dto.query, result.content);

    const suggestions = await this.generateSuggestions(dto.query, result.content);

    return {
      response: result.content,
      context: context,
      model: result.model,
      suggestions,
      sources: [],
      latencyMs: Date.now() - start,
    };
  }

  private buildSystemPrompt(context: string): string {
    const contextPrompt = ASSISTANT_CONTEXT_PROMPTS[context] || '';
    return `${ASSISTANT_SYSTEM_PROMPT}\n\n${contextPrompt}`;
  }

  private saveToSession(sessionId: string | undefined, query: string, response: string) {
    const id = sessionId || 'default';
    if (!this.sessions.has(id)) this.sessions.set(id, []);
    const session = this.sessions.get(id)!;
    session.push({ role: 'user', content: query }, { role: 'assistant', content: response });
    if (session.length > 50) session.splice(0, session.length - 50);
  }

  private async generateSuggestions(query: string, response: string): Promise<string[]> {
    try {
      const result = await this.aiService.chat(
        [
          {
            role: 'system',
            content: 'Genera 3 preguntas de seguimiento relevantes. Responde SOLO con un array JSON de strings.',
          },
          {
            role: 'user',
            content: `Pregunta original: "${query}"\n\nRespuesta: "${response.slice(0, 500)}"\n\nGenera 3 preguntas de seguimiento:`,
          },
        ],
        { temperature: 0.8, maxTokens: 200, feature: 'assistant-suggestions' },
      );
      const parsed = JSON.parse(result.content);
      return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
    } catch {
      return [];
    }
  }

  clearSession(sessionId: string) {
    this.sessions.delete(sessionId);
  }
}
