import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';

@Injectable()
export class PermissionsService extends BaseCrudService<any> {
  protected logger = new Logger(PermissionsService.name);
  protected modelName = 'Permiso';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.permission;
  }
}
