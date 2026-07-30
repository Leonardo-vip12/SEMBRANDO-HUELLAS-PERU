import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { NewsModule } from './modules/news/news.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SpeciesModule } from './modules/species/species.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { EventsModule } from './modules/events/events.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { PartnersModule } from './modules/partners/partners.module';
import { VolunteersModule } from './modules/volunteers/volunteers.module';
import { FaqModule } from './modules/faq/faq.module';
import { TeamModule } from './modules/team/team.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { ImpactModule } from './modules/impact/impact.module';
import { DonationsModule } from './modules/donations/donations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditModule } from './modules/audit/audit.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AiModule } from './modules/ai/ai.module';
import { EisModule } from './modules/eis/eis.module';
import { SiaModule } from './modules/sia/sia.module';
import { I18nModule } from './modules/i18n/i18n.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { LanguageMiddleware } from './common/middleware/language.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    NewsModule,
    CategoriesModule,
    ProgramsModule,
    ProjectsModule,
    SpeciesModule,
    GalleryModule,
    EventsModule,
    ResourcesModule,
    PartnersModule,
    VolunteersModule,
    FaqModule,
    TeamModule,
    TestimonialsModule,
    OrganizationModule,
    ImpactModule,
    DonationsModule,
    NotificationsModule,
    AuditModule,
    UploadsModule,
    DashboardModule,
    AnalyticsModule,
    SettingsModule,
    AiModule,
    EisModule,
    SiaModule,
    I18nModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}
