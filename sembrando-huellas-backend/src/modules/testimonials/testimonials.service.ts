import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';

@Injectable()
export class TestimonialsService extends BaseCrudService<any> {
  protected logger = new Logger(TestimonialsService.name);
  protected modelName = 'Testimonio';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.testimonial;
  }

  protected buildSearchFilter(search: string) {
    return {
      OR: [
        { author: { contains: search, mode: 'insensitive' as const } },
        { content: { contains: search, mode: 'insensitive' as const } },
      ],
    };
  }
}
