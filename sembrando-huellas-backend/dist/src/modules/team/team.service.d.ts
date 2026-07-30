import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
export declare class TeamService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
    findAll(query: any): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            role: string | null;
            isActive: boolean;
            order: number;
            bio: string | null;
            image: string | null;
        }[];
        meta: {
            total: number;
            page: any;
            limit: any;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: string | null;
        isActive: boolean;
        order: number;
        bio: string | null;
        image: string | null;
    }>;
    create(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: string | null;
        isActive: boolean;
        order: number;
        bio: string | null;
        image: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: string | null;
        isActive: boolean;
        order: number;
        bio: string | null;
        image: string | null;
    }>;
    remove(id: string): Promise<void>;
    protected buildSearchFilter(search: string): {
        OR: ({
            name: {
                contains: string;
                mode: "insensitive";
            };
            role?: undefined;
        } | {
            role: {
                contains: string;
                mode: "insensitive";
            };
            name?: undefined;
        })[];
    };
}
