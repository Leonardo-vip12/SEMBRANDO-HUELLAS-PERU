import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SemanticSearchDto {
  @ApiProperty({ description: 'Consulta en lenguaje natural' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ description: 'Colecciones a buscar' })
  @IsOptional()
  @IsArray()
  collections?: string[];

  @ApiPropertyOptional({ description: 'Límite de resultados', default: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Umbral de similitud mínima (0-1)' })
  @IsOptional()
  @IsNumber()
  threshold?: number;
}

export class SemanticSearchResultDto {
  id: string;
  content: string;
  source: string;
  collection: string;
  score: number;
  metadata?: Record<string, any>;
}

export class TranslatorDto {
  @ApiProperty({ description: 'Texto a traducir' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Idioma origen (ej: es, en, pt)' })
  @IsOptional()
  @IsString()
  sourceLanguage?: string;

  @ApiProperty({ description: 'Idioma destino (ej: es, en, pt, qu)"' })
  @IsString()
  targetLanguage: string;

  @ApiPropertyOptional({ description: 'Contexto para mejorar traducción' })
  @IsOptional()
  @IsString()
  context?: string;
}

export class SummarizeDto {
  @ApiProperty({ description: 'Texto a resumir' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ description: 'Longitud del resumen (short, medium, long)' })
  @IsOptional()
  @IsString()
  length?: string;

  @ApiPropertyOptional({ description: 'Formato de salida' })
  @IsOptional()
  @IsString()
  format?: string;
}
