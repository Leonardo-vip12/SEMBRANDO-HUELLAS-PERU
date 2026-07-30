import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';
import { generateSlug } from '../../common/utils/slug.util';

@Injectable()
export class ProgramsService extends BaseCrudService<any> {
  protected logger = new Logger(ProgramsService.name);
  protected modelName = 'Programa';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.program;
  }

  async create(dto: any) {
    const slug = dto.slug || generateSlug(dto.name) + '-' + Date.now();
    return super.create({ ...dto, slug });
  }

  protected buildSearchFilter(search: string) {
    return {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    };
  }
}
