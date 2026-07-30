export declare class RegisterObservationDto {
    speciesName?: string;
    scientificName?: string;
    quantity?: number;
    latitude: number;
    longitude: number;
    observedAt?: string;
    habitat?: string;
    weather?: string;
    comments?: string;
    images?: string[];
}
export declare class ObservationQueryDto {
    page?: number;
    limit?: number;
    status?: string;
}
export declare enum ObservationStatusAction {
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED",
    NEEDS_REVIEW = "NEEDS_REVIEW"
}
export declare class VerifyObservationDto {
    status: ObservationStatusAction;
}
