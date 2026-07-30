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
var AiGatewayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiGatewayService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ai_provider_interface_1 = require("../../ai/providers/ai-provider.interface");
const provider_factory_1 = require("../../ai/providers/provider-factory");
let AiGatewayService = AiGatewayService_1 = class AiGatewayService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(AiGatewayService_1.name);
        this.providers = new Map();
        this.FAILURE_THRESHOLD = 3;
        this.COOLDOWN_MS = 60000;
        this.activeProvider = (this.configService.get('AI_PROVIDER') || 'openai');
    }
    async initialize() {
        const types = Object.values(ai_provider_interface_1.AIProviderType);
        for (const type of types) {
            try {
                const provider = provider_factory_1.AIProviderFactory.createProvider(type);
                if (provider.isAvailable()) {
                    await provider.initialize();
                    this.providers.set(type, { provider, type, weight: 1, failures: 0, lastFailure: 0 });
                    this.logger.log(`Gateway: ${type} initialized (${provider.getModel()})`);
                }
            }
            catch (error) {
                this.logger.warn(`Gateway: ${type} failed to initialize: ${error.message}`);
            }
        }
    }
    async chat(messages, options) {
        const targetType = options?.requireProvider;
        if (targetType) {
            const instance = this.providers.get(targetType);
            if (instance && this.isHealthy(instance)) {
                return this.executeWithRetry(instance, messages, options);
            }
            throw new Error(`Provider ${targetType} not available`);
        }
        const ordered = this.getOrderedProviders();
        const errors = [];
        for (const instance of ordered) {
            if (!this.isHealthy(instance))
                continue;
            try {
                return await this.executeWithRetry(instance, messages, options);
            }
            catch (error) {
                this.recordFailure(instance);
                errors.push(`${instance.type}: ${error.message}`);
            }
        }
        throw new Error(`All AI providers failed: ${errors.join('; ')}`);
    }
    async embed(texts, options) {
        const provider = options?.provider || this.activeProvider;
        const instance = this.providers.get(provider);
        if (!instance || !this.isHealthy(instance))
            throw new Error(`Provider ${provider} not available for embeddings`);
        return instance.provider.embed(texts);
    }
    getActiveProvider() {
        return this.providers.get(this.activeProvider)?.provider;
    }
    getProviderStatus() {
        return Array.from(this.providers.values()).map((i) => ({
            type: i.type,
            model: i.provider.getModel(),
            available: i.provider.isAvailable(),
            healthy: this.isHealthy(i),
            failures: i.failures,
            weight: i.weight,
        }));
    }
    setActiveProvider(type) {
        if (this.providers.has(type)) {
            this.activeProvider = type;
            this.logger.log(`Gateway: Active provider changed to ${type}`);
        }
    }
    isHealthy(instance) {
        if (instance.failures < this.FAILURE_THRESHOLD)
            return true;
        return Date.now() - instance.lastFailure > this.COOLDOWN_MS;
    }
    recordFailure(instance) {
        instance.failures++;
        instance.lastFailure = Date.now();
        instance.weight = Math.max(0.1, instance.weight - 0.2);
        this.logger.warn(`Gateway: ${instance.type} failure #${instance.failures}`);
    }
    getOrderedProviders() {
        return Array.from(this.providers.values())
            .filter((p) => p.provider.isAvailable())
            .sort((a, b) => {
            if (a.type === this.activeProvider)
                return -1;
            if (b.type === this.activeProvider)
                return 1;
            return b.weight - a.weight;
        });
    }
    async executeWithRetry(instance, messages, options) {
        const maxRetries = 2;
        let lastError;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const result = await instance.provider.chat(messages, options);
                instance.failures = Math.max(0, instance.failures - 1);
                instance.weight = Math.min(1, instance.weight + 0.05);
                return result;
            }
            catch (error) {
                lastError = error;
                if (attempt < maxRetries - 1) {
                    await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
                }
            }
        }
        throw lastError || new Error('Max retries exceeded');
    }
};
exports.AiGatewayService = AiGatewayService;
exports.AiGatewayService = AiGatewayService = AiGatewayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiGatewayService);
//# sourceMappingURL=ai-gateway.service.js.map