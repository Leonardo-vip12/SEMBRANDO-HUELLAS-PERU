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
var GeneratorsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorsService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../ai.service");
const prompts_1 = require("../prompts");
const prompts_2 = require("../prompts");
const generator_dto_1 = require("../dto/generator.dto");
let GeneratorsService = GeneratorsService_1 = class GeneratorsService {
    constructor(aiService) {
        this.aiService = aiService;
        this.logger = new common_1.Logger(GeneratorsService_1.name);
    }
    async generateEducationalContent(dto) {
        const promptMap = {
            [generator_dto_1.ContentType.INFOGRAPHIC]: prompts_1.INFOGRAPHIC_PROMPT,
            [generator_dto_1.ContentType.EDUCATIONAL_CARD]: prompts_1.EDUCATIONAL_CARD_PROMPT,
            [generator_dto_1.ContentType.QUIZ]: prompts_1.QUIZ_PROMPT,
            [generator_dto_1.ContentType.GUIDE]: prompts_1.GUIDE_PROMPT,
            [generator_dto_1.ContentType.SUMMARY]: 'Crea un resumen educativo sobre el tema.',
            [generator_dto_1.ContentType.ACTIVITY]: 'Crea una actividad educativa práctica.',
        };
        const contentPrompt = promptMap[dto.contentType] || prompts_1.INFOGRAPHIC_PROMPT;
        const userMessage = `Tema: ${dto.topic}
Nivel: ${dto.level || 'general'}
Audiencia: ${dto.audience || 'público general'}
Contexto adicional: ${dto.additionalContext || 'Ninguno'}

${contentPrompt}

Devuelve el resultado en formato JSON.`;
        const result = await this.aiService.chat([
            { role: 'system', content: prompts_1.GENERATOR_SYSTEM_PROMPT },
            { role: 'user', content: userMessage },
        ], { feature: 'generator', temperature: 0.7, maxTokens: 4000 });
        return this.parseJsonResult(result.content);
    }
    async generateNewsDraft(dto) {
        const userMessage = `Tema: ${dto.topic}
Keywords: ${dto.keywords || 'No especificadas'}
Tono: ${dto.tone || 'Informativo'}

${prompts_2.NEWS_DRAFT_PROMPT}`;
        const result = await this.aiService.chat([
            { role: 'system', content: prompts_2.NEWS_GENERATOR_SYSTEM },
            { role: 'user', content: userMessage },
        ], { feature: 'news-generator', temperature: 0.7, maxTokens: 3000 });
        return this.parseJsonResult(result.content);
    }
    async summarizeEvent(eventDescription) {
        const result = await this.aiService.chat([
            { role: 'system', content: prompts_2.NEWS_GENERATOR_SYSTEM },
            { role: 'user', content: `Resume el siguiente evento en formato noticia:\n\n${eventDescription}` },
        ], { feature: 'news-summarizer', temperature: 0.5, maxTokens: 1500 });
        return { summary: result.content, model: result.model };
    }
    parseJsonResult(content) {
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch)
                return JSON.parse(jsonMatch[0]);
            return { content };
        }
        catch {
            return { content };
        }
    }
};
exports.GeneratorsService = GeneratorsService;
exports.GeneratorsService = GeneratorsService = GeneratorsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], GeneratorsService);
//# sourceMappingURL=generators.service.js.map