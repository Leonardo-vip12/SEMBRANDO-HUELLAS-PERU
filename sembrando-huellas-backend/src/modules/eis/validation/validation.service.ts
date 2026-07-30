import { Injectable, Logger } from '@nestjs/common';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';

export interface ValidationResult {
  isValidated: boolean;
  confidence: 'alta' | 'media' | 'baja';
  sources: string[];
  warnings: string[];
  reviewedBy?: string;
  reviewedAt?: string;
  disclaimer: string;
}

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);

  constructor(private kbService: KnowledgeBaseService) {}

  async validateResponse(
    response: string,
    sourceInfo?: { query?: string; provider?: string; model?: string },
  ): Promise<ValidationResult> {
    const warnings: string[] = [];
    const sources: string[] = [];

    if (sourceInfo?.query) {
      const kbResults = await this.kbService.search(sourceInfo.query, undefined, 3);
      kbResults.forEach((r: any) => {
        if (r.source) sources.push(r.source);
      });
    }

    if (this.containsUncertainty(response)) {
      warnings.push('La respuesta contiene expresiones de incertidumbre que requieren verificación.');
    }

    if (
      response.includes('IA') ||
      response.includes('inteligencia artificial') ||
      response.includes('modelo de lenguaje')
    ) {
      warnings.push(
        'Esta respuesta fue generada por inteligencia artificial y debe ser verificada por un especialista antes de usar como información oficial.',
      );
    }

    const confidenceLevel = this.calculateConfidence(response, sources);

    return {
      isValidated: sources.length > 0 && !this.containsUncertainty(response),
      confidence: confidenceLevel,
      sources: [...new Set(sources)],
      warnings,
      disclaimer:
        'Esta información fue generada por IA como referencia preliminar. No reemplaza la consulta a fuentes oficiales o especialistas. Verifique los datos antes de usarlos con fines académicos o de investigación.',
    };
  }

  async validateContent(
    content: string,
    category: string,
  ): Promise<{
    approved: boolean;
    suggestions: string[];
    issues: string[];
    score: number;
  }> {
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (content.length < 50) {
      issues.push('El contenido es demasiado corto para ser informativo.');
    }

    if (!content.includes('Perú') && !content.includes('peruano')) {
      suggestions.push('Considere incluir referencias al contexto peruano.');
    }

    const hasData = /\d+/.test(content);
    if (!hasData) {
      suggestions.push('Agregue datos cuantitativos para respaldar la información.');
    }

    const score = Math.max(0, Math.min(100, 100 - issues.length * 20 + suggestions.length * 5));

    return {
      approved: score >= 50,
      suggestions,
      issues,
      score,
    };
  }

  addDisclaimer(response: string, validation: ValidationResult): string {
    return `${response}\n\n---\n*🤖 Generado por IA • Confianza: ${validation.confidence} • Fuentes: ${validation.sources.length > 0 ? validation.sources.join(', ') : 'No verificadas'} • ${validation.disclaimer}*`;
  }

  private containsUncertainty(text: string): boolean {
    const patterns = [
      /no estoy seguro/i,
      /podría ser/i,
      /tal vez/i,
      /quizás/i,
      /no tengo información/i,
      /no puedo confirmar/i,
      /es posible/i,
      /no está claro/i,
      /no se sabe con certeza/i,
    ];
    return patterns.some((p) => p.test(text));
  }

  private calculateConfidence(response: string, sources: string[]): 'alta' | 'media' | 'baja' {
    if (sources.length >= 3 && !this.containsUncertainty(response)) return 'alta';
    if (sources.length >= 1) return 'media';
    return 'baja';
  }
}
