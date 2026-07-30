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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    async getContentByMonth() {
        const news = await this.prisma.news.findMany({ select: { createdAt: true } });
        const events = await this.prisma.event.findMany({ select: { createdAt: true } });
        const projects = await this.prisma.project.findMany({ select: { createdAt: true } });
        const monthlyMap = new Map();
        const addToMap = (items, key) => {
            items.forEach((item) => {
                const month = item.createdAt.toISOString().slice(0, 7);
                if (!monthlyMap.has(month)) {
                    monthlyMap.set(month, { news: 0, events: 0, projects: 0 });
                }
                monthlyMap.get(month)[key]++;
            });
        };
        addToMap(news, 'news');
        addToMap(events, 'events');
        addToMap(projects, 'projects');
        return Array.from(monthlyMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, counts]) => ({ month, ...counts }));
    }
    async getDonationTrend() {
        const donations = await this.prisma.donation.findMany({
            where: { status: 'COMPLETED' },
            select: { amount: true, createdAt: true },
        });
        const monthlyMap = new Map();
        donations.forEach((d) => {
            const month = d.createdAt.toISOString().slice(0, 7);
            monthlyMap.set(month, (monthlyMap.get(month) || 0) + d.amount);
        });
        return Array.from(monthlyMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, total]) => ({ month, total }));
    }
    async getTopPartners() {
        return this.prisma.partner.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map