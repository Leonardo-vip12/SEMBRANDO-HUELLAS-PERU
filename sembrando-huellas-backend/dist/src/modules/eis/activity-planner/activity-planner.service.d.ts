import { AiService } from '../../ai/ai.service';
export type ActivityType = 'charla' | 'campana' | 'taller' | 'sesion_educativa' | 'juego' | 'dinamica';
export declare class ActivityPlannerService {
    private aiService;
    private readonly logger;
    constructor(aiService: AiService);
    plan(dto: {
        activityType: ActivityType;
        topic: string;
        level?: string;
        duration?: string;
        participants?: number;
        objectives?: string[];
        additionalContext?: string;
        userId?: string;
    }): Promise<any>;
    getRecommendations(level?: string, duration?: string): Promise<any>;
}
