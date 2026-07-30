import { ConfigService } from '@nestjs/config';
export declare class AiConfigService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    getConfig(): {
        activeProvider: string;
        providers: {
            openai: {
                available: boolean;
                model: string;
                models: string[];
            };
            gemini: {
                available: boolean;
                model: string;
                models: string[];
            };
            claude: {
                available: boolean;
                model: string;
                models: string[];
            };
            local: {
                available: boolean;
                model: string;
                models: string[];
            };
        };
        defaultTemperature: number;
        maxTokens: number;
        costLimit: number;
    };
    updateConfig(_updates: any): {
        success: boolean;
        message: string;
    };
}
