import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class GalleryController {
    private readonly service;
    constructor(service: GalleryService);
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: CreateGalleryDto): Promise<any>;
    update(id: string, dto: UpdateGalleryDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
