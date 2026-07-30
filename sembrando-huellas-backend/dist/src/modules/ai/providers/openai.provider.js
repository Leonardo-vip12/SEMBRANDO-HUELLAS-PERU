"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const ai_provider_interface_1 = require("./ai-provider.interface");
class OpenAIProvider {
    constructor(config) {
        this.type = ai_provider_interface_1.AIProviderType.OPENAI;
        this.initialized = false;
        this.config = {
            apiKey: config?.apiKey || process.env.OPENAI_API_KEY || '',
            baseUrl: config?.baseUrl || 'https://api.openai.com/v1',
            defaultModel: config?.defaultModel || 'gpt-4o',
            maxRetries: config?.maxRetries ?? 3,
            timeout: config?.timeout ?? 60000,
        };
    }
    async initialize() {
        const { default: OpenAI } = await Promise.resolve().then(() => require('openai'));
        this.client = new OpenAI({
            apiKey: this.config.apiKey,
            baseURL: this.config.baseUrl,
            timeout: this.config.timeout,
            maxRetries: this.config.maxRetries,
        });
        this.initialized = true;
    }
    async chat(messages, options) {
        await this.ensureInitialized();
        const start = Date.now();
        const response = await this.client.chat.completions.create({
            model: options?.model || this.config.defaultModel,
            messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens,
            stream: false,
        });
        const result = response.choices[0];
        return {
            content: result.message.content || '',
            model: response.model,
            provider: this.type,
            tokensUsed: response.usage?.total_tokens || 0,
            promptTokens: response.usage?.prompt_tokens || 0,
            completionTokens: response.usage?.completion_tokens || 0,
            latencyMs: Date.now() - start,
            cost: this.estimateCost(response.model, response.usage?.prompt_tokens || 0, response.usage?.completion_tokens || 0),
        };
    }
    async *chatStream(messages, options) {
        await this.ensureInitialized();
        const stream = await this.client.chat.completions.create({
            model: options?.model || this.config.defaultModel,
            messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens,
            stream: true,
        });
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content)
                yield content;
        }
    }
    async embed(texts) {
        await this.ensureInitialized();
        const start = Date.now();
        const response = await this.client.embeddings.create({
            model: 'text-embedding-3-small',
            input: texts,
        });
        return {
            embeddings: response.data.map((d) => d.embedding),
            model: response.model,
            provider: this.type,
            tokensUsed: response.usage?.total_tokens || 0,
            latencyMs: Date.now() - start,
        };
    }
    async analyzeImage(imageBuffer, mimeType, prompt) {
        await this.ensureInitialized();
        const base64 = imageBuffer.toString('base64');
        const dataUrl = `data:${mimeType};base64,${base64}`;
        const response = await this.client.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        { type: 'image_url', image_url: { url: dataUrl } },
                    ],
                },
            ],
            max_tokens: 1000,
        });
        const content = response.choices[0]?.message?.content || '';
        return this.parseImageAnalysis(content);
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
    parseImageAnalysis(content) {
        return {
            description: content,
            labels: [],
            objects: [],
        };
    }
    estimateCost(model, promptTokens, completionTokens) {
        const rates = {
            'gpt-4o': [2.5 / 1_000_000, 10 / 1_000_000],
            'gpt-4o-mini': [0.15 / 1_000_000, 0.6 / 1_000_000],
        };
        const [promptRate, completionRate] = rates[model] || [2.5 / 1_000_000, 10 / 1_000_000];
        return promptTokens * promptRate + completionTokens * completionRate;
    }
}
exports.OpenAIProvider = OpenAIProvider;
//# sourceMappingURL=openai.provider.js.map