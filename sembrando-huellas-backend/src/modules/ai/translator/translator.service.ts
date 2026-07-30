import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai.service';
import { TRANSLATOR_SYSTEM } from '../prompts';

interface TranslateKeyItem {
  key: string;
  value: string;
  sourceLang: string;
  targetLang: string;
}

interface BatchProgress {
  total: number;
  completed: number;
  failed: number;
  errors: Array<{ key: string; error: string }>;
}

@Injectable()
export class TranslatorService {
  private readonly logger = new Logger(TranslatorService.name);

  constructor(private aiService: AiService) {}

  async translate(dto: {
    text: string;
    sourceLanguage?: string;
    targetLanguage: string;
    context?: string;
  }): Promise<{ translatedText: string; sourceLanguage: string; targetLanguage: string }> {
    const source = dto.sourceLanguage || (await this.detectLanguage(dto.text)).language;
    const contextPrompt = dto.context ? `\n\nContexto: ${dto.context}` : '';

    const userMessage = `Traduce el siguiente texto de ${source} a ${dto.targetLanguage}:${contextPrompt}\n\n${dto.text}`;

    const result = await this.aiService.chat(
      [
        { role: 'system', content: TRANSLATOR_SYSTEM },
        { role: 'user', content: userMessage },
      ],
      { feature: 'translator', temperature: 0.3, maxTokens: 4000 },
    );

    return {
      translatedText: result.content.trim(),
      sourceLanguage: source,
      targetLanguage: dto.targetLanguage,
    };
  }

  async translateKeys(
    items: TranslateKeyItem[],
    onProgress?: (progress: BatchProgress) => void,
  ): Promise<BatchProgress> {
    const progress: BatchProgress = { total: items.length, completed: 0, failed: 0, errors: [] };

    const BATCH_SIZE = 5;
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      const batchPrompt = batch
        .map(
          (item, idx) =>
            `[${idx}] Clave: "${item.key}"\nTexto (${item.sourceLang}): "${item.value}"\nTraducir a: ${item.targetLang}`,
        )
        .join('\n\n');

      const userMessage = `Traduce los siguientes textos al idioma destino indicado para cada uno.\n\n${batchPrompt}\n\nResponde en formato JSON: { "0": "traducción1", "1": "traducción2", ... }`;

      try {
        const result = await this.aiService.chat(
          [
            { role: 'system', content: TRANSLATOR_SYSTEM },
            { role: 'user', content: userMessage },
          ],
          { feature: 'translator', temperature: 0.3, maxTokens: 4000 },
        );

        const parsed = JSON.parse(result.content.trim());
        for (let j = 0; j < batch.length; j++) {
          if (parsed[String(j)]) {
            batch[j].value = parsed[String(j)];
            progress.completed++;
          } else {
            progress.failed++;
            progress.errors.push({ key: batch[j].key, error: 'No translation returned' });
          }
        }
      } catch (error) {
        for (const item of batch) {
          progress.failed++;
          progress.errors.push({ key: item.key, error: (error as Error).message });
        }
      }

      if (onProgress) onProgress({ ...progress });
    }

    return progress;
  }

  async detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
    const patterns: Array<{ regex: RegExp; lang: string }> = [
      { regex: /[áéíóúüñ¿¡]/i, lang: 'es' },
      { regex: /[àâçéèêëîïôûùü]/i, lang: 'fr' },
      { regex: /[äöüß]/i, lang: 'de' },
      { regex: /[àèéìòù]/i, lang: 'it' },
      { regex: /[ãõâêíóú]/i, lang: 'pt' },
      { regex: /[qkw']/i, lang: 'qu' },
    ];

    for (const { regex, lang } of patterns) {
      if (regex.test(text)) {
        return { language: lang, confidence: 0.7 };
      }
    }

    const langData: Array<{ words: string[]; lang: string }> = [
      { words: ['the', 'is', 'are', 'was', 'were', 'will', 'have', 'has', 'been', 'this', 'that', 'with'], lang: 'en' },
      { words: ['el', 'la', 'los', 'las', 'es', 'son', 'está', 'están', 'con', 'para', 'por', 'del'], lang: 'es' },
      { words: ['o', 'a', 'os', 'as', 'é', 'são', 'está', 'estão', 'com', 'para', 'por', 'do', 'da'], lang: 'pt' },
    ];

    const words = text.toLowerCase().split(/\s+/);
    const scores = langData.map(({ words: dict, lang }) => {
      const count = words.filter((w) => dict.includes(w)).length;
      return { lang, score: count / Math.max(words.length, 1) };
    });

    const best = scores.sort((a, b) => b.score - a.score)[0];

    if (best && best.score > 0.15) {
      return { language: best.lang, confidence: Math.min(best.score * 2, 0.95) };
    }

    return { language: 'es', confidence: 0.5 };
  }

  async getSupportedLanguages(): Promise<Array<{ code: string; name: string; nativeName: string; status: string }>> {
    return [
      { code: 'es', name: 'Spanish', nativeName: 'Español', status: 'full' },
      { code: 'en', name: 'English', nativeName: 'English', status: 'full' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português', status: 'full' },
      { code: 'qu', name: 'Quechua', nativeName: 'Runasimi', status: 'partial' },
      { code: 'ay', name: 'Aymara', nativeName: 'Aymar aru', status: 'partial' },
      { code: 'cni', name: 'Asháninka', nativeName: 'Asháninka', status: 'partial' },
    ];
  }
}
