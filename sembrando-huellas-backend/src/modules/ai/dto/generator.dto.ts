import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ContentType {
  INFOGRAPHIC = 'infografia',
  EDUCATIONAL_CARD = 'ficha_educativa',
  QUIZ = 'cuestionario',
  GUIDE = 'guia',
  SUMMARY = 'resumen',
  ACTIVITY = 'actividad',
}

export class GenerateContentDto {
  @ApiProperty({ description: 'Tema del contenido educativo' })
  @IsString()
  topic: string;

  @ApiProperty({ enum: ContentType })
  @IsEnum(ContentType)
  contentType: ContentType;

  @ApiPropertyOptional({ description: 'Nivel educativo' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ description: 'Audiencia objetivo' })
  @IsOptional()
  @IsString()
  audience?: string;

  @ApiPropertyOptional({ description: 'Formato de salida (markdown, html, json)' })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional({ description: 'Contexto adicional' })
  @IsOptional()
  @IsString()
  additionalContext?: string;
}

export class GenerateNewsDto {
  @ApiProperty({ description: 'Tema o evento de la noticia' })
  @IsString()
  topic: string;

  @ApiPropertyOptional({ description: 'Keywords para SEO' })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiPropertyOptional({ description: 'Tono del artículo' })
  @IsOptional()
  @IsString()
  tone?: string;

  @ApiPropertyOptional({ description: 'Tamaño deseado' })
  @IsOptional()
  @IsString()
  length?: string;
}

export class GenerateCertificateDto {
  @ApiProperty({ description: 'Nombre del beneficiario' })
  @IsString()
  recipientName: string;

  @ApiProperty({ description: 'Tipo de certificado' })
  @IsString()
  certificateType: string;

  @ApiProperty({ description: 'Nombre del programa/evento' })
  @IsString()
  programName: string;

  @ApiPropertyOptional({ description: 'Horas completadas' })
  @IsOptional()
  @IsString()
  hours?: string;

  @ApiPropertyOptional({ description: 'Fecha del evento' })
  @IsOptional()
  @IsString()
  eventDate?: string;

  @ApiPropertyOptional({ description: 'Idioma del certificado' })
  @IsOptional()
  @IsString()
  language?: string;
}
