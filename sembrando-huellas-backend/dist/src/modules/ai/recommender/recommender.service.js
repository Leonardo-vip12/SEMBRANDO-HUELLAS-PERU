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
var RecommenderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommenderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const ai_service_1 = require("../ai.service");
let RecommenderService = RecommenderService_1 = class RecommenderService {
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
        this.logger = new common_1.Logger(RecommenderService_1.name);
    }
    async recommend(query, limit = 6) {
        try {
            const embedding = await this.aiService.embed([query]);
            if (!embedding.embeddings.length)
                return this.fallback(query, limit);
            const vectorResults = await this.searchAllCollections(embedding.embeddings[0], limit);
            return vectorResults;
        }
        catch (error) {
            this.logger.error(`Recommendation failed: ${error.message}`);
            return this.fallback(query, limit);
        }
    }
    async recommendForItem(itemId, itemType, limit = 4) {
        let content = '';
        switch (itemType) {
            case 'species': {
                const s = await this.prisma.species.findUnique({ where: { id: itemId } });
                if (s)
                    content = `${s.name} ${s.description || ''}`;
                break;
            }
            case 'news': {
                const n = await this.prisma.news.findUnique({ where: { id: itemId } });
                if (n)
                    content = `${n.title} ${n.excerpt || ''}`;
                break;
            }
            case 'program': {
                const p = await this.prisma.program.findUnique({ where: { id: itemId } });
                if (p)
                    content = `${p.title} ${p.description || ''}`;
                break;
            }
        }
        if (!content)
            return [];
        return this.recommend(content, limit);
    }
    async searchAllCollections(embedding, limit) {
        const { VectorStoreFactory } = await Promise.resolve().then(() => require('../vector-store/vector-store.factory'));
        const store = VectorStoreFactory.create();
        const results = await store.search(embedding, undefined, limit, 0.5);
        return results.map((r) => ({
            type: r.document.collection,
            id: r.document.id.replace(/^[a-z]+-/, ''),
            title: r.document.content.slice(0, 100),
            description: r.document.content.slice(0, 200),
            score: r.score,
            reason: 'Contenido relacionado',
        }));
    }
    async fallback(query, limit) {
        const results = [];
        const species = await this.prisma.species.findMany({
            take: limit,
            where: { description: { contains: query, mode: 'insensitive' } },
        });
        species.forEach((s) => results.push({
            type: 'species',
            id: s.id,
            title: s.name,
            description: s.description || '',
            score: 0.5,
            reason: 'Coincidencia de búsqueda',
        }));
        return results.slice(0, limit);
    }
};
exports.RecommenderService = RecommenderService;
exports.RecommenderService = RecommenderService = RecommenderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], RecommenderService);
//# sourceMappingURL=recommender.service.js.map