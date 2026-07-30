import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VolunteerStatus } from '@prisma/client';

export class CreateVolunteerDto {
  @ApiProperty({ example: 'María García' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'maria@ejemplo.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  interests?: string;

  @ApiPropertyOptional({ enum: VolunteerStatus })
  @IsOptional()
  @IsEnum(VolunteerStatus)
  status?: VolunteerStatus;
}
