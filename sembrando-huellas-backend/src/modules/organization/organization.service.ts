import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrganizationService {
  protected logger = new Logger(OrganizationService.name);

  constructor(private prisma: PrismaService) {}

  async find() {
    const org = await this.prisma.organization.findFirst();
    if (!org) {
      throw new NotFoundException('Configuración de organización no encontrada');
    }
    return org;
  }

  async update(data: any) {
    const org = await this.prisma.organization.findFirst();
    if (!org) {
      return this.prisma.organization.create({ data });
    }
    return this.prisma.organization.update({ where: { id: org.id }, data });
  }
}
