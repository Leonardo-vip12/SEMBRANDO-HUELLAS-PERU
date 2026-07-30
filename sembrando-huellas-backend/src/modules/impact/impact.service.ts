import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';

@Injectable()
export class ImpactService extends BaseCrudService<any> {
  protected logger = new Logger(ImpactService.name);
  protected modelName = 'Métrica de Impacto';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.impactMetric;
  }

  async getSummary() {
    const metrics = await this.prisma.impactMetric.findMany();
    const summary: Record<string, string> = {};
    metrics.forEach((m) => {
      summary[m.label] = m.value;
    });
    return summary;
  }
}
