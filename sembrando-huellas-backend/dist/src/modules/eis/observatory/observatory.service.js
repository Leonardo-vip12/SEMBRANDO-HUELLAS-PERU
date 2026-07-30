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
var ObservatoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservatoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let ObservatoryService = ObservatoryService_1 = class ObservatoryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ObservatoryService_1.name);
    }
    async register(dto) {
        if (!dto.latitude || !dto.longitude) {
            throw new common_1.BadRequestException('La ubicación es obligatoria');
        }
        return this.prisma.biodiversityObservation.create({
            data: {
                speciesName: dto.speciesName,
                scientificName: dto.scientificName,
                quantity: dto.quantity || 1,
                latitude: dto.latitude,
                longitude: dto.longitude,
                observedAt: dto.observedAt ? new Date(dto.observedAt) : new Date(),
                habitat: dto.habitat,
                weather: dto.weather,
                comments: dto.comments,
                images: dto.images || [],
                status: 'PENDING',
                userId: dto.userId,
            },
        });
    }
    async findAll(page = 1, limit = 50, status) {
        const skip = (page - 1) * limit;
        const where = status ? { status } : {};
        const [data, total] = await Promise.all([
            this.prisma.biodiversityObservation.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { id: true, name: true } } },
            }),
            this.prisma.biodiversityObservation.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async getMapData(status) {
        const where = {};
        if (status)
            where.status = status;
        const observations = await this.prisma.biodiversityObservation.findMany({
            where,
            select: {
                id: true,
                speciesName: true,
                scientificName: true,
                latitude: true,
                longitude: true,
                quantity: true,
                observedAt: true,
                status: true,
                images: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 1000,
        });
        return observations.map((o) => ({
            id: o.id,
            speciesName: o.speciesName,
            scientificName: o.scientificName,
            lat: o.latitude,
            lng: o.longitude,
            quantity: o.quantity,
            date: o.observedAt,
            status: o.status,
            images: o.images,
        }));
    }
    async verifyObservation(id, reviewerId, status) {
        return this.prisma.biodiversityObservation.update({
            where: { id },
            data: { status, reviewedBy: reviewerId, reviewedAt: new Date() },
        });
    }
    async getStats() {
        const [total, verified, pending, speciesCount] = await Promise.all([
            this.prisma.biodiversityObservation.count(),
            this.prisma.biodiversityObservation.count({ where: { status: 'VERIFIED' } }),
            this.prisma.biodiversityObservation.count({ where: { status: 'PENDING' } }),
            this.prisma.biodiversityObservation.groupBy({
                by: ['scientificName'],
                _count: true,
                orderBy: { _count: { scientificName: 'desc' } },
                take: 10,
            }),
        ]);
        return { total, verified, pending, topSpecies: speciesCount.filter((s) => s.scientificName) };
    }
};
exports.ObservatoryService = ObservatoryService;
exports.ObservatoryService = ObservatoryService = ObservatoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ObservatoryService);
//# sourceMappingURL=observatory.service.js.map