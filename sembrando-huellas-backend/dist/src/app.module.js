"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const config_2 = require("./config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./prisma/prisma.module");
const redis_module_1 = require("./redis/redis.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const roles_module_1 = require("./modules/roles/roles.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const news_module_1 = require("./modules/news/news.module");
const categories_module_1 = require("./modules/categories/categories.module");
const programs_module_1 = require("./modules/programs/programs.module");
const projects_module_1 = require("./modules/projects/projects.module");
const species_module_1 = require("./modules/species/species.module");
const gallery_module_1 = require("./modules/gallery/gallery.module");
const events_module_1 = require("./modules/events/events.module");
const resources_module_1 = require("./modules/resources/resources.module");
const partners_module_1 = require("./modules/partners/partners.module");
const volunteers_module_1 = require("./modules/volunteers/volunteers.module");
const faq_module_1 = require("./modules/faq/faq.module");
const team_module_1 = require("./modules/team/team.module");
const testimonials_module_1 = require("./modules/testimonials/testimonials.module");
const organization_module_1 = require("./modules/organization/organization.module");
const impact_module_1 = require("./modules/impact/impact.module");
const donations_module_1 = require("./modules/donations/donations.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const audit_module_1 = require("./modules/audit/audit.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const settings_module_1 = require("./modules/settings/settings.module");
const ai_module_1 = require("./modules/ai/ai.module");
const eis_module_1 = require("./modules/eis/eis.module");
const sia_module_1 = require("./modules/sia/sia.module");
const i18n_module_1 = require("./modules/i18n/i18n.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const language_middleware_1 = require("./common/middleware/language.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(language_middleware_1.LanguageMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                load: [config_2.default],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            news_module_1.NewsModule,
            categories_module_1.CategoriesModule,
            programs_module_1.ProgramsModule,
            projects_module_1.ProjectsModule,
            species_module_1.SpeciesModule,
            gallery_module_1.GalleryModule,
            events_module_1.EventsModule,
            resources_module_1.ResourcesModule,
            partners_module_1.PartnersModule,
            volunteers_module_1.VolunteersModule,
            faq_module_1.FaqModule,
            team_module_1.TeamModule,
            testimonials_module_1.TestimonialsModule,
            organization_module_1.OrganizationModule,
            impact_module_1.ImpactModule,
            donations_module_1.DonationsModule,
            notifications_module_1.NotificationsModule,
            audit_module_1.AuditModule,
            uploads_module_1.UploadsModule,
            dashboard_module_1.DashboardModule,
            analytics_module_1.AnalyticsModule,
            settings_module_1.SettingsModule,
            ai_module_1.AiModule,
            eis_module_1.EisModule,
            sia_module_1.SiaModule,
            i18n_module_1.I18nModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map