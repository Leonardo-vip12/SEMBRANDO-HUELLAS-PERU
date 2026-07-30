import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  protected logger = new Logger(DashboardService.name);

  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalNews,
      totalProjects,
      totalEvents,
      totalDonations,
      totalVolunteers,
      totalUsers,
      totalSpecies,
      totalPartners,
      totalGallery,
      totalResources,
    ] = await Promise.all([
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
}
