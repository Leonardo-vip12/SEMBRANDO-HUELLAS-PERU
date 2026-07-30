import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';

@Injectable()
export class SpeciesService extends BaseCrudService<any> {
  protected logger = new Logger(SpeciesService.name);
  protected modelName = 'Especie';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.species;
  }

  protected buildSearchFilter(search: string) {
    return {
      OR: [
        { commonName: { contains: search, mode: 'insensitive' as const } },
        { scientificName: { contains: search, mode: 'insensitive' as const } },
      ],
    };
  }
}
