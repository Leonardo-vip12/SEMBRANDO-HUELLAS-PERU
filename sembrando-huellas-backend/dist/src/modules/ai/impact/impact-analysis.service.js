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
var ImpactAnalysisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const ai_service_1 = require("../ai.service");
const prompts_1 = require("../prompts");
let ImpactAnalysisService = ImpactAnalysisService_1 = class ImpactAnalysisService {
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
        this.logger = new common_1.Logger(ImpactAnalysisService_1.name);
    }
    async generateReport(startDate, endDate) {
        const metrics = await this.prisma.impactMetric.findMany();
        const donations = await this.prisma.donation.aggregate({
            _sum: { amount: true },
            _count: true,
            where: { status: 'COMPLETED' },
        });
        const volunteersCount = await this.prisma.volunteer.count();
        const newsCount = await this.prisma.news.count();
        const data = {
            metrics: metrics.map((m) => ({ label: m.label, value: m.value, icon: m.icon })),
            donations: { total: donations._sum.amount || 0, count: donations._count },
            volunteers: volunteersCount,
            news: newsCount,
            period: { start: startDate || 'inicio', end: endDate || 'actualidad' },
        };
        const result = await this.aiService.chat([
            { role: 'system', content: prompts_1.IMPACT_ANALYSIS_SYSTEM },
            { role: 'user', content: `${prompts_1.IMPACT_REPORT_PROMPT}\n\nDatos del período:\n${JSON.stringify(data, null, 2)}` },
        ], { feature: 'impact-analysis', temperature: 0.5, maxTokens: 3000 });
        try {
            const jsonMatch = result.content.match(/\{[\s\S]*\}/);
            if (jsonMatch)
                return { ...JSON.parse(jsonMatch[0]), data };
        }
        catch { }
        return { narrative: result.content, data };
    }
    async analyzeTrend(metricKey) {
        const metrics = await this.prisma.impactMetric.findMany({ orderBy: { year: 'asc' } });
        return {
            metric: metricKey,
            data: metrics,
            analysis: 'Análisis de tendencia no disponible sin proveedor IA configurado.',
        };
    }
};
exports.ImpactAnalysisService = ImpactAnalysisService;
exports.ImpactAnalysisService = ImpactAnalysisService = ImpactAnalysisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], ImpactAnalysisService);
//# sourceMappingURL=impact-analysis.service.js.map