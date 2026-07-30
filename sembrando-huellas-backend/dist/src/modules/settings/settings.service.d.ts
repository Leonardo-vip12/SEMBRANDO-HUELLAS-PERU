import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        value: string | null;
        group: string | null;
    }[]>;
    findByGroup(group: string): Promise<{
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        value: string | null;
        group: string | null;
    }[]>;
    upsert(key: string, value: string, group?: string): Promise<{
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        value: string | null;
        group: string | null;
    }>;
    bulkUpdate(settings: Array<{
        key: string;
        value: string;
        group?: string;
    }>): Promise<{
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        value: string | null;
        group: string | null;
    }[]>;
    remove(key: string): Promise<{
        message: string;
    }>;
}
