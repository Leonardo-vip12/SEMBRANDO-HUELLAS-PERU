import { VolunteerStatus } from '@prisma/client';
export declare class CreateVolunteerDto {
    name: string;
    email: string;
    phone?: string;
    message?: string;
    interests?: string;
    status?: VolunteerStatus;
}
