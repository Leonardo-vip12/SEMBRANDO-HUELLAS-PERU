import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ProjectsController {
    private readonly service;
    constructor(service: ProjectsService);
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: CreateProjectDto): Promise<any>;
    update(id: string, dto: UpdateProjectDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
