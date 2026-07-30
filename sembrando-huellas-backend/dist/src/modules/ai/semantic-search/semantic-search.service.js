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
var SemanticSearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticSearchService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../ai.service");
const rag_service_1 = require("../rag/rag.service");
let SemanticSearchService = SemanticSearchService_1 = class SemanticSearchService {
    constructor(aiService, ragService) {
        this.aiService = aiService;
        this.ragService = ragService;
        this.logger = new common_1.Logger(SemanticSearchService_1.name);
    }
    async search(dto) {
        const collection = dto.collections?.join(',');
        const results = await this.ragService.searchSimilar(dto.query, collection, dto.limit || 10, dto.threshold || 0.5);
        return results.map((r) => ({
            id: r.document.id,
            content: r.document.content,
            source: r.document.source,
            collection: r.document.collection,
            score: r.score,
            metadata: r.document.metadata,
        }));
    }
    async hybridSearch(query, limit = 10) {
        const semanticResults = await this.search({ query, limit });
        if (semanticResults.length >= limit)
            return semanticResults.slice(0, limit);
        const existingIds = new Set(semanticResults.map((r) => r.id));
        const keywordResults = await this.keywordSearch(query, limit - semanticResults.length);
        const filtered = keywordResults.filter((r) => !existingIds.has(r.id));
        return [...semanticResults, ...filtered];
    }
    async keywordSearch(query, limit) {
        const results = [];
        const { PrismaService } = await Promise.resolve().then(() => require('../../../prisma/prisma.service'));
        return results;
    }
};
exports.SemanticSearchService = SemanticSearchService;
exports.SemanticSearchService = SemanticSearchService = SemanticSearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        rag_service_1.RAGService])
], SemanticSearchService);
//# sourceMappingURL=semantic-search.service.js.map