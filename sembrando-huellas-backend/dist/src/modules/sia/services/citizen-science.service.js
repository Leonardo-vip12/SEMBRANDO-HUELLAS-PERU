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
var SiaCitizenScienceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiaCitizenScienceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let SiaCitizenScienceService = SiaCitizenScienceService_1 = class SiaCitizenScienceService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SiaCitizenScienceService_1.name);
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.speciesName) {
            where.OR = [
                { speciesName: { contains: query.speciesName, mode: 'insensitive' } },
                { scientificName: { contains: query.speciesName, mode: 'insensitive' } },
            ];
        }
        if (query.assignedTo)
            where.assignedTo = query.assignedTo;
        if (query.startDate || query.endDate) {
            where.observedAt = {};
            if (query.startDate)
                where.observedAt.gte = new Date(query.startDate);
            if (query.endDate)
                where.observedAt.lte = new Date(query.endDate);
        }
        const [data, total] = await Promise.all([
            this.prisma.siaCitizenObservation.findMany({
                skip,
                take: limit,
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, name: true, email: true } },
                },
            }),
            this.prisma.siaCitizenObservation.count({ where }),
        ]);
        return {
            data,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const observation = await this.prisma.siaCitizenObservation.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
        if (!observation) {
            throw new common_1.NotFoundException(`Observación con ID "${id}" no encontrada`);
        }
        return observation;
    }
    async review(id, dto) {
        const observation = await this.prisma.siaCitizenObservation.findUnique({ where: { id } });
        if (!observation) {
            throw new common_1.NotFoundException(`Observación con ID "${id}" no encontrada`);
        }
        const historyEntry = {
            status: dto.status,
            comments: dto.comments,
            reviewedBy: dto.assignedTo || observation.assignedTo,
            reviewedAt: new Date().toISOString(),
        };
        const existingHistory = observation.revisionHistory || [];
        const revisionHistory = [...existingHistory, historyEntry];
        return this.prisma.siaCitizenObservation.update({
            where: { id },
            data: {
                status: dto.status,
                reviewedBy: dto.assignedTo || observation.reviewedBy,
                reviewedAt: new Date(),
                assignedTo: dto.assignedTo !== undefined ? dto.assignedTo : observation.assignedTo,
                revisionHistory,
            },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
    }
    async assign(id, userId) {
        const observation = await this.prisma.siaCitizenObservation.findUnique({ where: { id } });
        if (!observation) {
            throw new common_1.NotFoundException(`Observación con ID "${id}" no encontrada`);
        }
        const historyEntry = {
            action: 'ASSIGNED',
            assignedTo: userId,
            assignedAt: new Date().toISOString(),
        };
        const existingHistory = observation.revisionHistory || [];
        const revisionHistory = [...existingHistory, historyEntry];
        return this.prisma.siaCitizenObservation.update({
            where: { id },
            data: {
                assignedTo: userId,
                revisionHistory,
            },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
    }
    async getStats() {
        const counts = await this.prisma.siaCitizenObservation.groupBy({
            by: ['status'],
            _count: { id: true },
        });
        const total = counts.reduce((sum, c) => sum + c._count.id, 0);
        const stats = { total };
        for (const c of counts) {
            stats[c.status] = c._count.id;
        }
        return stats;
    }
    async getReviewHistory(id) {
        const observation = await this.prisma.siaCitizenObservation.findUnique({
            where: { id },
            select: { revisionHistory: true },
        });
        if (!observation) {
            throw new common_1.NotFoundException(`Observación con ID "${id}" no encontrada`);
        }
        return observation.revisionHistory || [];
    }
    async exportPending() {
        return this.prisma.siaCitizenObservation.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
    }
};
exports.SiaCitizenScienceService = SiaCitizenScienceService;
exports.SiaCitizenScienceService = SiaCitizenScienceService = SiaCitizenScienceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SiaCitizenScienceService);
//# sourceMappingURL=citizen-science.service.js.map