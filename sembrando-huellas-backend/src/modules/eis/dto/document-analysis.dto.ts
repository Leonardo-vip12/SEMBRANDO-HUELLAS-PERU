import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyzeTextDto {
  @ApiProperty({ description: 'Texto a analizar (mínimo 10 caracteres)' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ description: 'ID de usuario' })
  @IsOptional()
  @IsString()
  userId?: string;
}
