import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';

@Injectable()
export class VolunteersService extends BaseCrudService<any> {
  protected logger = new Logger(VolunteersService.name);
  protected modelName = 'Voluntario';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.volunteer;
  }

  protected buildSearchFilter(search: string) {
    return {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ],
    };
  }
}
