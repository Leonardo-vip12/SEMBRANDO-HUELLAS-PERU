"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorStoreFactory = void 0;
const memory_store_1 = require("./memory.store");
class VectorStoreFactory {
    static create(type) {
        if (this.instance)
            return this.instance;
        const storeType = type || process.env.VECTOR_STORE || 'memory';
        switch (storeType) {
            case 'pgvector':
                throw new Error('pgvector support not yet implemented. Set VECTOR_STORE=memory or implement PgVectorStore.');
            case 'qdrant':
                throw new Error('Qdrant support not yet implemented. Set VECTOR_STORE=memory or implement QdrantStore.');
            case 'memory':
            default:
                this.instance = new memory_store_1.MemoryVectorStore();
                this.instance.initialize();
                return this.instance;
        }
    }
    static resetInstance() {
        this.instance = undefined;
    }
}
exports.VectorStoreFactory = VectorStoreFactory;
//# sourceMappingURL=vector-store.factory.js.map