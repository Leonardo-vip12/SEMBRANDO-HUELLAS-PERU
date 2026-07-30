export declare class AddKnowledgeEntryDto {
    title: string;
    content: string;
    source: string;
    sourceType: string;
    category?: string;
    tags?: string[];
    metadata?: any;
}
export declare class KnowledgeSearchDto {
    query: string;
    category?: string;
    limit?: number;
}
