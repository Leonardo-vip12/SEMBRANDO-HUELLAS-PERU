import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';

@Injectable()
export class DocumentAnalysisService {
  private readonly logger = new Logger(DocumentAnalysisService.name);

  constructor(private aiService: AiService) {}

  async analyzeDocument(file: Express.Multer.File, userId?: string): Promise<any> {
    if (!file) throw new BadRequestException('No se proporcionó un archivo');

    const content = await this.extractText(file);

    const [summary, concepts, questions, mindMap, glossary, activities] = await Promise.all([
      this.generateSummary(content),
      this.extractConcepts(content),
      this.generateQuestions(content),
      this.generateMindMap(content),
      this.generateGlossary(content),
      this.generateActivities(content),
    ]);

    const analysis = await (await import('../../../prisma/prisma.service')).PrismaService;
    const prisma = new analysis();

    const saved = await (prisma as any).documentAnalysis.create({
      data: {
        filename: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        content: content.slice(0, 50000),
        summary,
        concepts,
        questions,
        mindMap,
        glossary,
        activities,
        userId,
      },
    });

    return saved;
  }

  async analyzeText(text: string, userId?: string): Promise<any> {
    if (!text || text.length < 10) throw new BadRequestException('El texto debe tener al menos 10 caracteres');

    const [summary, concepts, questions, mindMap, glossary, activities] = await Promise.all([
      this.generateSummary(text),
      this.extractConcepts(text),
      this.generateQuestions(text),
      this.generateMindMap(text),
      this.generateGlossary(text),
      this.generateActivities(text),
    ]);

    return { summary, concepts, questions, mindMap, glossary, activities };
  }

  private async extractText(file: Express.Multer.File): Promise<string> {
    const mime = file.mimetype;
    if (mime.includes('text') || mime.includes('json')) {
      return file.buffer.toString('utf-8');
    }
    if (mime.includes('pdf')) {
      return `[PDF: ${file.originalname}] El contenido del PDF no pudo ser extraído automáticamente. Usa la IA para analizarlo.`;
    }
    if (mime.includes('word') || mime.includes('document')) {
      return `[Word: ${file.originalname}] El contenido del documento no pudo ser extraído automáticamente. Usa la IA para analizarlo.`;
    }
    return file.buffer.toString('utf-8').slice(0, 50000) || `[${file.originalname}]`;
  }

  private async generateSummary(content: string): Promise<string> {
    const result = await this.aiService.chat(
      [
        {
          role: 'system',
          content:
            'Resume el siguiente texto de forma clara y concisa. Destaca las ideas principales, datos clave y conclusiones. Máximo 3 párrafos.',
        },
        { role: 'user', content: content.slice(0, 15000) },
      ],
      { feature: 'doc-summary', temperature: 0.3 },
    );
    return result.content;
  }

  private async extractConcepts(content: string): Promise<any> {
    const result = await this.aiService.chat(
      [
        {
          role: 'system',
          content:
            'Extrae los conceptos clave del texto. Devuelve un JSON array con objetos: { concept, definition, importance (1-5), relatedConcepts: string[] }',
        },
        { role: 'user', content: content.slice(0, 15000) },
      ],
      { feature: 'doc-concepts', temperature: 0.3 },
    );
    try {
      return JSON.parse(result.content.match(/\{[\s\S]*\}|\[[\s\S]*\]/)![0]);
    } catch {
      return [];
    }
  }

  private async generateQuestions(content: string): Promise<any> {
    const result = await this.aiService.chat(
      [
        {
          role: 'system',
          content:
            'Genera preguntas de comprensión sobre el texto. Devuelve JSON array con objetos: { question, options: string[], correctIndex: number, explanation: string, difficulty: "easy"|"medium"|"hard" }',
        },
        { role: 'user', content: content.slice(0, 15000) },
      ],
      { feature: 'doc-questions', temperature: 0.5 },
    );
    try {
      return JSON.parse(result.content.match(/\{[\s\S]*\}|\[[\s\S]*\]/)![0]);
    } catch {
      return [];
    }
  }

  private async generateMindMap(content: string): Promise<any> {
    const result = await this.aiService.chat(
      [
        {
          role: 'system',
          content:
            'Crea un mapa conceptual del texto. Devuelve JSON: { centralTopic: string, nodes: Array<{ id: string, label: string, level: number, parentId?: string }>, connections: Array<{ from: string, to: string, label: string }> }',
        },
        { role: 'user', content: content.slice(0, 15000) },
      ],
      { feature: 'doc-mindmap', temperature: 0.4 },
    );
    try {
      return JSON.parse(result.content.match(/\{[\s\S]*\}/)![0]);
    } catch {
      return { centralTopic: '', nodes: [], connections: [] };
    }
  }

  private async generateGlossary(content: string): Promise<any> {
    const result = await this.aiService.chat(
      [
        {
          role: 'system',
          content:
            'Crea un glosario de términos difíciles encontrados en el texto. Devuelve JSON array: { term: string, simpleExplanation: string, scientificExplanation: string, example: string }',
        },
        { role: 'user', content: content.slice(0, 15000) },
      ],
      { feature: 'doc-glossary', temperature: 0.3 },
    );
    try {
      return JSON.parse(result.content.match(/\{[\s\S]*\}|\[[\s\S]*\]/)![0]);
    } catch {
      return [];
    }
  }

  private async generateActivities(content: string): Promise<any> {
    const result = await this.aiService.chat(
      [
        {
          role: 'system',
          content:
            'Genera actividades educativas basadas en el texto. Devuelve JSON array: { title: string, type: "individual"|"grupal"|"investigacion"|"practica", duration: string, description: string, materials: string[], objectives: string[], steps: string[] }',
        },
        { role: 'user', content: content.slice(0, 15000) },
      ],
      { feature: 'doc-activities', temperature: 0.6 },
    );
    try {
      return JSON.parse(result.content.match(/\{[\s\S]*\}|\[[\s\S]*\]/)![0]);
    } catch {
      return [];
    }
  }
}
