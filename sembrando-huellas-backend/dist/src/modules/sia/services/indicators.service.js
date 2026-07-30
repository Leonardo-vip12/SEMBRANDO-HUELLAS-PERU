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
var SiaIndicatorsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiaIndicatorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let SiaIndicatorsService = SiaIndicatorsService_1 = class SiaIndicatorsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SiaIndicatorsService_1.name);
    }
    async create(dto) {
        return this.prisma.siaIndicator.create({ data: dto });
    }
    async update(id, dto) {
        const indicator = await this.prisma.siaIndicator.findUnique({ where: { id } });
        if (!indicator) {
            throw new common_1.NotFoundException(`Indicador con ID "${id}" no encontrado`);
        }
        return this.prisma.siaIndicator.update({ where: { id }, data: dto });
    }
    async findAll(category, active, year) {
        const where = {};
        if (category)
            where.category = category;
        if (active !== undefined)
            where.active = active;
        if (year)
            where.year = year;
        return this.prisma.siaIndicator.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { records: true } },
            },
        });
    }
    async findOne(id) {
        const indicator = await this.prisma.siaIndicator.findUnique({
            where: { id },
            include: {
                records: { orderBy: { date: 'desc' } },
                alertRules: { where: { status: 'ACTIVE' } },
            },
        });
        if (!indicator) {
            throw new common_1.NotFoundException(`Indicador con ID "${id}" no encontrado`);
        }
        return indicator;
    }
    async delete(id) {
        const indicator = await this.prisma.siaIndicator.findUnique({ where: { id } });
        if (!indicator) {
            throw new common_1.NotFoundException(`Indicador con ID "${id}" no encontrado`);
        }
        await this.prisma.siaIndicator.delete({ where: { id } });
        return { message: 'Indicador eliminado correctamente' };
    }
    async addRecord(indicatorId, dto) {
        const indicator = await this.prisma.siaIndicator.findUnique({ where: { id: indicatorId } });
        if (!indicator) {
            throw new common_1.NotFoundException(`Indicador con ID "${indicatorId}" no encontrado`);
        }
        const record = await this.prisma.siaIndicatorRecord.create({
            data: {
                indicatorId,
                value: dto.value,
                date: new Date(dto.date),
                region: dto.region,
                institution: dto.institution,
            },
        });
        await this.prisma.siaIndicator.update({
            where: { id: indicatorId },
            data: { current: dto.value },
        });
        return record;
    }
    async getRecords(indicatorId, startDate, endDate) {
        const where = { indicatorId };
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = new Date(startDate);
            if (endDate)
                where.date.lte = new Date(endDate);
        }
        return this.prisma.siaIndicatorRecord.findMany({
            where,
            orderBy: { date: 'desc' },
        });
    }
    async getCategories() {
        const values = [
            'EDUCACION',
            'AMBIENTAL',
            'SOCIAL',
            'ECONOMICO',
            'PARTICIPACION',
            'CONSERVACION',
        ];
        return values;
    }
    async getSummary() {
        const indicators = await this.prisma.siaIndicator.findMany({
            where: { active: true },
            include: {
                records: { orderBy: { date: 'desc' }, take: 1 },
            },
            orderBy: { category: 'asc' },
        });
        const grouped = {};
        for (const indicator of indicators) {
            const cat = indicator.category;
            if (!grouped[cat])
                grouped[cat] = [];
            grouped[cat].push({
                id: indicator.id,
                name: indicator.name,
                slug: indicator.slug,
                description: indicator.description,
                unit: indicator.unit,
                target: indicator.target,
                current: indicator.records[0]?.value ?? indicator.current,
                year: indicator.year,
                region: indicator.region,
                lastRecord: indicator.records[0] || null,
            });
        }
        return grouped;
    }
};
exports.SiaIndicatorsService = SiaIndicatorsService;
exports.SiaIndicatorsService = SiaIndicatorsService = SiaIndicatorsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SiaIndicatorsService);
//# sourceMappingURL=indicators.service.js.map