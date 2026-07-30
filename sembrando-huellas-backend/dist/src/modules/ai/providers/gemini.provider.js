"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const ai_provider_interface_1 = require("./ai-provider.interface");
class GeminiProvider {
    constructor(config) {
        this.type = ai_provider_interface_1.AIProviderType.GEMINI;
        this.initialized = false;
        this.config = {
            apiKey: config?.apiKey || process.env.GEMINI_API_KEY || '',
            baseUrl: config?.baseUrl || 'https://generativelanguage.googleapis.com/v1beta',
            defaultModel: config?.defaultModel || 'gemini-2.0-flash',
            maxRetries: config?.maxRetries ?? 3,
            timeout: config?.timeout ?? 60000,
        };
    }
    async initialize() {
        const { GoogleGenerativeAI } = await Promise.resolve().then(() => require('@google/generative-ai'));
        const genAI = new GoogleGenerativeAI(this.config.apiKey || '');
        this.client = genAI.getGenerativeModel({ model: this.config.defaultModel });
        this.initialized = true;
    }
    async chat(messages, options) {
        await this.ensureInitialized();
        const start = Date.now();
        const systemMsg = messages.find((m) => m.role === 'system');
        const history = messages
            .filter((m) => m.role !== 'system')
            .slice(0, -1)
            .map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));
        const lastUserMsg = messages.filter((m) => m.role !== 'system').pop();
        const chat = this.client.startChat({
            history,
            systemInstruction: systemMsg ? { parts: [{ text: systemMsg.content }] } : undefined,
            generationConfig: {
                temperature: options?.temperature ?? 0.7,
                maxOutputTokens: options?.maxTokens,
            },
        });
        const result = await chat.sendMessage(lastUserMsg?.content || '');
        const response = result.response;
        const content = response.text();
        return {
            content,
            model: this.config.defaultModel,
            provider: this.type,
            tokensUsed: 0,
            promptTokens: 0,
            completionTokens: 0,
            latencyMs: Date.now() - start,
            cost: 0,
        };
    }
    async *chatStream(messages, options) {
        await this.ensureInitialized();
        const lastMsg = messages[messages.length - 1];
        const result = await this.client.generateContentStream(lastMsg?.content || '');
        for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text)
                yield text;
        }
    }
    async embed(texts) {
        const start = Date.now();
        const embeddings = [];
        for (const text of texts) {
            const result = await this.client.embedContent(text);
            embeddings.push(result.embedding.values);
        }
        return {
            embeddings,
            model: this.config.defaultModel,
            provider: this.type,
            tokensUsed: 0,
            latencyMs: Date.now() - start,
        };
    }
    async analyzeImage(imageBuffer, mimeType, prompt) {
        await this.ensureInitialized();
        const base64 = imageBuffer.toString('base64');
        const result = await this.client.generateContent([{ text: prompt }, { inlineData: { mimeType, data: base64 } }]);
        const content = result.response.text();
        return { description: content, labels: [], objects: [] };
    }
    isAvailable() {
        return !!this.config.apiKey;
    }
    getModel() {
        return this.config.defaultModel;
    }
    async ensureInitialized() {
        if (!this.initialized)
            await this.initialize();
    }
}
exports.GeminiProvider = GeminiProvider;
//# sourceMappingURL=gemini.provider.js.map