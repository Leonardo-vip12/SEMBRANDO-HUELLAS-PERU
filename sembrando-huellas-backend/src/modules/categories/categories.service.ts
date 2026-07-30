import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';
import { generateSlug } from '../../common/utils/slug.util';

@Injectable()
export class CategoriesService extends BaseCrudService<any> {
  protected logger = new Logger(CategoriesService.name);
  protected modelName = 'Categoría';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.category;
  }

  async create(dto: any) {
    const slug = dto.slug || generateSlug(dto.name);
    return super.create({ ...dto, slug });
  }
}
