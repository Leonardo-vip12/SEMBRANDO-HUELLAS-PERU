export declare class GenerateCertificateDto {
    recipientName: string;
    recipientEmail?: string;
    certificateType: string;
    programName: string;
    hours?: string;
    eventDate?: string;
}
export declare class VerifyCertificateDto {
    code: string;
}
