import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';

@Injectable()
export class ResourcesService extends BaseCrudService<any> {
  protected logger = new Logger(ResourcesService.name);
  protected modelName = 'Recurso';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.resource;
  }

  protected buildSearchFilter(search: string) {
    return {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    };
  }
}
