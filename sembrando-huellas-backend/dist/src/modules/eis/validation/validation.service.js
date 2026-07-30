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
var ValidationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
const common_1 = require("@nestjs/common");
const knowledge_base_service_1 = require("../knowledge-base/knowledge-base.service");
let ValidationService = ValidationService_1 = class ValidationService {
    constructor(kbService) {
        this.kbService = kbService;
        this.logger = new common_1.Logger(ValidationService_1.name);
    }
    async validateResponse(response, sourceInfo) {
        const warnings = [];
        const sources = [];
        if (sourceInfo?.query) {
            const kbResults = await this.kbService.search(sourceInfo.query, undefined, 3);
            kbResults.forEach((r) => {
                if (r.source)
                    sources.push(r.source);
            });
        }
        if (this.containsUncertainty(response)) {
            warnings.push('La respuesta contiene expresiones de incertidumbre que requieren verificación.');
        }
        if (response.includes('IA') ||
            response.includes('inteligencia artificial') ||
            response.includes('modelo de lenguaje')) {
            warnings.push('Esta respuesta fue generada por inteligencia artificial y debe ser verificada por un especialista antes de usar como información oficial.');
        }
        const confidenceLevel = this.calculateConfidence(response, sources);
        return {
            isValidated: sources.length > 0 && !this.containsUncertainty(response),
            confidence: confidenceLevel,
            sources: [...new Set(sources)],
            warnings,
            disclaimer: 'Esta información fue generada por IA como referencia preliminar. No reemplaza la consulta a fuentes oficiales o especialistas. Verifique los datos antes de usarlos con fines académicos o de investigación.',
        };
    }
    async validateContent(content, category) {
        const issues = [];
        const suggestions = [];
        if (content.length < 50) {
            issues.push('El contenido es demasiado corto para ser informativo.');
        }
        if (!content.includes('Perú') && !content.includes('peruano')) {
            suggestions.push('Considere incluir referencias al contexto peruano.');
        }
        const hasData = /\d+/.test(content);
        if (!hasData) {
            suggestions.push('Agregue datos cuantitativos para respaldar la información.');
        }
        const score = Math.max(0, Math.min(100, 100 - issues.length * 20 + suggestions.length * 5));
        return {
            approved: score >= 50,
            suggestions,
            issues,
            score,
        };
    }
    addDisclaimer(response, validation) {
        return `${response}\n\n---\n*🤖 Generado por IA • Confianza: ${validation.confidence} • Fuentes: ${validation.sources.length > 0 ? validation.sources.join(', ') : 'No verificadas'} • ${validation.disclaimer}*`;
    }
    containsUncertainty(text) {
        const patterns = [
            /no estoy seguro/i,
            /podría ser/i,
            /tal vez/i,
            /quizás/i,
            /no tengo información/i,
            /no puedo confirmar/i,
            /es posible/i,
            /no está claro/i,
            /no se sabe con certeza/i,
        ];
        return patterns.some((p) => p.test(text));
    }
    calculateConfidence(response, sources) {
        if (sources.length >= 3 && !this.containsUncertainty(response))
            return 'alta';
        if (sources.length >= 1)
            return 'media';
        return 'baja';
    }
};
exports.ValidationService = ValidationService;
exports.ValidationService = ValidationService = ValidationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [knowledge_base_service_1.KnowledgeBaseService])
], ValidationService);
//# sourceMappingURL=validation.service.js.map