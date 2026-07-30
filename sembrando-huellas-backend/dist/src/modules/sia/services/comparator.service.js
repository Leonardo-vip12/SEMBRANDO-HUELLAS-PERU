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
var SiaComparatorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiaComparatorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const ai_service_1 = require("../../ai/ai.service");
let SiaComparatorService = SiaComparatorService_1 = class SiaComparatorService {
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
        this.logger = new common_1.Logger(SiaComparatorService_1.name);
    }
    async compare(dto) {
        try {
            switch (dto.type) {
                case 'region':
                    return await this.compareByRegion(dto);
                case 'institution':
                    return await this.compareByInstitution(dto);
                case 'campaign':
                    return await this.compareByCampaign(dto);
                case 'project':
                    return await this.compareByProject(dto);
                case 'period':
                    return await this.compareByPeriod(dto);
                default:
                    throw new common_1.BadRequestException(`Tipo de comparación "${dto.type}" no soportado`);
            }
        }
        catch (error) {
            this.logger.error(`Error in compare: ${error.message}`);
            throw error;
        }
    }
    async compareByRegion(dto) {
        const where = {};
        if (dto.indicatorId)
            where.indicatorId = dto.indicatorId;
        if (dto.ids && dto.ids.length > 0)
            where.region = { in: dto.ids };
        if (dto.startDate || dto.endDate) {
            where.date = {};
            if (dto.startDate)
                where.date.gte = new Date(dto.startDate);
            if (dto.endDate)
                where.date.lte = new Date(dto.endDate);
        }
        const records = await this.prisma.siaIndicatorRecord.findMany({
            where,
            include: { indicator: true },
            orderBy: { date: 'asc' },
        });
        const grouped = {};
        for (const r of records) {
            const key = r.region || 'default';
            if (!grouped[key])
                grouped[key] = { label: key, values: [], dates: [] };
            grouped[key].values.push(r.value);
            grouped[key].dates.push(r.date.toISOString());
        }
        return {
            type: 'region',
            labels: Object.keys(grouped),
            datasets: Object.entries(grouped).map(([region, data]) => ({
                label: region,
                data: data.values,
                dates: data.dates,
            })),
            total: Object.keys(grouped).length,
        };
    }
    async compareByInstitution(dto) {
        const where = {};
        if (dto.indicatorId)
            where.indicatorId = dto.indicatorId;
        if (dto.ids && dto.ids.length > 0)
            where.institution = { in: dto.ids };
        if (dto.startDate || dto.endDate) {
            where.date = {};
            if (dto.startDate)
                where.date.gte = new Date(dto.startDate);
            if (dto.endDate)
                where.date.lte = new Date(dto.endDate);
        }
        const records = await this.prisma.siaIndicatorRecord.findMany({
            where,
            include: { indicator: true },
            orderBy: { date: 'asc' },
        });
        const grouped = {};
        for (const r of records) {
            const key = r.institution || 'default';
            if (!grouped[key])
                grouped[key] = { label: key, values: [], dates: [] };
            grouped[key].values.push(r.value);
            grouped[key].dates.push(r.date.toISOString());
        }
        return {
            type: 'institution',
            labels: Object.keys(grouped),
            datasets: Object.entries(grouped).map(([inst, data]) => ({
                label: inst,
                data: data.values,
                dates: data.dates,
            })),
            total: Object.keys(grouped).length,
        };
    }
    async compareByCampaign(dto) {
        if (!dto.ids || dto.ids.length === 0) {
            throw new common_1.BadRequestException('Se requieren IDs de campañas para comparar');
        }
        const campaigns = await this.prisma.event.findMany({
            where: { id: { in: dto.ids } },
            include: {
                impactMetrics: {
                    ...(dto.indicatorId ? { where: { indicatorId: dto.indicatorId } } : {}),
                },
            },
        });
        return {
            type: 'campaign',
            labels: campaigns.map((c) => c.name),
            datasets: campaigns.map((c) => ({
                label: c.name,
                data: c.impactMetrics.map((m) => m.value),
                metrics: c.impactMetrics,
            })),
            total: campaigns.length,
        };
    }
    async compareByProject(dto) {
        if (!dto.ids || dto.ids.length === 0) {
            throw new common_1.BadRequestException('Se requieren IDs de proyectos para comparar');
        }
        const projects = await this.prisma.project.findMany({
            where: { id: { in: dto.ids } },
            include: {
                impactMetrics: {
                    ...(dto.indicatorId ? { where: { indicatorId: dto.indicatorId } } : {}),
                },
            },
        });
        return {
            type: 'project',
            labels: projects.map((p) => p.name),
            datasets: projects.map((p) => ({
                label: p.name,
                data: p.impactMetrics.map((m) => m.value),
                metrics: p.impactMetrics,
            })),
            total: projects.length,
        };
    }
    async compareByPeriod(dto) {
        if (!dto.startDate || !dto.endDate) {
            throw new common_1.BadRequestException('Se requieren fechas de inicio y fin para comparar periodos');
        }
        const midDate = new Date((new Date(dto.startDate).getTime() + new Date(dto.endDate).getTime()) / 2);
        const where = {};
        if (dto.indicatorId)
            where.indicatorId = dto.indicatorId;
        const firstHalf = await this.prisma.siaIndicatorRecord.findMany({
            where: { ...where, date: { gte: new Date(dto.startDate), lt: midDate } },
            orderBy: { date: 'asc' },
        });
        const secondHalf = await this.prisma.siaIndicatorRecord.findMany({
            where: { ...where, date: { gte: midDate, lte: new Date(dto.endDate) } },
            orderBy: { date: 'asc' },
        });
        const avg = (arr) => (arr.length > 0 ? arr.reduce((s, r) => s + r.value, 0) / arr.length : 0);
        return {
            type: 'period',
            labels: ['Primer periodo', 'Segundo periodo'],
            datasets: [
                {
                    label: 'Primer periodo',
                    data: firstHalf.map((r) => r.value),
                    dates: firstHalf.map((r) => r.date.toISOString()),
                    average: avg(firstHalf),
                    count: firstHalf.length,
                },
                {
                    label: 'Segundo periodo',
                    data: secondHalf.map((r) => r.value),
                    dates: secondHalf.map((r) => r.date.toISOString()),
                    average: avg(secondHalf),
                    count: secondHalf.length,
                },
            ],
            variation: avg(secondHalf) - avg(firstHalf),
            variationPercent: avg(firstHalf) !== 0 ? ((avg(secondHalf) - avg(firstHalf)) / avg(firstHalf)) * 100 : 0,
        };
    }
    async getComparisonChart(type, dimension) {
        try {
            const records = await this.prisma.siaIndicatorRecord.findMany({
                where: { [dimension]: { not: null } },
                orderBy: { date: 'asc' },
                take: 100,
            });
            const grouped = {};
            for (const r of records) {
                const key = r[dimension] || 'unknown';
                if (!grouped[key])
                    grouped[key] = { values: [], dates: [] };
                grouped[key].values.push(r.value);
                grouped[key].dates.push(r.date.toISOString());
            }
            return {
                type,
                dimension,
                chartType: 'line',
                labels: Object.keys(grouped),
                datasets: Object.entries(grouped).map(([key, data]) => ({
                    label: key,
                    data: data.values,
                    dates: data.dates,
                })),
            };
        }
        catch (error) {
            this.logger.error(`Error getting comparison chart: ${error.message}`);
            throw error;
        }
    }
};
exports.SiaComparatorService = SiaComparatorService;
exports.SiaComparatorService = SiaComparatorService = SiaComparatorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], SiaComparatorService);
//# sourceMappingURL=comparator.service.js.map