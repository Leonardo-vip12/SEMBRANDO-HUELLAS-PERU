import { Module } from '@nestjs/common';
import { SiaController } from './sia.controller';
import { SiaDashboardService } from './services/dashboard.service';
import { SiaBiodiversityService } from './services/biodiversity.service';
import { SiaMapsService } from './services/maps.service';
import { SiaAnalyticsService } from './services/analytics.service';
import { SiaReportsService } from './services/reports.service';
import { SiaIndicatorsService } from './services/indicators.service';
import { SiaCitizenScienceService } from './services/citizen-science.service';
import { SiaAlertsService } from './services/alerts.service';
import { SiaComparatorService } from './services/comparator.service';
import { SiaDataCenterService } from './services/data-center.service';
import { SiaGeospatialService } from './services/geospatial.service';
import { SiaAiReportsService } from './services/ai-reports.service';
import { SiaTransparencyService } from './services/transparency.service';
import { SiaMonitoringService } from './services/monitoring.service';

@Module({
  controllers: [SiaController],
  providers: [
    SiaDashboardService,
    SiaBiodiversityService,
    SiaMapsService,
    SiaAnalyticsService,
    SiaReportsService,
    SiaIndicatorsService,
    SiaCitizenScienceService,
    SiaAlertsService,
    SiaComparatorService,
    SiaDataCenterService,
    SiaGeospatialService,
    SiaAiReportsService,
    SiaTransparencyService,
    SiaMonitoringService,
  ],
  exports: [
    SiaDashboardService,
    SiaBiodiversityService,
    SiaMapsService,
    SiaAnalyticsService,
    SiaReportsService,
    SiaIndicatorsService,
    SiaCitizenScienceService,
    SiaAlertsService,
    SiaComparatorService,
    SiaDataCenterService,
    SiaGeospatialService,
    SiaAiReportsService,
    SiaTransparencyService,
    SiaMonitoringService,
  ],
})
export class SiaModule {}
