import { Injectable, Logger, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseCrudService } from '../../common/base/base-crud.service';

@Injectable()
export class UsersService extends BaseCrudService<any> {
  protected logger = new Logger(UsersService.name);
  protected modelName = 'Usuario';

  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  get prismaDelegate() {
    return this.prisma.user;
  }

  async create(dto: any) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }
    const hashedPassword = await bcrypt.hash(dto.password || 'temporal123', 10);
    return super.create({
      name: dto.name,
      email: dto.email,
      passwordHash: hashedPassword,
      roleId: dto.roleId,
      isActive: dto.isActive,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
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
