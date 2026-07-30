import { IsString, IsOptional, IsNumber, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterObservationDto {
  @ApiPropertyOptional({ description: 'Nombre común de la especie' })
  @IsOptional()
  @IsString()
  speciesName?: string;

  @ApiPropertyOptional({ description: 'Nombre científico' })
  @IsOptional()
  @IsString()
  scientificName?: string;

  @ApiPropertyOptional({ description: 'Cantidad observada', default: 1 })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ description: 'Latitud' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitud' })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ description: 'Fecha de observación (ISO)' })
  @IsOptional()
  @IsString()
  observedAt?: string;

  @ApiPropertyOptional({ description: 'Tipo de hábitat' })
  @IsOptional()
  @IsString()
  habitat?: string;

  @ApiPropertyOptional({ description: 'Condición climática' })
  @IsOptional()
  @IsString()
  weather?: string;

  @ApiPropertyOptional({ description: 'Comentarios' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({ description: 'URLs de imágenes' })
  @IsOptional()
  @IsArray()
  images?: string[];
}

export class ObservationQueryDto {
  @ApiPropertyOptional({ description: 'Página', default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: 'Límite por página', default: 50 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Filtrar por estado' })
  @IsOptional()
  @IsString()
  status?: string;
}

export enum ObservationStatusAction {
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  NEEDS_REVIEW = 'NEEDS_REVIEW',
}

export class VerifyObservationDto {
  @ApiProperty({ enum: ObservationStatusAction })
  @IsEnum(ObservationStatusAction)
  status: ObservationStatusAction;
}
