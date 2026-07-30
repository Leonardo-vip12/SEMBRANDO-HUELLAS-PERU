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
var TranslatorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslatorService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../ai.service");
const prompts_1 = require("../prompts");
let TranslatorService = TranslatorService_1 = class TranslatorService {
    constructor(aiService) {
        this.aiService = aiService;
        this.logger = new common_1.Logger(TranslatorService_1.name);
    }
    async translate(dto) {
        const source = dto.sourceLanguage || (await this.detectLanguage(dto.text)).language;
        const contextPrompt = dto.context ? `\n\nContexto: ${dto.context}` : '';
        const userMessage = `Traduce el siguiente texto de ${source} a ${dto.targetLanguage}:${contextPrompt}\n\n${dto.text}`;
        const result = await this.aiService.chat([
            { role: 'system', content: prompts_1.TRANSLATOR_SYSTEM },
            { role: 'user', content: userMessage },
        ], { feature: 'translator', temperature: 0.3, maxTokens: 4000 });
        return {
            translatedText: result.content.trim(),
            sourceLanguage: source,
            targetLanguage: dto.targetLanguage,
        };
    }
    async translateKeys(items, onProgress) {
        const progress = { total: items.length, completed: 0, failed: 0, errors: [] };
        const BATCH_SIZE = 5;
        for (let i = 0; i < items.length; i += BATCH_SIZE) {
            const batch = items.slice(i, i + BATCH_SIZE);
            const batchPrompt = batch
                .map((item, idx) => `[${idx}] Clave: "${item.key}"\nTexto (${item.sourceLang}): "${item.value}"\nTraducir a: ${item.targetLang}`)
                .join('\n\n');
            const userMessage = `Traduce los siguientes textos al idioma destino indicado para cada uno.\n\n${batchPrompt}\n\nResponde en formato JSON: { "0": "traducción1", "1": "traducción2", ... }`;
            try {
                const result = await this.aiService.chat([
                    { role: 'system', content: prompts_1.TRANSLATOR_SYSTEM },
                    { role: 'user', content: userMessage },
                ], { feature: 'translator', temperature: 0.3, maxTokens: 4000 });
                const parsed = JSON.parse(result.content.trim());
                for (let j = 0; j < batch.length; j++) {
                    if (parsed[String(j)]) {
                        batch[j].value = parsed[String(j)];
                        progress.completed++;
                    }
                    else {
                        progress.failed++;
                        progress.errors.push({ key: batch[j].key, error: 'No translation returned' });
                    }
                }
            }
            catch (error) {
                for (const item of batch) {
                    progress.failed++;
                    progress.errors.push({ key: item.key, error: error.message });
                }
            }
            if (onProgress)
                onProgress({ ...progress });
        }
        return progress;
    }
    async detectLanguage(text) {
        const patterns = [
            { regex: /[áéíóúüñ¿¡]/i, lang: 'es' },
            { regex: /[àâçéèêëîïôûùü]/i, lang: 'fr' },
            { regex: /[äöüß]/i, lang: 'de' },
            { regex: /[àèéìòù]/i, lang: 'it' },
            { regex: /[ãõâêíóú]/i, lang: 'pt' },
            { regex: /[qkw']/i, lang: 'qu' },
        ];
        for (const { regex, lang } of patterns) {
            if (regex.test(text)) {
                return { language: lang, confidence: 0.7 };
            }
        }
        const langData = [
            { words: ['the', 'is', 'are', 'was', 'were', 'will', 'have', 'has', 'been', 'this', 'that', 'with'], lang: 'en' },
            { words: ['el', 'la', 'los', 'las', 'es', 'son', 'está', 'están', 'con', 'para', 'por', 'del'], lang: 'es' },
            { words: ['o', 'a', 'os', 'as', 'é', 'são', 'está', 'estão', 'com', 'para', 'por', 'do', 'da'], lang: 'pt' },
        ];
        const words = text.toLowerCase().split(/\s+/);
        const scores = langData.map(({ words: dict, lang }) => {
            const count = words.filter((w) => dict.includes(w)).length;
            return { lang, score: count / Math.max(words.length, 1) };
        });
        const best = scores.sort((a, b) => b.score - a.score)[0];
        if (best && best.score > 0.15) {
            return { language: best.lang, confidence: Math.min(best.score * 2, 0.95) };
        }
        return { language: 'es', confidence: 0.5 };
    }
    async getSupportedLanguages() {
        return [
            { code: 'es', name: 'Spanish', nativeName: 'Español', status: 'full' },
            { code: 'en', name: 'English', nativeName: 'English', status: 'full' },
            { code: 'pt', name: 'Portuguese', nativeName: 'Português', status: 'full' },
            { code: 'qu', name: 'Quechua', nativeName: 'Runasimi', status: 'partial' },
            { code: 'ay', name: 'Aymara', nativeName: 'Aymar aru', status: 'partial' },
            { code: 'cni', name: 'Asháninka', nativeName: 'Asháninka', status: 'partial' },
        ];
    }
};
exports.TranslatorService = TranslatorService;
exports.TranslatorService = TranslatorService = TranslatorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], TranslatorService);
//# sourceMappingURL=translator.service.js.map