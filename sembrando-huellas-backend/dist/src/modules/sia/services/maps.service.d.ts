import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class SiaMapsService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
    getLayers(): Promise<{
        layers: {
            id: string;
            name: string;
            type: string;
            visible: boolean;
            count: number;
        }[];
    }>;
    getLayerData(layer: string, filters?: any): Promise<{
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
    private parseCoords;
}
