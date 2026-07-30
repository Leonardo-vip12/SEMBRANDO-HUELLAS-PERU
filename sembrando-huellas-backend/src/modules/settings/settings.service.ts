import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  protected logger = new Logger(SettingsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.setting.findMany();
  }

  async findByGroup(group: string) {
    return this.prisma.setting.findMany({ where: { group } });
  }

  async upsert(key: string, value: string, group = 'general') {
    const existing = await this.prisma.setting.findUnique({ where: { key } });
    if (existing) {
      return this.prisma.setting.update({ where: { key }, data: { value } });
    }
    return this.prisma.setting.create({ data: { key, value, group } });
  }

  async bulkUpdate(settings: Array<{ key: string; value: string; group?: string }>) {
    return this.prisma.$transaction(
      settings.map((s) =>
        this.prisma.setting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value, group: s.group || 'general' },
        }),
      ),
    );
  }

  async remove(key: string) {
    await this.prisma.setting.delete({ where: { key } });
    return { message: 'Configuración eliminada' };
  }
}
