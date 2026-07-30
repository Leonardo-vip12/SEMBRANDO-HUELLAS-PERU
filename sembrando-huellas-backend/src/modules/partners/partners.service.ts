import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';

@Injectable()
export class PartnersService extends BaseCrudService<any> {
  protected logger = new Logger(PartnersService.name);
  protected modelName = 'Aliado';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.partner;
  }
}
