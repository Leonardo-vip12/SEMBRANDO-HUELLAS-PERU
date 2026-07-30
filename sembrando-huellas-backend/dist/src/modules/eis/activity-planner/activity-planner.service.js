"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ActivityPlannerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityPlannerService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../../ai/ai.service");
const ACTIVITY_PROMPTS = {
    charla: 'Crea una charla educativa estructurada con introducción, desarrollo, conclusiones y espacio de preguntas.',
    campana: 'Diseña una campaña de concientización ambiental con objetivos claros, audiencia objetivo, mensajes clave y métricas de éxito.',
    taller: 'Crea un taller práctico paso a paso con objetivos de aprendizaje, materiales, duración y evaluación.',
    sesion_educativa: 'Diseña una sesión educativa completa con inicio, desarrollo, cierre y evaluación formativa.',
    juego: 'Crea un juego educativo ambiental con reglas, materiales, participantes, duración y objetivos de aprendizaje.',
    dinamica: 'Crea una dinámica grupal ambiental con objetivos, participantes, duración, instrucciones y reflexión final.',
};
let ActivityPlannerService = ActivityPlannerService_1 = class ActivityPlannerService {
    constructor(aiService) {
        this.aiService = aiService;
        this.logger = new common_1.Logger(ActivityPlannerService_1.name);
    }
    async plan(dto) {
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
        const result = await this.aiService.chat([
            {
                role: 'system',
                content: 'Eres un planificador de actividades educativas ambientales. Crea planes estructurados, prácticos y adaptables.',
            },
            { role: 'user', content: userMessage },
        ], { feature: 'activity-planner', temperature: 0.7, maxTokens: 3000, userId: dto.userId });
        try {
            const jsonMatch = result.content.match(/\{[\s\S]*\}/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : { plan: result.content };
        }
        catch {
            return { plan: result.content };
        }
    }
    async getRecommendations(level, duration) {
        const result = await this.aiService.chat([
            {
                role: 'system',
                content: 'Recomienda 5 actividades educativas ambientales. Devuelve JSON array con: title, type, description, duration, level, briefDescription.',
            },
            {
                role: 'user',
                content: `Nivel: ${level || 'general'}. Duración: ${duration || 'variable'}. Enfócate en actividades prácticas para educación ambiental en Perú.`,
            },
        ], { feature: 'activity-recommend', temperature: 0.8 });
        try {
            return JSON.parse(result.content.match(/\[[\s\S]*\]/)[0]);
        }
        catch {
            return [];
        }
    }
};
exports.ActivityPlannerService = ActivityPlannerService;
exports.ActivityPlannerService = ActivityPlannerService = ActivityPlannerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], ActivityPlannerService);
//# sourceMappingURL=activity-planner.service.js.map