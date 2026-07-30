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
var DonationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_crud_service_1 = require("../../common/base/base-crud.service");
let DonationsService = DonationsService_1 = class DonationsService extends base_crud_service_1.BaseCrudService {
    constructor(prisma) {
        super(prisma);
        this.prisma = prisma;
        this.logger = new common_1.Logger(DonationsService_1.name);
        this.modelName = 'Donación';
    }
    get prismaDelegate() {
        return this.prisma.donation;
    }
    async getTotal() {
        const result = await this.prisma.donation.aggregate({
            _sum: { amount: true },
            where: { status: 'COMPLETED' },
        });
        return { total: result._sum.amount || 0 };
    }
    async getStats() {
        const [total, count, completed, pending] = await Promise.all([
            this.prisma.donation.aggregate({
                _sum: { amount: true },
                where: { status: 'COMPLETED' },
            }),
            this.prisma.donation.count(),
            this.prisma.donation.count({ where: { status: 'COMPLETED' } }),
            this.prisma.donation.count({ where: { status: 'PENDING' } }),
        ]);
        return {
            totalAmount: total._sum.amount || 0,
            totalDonations: count,
            completedDonations: completed,
            pendingDonations: pending,
        };
    }
};
exports.DonationsService = DonationsService;
exports.DonationsService = DonationsService = DonationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DonationsService);
//# sourceMappingURL=donations.service.js.map