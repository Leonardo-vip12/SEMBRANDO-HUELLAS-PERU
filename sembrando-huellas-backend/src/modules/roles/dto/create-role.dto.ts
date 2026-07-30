import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';

export class CreateRoleDto {
  @ApiProperty({ enum: RoleName, example: 'EDITOR' })
  @IsEnum(RoleName)
  name: RoleName;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  permissionIds?: string[];
}
