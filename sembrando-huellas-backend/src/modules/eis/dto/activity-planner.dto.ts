import { IsString, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ActivityType {
  CHARLA = 'charla',
  CAMPANA = 'campana',
  TALLER = 'taller',
  SESION = 'sesion_educativa',
  JUEGO = 'juego',
  DINAMICA = 'dinamica',
}

export class PlanActivityDto {
  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  activityType: ActivityType;

  @ApiProperty({ description: 'Tema de la actividad' })
  @IsString()
  topic: string;

  @ApiPropertyOptional({ description: 'Nivel educativo' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ description: 'Duración estimada' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ description: 'Número de participantes' })
  @IsOptional()
  @IsNumber()
  participants?: number;

  @ApiPropertyOptional({ description: 'Objetivos específicos' })
  @IsOptional()
  @IsArray()
  objectives?: string[];

  @ApiPropertyOptional({ description: 'Contexto adicional' })
  @IsOptional()
  @IsString()
  additionalContext?: string;
}

export class ActivityRecommendDto {
  @ApiPropertyOptional({ description: 'Nivel educativo' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ description: 'Duración deseada' })
  @IsOptional()
  @IsString()
  duration?: string;
}
