import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class SiaBiodiversityService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
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
    getMapData(): Promise<{
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
    private groupByMonth;
}
