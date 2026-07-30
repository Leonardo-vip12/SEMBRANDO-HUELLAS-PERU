import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';

export type ActivityType = 'charla' | 'campana' | 'taller' | 'sesion_educativa' | 'juego' | 'dinamica';

const ACTIVITY_PROMPTS: Record<string, string> = {
  charla: 'Crea una charla educativa estructurada con introducción, desarrollo, conclusiones y espacio de preguntas.',
  campana:
    'Diseña una campaña de concientización ambiental con objetivos claros, audiencia objetivo, mensajes clave y métricas de éxito.',
  taller: 'Crea un taller práctico paso a paso con objetivos de aprendizaje, materiales, duración y evaluación.',
  sesion_educativa: 'Diseña una sesión educativa completa con inicio, desarrollo, cierre y evaluación formativa.',
  juego:
    'Crea un juego educativo ambiental con reglas, materiales, participantes, duración y objetivos de aprendizaje.',
  dinamica:
    'Crea una dinámica grupal ambiental con objetivos, participantes, duración, instrucciones y reflexión final.',
};

@Injectable()
export class ActivityPlannerService {
  private readonly logger = new Logger(ActivityPlannerService.name);

  constructor(private aiService: AiService) {}

  async plan(dto: {
    activityType: ActivityType;
    topic: string;
    level?: string;
    duration?: string;
    participants?: number;
    objectives?: string[];
    additionalContext?: string;
    userId?: string;
  }): Promise<any> {
    const typePrompt = ACTIVITY_PROMPTS[dto.activityType] || ACTIVITY_PROMPTS.taller;

    const userMessage = `Tipo de actividad: ${dto.activityType}
Tema: ${dto.topic}
Nivel educativo: ${dto.level || 'general'}
Duración estimada: ${dto.duration || '60 minutos'}
Participantes: ${dto.participants || 20}
Objetivos: ${dto.objectives?.join(', ') || 'No especificados'}
Contexto adicional: ${dto.additionalContext || 'Ninguno'}

${typePrompt}

Devuelve el plan completo en formato JSON con:
- title, description, objectives, duration, participants, materials, structure (array de pasos con tiempo), evaluation, adaptations (para diferentes niveles), tags`;

    const result = await this.aiService.chat(
      [
        {
          role: 'system',
          content:
            'Eres un planificador de actividades educativas ambientales. Crea planes estructurados, prácticos y adaptables.',
        },
        { role: 'user', content: userMessage },
      ],
      { feature: 'activity-planner', temperature: 0.7, maxTokens: 3000, userId: dto.userId },
    );

    try {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { plan: result.content };
    } catch {
      return { plan: result.content };
    }
  }

  async getRecommendations(level?: string, duration?: string): Promise<any> {
    const result = await this.aiService.chat(
      [
        {
          role: 'system',
          content:
            'Recomienda 5 actividades educativas ambientales. Devuelve JSON array con: title, type, description, duration, level, briefDescription.',
        },
        {
          role: 'user',
          content: `Nivel: ${level || 'general'}. Duración: ${duration || 'variable'}. Enfócate en actividades prácticas para educación ambiental en Perú.`,
        },
      ],
      { feature: 'activity-recommend', temperature: 0.8 },
    );
    try {
      return JSON.parse(result.content.match(/\[[\s\S]*\]/)![0]);
    } catch {
      return [];
    }
  }
}
