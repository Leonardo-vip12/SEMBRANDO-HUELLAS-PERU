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
var RagV2Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagV2Service = void 0;
const common_1 = require("@nestjs/common");
const rag_service_1 = require("../../ai/rag/rag.service");
const ai_service_1 = require("../../ai/ai.service");
const prisma_service_1 = require("../../../prisma/prisma.service");
const knowledge_base_service_1 = require("../knowledge-base/knowledge-base.service");
let RagV2Service = RagV2Service_1 = class RagV2Service {
    constructor(ragService, aiService, prisma, kbService) {
        this.ragService = ragService;
        this.aiService = aiService;
        this.prisma = prisma;
        this.kbService = kbService;
        this.logger = new common_1.Logger(RagV2Service_1.name);
    }
    async search(query, collection, limit = 10, threshold = 0.7) {
        return this.ragService.searchSimilar(query, collection, limit, threshold);
    }
    async indexAll() {
        return this.ragService.indexAllContent();
    }
    async indexCollection(collection) {
        let indexed = 0;
        let failed = 0;
        const getData = () => {
            switch (collection) {
                case 'news':
                    return this.prisma.news.findMany({ select: { id: true, title: true, excerpt: true, content: true } });
                case 'species':
                    return this.prisma.species.findMany({ select: { id: true, name: true, description: true } });
                case 'programs':
                    return this.prisma.program.findMany({ select: { id: true, title: true, description: true } });
                case 'faq':
                    return this.prisma.faq.findMany({ select: { id: true, question: true, answer: true } });
                case 'resources':
                    return this.prisma.resource.findMany({ select: { id: true, title: true, description: true } });
                case 'projects':
                    return this.prisma.project.findMany({ select: { id: true, name: true, description: true } });
                default:
                    return null;
            }
        };
        const data = await getData();
        if (!data)
            throw new Error(`Collection '${collection}' not recognized`);
        for (const item of data) {
            try {
                const content = Object.values(item)
                    .filter((v) => typeof v === 'string')
                    .join('. ');
                await this.ragService.indexDocument({
                    id: `${collection}-${item.id}`,
                    content,
                    source: item.id,
                    collection,
                    metadata: item,
                });
                indexed++;
            }
            catch {
                failed++;
            }
        }
        return { collection, indexed, failed };
    }
    async getStats() {
        const kbStats = await this.kbService.getStats();
        const collections = ['news', 'species', 'programs', 'faq', 'resources', 'projects'];
        return {
            vectorStore: {
                totalDocuments: kbStats.total,
                collections,
            },
            knowledgeBase: kbStats,
        };
    }
    async searchKnowledgeBase(query, category, limit = 10) {
        return this.kbService.search(query, category, limit);
    }
};
exports.RagV2Service = RagV2Service;
exports.RagV2Service = RagV2Service = RagV2Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rag_service_1.RAGService,
        ai_service_1.AiService,
        prisma_service_1.PrismaService,
        knowledge_base_service_1.KnowledgeBaseService])
], RagV2Service);
//# sourceMappingURL=rag-v2.service.js.map