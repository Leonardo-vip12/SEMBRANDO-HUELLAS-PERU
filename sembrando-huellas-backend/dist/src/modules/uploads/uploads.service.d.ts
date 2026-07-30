import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
export declare class UploadsService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
    upload(file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        url: string | null;
        path: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        provider: string;
        bucket: string | null;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            url: string | null;
            path: string;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            provider: string;
            bucket: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
