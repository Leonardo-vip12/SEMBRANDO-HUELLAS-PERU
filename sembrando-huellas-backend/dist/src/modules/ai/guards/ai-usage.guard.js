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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiUsageGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AiUsageGuard = class AiUsageGuard {
    constructor(configService) {
        this.configService = configService;
        this.dailyQueries = new Map();
        this.lastReset = Date.now();
    }
    canActivate(context) {
        this.resetIfNeeded();
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id || 'anonymous';
        const limit = this.configService.get('ai.rateLimit', 100);
        const current = this.dailyQueries.get(userId) || 0;
        if (current >= limit) {
            throw new common_1.HttpException('Límite de consultas IA diarias alcanzado', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        this.dailyQueries.set(userId, current + 1);
        return true;
    }
    resetIfNeeded() {
        if (Date.now() - this.lastReset > 24 * 60 * 60 * 1000) {
            this.dailyQueries.clear();
            this.lastReset = Date.now();
        }
    }
};
exports.AiUsageGuard = AiUsageGuard;
exports.AiUsageGuard = AiUsageGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiUsageGuard);
//# sourceMappingURL=ai-usage.guard.js.map