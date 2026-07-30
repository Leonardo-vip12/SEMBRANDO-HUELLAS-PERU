import { RoleName } from '@prisma/client';
export declare class CreateRoleDto {
    name: RoleName;
    description?: string;
    permissionIds?: string[];
}
