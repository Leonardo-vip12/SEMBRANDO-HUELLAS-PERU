import { VolunteersService } from './volunteers.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class VolunteersController {
    private readonly service;
    constructor(service: VolunteersService);
    create(dto: CreateVolunteerDto): Promise<any>;
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateVolunteerDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
