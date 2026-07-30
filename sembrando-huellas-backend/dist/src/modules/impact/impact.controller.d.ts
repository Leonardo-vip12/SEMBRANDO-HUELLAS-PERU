import { ImpactService } from './impact.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ImpactController {
    private readonly service;
    constructor(service: ImpactService);
    getSummary(): Promise<Record<string, string>>;
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: any): Promise<any>;
    update(id: string, dto: any): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
