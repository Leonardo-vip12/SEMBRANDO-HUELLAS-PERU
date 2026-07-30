import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AssistantContext {
  AMAZONIA = 'amazonia',
  EDUCACION = 'educacion',
  FLORA = 'flora',
  FAUNA = 'fauna',
  CLIMA = 'clima',
  CONSERVACION = 'conservacion',
  PROGRAMAS = 'programas',
  PROYECTOS = 'proyectos',
  EVENTOS = 'eventos',
  NOTICIAS = 'noticias',
  GENERAL = 'general',
}

export class AssistantQueryDto {
  @ApiProperty({ description: 'Pregunta del usuario' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ enum: AssistantContext, default: AssistantContext.GENERAL })
  @IsOptional()
  @IsEnum(AssistantContext)
  context?: AssistantContext;

  @ApiPropertyOptional({ description: 'Historial de conversación' })
  @IsOptional()
  @IsArray()
  history?: Array<{ role: string; content: string }>;

  @ApiPropertyOptional({ description: 'ID de sesión para mantener contexto' })
  @IsOptional()
  @IsString()
  sessionId?: string;
}

export class AssistantResponseDto {
  response: string;
  context: string;
  model: string;
  suggestions: string[];
  sources: string[];
  latencyMs: number;
}
