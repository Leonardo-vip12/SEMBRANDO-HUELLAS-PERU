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
var SiaDashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiaDashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let SiaDashboardService = SiaDashboardService_1 = class SiaDashboardService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SiaDashboardService_1.name);
    }
    async getExecutiveDashboard(query) {
        const dateFilter = this.buildDateFilter(query.startDate, query.endDate);
        const regionFilter = query.region ? { region: query.region } : {};
        const institutionFilter = query.institution ? { institution: query.institution } : {};
        const [totalActivities, totalInstitutions, totalStudents, totalTeachers, totalTreesPlanted, totalSpecies, totalObservations, totalCampaigns, totalResources, totalVolunteerHours, totalProjects, totalEvents,] = await Promise.all([
            this.prisma.news.count({ where: { ...dateFilter, status: 'PUBLISHED' } }),
            this.prisma.partner.count({ where: { active: true } }),
            this.prisma.user.count({ where: { ...dateFilter, role: { name: 'ESTUDIANTE' } } }),
            this.prisma.user.count({ where: { ...dateFilter, role: { name: 'DOCENTE' } } }),
            this.prisma.impactMetric.count({ where: { label: { contains: 'árbol' } } }),
            this.prisma.species.count({ where: { ...dateFilter } }),
            this.prisma.biodiversityObservation.count({ where: { ...dateFilter } }),
            this.prisma.project.count({ where: { ...dateFilter, status: 'PUBLISHED' } }),
            this.prisma.resource.count({ where: { ...dateFilter } }),
            this.prisma.volunteer.count({ where: { ...dateFilter } }),
            this.prisma.project.count({ where: { ...dateFilter } }),
            this.prisma.event.count({ where: { ...dateFilter } }),
        ]);
        return {
            activities: totalActivities,
            institutions: totalInstitutions || 0,
            students: totalStudents || 0,
            teachers: totalTeachers || 0,
            treesPlanted: totalTreesPlanted || 0,
            speciesRegistered: totalSpecies,
            observations: totalObservations,
            campaignsExecuted: totalCampaigns,
            resourcesPublished: totalResources,
            volunteerHours: totalVolunteerHours,
            totalProjects,
            totalEvents,
        };
    }
    async getTimeSeries(metric, startDate, endDate, interval = 'month') {
        const dateFilter = this.buildDateFilter(startDate, endDate);
        const entityMap = {
            news: this.prisma.news,
            projects: this.prisma.project,
            events: this.prisma.event,
            observations: this.prisma.biodiversityObservation,
            species: this.prisma.species,
            volunteers: this.prisma.volunteer,
            donations: this.prisma.donation,
            resources: this.prisma.resource,
            users: this.prisma.user,
            partners: this.prisma.partner,
        };
        const delegate = entityMap[metric];
        if (!delegate) {
            return [];
        }
        const items = await delegate.findMany({
            where: { ...dateFilter },
            select: { createdAt: true },
            orderBy: { createdAt: 'asc' },
        });
        const grouped = new Map();
        for (const item of items) {
            let key;
            if (interval === 'year') {
                key = item.createdAt.toISOString().slice(0, 4);
            }
            else if (interval === 'week') {
                const d = new Date(item.createdAt);
                const startOfWeek = new Date(d);
                startOfWeek.setDate(d.getDate() - d.getDay());
                key = startOfWeek.toISOString().slice(0, 7);
            }
            else {
                key = item.createdAt.toISOString().slice(0, 7);
            }
            grouped.set(key, (grouped.get(key) || 0) + 1);
        }
        return Array.from(grouped.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([period, count]) => ({ period, count }));
    }
    buildDateFilter(startDate, endDate) {
        const filter = {};
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate)
                filter.createdAt.gte = new Date(startDate);
            if (endDate)
                filter.createdAt.lte = new Date(endDate);
        }
        return filter;
    }
};
exports.SiaDashboardService = SiaDashboardService;
exports.SiaDashboardService = SiaDashboardService = SiaDashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SiaDashboardService);
//# sourceMappingURL=dashboard.service.js.map