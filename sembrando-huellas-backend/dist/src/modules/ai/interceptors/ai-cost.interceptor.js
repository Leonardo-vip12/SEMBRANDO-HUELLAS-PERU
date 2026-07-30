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
exports.AiCostInterceptor = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let AiCostInterceptor = class AiCostInterceptor {
    constructor(configService) {
        this.configService = configService;
        this.totalCost = 0;
        this.lastReset = Date.now();
    }
    intercept(context, next) {
        this.resetIfNeeded();
        return next.handle().pipe((0, rxjs_1.tap)((response) => {
            if (response?.cost) {
                this.totalCost += response.cost;
                const limit = this.configService.get('ai.costLimit', 50);
                if (this.totalCost > limit) {
                    throw new common_1.HttpException('Límite de costos IA diario alcanzado', common_1.HttpStatus.TOO_MANY_REQUESTS);
                }
            }
        }));
    }
    resetIfNeeded() {
        if (Date.now() - this.lastReset > 24 * 60 * 60 * 1000) {
            this.totalCost = 0;
            this.lastReset = Date.now();
        }
    }
};
exports.AiCostInterceptor = AiCostInterceptor;
exports.AiCostInterceptor = AiCostInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiCostInterceptor);
//# sourceMappingURL=ai-cost.interceptor.js.map