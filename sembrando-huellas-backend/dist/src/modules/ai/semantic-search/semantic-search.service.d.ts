import { AiService } from '../ai.service';
import { RAGService } from '../rag/rag.service';
import { SemanticSearchDto, SemanticSearchResultDto } from '../dto/semantic.dto';
export declare class SemanticSearchService {
    private aiService;
    private ragService;
    private readonly logger;
    constructor(aiService: AiService, ragService: RAGService);
    search(dto: SemanticSearchDto): Promise<SemanticSearchResultDto[]>;
    hybridSearch(query: string, limit?: number): Promise<SemanticSearchResultDto[]>;
    private keywordSearch;
}
