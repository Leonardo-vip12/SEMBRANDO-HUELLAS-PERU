"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SpeciesV2Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeciesV2Service = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../../ai/ai.service");
const prisma_service_1 = require("../../../prisma/prisma.service");
let SpeciesV2Service = SpeciesV2Service_1 = class SpeciesV2Service {
    constructor(aiService, prisma) {
        this.aiService = aiService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(SpeciesV2Service_1.name);
    }
    async identify(imageBuffer, mimeType, userId) {
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
            await this.prisma.speciesIdentification.create({
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
        }
        catch (error) {
            this.logger.error(`Failed to save identification: ${error.message}`);
        }
        const similarFromDB = await this.findSimilarSpecies(parsed.scientificName || parsed.commonName);
        const bibliography = await this.findBibliography(parsed.scientificName || '');
        return { ...parsed, similarFromDB, bibliography, confidence: parsed.confidence || 0 };
    }
    async getIdentificationHistory(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = userId ? { userId } : {};
        const [data, total] = await Promise.all([
            this.prisma.speciesIdentification.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.speciesIdentification.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async getStats() {
        const [total, species] = await Promise.all([
            this.prisma.speciesIdentification.count(),
            this.prisma.speciesIdentification.groupBy({
                by: ['scientificName'],
                _count: true,
                orderBy: { _count: { scientificName: 'desc' } },
                take: 20,
            }),
        ]);
        return { total, topSpecies: species.filter((s) => s.scientificName) };
    }
    parseResult(raw) {
        try {
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (jsonMatch)
                return JSON.parse(jsonMatch[0]);
        }
        catch { }
        return { description: raw.slice(0, 500), confidence: 0 };
    }
    async findSimilarSpecies(name) {
        if (!name)
            return [];
        const parts = name.split(' ');
        const where = parts.length > 1
            ? { OR: parts.map((p) => ({ name: { contains: p, mode: 'insensitive' } })) }
            : { name: { contains: name, mode: 'insensitive' } };
        return this.prisma.species.findMany({
            where,
            take: 5,
            select: { id: true, name: true, scientificName: true, image: true, conservationStatus: true },
        });
    }
    async findBibliography(name) {
        if (!name)
            return [];
        return this.prisma.news.findMany({
            where: {
                OR: [{ title: { contains: name, mode: 'insensitive' } }, { content: { contains: name, mode: 'insensitive' } }],
            },
            take: 3,
            select: { id: true, title: true, slug: true, publishedAt: true },
        });
    }
};
exports.SpeciesV2Service = SpeciesV2Service;
exports.SpeciesV2Service = SpeciesV2Service = SpeciesV2Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        prisma_service_1.PrismaService])
], SpeciesV2Service);
//# sourceMappingURL=species-v2.service.js.map