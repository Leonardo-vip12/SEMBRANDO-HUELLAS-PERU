import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
type SiaObservationStatus = 'PENDING' | 'VALIDATED' | 'APPROVED' | 'REJECTED' | 'NEEDS_CORRECTION';
export declare class SiaCitizenScienceService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
    findAll(query: {
        page?: number;
        limit?: number;
        status?: SiaObservationStatus;
        speciesName?: string;
        region?: string;
        assignedTo?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
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
    findOne(id: string): Promise<{
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
    review(id: string, dto: {
        status: SiaObservationStatus;
        comments?: string;
        assignedTo?: string;
    }): Promise<{
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
    assign(id: string, userId: string): Promise<{
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
    getStats(): Promise<Record<string, number>>;
    getReviewHistory(id: string): Promise<any[]>;
    exportPending(): Promise<({
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
    })[]>;
}
export {};
