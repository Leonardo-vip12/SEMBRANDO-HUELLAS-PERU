import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class CategoriesController {
    private readonly service;
    constructor(service: CategoriesService);
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: CreateCategoryDto): Promise<any>;
    update(id: string, dto: UpdateCategoryDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
