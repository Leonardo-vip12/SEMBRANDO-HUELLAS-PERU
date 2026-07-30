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
var DocumentAnalysisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../../ai/ai.service");
let DocumentAnalysisService = DocumentAnalysisService_1 = class DocumentAnalysisService {
    constructor(aiService) {
        this.aiService = aiService;
        this.logger = new common_1.Logger(DocumentAnalysisService_1.name);
    }
    async analyzeDocument(file, userId) {
        if (!file)
            throw new common_1.BadRequestException('No se proporcionó un archivo');
        const content = await this.extractText(file);
        const [summary, concepts, questions, mindMap, glossary, activities] = await Promise.all([
            this.generateSummary(content),
            this.extractConcepts(content),
            this.generateQuestions(content),
            this.generateMindMap(content),
            this.generateGlossary(content),
            this.generateActivities(content),
        ]);
        const analysis = await (await Promise.resolve().then(() => require('../../../prisma/prisma.service'))).PrismaService;
        const prisma = new analysis();
        const saved = await prisma.documentAnalysis.create({
            data: {
                filename: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                content: content.slice(0, 50000),
                summary,
                concepts,
                questions,
                mindMap,
                glossary,
                activities,
                userId,
            },
        });
        return saved;
    }
    async analyzeText(text, userId) {
        if (!text || text.length < 10)
            throw new common_1.BadRequestException('El texto debe tener al menos 10 caracteres');
        const [summary, concepts, questions, mindMap, glossary, activities] = await Promise.all([
            this.generateSummary(text),
            this.extractConcepts(text),
            this.generateQuestions(text),
            this.generateMindMap(text),
            this.generateGlossary(text),
            this.generateActivities(text),
        ]);
        return { summary, concepts, questions, mindMap, glossary, activities };
    }
    async extractText(file) {
        const mime = file.mimetype;
        if (mime.includes('text') || mime.includes('json')) {
            return file.buffer.toString('utf-8');
        }
        if (mime.includes('pdf')) {
            return `[PDF: ${file.originalname}] El contenido del PDF no pudo ser extraído automáticamente. Usa la IA para analizarlo.`;
        }
        if (mime.includes('word') || mime.includes('document')) {
            return `[Word: ${file.originalname}] El contenido del documento no pudo ser extraído automáticamente. Usa la IA para analizarlo.`;
        }
        return file.buffer.toString('utf-8').slice(0, 50000) || `[${file.originalname}]`;
    }
    async generateSummary(content) {
        const result = await this.aiService.chat([
            {
                role: 'system',
                content: 'Resume el siguiente texto de forma clara y concisa. Destaca las ideas principales, datos clave y conclusiones. Máximo 3 párrafos.',
            },
            { role: 'user', content: content.slice(0, 15000) },
        ], { feature: 'doc-summary', temperature: 0.3 });
        return result.content;
    }
    async extractConcepts(content) {
        const result = await this.aiService.chat([
            {
                role: 'system',
                content: 'Extrae los conceptos clave del texto. Devuelve un JSON array con objetos: { concept, definition, importance (1-5), relatedConcepts: string[] }',
            },
            { role: 'user', content: content.slice(0, 15000) },
        ], { feature: 'doc-concepts', temperature: 0.3 });
        try {
            return JSON.parse(result.content.match(/\{[\s\S]*\}|\[[\s\S]*\]/)[0]);
        }
        catch {
            return [];
        }
    }
    async generateQuestions(content) {
        const result = await this.aiService.chat([
            {
                role: 'system',
                content: 'Genera preguntas de comprensión sobre el texto. Devuelve JSON array con objetos: { question, options: string[], correctIndex: number, explanation: string, difficulty: "easy"|"medium"|"hard" }',
            },
            { role: 'user', content: content.slice(0, 15000) },
        ], { feature: 'doc-questions', temperature: 0.5 });
        try {
            return JSON.parse(result.content.match(/\{[\s\S]*\}|\[[\s\S]*\]/)[0]);
        }
        catch {
            return [];
        }
    }
    async generateMindMap(content) {
        const result = await this.aiService.chat([
            {
                role: 'system',
                content: 'Crea un mapa conceptual del texto. Devuelve JSON: { centralTopic: string, nodes: Array<{ id: string, label: string, level: number, parentId?: string }>, connections: Array<{ from: string, to: string, label: string }> }',
            },
            { role: 'user', content: content.slice(0, 15000) },
        ], { feature: 'doc-mindmap', temperature: 0.4 });
        try {
            return JSON.parse(result.content.match(/\{[\s\S]*\}/)[0]);
        }
        catch {
            return { centralTopic: '', nodes: [], connections: [] };
        }
    }
    async generateGlossary(content) {
        const result = await this.aiService.chat([
            {
                role: 'system',
                content: 'Crea un glosario de términos difíciles encontrados en el texto. Devuelve JSON array: { term: string, simpleExplanation: string, scientificExplanation: string, example: string }',
            },
            { role: 'user', content: content.slice(0, 15000) },
        ], { feature: 'doc-glossary', temperature: 0.3 });
        try {
            return JSON.parse(result.content.match(/\{[\s\S]*\}|\[[\s\S]*\]/)[0]);
        }
        catch {
            return [];
        }
    }
    async generateActivities(content) {
        const result = await this.aiService.chat([
            {
                role: 'system',
                content: 'Genera actividades educativas basadas en el texto. Devuelve JSON array: { title: string, type: "individual"|"grupal"|"investigacion"|"practica", duration: string, description: string, materials: string[], objectives: string[], steps: string[] }',
            },
            { role: 'user', content: content.slice(0, 15000) },
        ], { feature: 'doc-activities', temperature: 0.6 });
        try {
            return JSON.parse(result.content.match(/\{[\s\S]*\}|\[[\s\S]*\]/)[0]);
        }
        catch {
            return [];
        }
    }
};
exports.DocumentAnalysisService = DocumentAnalysisService;
exports.DocumentAnalysisService = DocumentAnalysisService = DocumentAnalysisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], DocumentAnalysisService);
//# sourceMappingURL=document-analysis.service.js.map