import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class RolesController {
    private readonly service;
    constructor(service: RolesService);
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: CreateRoleDto): Promise<any>;
    update(id: string, dto: UpdateRoleDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
