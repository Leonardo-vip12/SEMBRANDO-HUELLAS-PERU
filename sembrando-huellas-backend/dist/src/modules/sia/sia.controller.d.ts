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
export declare class SiaController {
    private readonly dashboardService;
    private readonly biodiversityService;
    private readonly mapsService;
    private readonly analyticsService;
    private readonly reportsService;
    private readonly indicatorsService;
    private readonly citizenScienceService;
    private readonly alertsService;
    private readonly comparatorService;
    private readonly dataCenterService;
    private readonly geospatialService;
    private readonly aiReportsService;
    private readonly transparencyService;
    private readonly monitoringService;
    constructor(dashboardService: SiaDashboardService, biodiversityService: SiaBiodiversityService, mapsService: SiaMapsService, analyticsService: SiaAnalyticsService, reportsService: SiaReportsService, indicatorsService: SiaIndicatorsService, citizenScienceService: SiaCitizenScienceService, alertsService: SiaAlertsService, comparatorService: SiaComparatorService, dataCenterService: SiaDataCenterService, geospatialService: SiaGeospatialService, aiReportsService: SiaAiReportsService, transparencyService: SiaTransparencyService, monitoringService: SiaMonitoringService);
    getDashboard(startDate?: string, endDate?: string, region?: string, institution?: string, projectId?: string): Promise<{
        activities: number;
        institutions: number;
        students: number;
        teachers: number;
        treesPlanted: number;
        speciesRegistered: number;
        observations: number;
        campaignsExecuted: number;
        resourcesPublished: number;
        volunteerHours: number;
        totalProjects: number;
        totalEvents: number;
    }>;
    getTimeSeries(metric: string, startDate?: string, endDate?: string, interval?: string): Promise<{
        period: string;
        count: number;
    }[]>;
    getSpeciesDistribution(): Promise<{
        byCategory: Record<string, number>;
        byConservationStatus: Record<string, number>;
        byRegion: Record<string, number>;
    }>;
    getObservationsTimeline(startDate?: string, endDate?: string): Promise<{
        month: string;
        count: number;
    }[]>;
    getHistoricalRecords(page?: number, limit?: number, speciesName?: string, region?: string, startDate?: string, endDate?: string): Promise<{
        data: ({
            user: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ObservationStatus;
            userId: string | null;
            scientificName: string | null;
            images: string[];
            confidence: number | null;
            habitat: string | null;
            reviewedBy: string | null;
            reviewedAt: Date | null;
            speciesName: string | null;
            quantity: number;
            latitude: number;
            longitude: number;
            observedAt: Date;
            weather: string | null;
            comments: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getConservationStatus(): Promise<Record<string, number>>;
    getTemporalComparison(year1: number, year2: number): Promise<{
        year1: {
            year: number;
            total: number;
            monthly: {
                month: string;
                count: number;
            }[];
        };
        year2: {
            year: number;
            total: number;
            monthly: {
                month: string;
                count: number;
            }[];
        };
    }>;
    getBiodiversityMapData(): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ObservationStatus;
        scientificName: string | null;
        images: string[];
        speciesName: string | null;
        quantity: number;
        latitude: number;
        longitude: number;
        observedAt: Date;
    }[]>;
    getLayers(): Promise<{
        layers: {
            id: string;
            name: string;
            type: string;
            visible: boolean;
            count: number;
        }[];
    }>;
    getLayerData(layer: string, region?: string): Promise<{
        type: string;
        features: {
            type: string;
            geometry: {
                type: string;
                coordinates: any[];
            };
            properties: {
                id: any;
                speciesName: any;
                scientificName: any;
                quantity: any;
                date: any;
                status: any;
            };
        }[];
    } | {
        type: string;
        features: {
            type: string;
            geometry: {
                type: string;
                coordinates: number[];
            };
            properties: {
                id: any;
                name: any;
                scientificName: any;
                category: any;
                conservationStatus: any;
                region: any;
                image: any;
            };
        }[];
    } | {
        type: string;
        features: {
            type: string;
            geometry: any;
            properties: {
                id: any;
                name: any;
                type: any;
                color: any;
            };
        }[];
    } | {
        type: string;
        features: {
            type: string;
            geometry: {
                type: string;
                coordinates: number[];
            };
            properties: {
                id: any;
                title: any;
                date: any;
                image: any;
            };
        }[];
    } | {
        type: string;
        features: {
            type: string;
            geometry: {
                type: string;
                coordinates: number[];
            };
            properties: {
                id: any;
                name: any;
                type: any;
                logo: any;
                description: any;
            };
        }[];
    } | {
        type: string;
        features: {
            type: string;
            geometry: {
                type: string;
                coordinates: number[];
            };
            properties: {
                id: any;
                label: any;
                value: any;
                year: any;
                description: any;
            };
        }[];
    }>;
    searchLocation(query: string): Promise<{
        projects: {
            id: string;
            slug: string;
            title: string;
            location: string | null;
            region: string | null;
        }[];
        events: {
            id: string;
            slug: string;
            title: string;
            location: string | null;
        }[];
        species: {
            id: string;
            name: string;
            slug: string;
            scientificName: string | null;
            region: string | null;
        }[];
    }>;
    getLegend(): Promise<{
        layers: {
            id: string;
            label: string;
            color: string;
            icon: string;
        }[];
    }>;
    getLineChart(metric: string, period: string): Promise<{
        metric: string;
        period: string;
        data: {
            label: string;
            value: number;
        }[];
    }>;
    getBarChart(groupBy: string, metric: string): Promise<{
        groupBy: string;
        metric: string;
        data: {
            label: string;
            value: number;
        }[];
    }>;
    getPieChart(category: string): Promise<{
        groupBy: string;
        metric: string;
        data: {
            label: string;
            value: number;
        }[];
    } | {
        category: "observationStatus";
        data: {
            label: string;
            value: number;
        }[];
    } | {
        category: "partnerType";
        data: {
            label: string;
            value: number;
        }[];
    } | {
        category: string;
        data: never[];
    }>;
    getRadarChart(dimensions: string): Promise<{
        dimensions: string[];
        data: {
            dimension: string;
            value: number;
        }[];
    }>;
    getHeatmap(region?: string, date?: string): Promise<{
        type: string;
        features: {
            type: string;
            geometry: {
                type: string;
                coordinates: any[];
            };
            properties: {
                weight: any;
                speciesName: any;
                date: any;
            };
        }[];
    }>;
    getAccumulatedIndicators(): Promise<{
        id: any;
        name: any;
        slug: any;
        category: any;
        unit: any;
        currentTotal: number;
        target: any;
        progress: number | null;
        data: any;
    }[]>;
    generateReport(dto: any): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.SiaReportType;
        title: string;
        format: import(".prisma/client").$Enums.SiaReportFormat | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        fileUrl: string | null;
        generatedAt: Date | null;
        filters: import("@prisma/client/runtime/library").JsonValue | null;
        createdBy: string | null;
    } | null>;
    listReports(page?: number, limit?: number, type?: string): Promise<{
        data: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.SiaReportType;
            title: string;
            format: import(".prisma/client").$Enums.SiaReportFormat | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            fileUrl: string | null;
            generatedAt: Date | null;
            filters: import("@prisma/client/runtime/library").JsonValue | null;
            createdBy: string | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getReport(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.SiaReportType;
        title: string;
        format: import(".prisma/client").$Enums.SiaReportFormat | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        fileUrl: string | null;
        generatedAt: Date | null;
        filters: import("@prisma/client/runtime/library").JsonValue | null;
        createdBy: string | null;
    }>;
    deleteReport(id: string): Promise<{
        message: string;
    }>;
    getReportStats(): Promise<Record<string, number>>;
    createIndicator(dto: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        category: import(".prisma/client").$Enums.SiaIndicatorCategory;
        year: number | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        region: string | null;
        active: boolean;
        source: string | null;
        institution: string | null;
        unit: string | null;
        formula: string | null;
        target: number | null;
        current: number | null;
        configurable: boolean;
    }>;
    updateIndicator(id: string, dto: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        category: import(".prisma/client").$Enums.SiaIndicatorCategory;
        year: number | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        region: string | null;
        active: boolean;
        source: string | null;
        institution: string | null;
        unit: string | null;
        formula: string | null;
        target: number | null;
        current: number | null;
        configurable: boolean;
    }>;
    listIndicators(category?: string, active?: string, year?: number): Promise<({
        _count: {
            records: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        category: import(".prisma/client").$Enums.SiaIndicatorCategory;
        year: number | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        region: string | null;
        active: boolean;
        source: string | null;
        institution: string | null;
        unit: string | null;
        formula: string | null;
        target: number | null;
        current: number | null;
        configurable: boolean;
    })[]>;
    getIndicatorCategories(): Promise<("EDUCACION" | "AMBIENTAL" | "SOCIAL" | "ECONOMICO" | "PARTICIPACION" | "CONSERVACION")[]>;
    getIndicatorSummary(): Promise<Record<string, any[]>>;
    getIndicator(id: string): Promise<{
        records: {
            id: string;
            createdAt: Date;
            value: number;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            region: string | null;
            date: Date;
            institution: string | null;
            indicatorId: string;
        }[];
        alertRules: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.SiaAlertStatus;
            severity: import(".prisma/client").$Enums.SiaAlertSeverity;
            threshold: number;
            indicatorId: string | null;
            condition: string;
            channel: string;
            cooldown: number;
            lastTriggeredAt: Date | null;
            config: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        category: import(".prisma/client").$Enums.SiaIndicatorCategory;
        year: number | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        region: string | null;
        active: boolean;
        source: string | null;
        institution: string | null;
        unit: string | null;
        formula: string | null;
        target: number | null;
        current: number | null;
        configurable: boolean;
    }>;
    deleteIndicator(id: string): Promise<{
        message: string;
    }>;
    addIndicatorRecord(id: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        value: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        region: string | null;
        date: Date;
        institution: string | null;
        indicatorId: string;
    }>;
    getIndicatorRecords(id: string, startDate?: string, endDate?: string): Promise<{
        id: string;
        createdAt: Date;
        value: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        region: string | null;
        date: Date;
        institution: string | null;
        indicatorId: string;
    }[]>;
    listCitizenObservations(page?: number, limit?: number, status?: string, speciesName?: string, region?: string, assignedTo?: string, startDate?: string, endDate?: string): Promise<{
        data: ({
            user: {
                id: string;
                name: string;
                email: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.SiaObservationStatus;
            userId: string | null;
            scientificName: string | null;
            images: string[];
            confidence: number | null;
            habitat: string | null;
            reviewedBy: string | null;
            reviewedAt: Date | null;
            speciesName: string | null;
            quantity: number;
            latitude: number;
            longitude: number;
            observedAt: Date;
            weather: string | null;
            comments: string | null;
            assignedTo: string | null;
            revisionHistory: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getCitizenObservation(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SiaObservationStatus;
        userId: string | null;
        scientificName: string | null;
        images: string[];
        confidence: number | null;
        habitat: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        speciesName: string | null;
        quantity: number;
        latitude: number;
        longitude: number;
        observedAt: Date;
        weather: string | null;
        comments: string | null;
        assignedTo: string | null;
        revisionHistory: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    reviewObservation(id: string, dto: any): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SiaObservationStatus;
        userId: string | null;
        scientificName: string | null;
        images: string[];
        confidence: number | null;
        habitat: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        speciesName: string | null;
        quantity: number;
        latitude: number;
        longitude: number;
        observedAt: Date;
        weather: string | null;
        comments: string | null;
        assignedTo: string | null;
        revisionHistory: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    assignObservation(id: string, userId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SiaObservationStatus;
        userId: string | null;
        scientificName: string | null;
        images: string[];
        confidence: number | null;
        habitat: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        speciesName: string | null;
        quantity: number;
        latitude: number;
        longitude: number;
        observedAt: Date;
        weather: string | null;
        comments: string | null;
        assignedTo: string | null;
        revisionHistory: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getCitizenScienceStats(): Promise<Record<string, number>>;
    getReviewHistory(id: string): Promise<any[]>;
    createAlertRule(dto: any): Promise<any>;
    updateAlertRule(id: string, dto: any): Promise<any>;
    listAlertRules(status?: string, severity?: string): Promise<any>;
    getAlertRule(id: string): Promise<any>;
    deleteAlertRule(id: string): Promise<void>;
    getAlertLogs(ruleId?: string, severity?: string, read?: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    markAlertRead(id: string): Promise<any>;
    markAllAlertsRead(): Promise<{
        updated: any;
    }>;
    checkAlertThresholds(): Promise<any[]>;
    getAlertStats(): Promise<{
        severity: Record<string, number>;
        status: Record<string, number>;
        totalLogs: any;
        unreadLogs: any;
    }>;
    compare(dto: any): Promise<{
        type: string;
        labels: any;
        datasets: any;
        total: any;
    } | {
        type: string;
        labels: string[];
        datasets: {
            label: string;
            data: any;
            dates: any;
            average: number;
            count: any;
        }[];
        variation: number;
        variationPercent: number;
    }>;
    getComparisonChart(type: string, dimension: string): Promise<{
        type: string;
        dimension: string;
        chartType: string;
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            dates: string[];
        }[];
    }>;
    createDataset(dto: any): Promise<any>;
    updateDataset(id: string, dto: any): Promise<any>;
    listDatasets(category?: string, visibility?: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getDataset(id: string): Promise<any>;
    deleteDataset(id: string): Promise<void>;
    getDataCenterMetadata(): Promise<{
        totalDatasets: any;
        categories: any;
        formats: any;
        lastUpdated: any;
    }>;
    getTimeSeriesData(indicatorId?: string, startDate?: string, endDate?: string): Promise<{
        title: string;
        generatedAt: string;
        totalRecords: any;
        data: any;
    }>;
    getOpenDataCatalog(): Promise<{
        catalog: {
            title: string;
            description: string;
            modified: string;
            publisher: string;
            license: string;
        };
        datasets: any;
        total: any;
    }>;
    createZone(dto: any): Promise<any>;
    updateZone(id: string, dto: any): Promise<any>;
    listZones(type?: string, active?: string): Promise<any>;
    getZone(id: string): Promise<any>;
    deleteZone(id: string): Promise<void>;
    getClustering(layer: string, zoom?: number, north?: number, south?: number, east?: number, west?: number): Promise<{
        layer: string;
        zoom: number | null;
        bounds: {
            north: number;
            south: number;
            east: number;
            west: number;
        } | null;
        clusters: {
            latitude: number;
            longitude: number;
            count: number;
            points: any[];
        }[];
        totalPoints: number;
    }>;
    getDensity(layer: string, region?: string): Promise<{
        layer: "observations" | "monitoring";
        region: string | null;
        points: {
            lat: any;
            lng: any;
            weight: number;
        }[];
        totalPoints: number;
        maxIntensity: number;
        config: {
            radius: number;
            blur: number;
            gradient: {
                0.4: string;
                0.6: string;
                0.7: string;
                0.8: string;
                1: string;
            };
        };
    }>;
    spatialQuery(dto: {
        layer: string;
        type: string;
        geometry: any;
    }): Promise<{
        layer: string;
        queryType: "intersects" | "within" | "near";
        geometry: any;
        results: any[];
        total: number;
        note: string;
    }>;
    bufferAnalysis(dto: {
        layer: string;
        lat: number;
        lng: number;
        radiusKm: number;
    }): Promise<{
        layer: string;
        center: {
            latitude: number;
            longitude: number;
        };
        radiusKm: number;
        bounds: {
            north: number;
            south: number;
            east: number;
            west: number;
        };
        features: any[];
        totalFeatures: number;
    }>;
    generateAiSummary(dto: any): Promise<{
        summary: string;
        disclaimer: string;
        data: {
            type: string;
            period: {
                start: string | null;
                end: string | null;
            };
            region: string | null;
            indicators: any;
            aiQueryStats: {
                total: any;
                averageLatency: number;
            };
        };
        charts: any[];
    } | {
        summary: string;
        disclaimer: string;
        data: null;
        charts: never[];
    }>;
    detectTrends(dto: {
        metric: string;
        period: string;
    }): Promise<{
        metric: string;
        period: string;
        trends: never[];
        message: string;
        dataPoints?: undefined;
    } | {
        metric: string;
        period: string;
        trends: {
            indicator: any;
            direction: "up" | "down" | "stable";
            magnitude: number;
            confidence: number;
            period: string;
            startValue: any;
            endValue: any;
            average: number;
            change: number;
            changePercent: number;
        }[];
        dataPoints: any;
        message?: undefined;
    }>;
    generateDraft(dto: any): Promise<{
        draft: boolean;
        type: string;
        filters: any;
        generatedAt: string;
        sections: {
            title: string;
            type: string;
            data: any;
        }[];
    }>;
    explainChart(dto: {
        chartType: string;
        data: any;
    }): Promise<{
        chartType: string;
        explanation: string;
        disclaimer: string;
        stats?: undefined;
    } | {
        chartType: string;
        explanation: string;
        disclaimer: string;
        stats: {
            min: number;
            max: number;
            avg: number;
            trend: string;
        };
    }>;
    suggestActions(dto: {
        data: any;
    }): Promise<{
        suggestions: never[];
        disclaimer: string;
        total?: undefined;
    } | {
        suggestions: {
            indicator: string;
            action: string;
            priority: string;
        }[];
        total: number;
        disclaimer: string;
    }>;
    getPublicIndicators(): Promise<any>;
    getPublicProjects(): Promise<{
        total: any;
        projects: any;
    }>;
    getImpactSummary(): Promise<{
        totalImpactMetrics: any;
        totalIndicators: any;
        totalImpactValue: any;
        categories: {
            name: string;
            count: number;
            total: number;
            indicators: any[];
        }[];
        lastUpdated: string;
    }>;
    getPublicDocuments(): Promise<{
        totalDocuments: any;
        resources: any;
        knowledgeBaseEntries: any;
        lastUpdated: string;
    }>;
    getOpenStats(): Promise<{
        totals: {
            indicators: any;
            projects: any;
            volunteers: any;
            events: any;
            citizenObservations: any;
            publicDatasets: any;
        };
        lastUpdated: string;
    }>;
    getDownloadableData(): Promise<{
        availableDatasets: any;
        datasets: any;
        formats: unknown[];
    }>;
    getSystemStatus(): Promise<{
        api: {
            status: string;
            uptime: string;
        };
        database: {
            status: string;
        };
        redis: {
            status: string;
        };
        aiProviders: {
            name: string;
            healthy: boolean;
        }[];
        uptime: string;
        timestamp: string;
    }>;
    getSyncStatus(): Promise<{
        status: string;
        lastSync: string;
        stats: {
            indicators: any;
            records: any;
            alertLogs: any;
            reports: any;
        };
        error?: undefined;
    } | {
        status: string;
        lastSync: null;
        error: string;
        stats?: undefined;
    }>;
    getActiveServices(): Promise<{
        services: {
            name: string;
            status: string;
            lastHeartbeat: Date;
            uptime: string;
        }[];
        total: number;
    }>;
    getQueues(): Promise<{
        queues: {
            name: string;
            pending: number;
            processing: number;
            failed: number;
        }[];
        note: string;
    }>;
    getProcesses(): Promise<{
        processes: {
            name: string;
            status: string;
            lastRun: null;
            interval: string;
        }[];
    }>;
    getErrors(page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getResourceUsage(): Promise<{
        cpu: {
            usage: number;
            cores: number;
        };
        memory: {
            used: number;
            total: number;
            percent: number;
        };
        disk: {
            used: number;
            total: number;
            percent: number;
        };
        note: string;
        timestamp: string;
    }>;
    createMonitoringLog(dto: any): Promise<any>;
    getMonitoringLogs(service?: string, status?: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
