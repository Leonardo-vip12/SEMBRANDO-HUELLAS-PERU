import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SpeciesV2Service {
  private readonly logger = new Logger(SpeciesV2Service.name);

  constructor(
    private aiService: AiService,
    private prisma: PrismaService,
  ) {}

  async identify(imageBuffer: Buffer, mimeType: string, userId?: string): Promise<any> {
    const prompt = `Eres un experto en biodiversidad peruana. Identifica la especie en esta imagen y proporciona:

INFORMACIÓN REQUERIDA (formato JSON):
{
  "scientificName": "Nombre científico completo",
  "commonName": "Nombre común en español",
  "kingdom": "Reino",
  "phylum": "Filo",
  "class": "Clase",
  "order": "Orden",
  "family": "Familia",
  "genus": "Género",
  "confidence": 0.95,
  "conservationStatus": "Estado IUCN (CR, EN, VU, NT, LC, NE)",
  "habitat": "Hábitat principal",
  "distribution": "Distribución geográfica en Perú",
  "description": "Descripción detallada",
  "curiosities": ["Dato curioso 1", "Dato curioso 2", "Dato curioso 3"],
  "threats": ["Amenaza 1", "Amenaza 2", "Amenaza 3"],
  "ecologicalImportance": "Importancia ecológica",
  "similarSpecies": ["Especie similar 1", "Especie相似 2"],
  "diet": "Alimentación",
  "reproduction": "Reproducción",
  "behavior": "Comportamiento notable"
}

NORMAS:
- Alta precisión para especies peruanas.
- Si no puedes identificar con certeza, baja el confidence.
- NO inventes información.`;

    const result = await this.aiService.analyzeImage(imageBuffer, mimeType, prompt);
    const parsed = this.parseResult(result.description);

    try {
      await (this.prisma as any).speciesIdentification.create({
        data: {
          imageUrl: 'upload',
          scientificName: parsed.scientificName,
          commonName: parsed.commonName,
          confidence: parsed.confidence,
          conservationStatus: parsed.conservationStatus,
          habitat: parsed.habitat,
          curiosities: parsed.curiosities || [],
          threats: parsed.threats || [],
          ecologicalImportance: parsed.ecologicalImportance,
          source: 'image',
          userId,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to save identification: ${(error as Error).message}`);
    }

    const similarFromDB = await this.findSimilarSpecies(parsed.scientificName || parsed.commonName);
    const bibliography = await this.findBibliography(parsed.scientificName || '');

    return { ...parsed, similarFromDB, bibliography, confidence: parsed.confidence || 0 };
  }

  async getIdentificationHistory(userId?: string, page = 1, limit = 20): Promise<any> {
    const skip = (page - 1) * limit;
    const where = userId ? { userId } : {};
    const [data, total] = await Promise.all([
      (this.prisma as any).speciesIdentification.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      (this.prisma as any).speciesIdentification.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getStats(): Promise<any> {
    const [total, species] = await Promise.all([
      (this.prisma as any).speciesIdentification.count(),
      (this.prisma as any).speciesIdentification.groupBy({
        by: ['scientificName'],
        _count: true,
        orderBy: { _count: { scientificName: 'desc' } },
        take: 20,
      }),
    ]);
    return { total, topSpecies: species.filter((s: any) => s.scientificName) };
  }

  private parseResult(raw: string): any {
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch {}
    return { description: raw.slice(0, 500), confidence: 0 };
  }

  private async findSimilarSpecies(name: string): Promise<any[]> {
    if (!name) return [];
    const parts = name.split(' ');
    const where =
      parts.length > 1
        ? { OR: parts.map((p) => ({ name: { contains: p, mode: 'insensitive' as const } })) }
        : { name: { contains: name, mode: 'insensitive' as const } };
    return this.prisma.species.findMany({
      where,
      take: 5,
      select: { id: true, name: true, scientificName: true, image: true, conservationStatus: true },
    });
  }

  private async findBibliography(name: string): Promise<any[]> {
    if (!name) return [];
    return this.prisma.news.findMany({
      where: {
        OR: [{ title: { contains: name, mode: 'insensitive' } }, { content: { contains: name, mode: 'insensitive' } }],
      },
      take: 3,
      select: { id: true, title: true, slug: true, publishedAt: true },
    });
  }
}
