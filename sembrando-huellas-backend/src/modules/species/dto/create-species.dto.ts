import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSpeciesDto {
  @ApiProperty({ example: 'Cedro' })
  @IsString()
  commonName: string;

  @ApiProperty({ example: 'Cedrela odorata' })
  @IsString()
  scientificName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conservationStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  region?: string;
}
