import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class FaqController {
    private readonly service;
    constructor(service: FaqService);
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: CreateFaqDto): Promise<any>;
    update(id: string, dto: UpdateFaqDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
