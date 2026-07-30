export declare class CertificatesService {
    private readonly logger;
    generateCertificate(dto: {
        recipientName: string;
        certificateType: string;
        programName: string;
        hours?: string;
        eventDate?: string;
        language?: string;
    }): Promise<{
        content: string;
        verificationCode: string;
        qrDataUrl?: string;
        verificationUrl: string;
    }>;
    verifyCertificate(code: string): Promise<{
        valid: boolean;
        message: string;
    }>;
}
