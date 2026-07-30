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
var AiConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AiConfigService = AiConfigService_1 = class AiConfigService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(AiConfigService_1.name);
    }
    getConfig() {
        return {
            activeProvider: this.configService.get('ai.provider', 'openai'),
            providers: {
                openai: {
                    available: !!this.configService.get('OPENAI_API_KEY'),
                    model: this.configService.get('ai.openai.model', 'gpt-4o'),
                    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
                },
                gemini: {
                    available: !!this.configService.get('GEMINI_API_KEY'),
                    model: this.configService.get('ai.gemini.model', 'gemini-2.0-flash'),
                    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
                },
                claude: {
                    available: !!this.configService.get('ANTHROPIC_API_KEY'),
                    model: this.configService.get('ai.claude.model', 'claude-3-5-sonnet-20241022'),
                    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
                },
                local: {
                    available: true,
                    model: this.configService.get('ai.local.model', 'llama3'),
                    models: ['llama3', 'mistral', 'phi3'],
                },
            },
            defaultTemperature: this.configService.get('ai.temperature', 0.7),
            maxTokens: this.configService.get('ai.maxTokens', 4096),
            costLimit: this.configService.get('ai.costLimit', 50),
        };
    }
    updateConfig(_updates) {
        return { success: false, message: 'La configuración solo puede modificarse a través de variables de entorno.' };
    }
};
exports.AiConfigService = AiConfigService;
exports.AiConfigService = AiConfigService = AiConfigService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiConfigService);
//# sourceMappingURL=ai-config.service.js.map