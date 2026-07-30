import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class TeamController {
    private readonly service;
    constructor(service: TeamService);
    findAll(query: PaginationDto): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            role: string | null;
            isActive: boolean;
            order: number;
            bio: string | null;
            image: string | null;
        }[];
        meta: {
            total: number;
            page: any;
            limit: any;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: string | null;
        isActive: boolean;
        order: number;
        bio: string | null;
        image: string | null;
    }>;
    create(dto: CreateTeamDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: string | null;
        isActive: boolean;
        order: number;
        bio: string | null;
        image: string | null;
    }>;
    update(id: string, dto: UpdateTeamDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: string | null;
        isActive: boolean;
        order: number;
        bio: string | null;
        image: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
