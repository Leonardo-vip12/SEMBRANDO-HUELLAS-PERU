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
var RAGService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const ai_service_1 = require("../ai.service");
let RAGService = RAGService_1 = class RAGService {
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
        this.logger = new common_1.Logger(RAGService_1.name);
    }
    async indexDocument(document) {
        try {
            const embeddings = await this.aiService.embed([document.content]);
            if (embeddings.embeddings.length > 0) {
                const doc = { ...document, embedding: embeddings.embeddings[0] };
                await this.saveToVectorStore(doc);
            }
        }
        catch (error) {
            this.logger.error(`Failed to index document ${document.id}: ${error.message}`);
        }
    }
    async searchSimilar(query, collection, limit = 10, threshold = 0.7) {
        try {
            const embeddings = await this.aiService.embed([query]);
            if (embeddings.embeddings.length === 0)
                return [];
            const queryEmbedding = embeddings.embeddings[0];
            return this.searchVectorStore(queryEmbedding, collection, limit, threshold);
        }
        catch (error) {
            this.logger.error(`Failed to search: ${error.message}`);
            return [];
        }
    }
    async indexAllContent() {
        let indexed = 0;
        let failed = 0;
        const collections = [
            {
                name: 'news',
                data: await this.prisma.news.findMany({ select: { id: true, title: true, excerpt: true, content: true } }),
            },
            {
                name: 'species',
                data: await this.prisma.species.findMany({ select: { id: true, name: true, description: true } }),
            },
            {
                name: 'programs',
                data: await this.prisma.program.findMany({ select: { id: true, title: true, description: true } }),
            },
            { name: 'faq', data: await this.prisma.faq.findMany({ select: { id: true, question: true, answer: true } }) },
        ];
        for (const { name, data } of collections) {
            for (const item of data) {
                try {
                    const content = Object.values(item)
                        .filter((v) => typeof v === 'string')
                        .join('. ');
                    const doc = {
                        id: `${name}-${item.id}`,
                        content,
                        source: item.id,
                        collection: name,
                        metadata: item,
                    };
                    await this.indexDocument(doc);
                    indexed++;
                }
                catch {
                    failed++;
                }
            }
        }
        return { indexed, failed };
    }
    async saveToVectorStore(document) {
        const { VectorStoreFactory } = await Promise.resolve().then(() => require('../vector-store/vector-store.factory'));
        const store = VectorStoreFactory.create();
        await store.upsert([document]);
    }
    async searchVectorStore(embedding, collection, limit = 10, threshold = 0.7) {
        const { VectorStoreFactory } = await Promise.resolve().then(() => require('../vector-store/vector-store.factory'));
        const store = VectorStoreFactory.create();
        return store.search(embedding, collection, limit, threshold);
    }
};
exports.RAGService = RAGService;
exports.RAGService = RAGService = RAGService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], RAGService);
//# sourceMappingURL=rag.service.js.map