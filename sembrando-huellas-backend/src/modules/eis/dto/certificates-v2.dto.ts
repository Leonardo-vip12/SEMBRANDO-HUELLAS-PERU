import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateCertificateDto {
  @ApiProperty({ description: 'Nombre del destinatario' })
  @IsString()
  recipientName: string;

  @ApiPropertyOptional({ description: 'Email del destinatario' })
  @IsOptional()
  @IsEmail()
  recipientEmail?: string;

  @ApiProperty({ description: 'Tipo de certificado (voluntariado, participacion, logro, etc)' })
  @IsString()
  certificateType: string;

  @ApiProperty({ description: 'Nombre del programa o actividad' })
  @IsString()
  programName: string;

  @ApiPropertyOptional({ description: 'Horas invertidas' })
  @IsOptional()
  @IsString()
  hours?: string;

  @ApiPropertyOptional({ description: 'Fecha del evento' })
  @IsOptional()
  @IsString()
  eventDate?: string;
}

export class VerifyCertificateDto {
  @ApiProperty({ description: 'Código de verificación del certificado' })
  @IsString()
  code: string;
}
