export declare enum ActivityType {
    CHARLA = "charla",
    CAMPANA = "campana",
    TALLER = "taller",
    SESION = "sesion_educativa",
    JUEGO = "juego",
    DINAMICA = "dinamica"
}
export declare class PlanActivityDto {
    activityType: ActivityType;
    topic: string;
    level?: string;
    duration?: string;
    participants?: number;
    objectives?: string[];
    additionalContext?: string;
}
export declare class ActivityRecommendDto {
    level?: string;
    duration?: string;
}
