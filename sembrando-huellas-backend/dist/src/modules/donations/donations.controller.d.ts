import { DonationsService } from './donations.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class DonationsController {
    private readonly service;
    constructor(service: DonationsService);
    create(dto: any): Promise<any>;
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    getStats(): Promise<{
        totalAmount: number;
        totalDonations: number;
        completedDonations: number;
        pendingDonations: number;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: any): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
