import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';

@Injectable()
export class FaqService extends BaseCrudService<any> {
  protected logger = new Logger(FaqService.name);
  protected modelName = 'FAQ';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.faq;
  }

  protected buildSearchFilter(search: string) {
    return {
      OR: [
        { question: { contains: search, mode: 'insensitive' as const } },
        { answer: { contains: search, mode: 'insensitive' as const } },
      ],
    };
  }
}
