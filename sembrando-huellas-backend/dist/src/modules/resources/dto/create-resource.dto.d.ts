import { ContentStatus } from '@prisma/client';
export declare class CreateResourceDto {
    title: string;
    slug?: string;
    description?: string;
    fileUrl?: string;
    fileType?: string;
    coverImage?: string;
    categoryId?: string;
    status?: ContentStatus;
}
