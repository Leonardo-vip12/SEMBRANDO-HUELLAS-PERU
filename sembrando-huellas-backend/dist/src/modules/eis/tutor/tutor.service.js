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
var TutorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorService = exports.UserLevel = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../../ai/ai.service");
const rag_service_1 = require("../../ai/rag/rag.service");
const knowledge_base_service_1 = require("../knowledge-base/knowledge-base.service");
var UserLevel;
(function (UserLevel) {
    UserLevel["PRIMARY"] = "primaria";
    UserLevel["SECONDARY"] = "secundaria";
    UserLevel["UNIVERSITY"] = "universidad";
    UserLevel["TEACHER"] = "docente";
    UserLevel["RESEARCHER"] = "investigador";
    UserLevel["VOLUNTEER"] = "voluntario";
    UserLevel["COMPANY"] = "empresa";
    UserLevel["GENERAL"] = "general";
})(UserLevel || (exports.UserLevel = UserLevel = {}));
const LEVEL_PROMPTS = {
    primaria: 'El usuario es un estudiante de primaria (6-11 años). Usa lenguaje muy simple, ejemplos divertidos, analogías con animales y juegos. Responde en 2-3 oraciones cortas. NO uses términos técnicos.',
    secundaria: 'El usuario es un estudiante de secundaria (12-16 años). Usa lenguaje claro con algunos términos científicos básicos. Incluye ejemplos prácticos y datos interesantes. Responde en 3-5 oraciones.',
    universidad: 'El usuario es un estudiante universitario. Usa terminología técnica apropiada. Incluye referencias a teorías, autores y datos actualizados. Proporciona profundidad académica.',
    docente: 'El usuario es un docente. Proporciona contenido estructurado para ser enseñado. Incluye objetivos de aprendizaje, metodologías sugeridas y recursos didácticos adicionales.',
    investigador: 'El usuario es un investigador. Usa lenguaje científico preciso. Incluye referencias bibliográficas, datos cuantitativos, metodologías y discusión de hallazgos.',
    voluntario: 'El usuario es un voluntario de la organización. Enfócate en acciones prácticas, cómo pueden contribuir, próximos eventos y oportunidades de participación.',
    empresa: 'El usuario representa una empresa. Enfócate en sostenibilidad corporativa, RSE, oportunidades de alianza, impacto medible y beneficios de la colaboración.',
    general: 'El usuario es público general. Usa lenguaje claro y accesible. Incluye datos interesantes y acciones prácticas que pueden tomar.',
};
let TutorService = TutorService_1 = class TutorService {
    constructor(aiService, ragService, kbService) {
        this.aiService = aiService;
        this.ragService = ragService;
        this.kbService = kbService;
        this.logger = new common_1.Logger(TutorService_1.name);
    }
    async ask(query, level = UserLevel.GENERAL, sessionId) {
        const levelPrompt = LEVEL_PROMPTS[level] || LEVEL_PROMPTS.general;
        const kbResults = await this.kbService.search(query, undefined, 3);
        const contextFromKB = kbResults.length > 0
            ? `\n\nInformación de referencia:\n${kbResults.map((r) => `[${r.sourceType}] ${r.content.slice(0, 500)}`).join('\n')}`
            : '';
        const systemMessage = `Eres un tutor ambiental adaptativo de "Sembrando Huellas Perú".

${levelPrompt}

NORMAS:
- Adapta TODO tu respuesta al nivel indicado.
- Incluye ejemplos relevantes para el Perú.
- Cuando sea apropiado, sugiere material educativo, actividades o recursos.
- Si no sabes algo, indícalo claramente con honestidad.
- Promueve la curiosidad y el pensamiento crítico.`;
        const result = await this.aiService.chat([
            { role: 'system', content: systemMessage },
            { role: 'user', content: query + contextFromKB },
        ], { feature: 'tutor', temperature: 0.7, maxTokens: 2000, userId: sessionId });
        const suggestions = await this.generateFollowUp(query, result.content, level);
        const sources = kbResults.map((r) => r.source);
        const confidence = result.content.length > 50 ? 'alta' : 'media';
        return {
            response: result.content,
            level,
            model: result.model,
            confidence,
            sources: [...new Set(sources)],
            suggestedMaterial: this.getSuggestedMaterial(level),
            followUpQuestions: suggestions,
        };
    }
    async generateFollowUp(query, response, level) {
        try {
            const result = await this.aiService.chat([
                {
                    role: 'system',
                    content: `Genera 3 preguntas de seguimiento para nivel ${level}. Responde SOLO con un array JSON.`,
                },
                { role: 'user', content: `Pregunta: "${query}"\nRespuesta: "${response.slice(0, 300)}"` },
            ], { feature: 'tutor-followup', temperature: 0.8 });
            const parsed = JSON.parse(result.content);
            return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
        }
        catch {
            return [];
        }
    }
    getSuggestedMaterial(level) {
        const material = {
            primaria: ['Fichas educativas ilustradas', 'Juegos interactivos', 'Cuentos ambientales'],
            secundaria: ['Guías de estudio', 'Infografías', 'Videos educativos'],
            universidad: ['Artículos científicos', 'Investigaciones', 'Documentales'],
            docente: ['Planificaciones de clase', 'Recursos didácticos', 'Rúbricas de evaluación'],
            investigador: ['Papers académicos', 'Datos de investigación', 'Informes técnicos'],
            voluntario: ['Guías de voluntariado', 'Manuales de campo', 'Calendario de actividades'],
            empresa: ['Reportes de sostenibilidad', 'Casos de éxito', 'Guías RSE'],
            general: ['Artículos divulgativos', 'Noticias ambientales', 'Guías prácticas'],
        };
        return material[level] || material.general;
    }
};
exports.TutorService = TutorService;
exports.TutorService = TutorService = TutorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        rag_service_1.RAGService,
        knowledge_base_service_1.KnowledgeBaseService])
], TutorService);
//# sourceMappingURL=tutor.service.js.map