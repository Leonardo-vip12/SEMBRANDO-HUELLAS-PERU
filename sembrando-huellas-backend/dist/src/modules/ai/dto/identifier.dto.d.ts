export declare class SpeciesIdentificationResultDto {
    scientificName: string;
    commonName: string;
    category?: string;
    conservationStatus?: string;
    confidence: number;
    curiosities?: string[];
    threats?: string[];
    ecologicalImportance?: string;
    description?: string;
}
export declare class IdentifySpeciesResponseDto {
    success: boolean;
    data?: SpeciesIdentificationResultDto;
    alternativeSuggestions?: SpeciesIdentificationResultDto[];
    error?: string;
    latencyMs: number;
}
