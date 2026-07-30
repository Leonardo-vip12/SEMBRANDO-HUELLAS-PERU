"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIProviderFactory = void 0;
const ai_provider_interface_1 = require("./ai-provider.interface");
const openai_provider_1 = require("./openai.provider");
const gemini_provider_1 = require("./gemini.provider");
const claude_provider_1 = require("./claude.provider");
const local_provider_1 = require("./local.provider");
class AIProviderFactory {
    static createProvider(type, config) {
        switch (type) {
            case ai_provider_interface_1.AIProviderType.OPENAI:
                return new openai_provider_1.OpenAIProvider(config);
            case ai_provider_interface_1.AIProviderType.GEMINI:
                return new gemini_provider_1.GeminiProvider(config);
            case ai_provider_interface_1.AIProviderType.CLAUDE:
                return new claude_provider_1.ClaudeProvider(config);
            case ai_provider_interface_1.AIProviderType.LOCAL:
                return new local_provider_1.LocalProvider(config);
            default:
                throw new Error(`Unknown AI provider type: ${type}`);
        }
    }
    static createDefaultProvider() {
        const envProvider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
        switch (envProvider) {
            case 'openai':
                return new openai_provider_1.OpenAIProvider({});
            case 'gemini':
                return new gemini_provider_1.GeminiProvider({});
            case 'claude':
                return new claude_provider_1.ClaudeProvider({});
            case 'local':
                return new local_provider_1.LocalProvider({});
            default:
                return new openai_provider_1.OpenAIProvider({});
        }
    }
}
exports.AIProviderFactory = AIProviderFactory;
//# sourceMappingURL=provider-factory.js.map