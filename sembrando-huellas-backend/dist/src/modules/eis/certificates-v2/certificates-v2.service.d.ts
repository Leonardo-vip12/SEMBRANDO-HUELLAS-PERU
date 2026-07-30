import { PrismaService } from '../../../prisma/prisma.service';
import { CertificatesService } from '../../ai/certificates/certificates.service';
export declare class CertificatesV2Service {
    private prisma;
    private certificatesService;
    private readonly logger;
    constructor(prisma: PrismaService, certificatesService: CertificatesService);
    generate(dto: {
        recipientName: string;
        recipientEmail?: string;
        certificateType: string;
        programName: string;
        hours?: string;
        eventDate?: string;
    }): Promise<{
        id: any;
        content: string;
        verificationCode: string;
        qrDataUrl?: string;
        verificationUrl: string;
    }>;
    verify(code: string): Promise<{
        valid: boolean;
        message: string;
        revokedAt?: undefined;
        certificate?: undefined;
    } | {
        valid: boolean;
        message: string;
        revokedAt: any;
        certificate?: undefined;
    } | {
        valid: boolean;
        certificate: {
            recipientName: any;
            certificateType: any;
            programName: any;
            hours: any;
            issuedAt: any;
            verificationCode: any;
        };
        message: string;
        revokedAt?: undefined;
    }>;
    revoke(code: string): Promise<{
        revoked: boolean;
        code: string;
    }>;
    list(page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(): Promise<{
        total: any;
        active: any;
        revoked: any;
    }>;
}
