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
var SiaReportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiaReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let SiaReportsService = SiaReportsService_1 = class SiaReportsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SiaReportsService_1.name);
    }
    async generateReport(dto) {
        const report = await this.prisma.siaReport.create({
            data: {
                title: dto.title,
                type: dto.type,
                description: dto.description,
                format: dto.format || 'PDF',
                filters: dto.filters || {},
                generatedAt: new Date(),
                metadata: { status: 'generating' },
            },
        });
        const data = await this.collectReportData(dto.type, dto.filters);
        await this.prisma.siaReport.update({
            where: { id: report.id },
            data: {
                metadata: { status: 'completed', data, generatedAt: new Date().toISOString() },
                fileUrl: `/api/sia/reports/${report.id}/download`,
            },
        });
        return this.prisma.siaReport.findUnique({ where: { id: report.id } });
    }
    async listReports(page = 1, limit = 10, type) {
        const where = type ? { type } : {};
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.siaReport.findMany({
                skip,
                take: limit,
                where,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.siaReport.count({ where }),
        ]);
        return {
            data,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getReport(id) {
        const report = await this.prisma.siaReport.findUnique({ where: { id } });
        if (!report) {
            throw new common_1.NotFoundException(`Reporte con ID "${id}" no encontrado`);
        }
        return report;
    }
    async deleteReport(id) {
        const report = await this.prisma.siaReport.findUnique({ where: { id } });
        if (!report) {
            throw new common_1.NotFoundException(`Reporte con ID "${id}" no encontrado`);
        }
        await this.prisma.siaReport.delete({ where: { id } });
        return { message: 'Reporte eliminado correctamente' };
    }
    async getReportStats() {
        const reports = await this.prisma.siaReport.groupBy({
            by: ['type'],
            _count: { id: true },
        });
        const stats = {};
        for (const r of reports) {
            stats[r.type] = r._count.id;
        }
        return stats;
    }
    async collectReportData(type, filters) {
        const baseFilters = {};
        if (filters?.startDate || filters?.endDate) {
            baseFilters.createdAt = {};
            if (filters.startDate)
                baseFilters.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate)
                baseFilters.createdAt.lte = new Date(filters.endDate);
        }
        if (filters?.region)
            baseFilters.region = filters.region;
        switch (type) {
            case 'INSTITUCIONAL':
                return {
                    projects: await this.prisma.project.count({ where: baseFilters }),
                    events: await this.prisma.event.count({ where: baseFilters }),
                    news: await this.prisma.news.count({ where: { ...baseFilters, status: 'PUBLISHED' } }),
                    partners: await this.prisma.partner.count({ where: { active: true } }),
                    volunteers: await this.prisma.volunteer.count({ where: baseFilters }),
                    users: await this.prisma.user.count({ where: baseFilters }),
                };
            case 'CAMPANA':
                return {
                    campaigns: await this.prisma.news.count({ where: { ...baseFilters, status: 'PUBLISHED' } }),
                    totalViews: 0,
                    interactions: 0,
                };
            case 'PROYECTO':
                return {
                    total: await this.prisma.project.count({ where: baseFilters }),
                    byStatus: await this.prisma.project.groupBy({
                        by: ['status'],
                        _count: { id: true },
                        where: baseFilters,
                    }),
                };
            case 'EDUCATIVO':
                return {
                    resources: await this.prisma.resource.count({ where: baseFilters }),
                    totalStudents: await this.prisma.user.count({ where: { ...baseFilters, role: { name: 'ESTUDIANTE' } } }),
                    totalTeachers: await this.prisma.user.count({ where: { ...baseFilters, role: { name: 'DOCENTE' } } }),
                };
            case 'BIODIVERSIDAD':
                return {
                    species: await this.prisma.species.count({ where: baseFilters }),
                    observations: await this.prisma.biodiversityObservation.count({ where: baseFilters }),
                    conservationStatus: await this.prisma.species.groupBy({
                        by: ['conservationStatus'],
                        _count: { id: true },
                        where: baseFilters,
                    }),
                };
            default:
                return {};
        }
    }
};
exports.SiaReportsService = SiaReportsService;
exports.SiaReportsService = SiaReportsService = SiaReportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SiaReportsService);
//# sourceMappingURL=reports.service.js.map