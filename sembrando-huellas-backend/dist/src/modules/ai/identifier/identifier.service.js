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
var IdentifierService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../ai.service");
const prompts_1 = require("../prompts");
let IdentifierService = IdentifierService_1 = class IdentifierService {
    constructor(aiService) {
        this.aiService = aiService;
        this.logger = new common_1.Logger(IdentifierService_1.name);
    }
    async identifySpecies(imageBuffer, mimeType) {
        if (!imageBuffer || imageBuffer.length === 0) {
            throw new common_1.BadRequestException('No se proporcionó una imagen válida');
        }
        const start = Date.now();
        try {
            const result = await this.aiService.analyzeImage(imageBuffer, mimeType, prompts_1.IDENTIFIER_SYSTEM_PROMPT);
            const parsed = this.parseIdentification(result.description);
            return {
                success: true,
                data: parsed,
                latencyMs: Date.now() - start,
            };
        }
        catch (error) {
            this.logger.error(`Species identification failed: ${error.message}`);
            return {
                success: false,
                error: `No se pudo identificar la especie: ${error.message}`,
                latencyMs: Date.now() - start,
            };
        }
    }
    parseIdentification(raw) {
        try {
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
        catch { }
        return {
            scientificName: '',
            commonName: 'No identificado',
            confidence: 0,
            description: raw.slice(0, 500),
        };
    }
};
exports.IdentifierService = IdentifierService;
exports.IdentifierService = IdentifierService = IdentifierService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], IdentifierService);
//# sourceMappingURL=identifier.service.js.map