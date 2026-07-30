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
var AnalyticsV2Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsV2Service = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let AnalyticsV2Service = AnalyticsV2Service_1 = class AnalyticsV2Service {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AnalyticsV2Service_1.name);
    }
    async getDashboard() {
        const [totalQueries, totalIdentifications, totalDocuments, totalActivities, totalObservations, totalCertificates, totalKnowledgeEntries, speciesStats, queryStats, activeUsers, recentActivity,] = await Promise.all([
            this.getTotalQueries(),
            this.getTotalIdentifications(),
            this.getTotalDocuments(),
            this.getTotalActivities(),
            this.getTotalObservations(),
            this.getTotalCertificates(),
            this.getTotalKnowledgeEntries(),
            this.getTopSpecies(),
            this.getQueryStats(),
            this.getActiveUsers(),
            this.getRecentActivity(),
        ]);
        return {
            overview: {
                totalQueries,
                totalIdentifications,
                totalDocuments,
                totalActivities,
                totalObservations,
                totalCertificates,
                totalKnowledgeEntries,
            },
            speciesStats,
            queryStats,
            activeUsers,
            recentActivity,
        };
    }
    async getFullReport(startDate, endDate) {
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();
        const [queries, identifications, observations, documents, activities, certificates, queriesByDay, identificationsByDay, topSpecies, topTopics,] = await Promise.all([
            this.countInRange('aiQueryLog', start, end),
            this.countInRange('speciesIdentification', start, end),
            this.countInRange('biodiversityObservation', start, end),
            this.countInRange('documentAnalysis', start, end),
            this.countInRange('activityPlan', start, end),
            this.countInRange('issuedCertificate', start, end),
            this.getDailyCounts('aiQueryLog', start, end),
            this.getDailyCounts('speciesIdentification', start, end),
            this.getTopSpecies(10),
            this.getTopTopics(10),
        ]);
        return {
            period: { start: start.toISOString(), end: end.toISOString() },
            totals: { queries, identifications, observations, documents, activities, certificates },
            trends: { queriesByDay, identificationsByDay },
            topSpecies,
            topTopics,
        };
    }
    async getAIMetrics() {
        const logs = await this.prisma.aiQueryLog.findMany({ orderBy: { createdAt: 'desc' } });
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const queriesByFeature = {};
        const queriesByProvider = {};
        let totalTokens = 0;
        let totalCost = 0;
        let totalLatency = 0;
        let errors24h = 0;
        const activeUsers24h = new Set();
        for (const log of logs) {
            queriesByFeature[log.feature] = (queriesByFeature[log.feature] || 0) + 1;
            queriesByProvider[log.provider] = (queriesByProvider[log.provider] || 0) + 1;
            totalTokens += log.tokensUsed;
            totalCost += log.cost;
            totalLatency += log.latencyMs;
            if (new Date(log.createdAt) > last24h) {
                if (!log.success)
                    errors24h++;
                if (log.userId)
                    activeUsers24h.add(log.userId);
            }
        }
        return {
            totalQueries: logs.length,
            totalTokens,
            totalCost,
            averageLatency: logs.length > 0 ? totalLatency / logs.length : 0,
            queriesByFeature,
            queriesByProvider,
            errorsLast24h: errors24h,
            activeUsers24h: activeUsers24h.size,
        };
    }
    async getTotalQueries() {
        return this.prisma.aiQueryLog.count();
    }
    async getTotalIdentifications() {
        return this.prisma.speciesIdentification.count();
    }
    async getTotalDocuments() {
        return this.prisma.documentAnalysis.count();
    }
    async getTotalActivities() {
        return this.prisma.activityPlan.count();
    }
    async getTotalObservations() {
        return this.prisma.biodiversityObservation.count();
    }
    async getTotalCertificates() {
        return this.prisma.issuedCertificate.count();
    }
    async getTotalKnowledgeEntries() {
        return this.prisma.knowledgeBase.count();
    }
    async getTopSpecies(limit = 10) {
        return this.prisma.speciesIdentification.groupBy({
            by: ['scientificName'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: limit,
        });
    }
    async getQueryStats() {
        const logs = await this.prisma.aiQueryLog.findMany({
            select: { feature: true, provider: true, createdAt: true },
        });
        const features = {};
        const providers = {};
        logs.forEach((l) => {
            features[l.feature] = (features[l.feature] || 0) + 1;
            providers[l.provider] = (providers[l.provider] || 0) + 1;
        });
        return { features, providers };
    }
    async getActiveUsers() {
        const logs = await this.prisma.aiQueryLog.findMany({
            where: { userId: { not: null } },
            select: { userId: true, createdAt: true },
            distinct: ['userId'],
        });
        const now = Date.now();
        return {
            total: logs.length,
            last24h: logs.filter((l) => now - new Date(l.createdAt).getTime() < 86400000).length,
            last7d: logs.filter((l) => now - new Date(l.createdAt).getTime() < 604800000).length,
        };
    }
    async getRecentActivity(limit = 10) {
        const types = [
            'aiQueryLog',
            'speciesIdentification',
            'documentAnalysis',
            'activityPlan',
            'biodiversityObservation',
        ];
        const results = [];
        for (const type of types) {
            const items = await this.prisma[type].findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, createdAt: true },
            });
            items.forEach((i) => results.push({ ...i, type }));
        }
        return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
    }
    async countInRange(model, start, end) {
        return this.prisma[model].count({
            where: { createdAt: { gte: start, lte: end } },
        });
    }
    async getDailyCounts(model, start, end) {
        const items = await this.prisma[model].findMany({
            where: { createdAt: { gte: start, lte: end } },
            select: { createdAt: true },
        });
        const counts = {};
        items.forEach((i) => {
            const date = i.createdAt.toISOString().slice(0, 10);
            counts[date] = (counts[date] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }
    async getTopTopics(limit = 10) {
        const logs = await this.prisma.aiQueryLog.findMany({
            select: { query: true },
            where: { query: { not: '' } },
        });
        const words = {};
        logs.forEach((l) => {
            const tokens = l.query
                .toLowerCase()
                .split(/\s+/)
                .filter((w) => w.length > 3);
            tokens.forEach((w) => {
                words[w] = (words[w] || 0) + 1;
            });
        });
        return Object.entries(words)
            .map(([topic, count]) => ({ topic, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
};
exports.AnalyticsV2Service = AnalyticsV2Service;
exports.AnalyticsV2Service = AnalyticsV2Service = AnalyticsV2Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsV2Service);
//# sourceMappingURL=analytics-v2.service.js.map