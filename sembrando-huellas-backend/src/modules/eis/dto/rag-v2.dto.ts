import { IsString, IsOptional, IsArray, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RAGSearchDto {
  @ApiProperty({ description: 'Consulta de búsqueda' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ description: 'Colección a buscar (species, news, programs, faq, resources)' })
  @IsOptional()
  @IsString()
  collection?: string;

  @ApiPropertyOptional({ description: 'Límite de resultados', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: 'Umbral de similitud (0-1)', default: 0.7 })
  @IsOptional()
  @Type(() => Number)
  threshold?: number;
}
