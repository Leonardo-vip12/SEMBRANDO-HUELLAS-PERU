import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';
export declare class SiaGeospatialService {
    private prisma;
    private aiService?;
    protected logger: Logger;
    constructor(prisma: PrismaService, aiService?: AiService | undefined);
    createZone(dto: {
        name: string;
        type?: string;
        description?: string;
        geometry?: any;
        centerLat?: number;
        centerLng?: number;
        color?: string;
    }): Promise<any>;
    updateZone(id: string, dto: any): Promise<any>;
    findAllZones(type?: string, active?: boolean): Promise<any>;
    findZone(id: string): Promise<any>;
    deleteZone(id: string): Promise<void>;
    getPointClustering(layer: string, zoom?: number, bounds?: {
        north: number;
        south: number;
        east: number;
        west: number;
    }): Promise<{
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
    getDensityHeatmap(layer: string, region?: string): Promise<{
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
    getSpatialQuery(layer: string, type: 'intersects' | 'within' | 'near', geometry: any): Promise<{
        layer: string;
        queryType: "intersects" | "within" | "near";
        geometry: any;
        results: any[];
        total: number;
        note: string;
    }>;
    getBufferAnalysis(layer: string, center: {
        lat: number;
        lng: number;
    }, radiusKm: number): Promise<{
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
}
