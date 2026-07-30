import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly service;
    constructor(service: UploadsService);
    upload(file: Express.Multer.File, userId: string): Promise<{
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
