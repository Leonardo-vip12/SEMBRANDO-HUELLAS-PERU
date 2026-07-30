import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';
export declare class DonationsService extends BaseCrudService<any> {
    protected prisma: PrismaService;
    protected logger: Logger;
    protected modelName: string;
    constructor(prisma: PrismaService);
    get prismaDelegate(): import(".prisma/client").Prisma.DonationDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    getTotal(): Promise<{
        total: number;
    }>;
    getStats(): Promise<{
        totalAmount: number;
        totalDonations: number;
        completedDonations: number;
        pendingDonations: number;
    }>;
}
