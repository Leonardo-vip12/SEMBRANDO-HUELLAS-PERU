import { Injectable, Logger } from '@nestjs/common';
import { RecommenderService } from '../../ai/recommender/recommender.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RecommenderV2Service {
  private readonly logger = new Logger(RecommenderV2Service.name);

  constructor(
    private recommenderService: RecommenderService,
    private prisma: PrismaService,
  ) {}

  async recommend(query: string, limit = 6) {
    return this.recommenderService.recommend(query, limit);
  }

  async recommendForUser(userId: string, limit = 6) {
    const user = await (this.prisma as any).user.findUnique({
      where: { id: userId },
      include: {
        notifications: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) return [];

    const queryParts: string[] = [];
    if (user.name) queryParts.push(user.name);

    if (user.notifications?.length > 0) {
      const topics = user.notifications.map((n: any) => n.title).join(' ');
      queryParts.push(topics);
    }

    const query = queryParts.join(' ') || 'educación ambiental Perú';
    return this.recommenderService.recommend(query, limit);
  }

  async recommendByCategory(category: string, limit = 4) {
    const categories: Record<string, string> = {
      courses: 'cursos educación ambiental Perú',
      news: 'noticias ambientales Perú conservación',
      projects: 'proyectos conservación ambiental Perú',
      species: 'especies biodiversidad Perú fauna flora',
      educational: 'material educativo ambiental Perú',
      events: 'eventos ambientales Perú',
      activities: 'actividades voluntariado ambiental Perú',
    };

    const query = categories[category] || category;
    return this.recommenderService.recommend(query, limit);
  }

  async recommendForItem(itemId: string, itemType: string, limit = 4) {
    return this.recommenderService.recommendForItem(itemId, itemType, limit);
  }
}
