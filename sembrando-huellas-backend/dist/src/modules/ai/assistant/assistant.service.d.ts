import { AiService } from '../ai.service';
import { AssistantQueryDto, AssistantResponseDto } from '../dto/ai-assistant.dto';
export declare class AssistantService {
    private aiService;
    private readonly logger;
    private sessions;
    constructor(aiService: AiService);
    query(dto: AssistantQueryDto): Promise<AssistantResponseDto>;
    private buildSystemPrompt;
    private saveToSession;
    private generateSuggestions;
    clearSession(sessionId: string): void;
}
