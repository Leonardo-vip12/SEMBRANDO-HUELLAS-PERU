import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RecommendQueryDto {
  @ApiProperty({ description: 'Consulta o interés del usuario' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ description: 'Cantidad de resultados', default: 6 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export class RecommendByCategoryDto {
  @ApiProperty({ description: 'Categoría (courses, news, projects, species, educational, events, activities)' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ description: 'Cantidad de resultados', default: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
