import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';

@Injectable()
export class SiaAlertsService {
  protected logger = new Logger(SiaAlertsService.name);

  constructor(
    private prisma: PrismaService,
    private aiService?: AiService,
  ) {}

  async createRule(dto: {
    name: string;
    description?: string;
    condition: string;
    threshold: number;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    channel?: string;
    cooldown?: number;
    indicatorId?: string;
  }) {
    try {
      const rule = await (this.prisma as any).siaAlertRule.create({
        data: {
          name: dto.name,
          description: dto.description,
          condition: dto.condition,
          threshold: dto.threshold,
          severity: dto.severity || 'MEDIUM',
          channel: dto.channel || 'email',
          cooldown: dto.cooldown ?? 3600,
          indicatorId: dto.indicatorId,
        },
        include: { indicator: true },
      });
      this.logger.log(`Alert rule created: ${rule.name}`);
      return rule;
    } catch (error) {
      this.logger.error(`Error creating alert rule: ${(error as Error).message}`);
      throw error;
    }
  }

  async updateRule(id: string, dto: any) {
    const existing = await (this.prisma as any).siaAlertRule.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Regla de alerta con ID "${id}" no encontrada`);
    try {
      return await (this.prisma as any).siaAlertRule.update({
        where: { id },
        data: dto,
        include: { indicator: true },
      });
    } catch (error) {
      this.logger.error(`Error updating alert rule ${id}: ${(error as Error).message}`);
      throw error;
    }
  }

  async findAllRules(status?: string, severity?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;
    try {
      return await (this.prisma as any).siaAlertRule.findMany({
        where,
        include: { indicator: true, _count: { select: { logs: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Error listing alert rules: ${(error as Error).message}`);
      throw error;
    }
  }

  async findOneRule(id: string) {
    const rule = await (this.prisma as any).siaAlertRule.findUnique({
      where: { id },
      include: {
        indicator: true,
        logs: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    });
    if (!rule) throw new NotFoundException(`Regla de alerta con ID "${id}" no encontrada`);
    return rule;
  }

  async deleteRule(id: string) {
    const existing = await (this.prisma as any).siaAlertRule.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Regla de alerta con ID "${id}" no encontrada`);
    try {
      await (this.prisma as any).siaAlertRule.delete({ where: { id } });
      this.logger.log(`Alert rule deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting alert rule ${id}: ${(error as Error).message}`);
      throw error;
    }
  }

  async getLogs(ruleId?: string, severity?: string, read?: boolean, page = 1, limit = 20) {
    const where: any = {};
    if (ruleId) where.ruleId = ruleId;
    if (severity) where.severity = severity;
    if (read !== undefined) where.read = read;
    const skip = (page - 1) * limit;
    try {
      const [data, total] = await Promise.all([
        (this.prisma as any).siaAlertLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { rule: true },
        }),
        (this.prisma as any).siaAlertLog.count({ where }),
      ]);
      return {
        data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      this.logger.error(`Error fetching alert logs: ${(error as Error).message}`);
      throw error;
    }
  }

  async markAsRead(id: string) {
    const existing = await (this.prisma as any).siaAlertLog.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Log de alerta con ID "${id}" no encontrado`);
    try {
      return await (this.prisma as any).siaAlertLog.update({
        where: { id },
        data: { read: true, readAt: new Date() },
      });
    } catch (error) {
      this.logger.error(`Error marking alert log as read: ${(error as Error).message}`);
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      const result = await (this.prisma as any).siaAlertLog.updateMany({
        where: { read: false },
        data: { read: true, readAt: new Date() },
      });
      return { updated: result.count };
    } catch (error) {
      this.logger.error(`Error marking all logs as read: ${(error as Error).message}`);
      throw error;
    }
  }

  async checkThresholds() {
    const results: any[] = [];
    try {
      const rules = await (this.prisma as any).siaAlertRule.findMany({
        where: { status: 'ACTIVE' },
        include: { indicator: { include: { records: { orderBy: { date: 'desc' }, take: 1 } } } },
      });

      const triggeredRules: Array<{ rule: any; latestValue: number }> = [];

      for (const rule of rules) {
        if (!rule.indicator || rule.indicator.records.length === 0) continue;

        const latestValue = rule.indicator.records[0].value;
        let triggered = false;

        switch (rule.condition) {
          case 'GT': triggered = latestValue > rule.threshold; break;
          case 'LT': triggered = latestValue < rule.threshold; break;
          case 'GTE': triggered = latestValue >= rule.threshold; break;
          case 'LTE': triggered = latestValue <= rule.threshold; break;
          case 'EQ': triggered = latestValue === rule.threshold; break;
          default: triggered = latestValue > rule.threshold;
        }

        if (triggered) {
          triggeredRules.push({ rule, latestValue });
        }
      }

      if (triggeredRules.length === 0) return results;

      const recentLogs = await (this.prisma as any).siaAlertLog.findMany({
        where: {
          ruleId: { in: triggeredRules.map((t) => t.rule.id) },
          createdAt: { gte: new Date(Date.now() - Math.max(...triggeredRules.map((t) => t.rule.cooldown || 3600)) * 1000) },
        },
      });

      const recentRuleIds = new Set(recentLogs.map((log: any) => log.ruleId));

      for (const { rule, latestValue } of triggeredRules) {
        if (recentRuleIds.has(rule.id)) continue;

        const log = await (this.prisma as any).siaAlertLog.create({
          data: {
            ruleId: rule.id,
            severity: rule.severity,
            channel: rule.channel,
            message: `Indicador "${rule.indicator.name}" (${latestValue}) ha excedido el umbral ${rule.condition} ${rule.threshold}`,
            metadata: { value: latestValue, threshold: rule.threshold, indicatorName: rule.indicator.name },
          },
        });
        results.push(log);
        this.logger.warn(`Alert triggered: ${rule.name} - Value: ${latestValue}`);
      }

      return results;
    } catch (error) {
      this.logger.error(`Error checking thresholds: ${(error as Error).message}`);
      throw error;
    }
  }

  async getStats() {
    try {
      const [severityCounts, statusCounts, totalLogs, unreadLogs] = await Promise.all([
        (this.prisma as any).siaAlertRule.groupBy({
          by: ['severity'],
          _count: true,
        }),
        (this.prisma as any).siaAlertRule.groupBy({
          by: ['status'],
          _count: true,
        }),
        (this.prisma as any).siaAlertLog.count(),
        (this.prisma as any).siaAlertLog.count({ where: { read: false } }),
      ]);

      const severity: Record<string, number> = {};
      for (const s of severityCounts) severity[s.severity] = s._count;
      const status: Record<string, number> = {};
      for (const s of statusCounts) status[s.status] = s._count;

      return { severity, status, totalLogs, unreadLogs };
    } catch (error) {
      this.logger.error(`Error getting alert stats: ${(error as Error).message}`);
      throw error;
    }
  }
}
