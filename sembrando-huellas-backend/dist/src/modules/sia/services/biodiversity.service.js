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
var SiaBiodiversityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiaBiodiversityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let SiaBiodiversityService = SiaBiodiversityService_1 = class SiaBiodiversityService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SiaBiodiversityService_1.name);
    }
    async getSpeciesDistribution() {
        const species = await this.prisma.species.findMany({
            select: { category: true, conservationStatus: true, region: true },
        });
        const byCategory = {};
        const byConservationStatus = {};
        const byRegion = {};
        for (const s of species) {
            if (s.category)
                byCategory[s.category] = (byCategory[s.category] || 0) + 1;
            if (s.conservationStatus)
                byConservationStatus[s.conservationStatus] = (byConservationStatus[s.conservationStatus] || 0) + 1;
            if (s.region)
                byRegion[s.region] = (byRegion[s.region] || 0) + 1;
        }
        return { byCategory, byConservationStatus, byRegion };
    }
    async getObservationsTimeline(startDate, endDate) {
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.observedAt = {};
            if (startDate)
                dateFilter.observedAt.gte = new Date(startDate);
            if (endDate)
                dateFilter.observedAt.lte = new Date(endDate);
        }
        const observations = await this.prisma.biodiversityObservation.findMany({
            where: dateFilter,
            select: { observedAt: true },
            orderBy: { observedAt: 'asc' },
        });
        const grouped = new Map();
        for (const obs of observations) {
            const month = obs.observedAt.toISOString().slice(0, 7);
            grouped.set(month, (grouped.get(month) || 0) + 1);
        }
        return Array.from(grouped.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, count]) => ({ month, count }));
    }
    async getHistoricalRecords(page = 1, limit = 20, speciesName, region, startDate, endDate) {
        const where = {};
        if (speciesName) {
            where.OR = [
                { speciesName: { contains: speciesName, mode: 'insensitive' } },
                { scientificName: { contains: speciesName, mode: 'insensitive' } },
            ];
        }
        if (startDate || endDate) {
            where.observedAt = {};
            if (startDate)
                where.observedAt.gte = new Date(startDate);
            if (endDate)
                where.observedAt.lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.biodiversityObservation.findMany({
                skip,
                take: limit,
                where,
                orderBy: { observedAt: 'desc' },
                include: { user: { select: { id: true, name: true } } },
            }),
            this.prisma.biodiversityObservation.count({ where }),
        ]);
        return {
            data,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getConservationStatus() {
        const species = await this.prisma.species.findMany({
            select: { conservationStatus: true },
        });
        const counts = {};
        for (const s of species) {
            const status = s.conservationStatus || 'UNKNOWN';
            counts[status] = (counts[status] || 0) + 1;
        }
        return counts;
    }
    async getTemporalComparison(year1, year2) {
        const start1 = new Date(`${year1}-01-01`);
        const end1 = new Date(`${year1}-12-31`);
        const start2 = new Date(`${year2}-01-01`);
        const end2 = new Date(`${year2}-12-31`);
        const [data1, data2] = await Promise.all([
            this.prisma.biodiversityObservation.findMany({
                where: { observedAt: { gte: start1, lte: end1 } },
                select: { speciesName: true, quantity: true, observedAt: true },
                orderBy: { observedAt: 'asc' },
            }),
            this.prisma.biodiversityObservation.findMany({
                where: { observedAt: { gte: start2, lte: end2 } },
                select: { speciesName: true, quantity: true, observedAt: true },
                orderBy: { observedAt: 'asc' },
            }),
        ]);
        const monthly1 = this.groupByMonth(data1);
        const monthly2 = this.groupByMonth(data2);
        return {
            year1: { year: year1, total: data1.length, monthly: monthly1 },
            year2: { year: year2, total: data2.length, monthly: monthly2 },
        };
    }
    async getMapData() {
        return this.prisma.biodiversityObservation.findMany({
            where: { latitude: { not: undefined }, longitude: { not: undefined } },
            select: {
                id: true,
                speciesName: true,
                scientificName: true,
                quantity: true,
                latitude: true,
                longitude: true,
                observedAt: true,
                status: true,
                images: true,
            },
            orderBy: { observedAt: 'desc' },
            take: 1000,
        });
    }
    groupByMonth(data) {
        const grouped = new Map();
        for (const item of data) {
            const month = item.observedAt.toISOString().slice(0, 7);
            grouped.set(month, (grouped.get(month) || 0) + 1);
        }
        return Array.from(grouped.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, count]) => ({ month, count }));
    }
};
exports.SiaBiodiversityService = SiaBiodiversityService;
exports.SiaBiodiversityService = SiaBiodiversityService = SiaBiodiversityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SiaBiodiversityService);
//# sourceMappingURL=biodiversity.service.js.map