export declare enum AssistantContext {
    AMAZONIA = "amazonia",
    EDUCACION = "educacion",
    FLORA = "flora",
    FAUNA = "fauna",
    CLIMA = "clima",
    CONSERVACION = "conservacion",
    PROGRAMAS = "programas",
    PROYECTOS = "proyectos",
    EVENTOS = "eventos",
    NOTICIAS = "noticias",
    GENERAL = "general"
}
export declare class AssistantQueryDto {
    query: string;
    context?: AssistantContext;
    history?: Array<{
        role: string;
        content: string;
    }>;
    sessionId?: string;
}
export declare class AssistantResponseDto {
    response: string;
    context: string;
    model: string;
    suggestions: string[];
    sources: string[];
    latencyMs: number;
}
