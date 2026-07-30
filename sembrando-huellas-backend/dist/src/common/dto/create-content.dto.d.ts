import { ContentStatus } from '@prisma/client';
export declare class CreateContentDto {
    title: string;
    slug?: string;
    description?: string;
    content?: string;
    coverImage?: string;
    status?: ContentStatus;
}
