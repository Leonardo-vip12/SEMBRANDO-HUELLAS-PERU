import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';

@Injectable()
export class SiaMonitoringService {
  protected logger = new Logger(SiaMonitoringService.name);

  private startTime = Date.now();
  private activeServices: Map<string, { status: string; lastHeartbeat: Date }> = new Map();

  constructor(
    private prisma: PrismaService,
    private aiService?: AiService,
  ) {
    this.registerCoreServices();
  }

  private registerCoreServices() {
    const services = [
      'sia-dashboard',
      'sia-indicators',
      'sia-alerts',
      'sia-comparator',
      'sia-data-center',
      'sia-geospatial',
      'sia-ai-reports',
      'sia-transparency',
      'sia-citizen-science',
      'sia-reports',
      'sia-biodiversity',
      'sia-maps',
      'sia-analytics',
    ];
    for (const name of services) {
      this.activeServices.set(name, { status: 'active', lastHeartbeat: new Date() });
    }
  }

  async getSystemStatus() {
    const apiHealthy = true;
    let dbHealthy = false;
    let redisHealthy = true;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbHealthy = true;
    } catch {
      dbHealthy = false;
    }

    const aiProviders: Array<{ name: string; healthy: boolean }> = [];
    if (this.aiService) {
      try {
        const available = this.aiService.isAnyProviderAvailable();
        const provider = this.aiService.getActiveProvider();
        aiProviders.push({
          name: provider?.type || 'unknown',
          healthy: available,
        });
      } catch {
        aiProviders.push({ name: 'ai', healthy: false });
      }
    }

    return {
      api: { status: apiHealthy ? 'healthy' : 'unhealthy', uptime: this.getUptime() },
      database: { status: dbHealthy ? 'healthy' : 'unhealthy' },
      redis: { status: redisHealthy ? 'healthy' : 'unhealthy' },
      aiProviders,
      uptime: this.getUptime(),
      timestamp: new Date().toISOString(),
    };
  }

  async getSyncStatus() {
    try {
      const [indicatorCount, recordCount, logCount, reportCount] = await Promise.all([
        (this.prisma as any).siaIndicator.count(),
        (this.prisma as any).siaIndicatorRecord.count(),
        (this.prisma as any).siaAlertLog.count(),
        (this.prisma as any).siaReport.count(),
      ]);

      return {
        status: 'synced',
        lastSync: new Date().toISOString(),
        stats: {
          indicators: indicatorCount,
          records: recordCount,
          alertLogs: logCount,
          reports: reportCount,
        },
      };
    } catch (error) {
      this.logger.error(`Error getting sync status: ${(error as Error).message}`);
      return { status: 'error', lastSync: null, error: (error as Error).message };
    }
  }

  async getActiveServices() {
    const now = new Date();
    const services = Array.from(this.activeServices.entries()).map(([name, info]) => {
      const secondsSinceHeartbeat = (now.getTime() - info.lastHeartbeat.getTime()) / 1000;
      return {
        name,
        status: secondsSinceHeartbeat > 120 ? 'inactive' : info.status,
        lastHeartbeat: info.lastHeartbeat,
        uptime: this.getUptime(),
      };
    });

    return { services, total: services.length };
  }

  async getQueues() {
    return {
      queues: [
        { name: 'alerts', pending: 0, processing: 0, failed: 0 },
        { name: 'reports', pending: 0, processing: 0, failed: 0 },
        { name: 'sync', pending: 0, processing: 0, failed: 0 },
      ],
      note: 'Queue system placeholder - pending Bull/BullMQ integration',
    };
  }

  async getProcesses() {
    return {
      processes: [
        { name: 'threshold-checker', status: 'idle', lastRun: null, interval: '5 minutes' },
        { name: 'report-generator', status: 'idle', lastRun: null, interval: 'on-demand' },
        { name: 'data-sync', status: 'idle', lastRun: null, interval: 'hourly' },
        { name: 'backup', status: 'idle', lastRun: null, interval: 'daily' },
      ],
    };
  }

  async getErrors(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    try {
      const [data, total] = await Promise.all([
        (this.prisma as any).siaMonitoringLog.findMany({
          where: { status: 'error' },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        (this.prisma as any).siaMonitoringLog.count({ where: { status: 'error' } }),
      ]);

      return {
        data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      this.logger.error(`Error fetching monitoring errors: ${(error as Error).message}`);
      throw error;
    }
  }

  async getResourceUsage() {
    return {
      cpu: { usage: 0, cores: 0 },
      memory: { used: 0, total: 0, percent: 0 },
      disk: { used: 0, total: 0, percent: 0 },
      note: 'Resource usage monitoring placeholder - pending system metrics integration',
      timestamp: new Date().toISOString(),
    };
  }

  async createLog(entry: { service: string; status: string; latency?: number; errorCount?: number; message?: string }) {
    try {
      const log = await (this.prisma as any).siaMonitoringLog.create({
        data: {
          service: entry.service,
          status: entry.status,
          latency: entry.latency || 0,
          errorCount: entry.errorCount || 0,
          message: entry.message || '',
        },
      });

      if (this.activeServices.has(entry.service)) {
        this.activeServices.set(entry.service, {
          status: entry.status === 'error' ? 'error' : 'active',
          lastHeartbeat: new Date(),
        });
      }

      return log;
    } catch (error) {
      this.logger.error(`Error creating monitoring log: ${(error as Error).message}`);
      throw error;
    }
  }

  async getLogs(service?: string, status?: string, page = 1, limit = 20) {
    const where: any = {};
    if (service) where.service = service;
    if (status) where.status = status;
    const skip = (page - 1) * limit;
    try {
      const [data, total] = await Promise.all([
        (this.prisma as any).siaMonitoringLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        (this.prisma as any).siaMonitoringLog.count({ where }),
      ]);

      return {
        data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      this.logger.error(`Error fetching monitoring logs: ${(error as Error).message}`);
      throw error;
    }
  }

  private getUptime(): string {
    const diff = Date.now() - this.startTime;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  }
}
