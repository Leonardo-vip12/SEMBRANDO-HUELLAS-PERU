import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
type SiaReportType = 'INSTITUCIONAL' | 'CAMPANA' | 'PROYECTO' | 'EDUCATIVO' | 'BIODIVERSIDAD';
type SiaReportFormat = 'PDF' | 'EXCEL' | 'CSV';
export declare class SiaReportsService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
    generateReport(dto: {
        title: string;
        type: SiaReportType;
        description?: string;
        format?: SiaReportFormat;
        filters?: Record<string, any>;
    }): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.SiaReportType;
        title: string;
        format: import(".prisma/client").$Enums.SiaReportFormat | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        fileUrl: string | null;
        generatedAt: Date | null;
        filters: import("@prisma/client/runtime/library").JsonValue | null;
        createdBy: string | null;
    } | null>;
    listReports(page?: number, limit?: number, type?: SiaReportType): Promise<{
        data: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.SiaReportType;
            title: string;
            format: import(".prisma/client").$Enums.SiaReportFormat | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            fileUrl: string | null;
            generatedAt: Date | null;
            filters: import("@prisma/client/runtime/library").JsonValue | null;
            createdBy: string | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getReport(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.SiaReportType;
        title: string;
        format: import(".prisma/client").$Enums.SiaReportFormat | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        fileUrl: string | null;
        generatedAt: Date | null;
        filters: import("@prisma/client/runtime/library").JsonValue | null;
        createdBy: string | null;
    }>;
    deleteReport(id: string): Promise<{
        message: string;
    }>;
    getReportStats(): Promise<Record<string, number>>;
    private collectReportData;
}
export {};
