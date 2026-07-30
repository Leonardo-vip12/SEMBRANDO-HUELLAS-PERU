import { OrganizationService } from './organization.service';
export declare class OrganizationController {
    private readonly service;
    constructor(service: OrganizationService);
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
    update(dto: any): Promise<{
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
