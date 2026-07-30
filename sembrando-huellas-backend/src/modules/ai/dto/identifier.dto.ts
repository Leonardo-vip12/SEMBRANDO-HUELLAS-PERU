import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SpeciesIdentificationResultDto {
  @ApiProperty({ description: 'Nombre científico' })
  scientificName: string;

  @ApiProperty({ description: 'Nombre común' })
  commonName: string;

  @ApiPropertyOptional({ description: 'Categoría taxonómica' })
  category?: string;

  @ApiPropertyOptional({ description: 'Estado de conservación' })
  conservationStatus?: string;

  @ApiProperty({ description: 'Probabilidad de acierto (0-1)' })
  confidence: number;

  @ApiPropertyOptional({ description: 'Curiosidades' })
  curiosities?: string[];

  @ApiPropertyOptional({ description: 'Amenazas' })
  threats?: string[];

  @ApiPropertyOptional({ description: 'Importancia ecológica' })
  ecologicalImportance?: string;

  @ApiPropertyOptional({ description: 'Descripción general' })
  description?: string;
}

export class IdentifySpeciesResponseDto {
  success: boolean;
  data?: SpeciesIdentificationResultDto;
  alternativeSuggestions?: SpeciesIdentificationResultDto[];
  error?: string;
  latencyMs: number;
}
