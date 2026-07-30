import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class TestimonialsController {
    private readonly service;
    constructor(service: TestimonialsService);
    findAll(query: PaginationDto): Promise<import("../../common/interfaces/pagination.interface").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    create(dto: CreateTestimonialDto): Promise<any>;
    update(id: string, dto: UpdateTestimonialDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
