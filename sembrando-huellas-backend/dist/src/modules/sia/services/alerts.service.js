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
var SiaAlertsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiaAlertsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const ai_service_1 = require("../../ai/ai.service");
let SiaAlertsService = SiaAlertsService_1 = class SiaAlertsService {
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
        this.logger = new common_1.Logger(SiaAlertsService_1.name);
    }
    async createRule(dto) {
        try {
            const rule = await this.prisma.siaAlertRule.create({
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
        }
        catch (error) {
            this.logger.error(`Error creating alert rule: ${error.message}`);
            throw error;
        }
    }
    async updateRule(id, dto) {
        const existing = await this.prisma.siaAlertRule.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Regla de alerta con ID "${id}" no encontrada`);
        try {
            return await this.prisma.siaAlertRule.update({
                where: { id },
                data: dto,
                include: { indicator: true },
            });
        }
        catch (error) {
            this.logger.error(`Error updating alert rule ${id}: ${error.message}`);
            throw error;
        }
    }
    async findAllRules(status, severity) {
        const where = {};
        if (status)
            where.status = status;
        if (severity)
            where.severity = severity;
        try {
            return await this.prisma.siaAlertRule.findMany({
                where,
                include: { indicator: true, _count: { select: { logs: true } } },
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            this.logger.error(`Error listing alert rules: ${error.message}`);
            throw error;
        }
    }
    async findOneRule(id) {
        const rule = await this.prisma.siaAlertRule.findUnique({
            where: { id },
            include: {
                indicator: true,
                logs: { orderBy: { createdAt: 'desc' }, take: 50 },
            },
        });
        if (!rule)
            throw new common_1.NotFoundException(`Regla de alerta con ID "${id}" no encontrada`);
        return rule;
    }
    async deleteRule(id) {
        const existing = await this.prisma.siaAlertRule.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Regla de alerta con ID "${id}" no encontrada`);
        try {
            await this.prisma.siaAlertRule.delete({ where: { id } });
            this.logger.log(`Alert rule deleted: ${id}`);
        }
        catch (error) {
            this.logger.error(`Error deleting alert rule ${id}: ${error.message}`);
            throw error;
        }
    }
    async getLogs(ruleId, severity, read, page = 1, limit = 20) {
        const where = {};
        if (ruleId)
            where.ruleId = ruleId;
        if (severity)
            where.severity = severity;
        if (read !== undefined)
            where.read = read;
        const skip = (page - 1) * limit;
        try {
            const [data, total] = await Promise.all([
                this.prisma.siaAlertLog.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                    include: { rule: true },
                }),
                this.prisma.siaAlertLog.count({ where }),
            ]);
            return {
                data,
                meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
            };
        }
        catch (error) {
            this.logger.error(`Error fetching alert logs: ${error.message}`);
            throw error;
        }
    }
    async markAsRead(id) {
        const existing = await this.prisma.siaAlertLog.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException(`Log de alerta con ID "${id}" no encontrado`);
        try {
            return await this.prisma.siaAlertLog.update({
                where: { id },
                data: { read: true, readAt: new Date() },
            });
        }
        catch (error) {
            this.logger.error(`Error marking alert log as read: ${error.message}`);
            throw error;
        }
    }
    async markAllAsRead() {
        try {
            const result = await this.prisma.siaAlertLog.updateMany({
                where: { read: false },
                data: { read: true, readAt: new Date() },
            });
            return { updated: result.count };
        }
        catch (error) {
            this.logger.error(`Error marking all logs as read: ${error.message}`);
            throw error;
        }
    }
    async checkThresholds() {
        const results = [];
        try {
            const rules = await this.prisma.siaAlertRule.findMany({
                where: { status: 'ACTIVE' },
                include: { indicator: { include: { records: { orderBy: { date: 'desc' }, take: 1 } } } },
            });
            const triggeredRules = [];
            for (const rule of rules) {
                if (!rule.indicator || rule.indicator.records.length === 0)
                    continue;
                const latestValue = rule.indicator.records[0].value;
                let triggered = false;
                switch (rule.condition) {
                    case 'GT':
                        triggered = latestValue > rule.threshold;
                        break;
                    case 'LT':
                        triggered = latestValue < rule.threshold;
                        break;
                    case 'GTE':
                        triggered = latestValue >= rule.threshold;
                        break;
                    case 'LTE':
                        triggered = latestValue <= rule.threshold;
                        break;
                    case 'EQ':
                        triggered = latestValue === rule.threshold;
                        break;
                    default: triggered = latestValue > rule.threshold;
                }
                if (triggered) {
                    triggeredRules.push({ rule, latestValue });
                }
            }
            if (triggeredRules.length === 0)
                return results;
            const recentLogs = await this.prisma.siaAlertLog.findMany({
                where: {
                    ruleId: { in: triggeredRules.map((t) => t.rule.id) },
                    createdAt: { gte: new Date(Date.now() - Math.max(...triggeredRules.map((t) => t.rule.cooldown || 3600)) * 1000) },
                },
            });
            const recentRuleIds = new Set(recentLogs.map((log) => log.ruleId));
            for (const { rule, latestValue } of triggeredRules) {
                if (recentRuleIds.has(rule.id))
                    continue;
                const log = await this.prisma.siaAlertLog.create({
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
        }
        catch (error) {
            this.logger.error(`Error checking thresholds: ${error.message}`);
            throw error;
        }
    }
    async getStats() {
        try {
            const [severityCounts, statusCounts, totalLogs, unreadLogs] = await Promise.all([
                this.prisma.siaAlertRule.groupBy({
                    by: ['severity'],
                    _count: true,
                }),
                this.prisma.siaAlertRule.groupBy({
                    by: ['status'],
                    _count: true,
                }),
                this.prisma.siaAlertLog.count(),
                this.prisma.siaAlertLog.count({ where: { read: false } }),
            ]);
            const severity = {};
            for (const s of severityCounts)
                severity[s.severity] = s._count;
            const status = {};
            for (const s of statusCounts)
                status[s.status] = s._count;
            return { severity, status, totalLogs, unreadLogs };
        }
        catch (error) {
            this.logger.error(`Error getting alert stats: ${error.message}`);
            throw error;
        }
    }
};
exports.SiaAlertsService = SiaAlertsService;
exports.SiaAlertsService = SiaAlertsService = SiaAlertsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], SiaAlertsService);
//# sourceMappingURL=alerts.service.js.map