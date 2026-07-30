import { AiService } from '../ai.service';
import { GenerateContentDto, GenerateNewsDto } from '../dto/generator.dto';
export declare class GeneratorsService {
    private aiService;
    private readonly logger;
    constructor(aiService: AiService);
    generateEducationalContent(dto: GenerateContentDto): Promise<any>;
    generateNewsDraft(dto: GenerateNewsDto): Promise<any>;
    summarizeEvent(eventDescription: string): Promise<any>;
    private parseJsonResult;
}
