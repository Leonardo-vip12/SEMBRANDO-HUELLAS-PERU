import { AiService } from '../../ai/ai.service';
export declare class DocumentAnalysisService {
    private aiService;
    private readonly logger;
    constructor(aiService: AiService);
    analyzeDocument(file: Express.Multer.File, userId?: string): Promise<any>;
    analyzeText(text: string, userId?: string): Promise<any>;
    private extractText;
    private generateSummary;
    private extractConcepts;
    private generateQuestions;
    private generateMindMap;
    private generateGlossary;
    private generateActivities;
}
