import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: CreateNewsDto, userId: string): Promise<any>;
    update(id: string, dto: UpdateNewsDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
