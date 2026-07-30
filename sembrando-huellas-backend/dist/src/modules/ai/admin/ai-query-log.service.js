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
var AiQueryLogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiQueryLogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let AiQueryLogService = AiQueryLogService_1 = class AiQueryLogService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AiQueryLogService_1.name);
    }
    async log(params) {
        try {
            await this.prisma.aiQueryLog.create({
                data: {
                    feature: params.feature,
                    query: params.query.slice(0, 1000),
                    provider: params.provider,
                    model: params.model,
                    tokensUsed: params.tokensUsed,
                    cost: params.cost,
                    latencyMs: params.latencyMs,
                    success: params.success,
                    userId: params.userId,
                    error: params.error,
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to save query log: ${error.message}`);
        }
    }
    async getStats() {
        const logs = await this.prisma.aiQueryLog.findMany({ orderBy: { createdAt: 'desc' } });
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const queriesByProvider = {};
        const tokensByProvider = {};
        const costByProvider = {};
        const modelCount = {};
        let totalLatency = 0;
        let errors24h = 0;
        const activeUsers = new Set();
        for (const log of logs) {
            queriesByProvider[log.provider] = (queriesByProvider[log.provider] || 0) + 1;
            tokensByProvider[log.provider] = (tokensByProvider[log.provider] || 0) + log.tokensUsed;
            costByProvider[log.provider] = (costByProvider[log.provider] || 0) + log.cost;
            modelCount[log.model] = (modelCount[log.model] || 0) + 1;
            totalLatency += log.latencyMs;
            if (new Date(log.createdAt) > last24h) {
                if (!log.success)
                    errors24h++;
                if (log.userId)
                    activeUsers.add(log.userId);
            }
        }
        const totalQueries = logs.length;
        const totalTokens = logs.reduce((s, l) => s + l.tokensUsed, 0);
        const totalCost = logs.reduce((s, l) => s + l.cost, 0);
        return {
            totalQueries,
            totalTokens,
            totalCost,
            queriesByProvider,
            tokensByProvider,
            costByProvider,
            averageLatency: totalQueries > 0 ? totalLatency / totalQueries : 0,
            topModels: Object.entries(modelCount)
                .map(([model, count]) => ({ model, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10),
            errorsLast24h: errors24h,
            activeUsers24h: activeUsers.size,
        };
    }
    async getLogs(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.aiQueryLog.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.aiQueryLog.count(),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
};
exports.AiQueryLogService = AiQueryLogService;
exports.AiQueryLogService = AiQueryLogService = AiQueryLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiQueryLogService);
//# sourceMappingURL=ai-query-log.service.js.map