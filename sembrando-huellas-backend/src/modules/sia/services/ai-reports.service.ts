import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';

@Injectable()
export class SiaAiReportsService {
  protected logger = new Logger(SiaAiReportsService.name);

  private readonly disclaimer =
    'Este informe ha sido generado por inteligencia artificial y requiere revisión humana antes de su publicación oficial.';

  constructor(
    private prisma: PrismaService,
    private aiService?: AiService,
  ) {}

  async generateSummary(dto: {
    type: string;
    startDate?: string;
    endDate?: string;
    region?: string;
    indicators?: string[];
    includeCharts?: boolean;
  }) {
    try {
      const indicatorWhere: any = {};
      if (dto.region) indicatorWhere.region = dto.region;
      if (dto.indicators && dto.indicators.length > 0) {
        indicatorWhere.slug = { in: dto.indicators };
      }

      const indicators = await (this.prisma as any).siaIndicator.findMany({
        where: indicatorWhere,
        include: {
          records: {
            where: {
              ...(dto.startDate || dto.endDate
                ? {
                    date: {
                      ...(dto.startDate ? { gte: new Date(dto.startDate) } : {}),
                      ...(dto.endDate ? { lte: new Date(dto.endDate) } : {}),
                    },
                  }
                : {}),
            },
            orderBy: { date: 'desc' },
            take: 100,
          },
        },
      });

      const aiMetrics = await (this.prisma as any).aiQueryLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      const chartData: any[] = [];
      if (dto.includeCharts) {
        for (const ind of indicators) {
          chartData.push({
            indicator: ind.name,
            type: 'line',
            labels: ind.records.map((r: any) => r.date.toISOString()),
            values: ind.records.map((r: any) => r.value),
          });
        }
      }

      const summary = this.buildSummaryText(dto.type, indicators, aiMetrics);

      return {
        summary,
        disclaimer: this.disclaimer,
        data: {
          type: dto.type,
          period: { start: dto.startDate || null, end: dto.endDate || null },
          region: dto.region || null,
          indicators: indicators.map((i: any) => ({
            name: i.name,
            slug: i.slug,
            category: i.category,
            currentValue: i.records[0]?.value || null,
            recordsCount: i.records.length,
          })),
          aiQueryStats: {
            total: aiMetrics.length,
            averageLatency:
              aiMetrics.length > 0
                ? aiMetrics.reduce((s: number, l: any) => s + (l.latencyMs || 0), 0) / aiMetrics.length
                : 0,
          },
        },
        charts: dto.includeCharts ? chartData : [],
      };
    } catch (error) {
      this.logger.error(`Error generating summary: ${(error as Error).message}`);
      return {
        summary: 'No se pudo generar el resumen debido a un error en la consulta de datos.',
        disclaimer: this.disclaimer,
        data: null,
        charts: [],
      };
    }
  }

  private buildSummaryText(type: string, indicators: any[], aiMetrics: any[]): string {
    const totalIndicators = indicators.length;
    const totalRecords = indicators.reduce((s: number, i: any) => s + i.records.length, 0);
    const categories = [...new Set(indicators.map((i: any) => i.category).filter(Boolean))];

    let text = `Resumen generado para ${type}. `;
    text += `Se analizaron ${totalIndicators} indicadores en ${categories.length} categorías, `;
    text += `con un total de ${totalRecords} registros. `;

    if (indicators.length > 0) {
      const latest = indicators.filter((i: any) => i.records.length > 0);
      if (latest.length > 0) {
        text += `Los indicadores con datos recientes incluyen: ${latest
          .slice(0, 5)
          .map((i: any) => `${i.name} (${i.records[0].value}${i.unit ? ' ' + i.unit : ''})`)
          .join(', ')}. `;
      }
    }

    if (aiMetrics.length > 0) {
      const successRate = (aiMetrics.filter((l: any) => l.success).length / aiMetrics.length) * 100;
      text += `El sistema de IA registró ${aiMetrics.length} consultas con una tasa de éxito del ${successRate.toFixed(1)}%.`;
    }

    return text;
  }

  async detectTrends(metric: string, period: string) {
    try {
      const now = new Date();
      let startDate: Date;
      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const indicator = await (this.prisma as any).siaIndicator.findFirst({
        where: { slug: metric },
        include: {
          records: {
            where: { date: { gte: startDate } },
            orderBy: { date: 'asc' },
          },
        },
      });

      if (!indicator || indicator.records.length < 2) {
        return {
          metric,
          period,
          trends: [],
          message: 'Datos insuficientes para detectar tendencias',
        };
      }

      const values = indicator.records.map((r: any) => r.value);
      const firstHalf = values.slice(0, Math.floor(values.length / 2));
      const secondHalf = values.slice(Math.floor(values.length / 2));
      const firstAvg = firstHalf.reduce((s: number, v: number) => s + v, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((s: number, v: number) => s + v, 0) / secondHalf.length;
      const change = secondAvg - firstAvg;
      const changePercent = firstAvg !== 0 ? (change / firstAvg) * 100 : 0;

      let direction: 'up' | 'down' | 'stable';
      if (Math.abs(changePercent) < 5) {
        direction = 'stable';
      } else if (changePercent > 0) {
        direction = 'up';
      } else {
        direction = 'down';
      }

      const magnitude = Math.abs(changePercent);
      const confidence = Math.min(100, (values.length / 30) * 100);

      const trends = [
        {
          indicator: indicator.name,
          direction,
          magnitude: Math.round(magnitude * 100) / 100,
          confidence: Math.round(confidence * 100) / 100,
          period,
          startValue: values[0],
          endValue: values[values.length - 1],
          average: values.reduce((s: number, v: number) => s + v, 0) / values.length,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
        },
      ];

      return { metric, period, trends, dataPoints: values.length };
    } catch (error) {
      this.logger.error(`Error detecting trends: ${(error as Error).message}`);
      throw error;
    }
  }

  async generateDraft(type: string, filters?: any) {
    try {
      const indicators = await (this.prisma as any).siaIndicator.findMany({
        include: { records: { orderBy: { date: 'desc' }, take: 10 } },
      });

      const projects = await (this.prisma as any).project.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      const aiQueries = await (this.prisma as any).aiQueryLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      return {
        draft: true,
        type,
        filters: filters || null,
        generatedAt: new Date().toISOString(),
        sections: [
          {
            title: 'Indicadores',
            type: 'table',
            data: indicators.map((i: any) => ({
              name: i.name,
              category: i.category,
              currentValue: i.records[0]?.value || null,
              lastUpdate: i.records[0]?.date || null,
            })),
          },
          {
            title: 'Proyectos',
            type: 'list',
            data: projects.map((p: any) => ({
              name: p.name,
              status: p.status,
            })),
          },
          {
            title: 'Actividad de IA',
            type: 'summary',
            data: {
              totalQueries: aiQueries.length,
              successRate:
                aiQueries.length > 0 ? (aiQueries.filter((q: any) => q.success).length / aiQueries.length) * 100 : 0,
            },
          },
        ],
      };
    } catch (error) {
      this.logger.error(`Error generating draft: ${(error as Error).message}`);
      throw error;
    }
  }

  async explainChart(chartType: string, data: any) {
    try {
      if (!data || !data.labels || !data.values) {
        return {
          chartType,
          explanation: 'No hay datos suficientes para generar una explicación.',
          disclaimer: this.disclaimer,
        };
      }

      const values = data.values as number[];
      const labels = data.labels as string[];
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = values.reduce((s: number, v: number) => s + v, 0) / values.length;
      const last = values[values.length - 1];
      const first = values[0];
      const trend = last > first ? 'ascendente' : last < first ? 'descendente' : 'estable';

      const maxIdx = values.indexOf(max);
      const minIdx = values.indexOf(min);

      let explanation = `Gráfico de tipo "${chartType}" con ${values.length} puntos de datos. `;
      explanation += `El valor promedio es ${avg.toFixed(2)}, con un mínimo de ${min.toFixed(2)}`;
      if (labels[minIdx]) explanation += ` (${labels[minIdx]})`;
      explanation += ` y un máximo de ${max.toFixed(2)}`;
      if (labels[maxIdx]) explanation += ` (${labels[maxIdx]})`;
      explanation += `. `;
      explanation += `La tendencia general es ${trend}`;
      if (trend !== 'estable') {
        const change = ((last - first) / first) * 100;
        explanation += ` con una variación del ${Math.abs(change).toFixed(1)}%`;
      }
      explanation += '.';

      return {
        chartType,
        explanation,
        disclaimer: this.disclaimer,
        stats: { min, max, avg: Math.round(avg * 100) / 100, trend },
      };
    } catch (error) {
      this.logger.error(`Error explaining chart: ${(error as Error).message}`);
      return {
        chartType,
        explanation: 'Error al generar la explicación del gráfico.',
        disclaimer: this.disclaimer,
      };
    }
  }

  async suggestActions(data: any) {
    try {
      if (!data || !data.indicators) {
        return {
          suggestions: [],
          disclaimer: this.disclaimer,
        };
      }

      const suggestions: Array<{ indicator: string; action: string; priority: string }> = [];

      for (const indicator of data.indicators) {
        if (indicator.currentValue == null) continue;

        if (indicator.category === 'EDUCACION' && indicator.currentValue < 50) {
          suggestions.push({
            indicator: indicator.name,
            action: 'Fortalecer programas educativos y aumentar cobertura en regiones con bajo rendimiento.',
            priority: 'ALTA',
          });
        } else if (indicator.category === 'AMBIENTAL' && indicator.currentValue < 40) {
          suggestions.push({
            indicator: indicator.name,
            action: 'Implementar medidas de mitigación ambiental y reforzar campañas de conservación.',
            priority: 'ALTA',
          });
        } else if (indicator.category === 'SOCIAL' && indicator.currentValue < 60) {
          suggestions.push({
            indicator: indicator.name,
            action: 'Ampliar programas de participación comunitaria y fortalecer alianzas locales.',
            priority: 'MEDIA',
          });
        } else if (indicator.category === 'ECONOMICO' && indicator.currentValue < 30) {
          suggestions.push({
            indicator: indicator.name,
            action: 'Evaluar fuentes de financiamiento y optimizar asignación de recursos.',
            priority: 'MEDIA',
          });
        }

        const previousValue = indicator.previousValue;
        if (previousValue != null && indicator.currentValue < previousValue) {
          suggestions.push({
            indicator: indicator.name,
            action: `Revisar tendencia decreciente en "${indicator.name}". Analizar causas y aplicar medidas correctivas.`,
            priority: 'MEDIA',
          });
        }
      }

      return {
        suggestions,
        total: suggestions.length,
        disclaimer: this.disclaimer,
      };
    } catch (error) {
      this.logger.error(`Error suggesting actions: ${(error as Error).message}`);
      return {
        suggestions: [],
        disclaimer: this.disclaimer,
      };
    }
  }
}
