import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AiService } from '../ai.service';
import { IDENTIFIER_SYSTEM_PROMPT } from '../prompts';
import { SpeciesIdentificationResultDto, IdentifySpeciesResponseDto } from '../dto/identifier.dto';

@Injectable()
export class IdentifierService {
  private readonly logger = new Logger(IdentifierService.name);

  constructor(private aiService: AiService) {}

  async identifySpecies(imageBuffer: Buffer, mimeType: string): Promise<IdentifySpeciesResponseDto> {
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new BadRequestException('No se proporcionó una imagen válida');
    }

    const start = Date.now();

    try {
      const result = await this.aiService.analyzeImage(imageBuffer, mimeType, IDENTIFIER_SYSTEM_PROMPT);
      const parsed = this.parseIdentification(result.description);
      return {
        success: true,
        data: parsed,
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      this.logger.error(`Species identification failed: ${(error as Error).message}`);
      return {
        success: false,
        error: `No se pudo identificar la especie: ${(error as Error).message}`,
        latencyMs: Date.now() - start,
      };
    }
  }

  private parseIdentification(raw: string): SpeciesIdentificationResultDto {
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {}
    return {
      scientificName: '',
      commonName: 'No identificado',
      confidence: 0,
      description: raw.slice(0, 500),
    };
  }
}
