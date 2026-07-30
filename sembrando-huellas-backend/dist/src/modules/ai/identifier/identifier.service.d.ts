import { AiService } from '../ai.service';
import { IdentifySpeciesResponseDto } from '../dto/identifier.dto';
export declare class IdentifierService {
    private aiService;
    private readonly logger;
    constructor(aiService: AiService);
    identifySpecies(imageBuffer: Buffer, mimeType: string): Promise<IdentifySpeciesResponseDto>;
    private parseIdentification;
}
