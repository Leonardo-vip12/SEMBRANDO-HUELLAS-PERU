"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalProvider = void 0;
const ai_provider_interface_1 = require("./ai-provider.interface");
class LocalProvider {
    constructor(config) {
        this.type = ai_provider_interface_1.AIProviderType.LOCAL;
        this.initialized = false;
        this.config = {
            apiKey: config?.apiKey || '',
            baseUrl: config?.baseUrl || 'http://localhost:11434',
            defaultModel: config?.defaultModel || 'llama3',
            maxRetries: config?.maxRetries ?? 1,
            timeout: config?.timeout ?? 120000,
        };
    }
    async initialize() {
        this.initialized = true;
    }
    async chat(messages, options) {
        const start = Date.now();
        const prompt = messages.map((m) => `${m.role}: ${m.content}`).join('\n') + '\nassistant: ';
        const response = await this.queryOllama(prompt, options);
        const content = typeof response === 'string' ? response : JSON.stringify(response);
        return {
            content: content.trim(),
            model: this.config.defaultModel,
            provider: this.type,
            tokensUsed: 0,
            promptTokens: 0,
            completionTokens: 0,
            latencyMs: Date.now() - start,
            cost: 0,
        };
    }
    async *chatStream(messages, _options) {
        const prompt = messages.map((m) => `${m.role}: ${m.content}`).join('\n') + '\nassistant: ';
        const response = await fetch(`${this.config.baseUrl}/api/generate`, {
            method: 'POST',
            body: JSON.stringify({ model: this.config.defaultModel, prompt, stream: true }),
        });
        const reader = response.body?.getReader();
        if (!reader)
            return;
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            const lines = decoder.decode(value).split('\n').filter(Boolean);
            for (const line of lines) {
                try {
                    const json = JSON.parse(line);
                    if (json.response)
                        yield json.response;
                }
                catch { }
            }
        }
    }
    async embed(texts) {
        const start = Date.now();
        const embeddings = [];
        for (const text of texts) {
            const response = await fetch(`${this.config.baseUrl}/api/embeddings`, {
                method: 'POST',
                body: JSON.stringify({ model: this.config.defaultModel, prompt: text }),
            });
            const data = await response.json();
            embeddings.push(data.embedding || []);
        }
        return {
            embeddings,
            model: this.config.defaultModel,
            provider: this.type,
            tokensUsed: 0,
            latencyMs: Date.now() - start,
        };
    }
    async analyzeImage(_imageBuffer, _mimeType, prompt) {
        return { description: `[Local model - image analysis not available] ${prompt}`, labels: [], objects: [] };
    }
    isAvailable() {
        return true;
    }
    getModel() {
        return this.config.defaultModel;
    }
    async queryOllama(prompt, options) {
        const response = await fetch(`${this.config.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: options?.model || this.config.defaultModel,
                prompt,
                options: { temperature: options?.temperature ?? 0.7, num_predict: options?.maxTokens },
            }),
        });
        const data = await response.json();
        return data.response || '';
    }
}
exports.LocalProvider = LocalProvider;
//# sourceMappingURL=local.provider.js.map