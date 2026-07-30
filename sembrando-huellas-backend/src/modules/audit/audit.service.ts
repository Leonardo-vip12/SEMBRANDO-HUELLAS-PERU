import { Injectable, Logger } from '@nestjs/common';
import { AuditAction, AuditSeverity } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  protected logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async log(params: {
    action: AuditAction;
    entity: string;
    entityId?: string;
    userId?: string;
    metadata?: any;
    severity?: AuditSeverity;
  }) {
    return this.prisma.auditLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        userId: params.userId,
        metadata: params.metadata || {},
        severity: params.severity || 'INFO',
      },
    });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.auditLog.count(),
    ]);
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
