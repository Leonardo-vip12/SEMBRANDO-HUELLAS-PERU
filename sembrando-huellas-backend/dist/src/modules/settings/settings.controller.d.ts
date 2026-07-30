import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly service;
    constructor(service: SettingsService);
    findAll(group?: string): Promise<{
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        value: string | null;
        group: string | null;
    }[]>;
    update(body: any): Promise<{
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        value: string | null;
        group: string | null;
    } | {
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        value: string | null;
        group: string | null;
    }[]>;
    remove(key: string): Promise<{
        message: string;
    }>;
}
