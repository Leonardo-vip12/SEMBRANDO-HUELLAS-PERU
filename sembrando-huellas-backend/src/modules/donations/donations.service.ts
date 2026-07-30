import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';

@Injectable()
export class DonationsService extends BaseCrudService<any> {
  protected logger = new Logger(DonationsService.name);
  protected modelName = 'Donación';

  constructor(protected prisma: PrismaService) {
    super(prisma);
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
}
