import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ProgramsController {
    private readonly service;
    constructor(service: ProgramsService);
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: CreateProgramDto): Promise<any>;
    update(id: string, dto: UpdateProgramDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
