import { I18nService } from './i18n.service';
import { TranslationStatus } from '@prisma/client';
export declare class I18nController {
    private readonly i18nService;
    constructor(i18nService: I18nService);
    getLanguages(activeOnly?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        nativeName: string | null;
        isDefault: boolean;
        flag: string | null;
    }[]>;
    createLanguage(dto: {
        code: string;
        name: string;
        nativeName?: string;
        flag?: string;
        isDefault?: boolean;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        nativeName: string | null;
        isDefault: boolean;
        flag: string | null;
    }>;
    updateLanguage(id: string, dto: {
        name?: string;
        nativeName?: string;
        isActive?: boolean;
        flag?: string;
        isDefault?: boolean;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        nativeName: string | null;
        isDefault: boolean;
        flag: string | null;
    }>;
    deleteLanguage(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        nativeName: string | null;
        isDefault: boolean;
        flag: string | null;
    }>;
    setDefault(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        nativeName: string | null;
        isDefault: boolean;
        flag: string | null;
    }>;
    getTranslations(entityType: string, entityId: string, languageId?: string): Promise<({
        language: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            code: string;
            nativeName: string | null;
            isDefault: boolean;
            flag: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TranslationStatus;
        value: string | null;
        entityId: string;
        entityType: string;
        field: string;
        languageId: string;
        translatorId: string | null;
        version: number;
    })[]>;
    upsertTranslation(dto: {
        entityType: string;
        entityId: string;
        field: string;
        value: string;
        languageId: string;
        status?: TranslationStatus;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TranslationStatus;
        value: string | null;
        entityId: string;
        entityType: string;
        field: string;
        languageId: string;
        translatorId: string | null;
        version: number;
    }>;
    getTranslationKeys(namespace?: string, languageId?: string, group?: string, search?: string, page?: string, limit?: string): Promise<{
        data: ({
            language: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                code: string;
                nativeName: string | null;
                isDefault: boolean;
                flag: string | null;
            };
        } & {
            id: string;
            key: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.TranslationStatus;
            value: string | null;
            group: string | null;
            maxLength: number | null;
            tags: string[];
            context: string | null;
            languageId: string;
            namespace: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    upsertKey(dto: {
        key: string;
        namespace?: string;
        value?: string;
        languageId: string;
        context?: string;
        maxLength?: number;
        group?: string;
        tags?: string[];
        status?: TranslationStatus;
    }): Promise<{
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TranslationStatus;
        value: string | null;
        group: string | null;
        maxLength: number | null;
        tags: string[];
        context: string | null;
        languageId: string;
        namespace: string;
    }>;
    deleteKey(id: string): Promise<{
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TranslationStatus;
        value: string | null;
        group: string | null;
        maxLength: number | null;
        tags: string[];
        context: string | null;
        languageId: string;
        namespace: string;
    }>;
    getKey(key: string, namespace: string, languageId: string): Promise<{
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TranslationStatus;
        value: string | null;
        group: string | null;
        maxLength: number | null;
        tags: string[];
        context: string | null;
        languageId: string;
        namespace: string;
    }>;
    getMissingKeys(languageId: string): Promise<{
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TranslationStatus;
        value: string | null;
        group: string | null;
        maxLength: number | null;
        tags: string[];
        context: string | null;
        languageId: string;
        namespace: string;
    }[]>;
    importTranslations(file: Express.Multer.File, format: string, languageId?: string): Promise<{
        imported: number;
        errors: number;
        details: {
            key: string;
            error: string;
        }[];
    }>;
    exportTranslations(languageId: string, format?: string, namespace?: string): Promise<{
        data: string;
        contentType: string;
        filename: string;
    }>;
    getStats(): Promise<{
        totalKeys: number;
        totalContentTranslations: number;
        languages: {
            code: string;
            name: string;
            keyCount: number;
            isDefault: boolean;
            isActive: boolean;
        }[];
        byStatus: {
            status: import(".prisma/client").$Enums.TranslationStatus;
            count: number;
        }[];
    }>;
    translateAll(dto: {
        sourceLanguageId: string;
        targetLanguageId: string;
        namespace?: string;
    }): Promise<{
        message: string;
        missing: number;
    }>;
}
