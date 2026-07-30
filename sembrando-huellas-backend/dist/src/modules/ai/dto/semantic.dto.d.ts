export declare class SemanticSearchDto {
    query: string;
    collections?: string[];
    limit?: number;
    threshold?: number;
}
export declare class SemanticSearchResultDto {
    id: string;
    content: string;
    source: string;
    collection: string;
    score: number;
    metadata?: Record<string, any>;
}
export declare class TranslatorDto {
    text: string;
    sourceLanguage?: string;
    targetLanguage: string;
    context?: string;
}
export declare class SummarizeDto {
    text: string;
    length?: string;
    format?: string;
}
