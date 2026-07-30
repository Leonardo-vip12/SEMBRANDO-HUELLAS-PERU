import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class EventsController {
    private readonly service;
    constructor(service: EventsService);
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: CreateEventDto): Promise<any>;
    update(id: string, dto: UpdateEventDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
