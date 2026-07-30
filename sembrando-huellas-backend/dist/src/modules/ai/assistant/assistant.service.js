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
var AssistantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistantService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../ai.service");
const prompts_1 = require("../prompts");
const ai_assistant_dto_1 = require("../dto/ai-assistant.dto");
let AssistantService = AssistantService_1 = class AssistantService {
    constructor(aiService) {
        this.aiService = aiService;
        this.logger = new common_1.Logger(AssistantService_1.name);
        this.sessions = new Map();
    }
    async query(dto) {
        const context = dto.context || ai_assistant_dto_1.AssistantContext.GENERAL;
        const history = this.sessions.get(dto.sessionId || 'default') || [];
        const systemMessage = this.buildSystemPrompt(context);
        const messages = [
            { role: 'system', content: systemMessage },
            ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: dto.query },
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
    buildSystemPrompt(context) {
        const contextPrompt = prompts_1.ASSISTANT_CONTEXT_PROMPTS[context] || '';
        return `${prompts_1.ASSISTANT_SYSTEM_PROMPT}\n\n${contextPrompt}`;
    }
    saveToSession(sessionId, query, response) {
        const id = sessionId || 'default';
        if (!this.sessions.has(id))
            this.sessions.set(id, []);
        const session = this.sessions.get(id);
        session.push({ role: 'user', content: query }, { role: 'assistant', content: response });
        if (session.length > 50)
            session.splice(0, session.length - 50);
    }
    async generateSuggestions(query, response) {
        try {
            const result = await this.aiService.chat([
                {
                    role: 'system',
                    content: 'Genera 3 preguntas de seguimiento relevantes. Responde SOLO con un array JSON de strings.',
                },
                {
                    role: 'user',
                    content: `Pregunta original: "${query}"\n\nRespuesta: "${response.slice(0, 500)}"\n\nGenera 3 preguntas de seguimiento:`,
                },
            ], { temperature: 0.8, maxTokens: 200, feature: 'assistant-suggestions' });
            const parsed = JSON.parse(result.content);
            return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
        }
        catch {
            return [];
        }
    }
    clearSession(sessionId) {
        this.sessions.delete(sessionId);
    }
};
exports.AssistantService = AssistantService;
exports.AssistantService = AssistantService = AssistantService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AssistantService);
//# sourceMappingURL=assistant.service.js.map