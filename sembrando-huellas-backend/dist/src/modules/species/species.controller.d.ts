import { SpeciesService } from './species.service';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class SpeciesController {
    private readonly service;
    constructor(service: SpeciesService);
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: CreateSpeciesDto): Promise<any>;
    update(id: string, dto: UpdateSpeciesDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
