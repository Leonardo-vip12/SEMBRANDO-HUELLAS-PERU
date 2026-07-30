import { EventStatus } from '@prisma/client';
export declare class CreateEventDto {
    title: string;
    slug?: string;
    description?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    coverImage?: string;
    status?: EventStatus;
    categoryId?: string;
}
