import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class PartnersController {
    private readonly service;
    constructor(service: PartnersService);
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: CreatePartnerDto): Promise<any>;
    update(id: string, dto: UpdatePartnerDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
