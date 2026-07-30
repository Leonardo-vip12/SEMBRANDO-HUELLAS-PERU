"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiaModule = void 0;
const common_1 = require("@nestjs/common");
const sia_controller_1 = require("./sia.controller");
const dashboard_service_1 = require("./services/dashboard.service");
const biodiversity_service_1 = require("./services/biodiversity.service");
const maps_service_1 = require("./services/maps.service");
const analytics_service_1 = require("./services/analytics.service");
const reports_service_1 = require("./services/reports.service");
const indicators_service_1 = require("./services/indicators.service");
const citizen_science_service_1 = require("./services/citizen-science.service");
const alerts_service_1 = require("./services/alerts.service");
const comparator_service_1 = require("./services/comparator.service");
const data_center_service_1 = require("./services/data-center.service");
const geospatial_service_1 = require("./services/geospatial.service");
const ai_reports_service_1 = require("./services/ai-reports.service");
const transparency_service_1 = require("./services/transparency.service");
const monitoring_service_1 = require("./services/monitoring.service");
let SiaModule = class SiaModule {
};
exports.SiaModule = SiaModule;
exports.SiaModule = SiaModule = __decorate([
    (0, common_1.Module)({
        controllers: [sia_controller_1.SiaController],
        providers: [
            dashboard_service_1.SiaDashboardService,
            biodiversity_service_1.SiaBiodiversityService,
            maps_service_1.SiaMapsService,
            analytics_service_1.SiaAnalyticsService,
            reports_service_1.SiaReportsService,
            indicators_service_1.SiaIndicatorsService,
            citizen_science_service_1.SiaCitizenScienceService,
            alerts_service_1.SiaAlertsService,
            comparator_service_1.SiaComparatorService,
            data_center_service_1.SiaDataCenterService,
            geospatial_service_1.SiaGeospatialService,
            ai_reports_service_1.SiaAiReportsService,
            transparency_service_1.SiaTransparencyService,
            monitoring_service_1.SiaMonitoringService,
        ],
        exports: [
            dashboard_service_1.SiaDashboardService,
            biodiversity_service_1.SiaBiodiversityService,
            maps_service_1.SiaMapsService,
            analytics_service_1.SiaAnalyticsService,
            reports_service_1.SiaReportsService,
            indicators_service_1.SiaIndicatorsService,
            citizen_science_service_1.SiaCitizenScienceService,
            alerts_service_1.SiaAlertsService,
            comparator_service_1.SiaComparatorService,
            data_center_service_1.SiaDataCenterService,
            geospatial_service_1.SiaGeospatialService,
            ai_reports_service_1.SiaAiReportsService,
            transparency_service_1.SiaTransparencyService,
            monitoring_service_1.SiaMonitoringService,
        ],
    })
], SiaModule);
//# sourceMappingURL=sia.module.js.map