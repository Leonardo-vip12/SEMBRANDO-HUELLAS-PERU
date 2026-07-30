"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryVectorStore = void 0;
function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB || 1);
}
class MemoryVectorStore {
    constructor() {
        this.name = 'memory';
        this.documents = [];
        this.initialized = false;
    }
    async initialize() {
        this.initialized = true;
    }
    async upsert(documents) {
        for (const doc of documents) {
            const idx = this.documents.findIndex((d) => d.id === doc.id);
            if (idx >= 0)
                this.documents[idx] = doc;
            else
                this.documents.push(doc);
        }
    }
    async search(embedding, collection, limit = 10, threshold = 0.7) {
        let candidates = this.documents;
        if (collection)
            candidates = candidates.filter((d) => d.collection === collection);
        if (!embedding || embedding.length === 0)
            return candidates.slice(0, limit).map((d) => ({ document: d, score: 0 }));
        const scored = candidates
            .filter((d) => d.embedding)
            .map((d) => ({ document: d, score: cosineSimilarity(embedding, d.embedding) }))
            .filter((r) => r.score >= threshold)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
        return scored;
    }
    async delete(ids) {
        this.documents = this.documents.filter((d) => !ids.includes(d.id));
    }
    async clearCollection(collection) {
        this.documents = this.documents.filter((d) => d.collection !== collection);
    }
    isAvailable() {
        return this.initialized;
    }
}
exports.MemoryVectorStore = MemoryVectorStore;
//# sourceMappingURL=memory.store.js.map