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
var RecommenderV2Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommenderV2Service = void 0;
const common_1 = require("@nestjs/common");
const recommender_service_1 = require("../../ai/recommender/recommender.service");
const prisma_service_1 = require("../../../prisma/prisma.service");
let RecommenderV2Service = RecommenderV2Service_1 = class RecommenderV2Service {
    constructor(recommenderService, prisma) {
        this.recommenderService = recommenderService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(RecommenderV2Service_1.name);
    }
    async recommend(query, limit = 6) {
        return this.recommenderService.recommend(query, limit);
    }
    async recommendForUser(userId, limit = 6) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                notifications: { take: 10, orderBy: { createdAt: 'desc' } },
            },
        });
        if (!user)
            return [];
        const queryParts = [];
        if (user.name)
            queryParts.push(user.name);
        if (user.notifications?.length > 0) {
            const topics = user.notifications.map((n) => n.title).join(' ');
            queryParts.push(topics);
        }
        const query = queryParts.join(' ') || 'educación ambiental Perú';
        return this.recommenderService.recommend(query, limit);
    }
    async recommendByCategory(category, limit = 4) {
        const categories = {
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
    async recommendForItem(itemId, itemType, limit = 4) {
        return this.recommenderService.recommendForItem(itemId, itemType, limit);
    }
};
exports.RecommenderV2Service = RecommenderV2Service;
exports.RecommenderV2Service = RecommenderV2Service = RecommenderV2Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [recommender_service_1.RecommenderService,
        prisma_service_1.PrismaService])
], RecommenderV2Service);
//# sourceMappingURL=recommender-v2.service.js.map