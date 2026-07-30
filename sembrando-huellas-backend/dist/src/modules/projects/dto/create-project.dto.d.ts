import { ContentStatus } from '@prisma/client';
export declare class CreateProjectDto {
    name: string;
    slug?: string;
    description?: string;
    content?: string;
    coverImage?: string;
    location?: string;
    treesPlanted?: number;
    areaHectares?: number;
    programId?: string;
    status?: ContentStatus;
}
