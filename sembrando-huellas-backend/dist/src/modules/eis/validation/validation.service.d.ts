import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
export interface ValidationResult {
    isValidated: boolean;
    confidence: 'alta' | 'media' | 'baja';
    sources: string[];
    warnings: string[];
    reviewedBy?: string;
    reviewedAt?: string;
    disclaimer: string;
}
export declare class ValidationService {
    private kbService;
    private readonly logger;
    constructor(kbService: KnowledgeBaseService);
    validateResponse(response: string, sourceInfo?: {
        query?: string;
        provider?: string;
        model?: string;
    }): Promise<ValidationResult>;
    validateContent(content: string, category: string): Promise<{
        approved: boolean;
        suggestions: string[];
        issues: string[];
        score: number;
    }>;
    addDisclaimer(response: string, validation: ValidationResult): string;
    private containsUncertainty;
    private calculateConfidence;
}
