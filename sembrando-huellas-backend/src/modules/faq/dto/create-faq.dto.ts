import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty({ example: '¿Cómo puedo ser voluntario?' })
  @IsString()
  question: string;

  @ApiProperty({ example: 'Puedes registrarte en nuestra página de voluntarios...' })
  @IsString()
  answer: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
