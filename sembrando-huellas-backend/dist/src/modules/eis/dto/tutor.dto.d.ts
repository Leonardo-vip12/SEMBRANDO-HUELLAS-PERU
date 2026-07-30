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
export declare class TutorAskDto {
    query: string;
    level?: UserLevel;
    sessionId?: string;
}
