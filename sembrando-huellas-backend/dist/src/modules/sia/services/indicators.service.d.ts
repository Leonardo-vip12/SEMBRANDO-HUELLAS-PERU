import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
type SiaIndicatorCategory = 'EDUCACION' | 'AMBIENTAL' | 'SOCIAL' | 'ECONOMICO' | 'PARTICIPACION' | 'CONSERVACION';
export declare class SiaIndicatorsService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
    create(dto: {
        name: string;
        slug: string;
        description?: string;
        category: SiaIndicatorCategory;
        unit?: string;
        formula?: string;
        source?: string;
        target?: number;
        current?: number;
        year?: number;
        region?: string;
        institution?: string;
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        category: import(".prisma/client").$Enums.SiaIndicatorCategory;
        year: number | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        region: string | null;
        active: boolean;
        source: string | null;
        institution: string | null;
        unit: string | null;
        formula: string | null;
        target: number | null;
        current: number | null;
        configurable: boolean;
    }>;
    update(id: string, dto: Partial<{
        name: string;
        slug: string;
        description: string;
        category: SiaIndicatorCategory;
        unit: string;
        formula: string;
        source: string;
        target: number;
        current: number;
        year: number;
        region: string;
        institution: string;
        active: boolean;
    }>): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        category: import(".prisma/client").$Enums.SiaIndicatorCategory;
        year: number | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        region: string | null;
        active: boolean;
        source: string | null;
        institution: string | null;
        unit: string | null;
        formula: string | null;
        target: number | null;
        current: number | null;
        configurable: boolean;
    }>;
    findAll(category?: SiaIndicatorCategory, active?: boolean, year?: number): Promise<({
        _count: {
            records: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        category: import(".prisma/client").$Enums.SiaIndicatorCategory;
        year: number | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        region: string | null;
        active: boolean;
        source: string | null;
        institution: string | null;
        unit: string | null;
        formula: string | null;
        target: number | null;
        current: number | null;
        configurable: boolean;
    })[]>;
    findOne(id: string): Promise<{
        records: {
            id: string;
            createdAt: Date;
            value: number;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            region: string | null;
            date: Date;
            institution: string | null;
            indicatorId: string;
        }[];
        alertRules: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.SiaAlertStatus;
            severity: import(".prisma/client").$Enums.SiaAlertSeverity;
            threshold: number;
            indicatorId: string | null;
            condition: string;
            channel: string;
            cooldown: number;
            lastTriggeredAt: Date | null;
            config: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        category: import(".prisma/client").$Enums.SiaIndicatorCategory;
        year: number | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        region: string | null;
        active: boolean;
        source: string | null;
        institution: string | null;
        unit: string | null;
        formula: string | null;
        target: number | null;
        current: number | null;
        configurable: boolean;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    addRecord(indicatorId: string, dto: {
        value: number;
        date: string;
        region?: string;
        institution?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        value: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        region: string | null;
        date: Date;
        institution: string | null;
        indicatorId: string;
    }>;
    getRecords(indicatorId: string, startDate?: string, endDate?: string): Promise<{
        id: string;
        createdAt: Date;
        value: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        region: string | null;
        date: Date;
        institution: string | null;
        indicatorId: string;
    }[]>;
    getCategories(): Promise<SiaIndicatorCategory[]>;
    getSummary(): Promise<Record<string, any[]>>;
}
export {};
