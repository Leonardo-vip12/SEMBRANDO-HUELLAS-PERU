import { AiService } from '../ai.service';
interface TranslateKeyItem {
    key: string;
    value: string;
    sourceLang: string;
    targetLang: string;
}
interface BatchProgress {
    total: number;
    completed: number;
    failed: number;
    errors: Array<{
        key: string;
        error: string;
    }>;
}
export declare class TranslatorService {
    private aiService;
    private readonly logger;
    constructor(aiService: AiService);
    translate(dto: {
        text: string;
        sourceLanguage?: string;
        targetLanguage: string;
        context?: string;
    }): Promise<{
        translatedText: string;
        sourceLanguage: string;
        targetLanguage: string;
    }>;
    translateKeys(items: TranslateKeyItem[], onProgress?: (progress: BatchProgress) => void): Promise<BatchProgress>;
    detectLanguage(text: string): Promise<{
        language: string;
        confidence: number;
    }>;
    getSupportedLanguages(): Promise<Array<{
        code: string;
        name: string;
        nativeName: string;
        status: string;
    }>>;
}
export {};
