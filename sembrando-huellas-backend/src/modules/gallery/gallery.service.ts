import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';

@Injectable()
export class GalleryService extends BaseCrudService<any> {
  protected logger = new Logger(GalleryService.name);
  protected modelName = 'Galería';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.gallery;
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
