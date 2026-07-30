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
var KnowledgeBaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeBaseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const ai_service_1 = require("../../ai/ai.service");
const rag_service_1 = require("../../ai/rag/rag.service");
let KnowledgeBaseService = KnowledgeBaseService_1 = class KnowledgeBaseService {
    constructor(prisma, aiService, ragService) {
        this.prisma = prisma;
        this.aiService = aiService;
        this.ragService = ragService;
        this.logger = new common_1.Logger(KnowledgeBaseService_1.name);
    }
    async addEntry(data) {
        const entry = await this.prisma.knowledgeBase.create({
            data: {
                title: data.title,
                content: data.content,
                source: data.source,
                sourceType: data.sourceType,
                category: data.category,
                tags: data.tags || [],
                metadata: data.metadata || {},
            },
        });
        try {
            const embeddings = await this.aiService.embed([data.content]);
            if (embeddings.embeddings.length > 0) {
                await this.prisma.knowledgeBase.update({
                    where: { id: entry.id },
                    data: { embedding: embeddings.embeddings[0] },
                });
            }
        }
        catch (error) {
            this.logger.warn(`Failed to generate embedding for KB entry ${entry.id}`);
        }
        return entry;
    }
    async search(query, category, limit = 10) {
        try {
            const embeddings = await this.aiService.embed([query]);
            if (embeddings.embeddings.length === 0)
                return [];
            const allEntries = await this.prisma.knowledgeBase.findMany({
                where: category ? { category } : {},
            });
            const scored = allEntries
                .filter((e) => e.embedding && e.embedding.length > 0)
                .map((e) => ({
                ...e,
                score: this.cosineSimilarity(embeddings.embeddings[0], e.embedding),
            }))
                .filter((e) => e.score > 0.5)
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);
            return scored;
        }
        catch (error) {
            this.logger.error(`KB search failed: ${error.message}`);
            return [];
        }
    }
    async findBySource(source, sourceType) {
        return this.prisma.knowledgeBase.findMany({
            where: { source, sourceType },
            orderBy: { version: 'desc' },
        });
    }
    async verifyEntry(id, userId) {
        return this.prisma.knowledgeBase.update({
            where: { id },
            data: { isVerified: true, verifiedBy: userId, verifiedAt: new Date() },
        });
    }
    async createVersion(id, newContent) {
        const original = await this.prisma.knowledgeBase.findUnique({ where: { id } });
        if (!original)
            throw new Error('Entry not found');
        return this.addEntry({
            title: original.title,
            content: newContent,
            source: original.source,
            sourceType: original.sourceType,
            category: original.category,
            tags: original.tags,
            metadata: original.metadata,
        });
    }
    async getStats() {
        const entries = await this.prisma.knowledgeBase.findMany();
        const categories = {};
        entries.forEach((e) => {
            if (e.category)
                categories[e.category] = (categories[e.category] || 0) + 1;
        });
        return {
            total: entries.length,
            verified: entries.filter((e) => e.isVerified).length,
            categories,
        };
    }
    cosineSimilarity(a, b) {
        const dot = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
        const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
        return dot / (magA * magB || 1);
    }
};
exports.KnowledgeBaseService = KnowledgeBaseService;
exports.KnowledgeBaseService = KnowledgeBaseService = KnowledgeBaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService,
        rag_service_1.RAGService])
], KnowledgeBaseService);
//# sourceMappingURL=knowledge-base.service.js.map