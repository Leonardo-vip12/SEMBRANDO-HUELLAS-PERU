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
var SiaTransparencyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiaTransparencyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const ai_service_1 = require("../../ai/ai.service");
let SiaTransparencyService = SiaTransparencyService_1 = class SiaTransparencyService {
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
        this.logger = new common_1.Logger(SiaTransparencyService_1.name);
    }
    async getPublicIndicators() {
        try {
            const indicators = await this.prisma.siaIndicator.findMany({
                where: { active: true },
                include: {
                    records: { orderBy: { date: 'desc' }, take: 1 },
                },
            });
            return indicators.map((i) => ({
                id: i.id,
                name: i.name,
                slug: i.slug,
                category: i.category,
                unit: i.unit,
                description: i.description,
                currentValue: i.records[0]?.value || null,
                lastUpdated: i.records[0]?.date || null,
                target: i.target,
                source: i.source,
            }));
        }
        catch (error) {
            this.logger.error(`Error getting public indicators: ${error.message}`);
            throw error;
        }
    }
    async getPublicProjects() {
        try {
            const projects = await this.prisma.project.findMany({
                where: { published: true },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true,
                    startDate: true,
                    endDate: true,
                    region: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            return {
                total: projects.length,
                projects,
            };
        }
        catch (error) {
            this.logger.error(`Error getting public projects: ${error.message}`);
            throw error;
        }
    }
    async getImpactSummary() {
        try {
            const [impactMetrics, indicators] = await Promise.all([
                this.prisma.impactMetric.findMany({
                    include: { indicator: true },
                    orderBy: { createdAt: 'desc' },
                }),
                this.prisma.siaIndicator.findMany({
                    include: { records: { orderBy: { date: 'desc' }, take: 1 } },
                }),
            ]);
            const totalImpact = impactMetrics.reduce((s, m) => s + (m.value || 0), 0);
            const categories = [...new Set(indicators.map((i) => i.category).filter(Boolean))];
            const byCategory = {};
            for (const indicator of indicators) {
                const cat = indicator.category || 'general';
                if (!byCategory[cat])
                    byCategory[cat] = { count: 0, total: 0, items: [] };
                byCategory[cat].count++;
                byCategory[cat].total += indicator.records[0]?.value || 0;
                byCategory[cat].items.push({
                    name: indicator.name,
                    value: indicator.records[0]?.value || 0,
                    unit: indicator.unit,
                });
            }
            return {
                totalImpactMetrics: impactMetrics.length,
                totalIndicators: indicators.length,
                totalImpactValue: totalImpact,
                categories: Object.entries(byCategory).map(([name, data]) => ({
                    name,
                    count: data.count,
                    total: data.total,
                    indicators: data.items,
                })),
                lastUpdated: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`Error getting impact summary: ${error.message}`);
            throw error;
        }
    }
    async getPublicDocuments() {
        try {
            const [resources, knowledgeEntries] = await Promise.all([
                this.prisma.resource.count({
                    where: { published: true },
                }),
                this.prisma.knowledgeBase.count({
                    where: { published: true },
                }),
            ]);
            return {
                totalDocuments: resources + knowledgeEntries,
                resources,
                knowledgeBaseEntries: knowledgeEntries,
                lastUpdated: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`Error getting public documents: ${error.message}`);
            throw error;
        }
    }
    async getOpenStats() {
        try {
            const [totalIndicators, totalProjects, totalVolunteers, totalEvents, totalObservations, totalDatasets] = await Promise.all([
                this.prisma.siaIndicator.count({ where: { active: true } }),
                this.prisma.project.count({ where: { published: true } }),
                this.prisma.volunteer.count(),
                this.prisma.event.count(),
                this.prisma.siaCitizenObservation.count(),
                this.prisma.siaDataset.count({ where: { visibility: 'PUBLIC' } }),
            ]);
            return {
                totals: {
                    indicators: totalIndicators,
                    projects: totalProjects,
                    volunteers: totalVolunteers,
                    events: totalEvents,
                    citizenObservations: totalObservations,
                    publicDatasets: totalDatasets,
                },
                lastUpdated: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`Error getting open stats: ${error.message}`);
            throw error;
        }
    }
    async getDownloadableData() {
        try {
            const datasets = await this.prisma.siaDataset.findMany({
                where: { visibility: 'PUBLIC' },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    description: true,
                    category: true,
                    format: true,
                    source: true,
                    updatedAt: true,
                },
                orderBy: { updatedAt: 'desc' },
            });
            return {
                availableDatasets: datasets.length,
                datasets: datasets.map((d) => ({
                    ...d,
                    downloadUrl: `/api/sia/data-center/${d.id}/download`,
                })),
                formats: [...new Set(datasets.map((d) => d.format).filter(Boolean))],
            };
        }
        catch (error) {
            this.logger.error(`Error getting downloadable data: ${error.message}`);
            throw error;
        }
    }
};
exports.SiaTransparencyService = SiaTransparencyService;
exports.SiaTransparencyService = SiaTransparencyService = SiaTransparencyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], SiaTransparencyService);
//# sourceMappingURL=transparency.service.js.map