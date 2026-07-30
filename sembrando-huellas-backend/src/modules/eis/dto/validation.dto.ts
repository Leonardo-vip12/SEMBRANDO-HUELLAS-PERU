import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidateResponseDto {
  @ApiProperty({ description: 'Respuesta de IA a validar' })
  @IsString()
  response: string;

  @ApiPropertyOptional({ description: 'Consulta original' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ description: 'Proveedor usado' })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ description: 'Modelo usado' })
  @IsOptional()
  @IsString()
  model?: string;
}

export class ValidateContentDto {
  @ApiProperty({ description: 'Contenido a validar' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Categoría del contenido' })
  @IsString()
  category: string;
}
