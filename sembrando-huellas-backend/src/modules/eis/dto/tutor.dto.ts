import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserLevel {
  PRIMARY = 'primaria',
  SECONDARY = 'secundaria',
  UNIVERSITY = 'universidad',
  TEACHER = 'docente',
  RESEARCHER = 'investigador',
  VOLUNTEER = 'voluntario',
  COMPANY = 'empresa',
  GENERAL = 'general',
}

export class TutorAskDto {
  @ApiProperty({ description: 'Consulta del usuario' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ enum: UserLevel, default: UserLevel.GENERAL })
  @IsOptional()
  @IsEnum(UserLevel)
  level?: UserLevel;

  @ApiPropertyOptional({ description: 'ID de sesión para mantener contexto' })
  @IsOptional()
  @IsString()
  sessionId?: string;
}
