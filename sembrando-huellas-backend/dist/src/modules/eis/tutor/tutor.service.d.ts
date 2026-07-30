import { AiService } from '../../ai/ai.service';
import { RAGService } from '../../ai/rag/rag.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
export declare enum UserLevel {
    PRIMARY = "primaria",
    SECONDARY = "secundaria",
    UNIVERSITY = "universidad",
    TEACHER = "docente",
    RESEARCHER = "investigador",
    VOLUNTEER = "voluntario",
    COMPANY = "empresa",
    GENERAL = "general"
}
export declare class TutorService {
    private aiService;
    private ragService;
    private kbService;
    private readonly logger;
    constructor(aiService: AiService, ragService: RAGService, kbService: KnowledgeBaseService);
    ask(query: string, level?: UserLevel, sessionId?: string): Promise<{
        response: string;
        level: string;
        model: string;
        confidence: string;
        sources: string[];
        suggestedMaterial: string[];
        followUpQuestions: string[];
    }>;
    private generateFollowUp;
    private getSuggestedMaterial;
}
