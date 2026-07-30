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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ai_provider_interface_1 = require("./providers/ai-provider.interface");
const provider_factory_1 = require("./providers/provider-factory");
const ai_query_log_service_1 = require("./admin/ai-query-log.service");
let AiService = AiService_1 = class AiService {
    constructor(configService, queryLogService) {
        this.configService = configService;
        this.queryLogService = queryLogService;
        this.logger = new common_1.Logger(AiService_1.name);
        this.providers = new Map();
        this.activeProvider =
            this.configService.get('ai.provider', 'openai') || ai_provider_interface_1.AIProviderType.OPENAI;
    }
    async onModuleInit() {
        await this.initializeProviders();
    }
    async initializeProviders() {
        const providerTypes = Object.values(ai_provider_interface_1.AIProviderType);
        for (const type of providerTypes) {
            try {
                const provider = provider_factory_1.AIProviderFactory.createProvider(type);
                if (provider.isAvailable()) {
                    await provider.initialize();
                    this.providers.set(type, provider);
                    this.logger.log(`Provider initialized: ${type} (model: ${provider.getModel()})`);
                }
            }
            catch (error) {
                this.logger.warn(`Failed to initialize provider ${type}: ${error.message}`);
            }
        }
    }
    getProvider(type) {
        if (type)
            return this.providers.get(type);
        return this.providers.get(this.activeProvider) || this.providers.values().next().value;
    }
    getAllProviders() {
        return Array.from(this.providers.values());
    }
    getActiveProvider() {
        return this.getProvider();
    }
    setActiveProvider(type) {
        if (this.providers.has(type)) {
            this.activeProvider = type;
            this.logger.log(`Active provider changed to: ${type}`);
        }
    }
    getActiveProviderType() {
        return this.activeProvider;
    }
    async chat(messages, options) {
        const provider = this.getProvider(options?.provider);
        if (!provider)
            throw new Error('No AI provider available');
        const start = Date.now();
        try {
            const result = await provider.chat(messages, options);
            await this.logQuery({
                feature: options?.feature || 'chat',
                query: messages[messages.length - 1]?.content || '',
                provider: provider.type,
                model: result.model,
                tokensUsed: result.tokensUsed,
                cost: result.cost,
                latencyMs: result.latencyMs,
                success: true,
                userId: options?.userId,
            });
            return result;
        }
        catch (error) {
            const latencyMs = Date.now() - start;
            await this.logQuery({
                feature: options?.feature || 'chat',
                query: messages[messages.length - 1]?.content || '',
                provider: provider.type,
                model: options?.model || provider.getModel(),
                tokensUsed: 0,
                cost: 0,
                latencyMs,
                success: false,
                userId: options?.userId,
                error: error.message,
            });
            throw error;
        }
    }
    async embed(texts, options) {
        const provider = this.getProvider(options?.provider);
        if (!provider)
            throw new Error('No AI provider available for embeddings');
        return provider.embed(texts);
    }
    async analyzeImage(imageBuffer, mimeType, prompt, options) {
        const provider = this.getProvider(options?.provider);
        if (!provider)
            throw new Error('No AI provider available');
        return provider.analyzeImage(imageBuffer, mimeType, prompt);
    }
    isAnyProviderAvailable() {
        return this.providers.size > 0;
    }
    async logQuery(params) {
        try {
            await this.queryLogService.log(params);
        }
        catch (error) {
            this.logger.error(`Failed to log AI query: ${error.message}`);
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        ai_query_log_service_1.AiQueryLogService])
], AiService);
//# sourceMappingURL=ai.service.js.map