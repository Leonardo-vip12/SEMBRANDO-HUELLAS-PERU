import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
export declare class OrganizationService {
    private prisma;
    protected logger: Logger;
    constructor(prisma: PrismaService);
    find(): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        legalName: string | null;
        mission: string | null;
        vision: string | null;
        logo: string | null;
        logoAlt: string | null;
        address: string | null;
        phone: string | null;
        website: string | null;
        foundingYear: number | null;
        socialMedia: import("@prisma/client/runtime/library").JsonValue | null;
        values: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(data: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        legalName: string | null;
        mission: string | null;
        vision: string | null;
        logo: string | null;
        logoAlt: string | null;
        address: string | null;
        phone: string | null;
        website: string | null;
        foundingYear: number | null;
        socialMedia: import("@prisma/client/runtime/library").JsonValue | null;
        values: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
