import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ResourcesController {
    private readonly service;
    constructor(service: ResourcesService);
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: CreateResourceDto): Promise<any>;
    update(id: string, dto: UpdateResourceDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
