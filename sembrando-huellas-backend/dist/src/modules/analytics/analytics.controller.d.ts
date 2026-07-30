import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly service;
    constructor(service: AnalyticsService);
    getContentByMonth(): Promise<{
        news: number;
        events: number;
        projects: number;
        month: string;
    }[]>;
    getDonationTrend(): Promise<{
        month: string;
        total: number;
    }[]>;
}
