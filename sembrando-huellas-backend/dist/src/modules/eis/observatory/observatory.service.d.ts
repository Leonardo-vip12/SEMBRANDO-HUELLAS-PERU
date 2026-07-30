import { PrismaService } from '../../../prisma/prisma.service';
export declare class ObservatoryService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    register(dto: {
        speciesName?: string;
        scientificName?: string;
        quantity?: number;
        latitude: number;
        longitude: number;
        observedAt?: string;
        habitat?: string;
        weather?: string;
        comments?: string;
        images?: string[];
        userId?: string;
    }): Promise<any>;
    findAll(page?: number, limit?: number, status?: string): Promise<any>;
    getMapData(status?: string): Promise<any[]>;
    verifyObservation(id: string, reviewerId: string, status: 'VERIFIED' | 'REJECTED' | 'NEEDS_REVIEW'): Promise<any>;
    getStats(): Promise<any>;
}
