import { RecommenderService } from '../../ai/recommender/recommender.service';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class RecommenderV2Service {
    private recommenderService;
    private prisma;
    private readonly logger;
    constructor(recommenderService: RecommenderService, prisma: PrismaService);
    recommend(query: string, limit?: number): Promise<import("../../ai/recommender/recommender.service").Recommendation[]>;
    recommendForUser(userId: string, limit?: number): Promise<import("../../ai/recommender/recommender.service").Recommendation[]>;
    recommendByCategory(category: string, limit?: number): Promise<import("../../ai/recommender/recommender.service").Recommendation[]>;
    recommendForItem(itemId: string, itemType: string, limit?: number): Promise<import("../../ai/recommender/recommender.service").Recommendation[]>;
}
