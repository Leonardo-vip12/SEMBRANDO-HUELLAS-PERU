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
var TeamService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TeamService = TeamService_1 = class TeamService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TeamService_1.name);
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.teamMember.findMany({ skip, take: limit, orderBy: { order: 'asc' } }),
            this.prisma.teamMember.count(),
        ]);
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findById(id) {
        const item = await this.prisma.teamMember.findUnique({ where: { id } });
        if (!item) {
            const { NotFoundException } = await Promise.resolve().then(() => require('@nestjs/common'));
            throw new NotFoundException('Miembro del Equipo no encontrado');
        }
        return item;
    }
    async create(data) {
        return this.prisma.teamMember.create({ data });
    }
    async update(id, data) {
        const item = await this.prisma.teamMember.findUnique({ where: { id } });
        if (!item) {
            const { NotFoundException } = await Promise.resolve().then(() => require('@nestjs/common'));
            throw new NotFoundException('Miembro del Equipo no encontrado');
        }
        return this.prisma.teamMember.update({ where: { id }, data });
    }
    async remove(id) {
        const item = await this.prisma.teamMember.findUnique({ where: { id } });
        if (!item) {
            const { NotFoundException } = await Promise.resolve().then(() => require('@nestjs/common'));
            throw new NotFoundException('Miembro del Equipo no encontrado');
        }
        await this.prisma.teamMember.delete({ where: { id } });
    }
    buildSearchFilter(search) {
        return {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { role: { contains: search, mode: 'insensitive' } },
            ],
        };
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = TeamService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamService);
//# sourceMappingURL=team.service.js.map