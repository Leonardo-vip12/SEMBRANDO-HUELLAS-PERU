import { ContentStatus } from '@prisma/client';
export declare class CreateNewsDto {
    title: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    status?: ContentStatus;
    featured?: boolean;
    author?: string;
    categoryId?: string;
}
