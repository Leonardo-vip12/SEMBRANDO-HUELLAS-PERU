import { PermissionsService } from './permissions.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class PermissionsController {
    private readonly service;
    constructor(service: PermissionsService);
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: any): Promise<any>;
    update(id: string, dto: any): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
