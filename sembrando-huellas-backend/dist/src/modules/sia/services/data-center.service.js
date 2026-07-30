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
var SiaDataCenterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiaDataCenterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const ai_service_1 = require("../../ai/ai.service");
let SiaDataCenterService = SiaDataCenterService_1 = class SiaDataCenterService {
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
        this.logger = new common_1.Logger(SiaDataCenterService_1.name);
    }
    async createDataset(dto) {
        try {
            const dataset = await this.prisma.siaDataset.create({
                data: {
                    title: dto.title,
                    slug: dto.slug,
                    description: dto.description,
                    category: dto.category || 'general',
                    source: dto.source,
                    format: dto.format || 'json',
                    visibility: dto.visibility || 'INTERNAL',
                },
            });
            this.logger.log(`Dataset created: ${dataset.title}`);
            return dataset;
        }
        catch (error) {
            this.logger.error(`Error creating dataset: ${error.message}`);
            throw error;
        }
    }
    async updateDataset(id, dto) {
        const existing = await this.prisma.siaDataset.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Dataset con ID "${id}" no encontrado`);
        try {
            return await this.prisma.siaDataset.update({
                where: { id },
                data: dto,
            });
        }
        catch (error) {
            this.logger.error(`Error updating dataset ${id}: ${error.message}`);
            throw error;
        }
    }
    async findAllDatasets(category, visibility, page = 1, limit = 20) {
        const where = {};
        if (category)
            where.category = category;
        if (visibility)
            where.visibility = visibility;
        const skip = (page - 1) * limit;
        try {
            const [data, total] = await Promise.all([
                this.prisma.siaDataset.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                }),
                this.prisma.siaDataset.count({ where }),
            ]);
            return {
                data,
                meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
            };
        }
        catch (error) {
            this.logger.error(`Error listing datasets: ${error.message}`);
            throw error;
        }
    }
    async findDataset(id) {
        const dataset = await this.prisma.siaDataset.findUnique({ where: { id } });
        if (!dataset)
            throw new common_1.NotFoundException(`Dataset con ID "${id}" no encontrado`);
        return dataset;
    }
    async deleteDataset(id) {
        const existing = await this.prisma.siaDataset.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Dataset con ID "${id}" no encontrado`);
        try {
            await this.prisma.siaDataset.delete({ where: { id } });
            this.logger.log(`Dataset deleted: ${id}`);
        }
        catch (error) {
            this.logger.error(`Error deleting dataset ${id}: ${error.message}`);
            throw error;
        }
    }
    async getMetadata() {
        try {
            const [total, categories, formats, lastUpdated] = await Promise.all([
                this.prisma.siaDataset.count(),
                this.prisma.siaDataset.groupBy({ by: ['category'], _count: true }),
                this.prisma.siaDataset.groupBy({ by: ['format'], _count: true }),
                this.prisma.siaDataset.findFirst({ orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
            ]);
            return {
                totalDatasets: total,
                categories: categories.map((c) => ({ category: c.category, count: c._count })),
                formats: formats.map((f) => ({ format: f.format, count: f._count })),
                lastUpdated: lastUpdated?.updatedAt || null,
            };
        }
        catch (error) {
            this.logger.error(`Error getting metadata: ${error.message}`);
            throw error;
        }
    }
    async getTimeSeriesData(indicatorId, startDate, endDate) {
        try {
            const where = {};
            if (indicatorId)
                where.indicatorId = indicatorId;
            if (startDate || endDate) {
                where.date = {};
                if (startDate)
                    where.date.gte = new Date(startDate);
                if (endDate)
                    where.date.lte = new Date(endDate);
            }
            const records = await this.prisma.siaIndicatorRecord.findMany({
                where,
                include: { indicator: true },
                orderBy: { date: 'asc' },
            });
            return {
                title: 'Time Series Data',
                generatedAt: new Date().toISOString(),
                totalRecords: records.length,
                data: records.map((r) => ({
                    date: r.date.toISOString(),
                    value: r.value,
                    indicator: r.indicator?.name || null,
                    region: r.region,
                    institution: r.institution,
                })),
            };
        }
        catch (error) {
            this.logger.error(`Error getting time series: ${error.message}`);
            throw error;
        }
    }
    async getOpenDataCatalog() {
        try {
            const datasets = await this.prisma.siaDataset.findMany({
                where: { visibility: 'PUBLIC' },
                orderBy: { updatedAt: 'desc' },
            });
            return {
                catalog: {
                    title: 'Catálogo de Datos Abiertos - Sembrando Huellas',
                    description: 'Datos públicos del Sistema de Indicadores Ambientales',
                    modified: new Date().toISOString(),
                    publisher: 'Sembrando Huellas',
                    license: 'Open Data',
                },
                datasets: datasets.map((d) => ({
                    id: d.id,
                    title: d.title,
                    description: d.description,
                    category: d.category,
                    format: d.format,
                    source: d.source,
                    updatedAt: d.updatedAt,
                    downloadUrl: `/api/sia/data-center/${d.id}/download`,
                })),
                total: datasets.length,
            };
        }
        catch (error) {
            this.logger.error(`Error getting open data catalog: ${error.message}`);
            throw error;
        }
    }
};
exports.SiaDataCenterService = SiaDataCenterService;
exports.SiaDataCenterService = SiaDataCenterService = SiaDataCenterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], SiaDataCenterService);
//# sourceMappingURL=data-center.service.js.map