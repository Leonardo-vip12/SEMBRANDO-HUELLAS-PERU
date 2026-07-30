export declare enum ContentType {
    INFOGRAPHIC = "infografia",
    EDUCATIONAL_CARD = "ficha_educativa",
    QUIZ = "cuestionario",
    GUIDE = "guia",
    SUMMARY = "resumen",
    ACTIVITY = "actividad"
}
export declare class GenerateContentDto {
    topic: string;
    contentType: ContentType;
    level?: string;
    audience?: string;
    format?: string;
    additionalContext?: string;
}
export declare class GenerateNewsDto {
    topic: string;
    keywords?: string;
    tone?: string;
    length?: string;
}
export declare class GenerateCertificateDto {
    recipientName: string;
    certificateType: string;
    programName: string;
    hours?: string;
    eventDate?: string;
    language?: string;
}
