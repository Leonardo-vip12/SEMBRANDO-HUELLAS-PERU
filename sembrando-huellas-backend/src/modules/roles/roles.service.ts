import { Injectable, Logger } from '@nestjs/common';
import { RoleName } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';

@Injectable()
export class RolesService extends BaseCrudService<any> {
  protected logger = new Logger(RolesService.name);
  protected modelName = 'Rol';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.role;
  }

  async findByName(name: RoleName) {
    return this.prisma.role.findUnique({
      where: { name },
      include: { rolePermissions: { include: { permission: true } } },
    });
  }
}
