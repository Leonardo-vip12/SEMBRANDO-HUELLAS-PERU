import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddKnowledgeEntryDto {
  @ApiProperty({ description: 'Título de la entrada' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Contenido de la entrada' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Fuente de la información' })
  @IsString()
  source: string;

  @ApiProperty({ description: 'Tipo de fuente (article, book, research, report, etc)' })
  @IsString()
  sourceType: string;

  @ApiPropertyOptional({ description: 'Categoría' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Tags' })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Metadatos adicionales' })
  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class KnowledgeSearchDto {
  @ApiProperty({ description: 'Consulta de búsqueda' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ description: 'Filtrar por categoría' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Límite de resultados', default: 10 })
  @IsOptional()
  limit?: number;
}
