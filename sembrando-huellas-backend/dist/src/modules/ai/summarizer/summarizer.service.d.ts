import { AiService } from '../ai.service';
export declare class SummarizerService {
    private aiService;
    private readonly logger;
    constructor(aiService: AiService);
    summarize(dto: {
        text: string;
        length?: string;
        format?: string;
    }): Promise<{
        summary: string;
        contentType?: string;
        keyPoints: string[];
        keywords: string[];
        readingTime: number;
    }>;
}
