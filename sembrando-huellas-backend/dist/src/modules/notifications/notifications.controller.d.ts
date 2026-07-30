import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly service;
    constructor(service: NotificationsService);
    findByUser(userId: string, page?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            type: string;
            title: string;
            userId: string | null;
            message: string | null;
            read: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    markAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        title: string;
        userId: string | null;
        message: string | null;
        read: boolean;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
