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
var SummarizerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummarizerService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../ai.service");
const prompts_1 = require("../prompts");
let SummarizerService = SummarizerService_1 = class SummarizerService {
    constructor(aiService) {
        this.aiService = aiService;
        this.logger = new common_1.Logger(SummarizerService_1.name);
    }
    async summarize(dto) {
        const lengthInstruction = dto.length === 'short' ? '1-2 oraciones' : dto.length === 'medium' ? '1 párrafo (3-5 oraciones)' : '2-3 párrafos';
        const userMessage = `Texto a resumir:\n\n${dto.text.slice(0, 10000)}\n\nLongitud: ${lengthInstruction}
Formato: ${dto.format || 'texto'}

${prompts_1.SUMMARIZE_PROMPT}`;
        const result = await this.aiService.chat([
            { role: 'system', content: prompts_1.SUMMARIZER_SYSTEM },
            { role: 'user', content: userMessage },
        ], { feature: 'summarizer', temperature: 0.3, maxTokens: 2000 });
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
        }
        catch { }
        const wordCount = result.content.split(' ').length;
        return {
            summary: result.content,
            keyPoints: [],
            keywords: [],
            readingTime: Math.ceil(wordCount / 200),
        };
    }
};
exports.SummarizerService = SummarizerService;
exports.SummarizerService = SummarizerService = SummarizerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], SummarizerService);
//# sourceMappingURL=summarizer.service.js.map