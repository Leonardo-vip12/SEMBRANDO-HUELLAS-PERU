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
var DashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DashboardService = DashboardService_1 = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(DashboardService_1.name);
    }
    async getStats() {
        const [totalNews, totalProjects, totalEvents, totalDonations, totalVolunteers, totalUsers, totalSpecies, totalPartners, totalGallery, totalResources,] = await Promise.all([
            this.prisma.news.count(),
            this.prisma.project.count(),
            this.prisma.event.count(),
            this.prisma.donation.count(),
            this.prisma.volunteer.count(),
            this.prisma.user.count(),
            this.prisma.species.count(),
            this.prisma.partner.count(),
            this.prisma.gallery.count(),
            this.prisma.resource.count(),
        ]);
        const donationStats = await this.prisma.donation.aggregate({
            _sum: { amount: true },
            where: { status: 'COMPLETED' },
        });
        return {
            content: {
                news: totalNews,
                projects: totalProjects,
                events: totalEvents,
                species: totalSpecies,
                gallery: totalGallery,
                resources: totalResources,
            },
            engagement: {
                volunteers: totalVolunteers,
                partners: totalPartners,
                users: totalUsers,
            },
            donations: {
                total: totalDonations,
                completedAmount: donationStats._sum.amount || 0,
            },
        };
    }
    async getRecentActivity(limit = 10) {
        return this.prisma.auditLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = DashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map