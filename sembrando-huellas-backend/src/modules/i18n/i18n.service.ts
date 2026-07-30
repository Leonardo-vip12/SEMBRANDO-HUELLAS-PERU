import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TranslationStatus } from '@prisma/client';

@Injectable()
export class I18nService {
  private readonly logger = new Logger(I18nService.name);

  constructor(private prisma: PrismaService) {}

  async getLanguages(activeOnly?: boolean) {
    const where = activeOnly ? { isActive: true } : {};
    return this.prisma.language.findMany({
      where,
      orderBy: { isDefault: 'desc' },
    });
  }

  async createLanguage(dto: { code: string; name: string; nativeName?: string; flag?: string; isDefault?: boolean }) {
    const existing = await this.prisma.language.findUnique({ where: { code: dto.code } });
    if (existing) throw new BadRequestException(`Language with code '${dto.code}' already exists`);

    if (dto.isDefault) {
      await this.prisma.language.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.language.create({ data: dto });
  }

  async updateLanguage(
    id: string,
    dto: { name?: string; nativeName?: string; isActive?: boolean; flag?: string; isDefault?: boolean },
  ) {
    const lang = await this.prisma.language.findUnique({ where: { id } });
    if (!lang) throw new NotFoundException(`Language with id '${id}' not found`);

    if (dto.isDefault) {
      await this.prisma.language.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.language.update({ where: { id }, data: dto });
  }

  async deleteLanguage(id: string) {
    const lang = await this.prisma.language.findUnique({ where: { id } });
    if (!lang) throw new NotFoundException(`Language with id '${id}' not found`);

    return this.prisma.language.delete({ where: { id } });
  }

  async setDefault(id: string) {
    const lang = await this.prisma.language.findUnique({ where: { id } });
    if (!lang) throw new NotFoundException(`Language with id '${id}' not found`);

    await this.prisma.language.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });

    return this.prisma.language.update({ where: { id }, data: { isDefault: true } });
  }

  async getTranslations(entityType: string, entityId: string, languageId?: string) {
    const where: any = { entityType, entityId };
    if (languageId) where.languageId = languageId;
    return this.prisma.contentTranslation.findMany({
      where,
      include: { language: true },
    });
  }

  async upsertTranslation(dto: {
    entityType: string;
    entityId: string;
    field: string;
    value: string;
    languageId: string;
    status?: TranslationStatus;
    translatorId?: string;
  }) {
    const existing = await this.prisma.contentTranslation.findUnique({
      where: {
        entityType_entityId_field_languageId: {
          entityType: dto.entityType,
          entityId: dto.entityId,
          field: dto.field,
          languageId: dto.languageId,
        },
      },
    });

    if (existing) {
      return this.prisma.contentTranslation.update({
        where: { id: existing.id },
        data: {
          value: dto.value,
          status: dto.status || existing.status,
          translatorId: dto.translatorId || existing.translatorId,
          version: existing.version + 1,
        },
      });
    }

    return this.prisma.contentTranslation.create({
      data: {
        entityType: dto.entityType,
        entityId: dto.entityId,
        field: dto.field,
        value: dto.value,
        languageId: dto.languageId,
        status: dto.status || 'DRAFT',
        translatorId: dto.translatorId,
      },
    });
  }

  async getTranslationKeys(params: {
    namespace?: string;
    languageId?: string;
    group?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { namespace, languageId, group, search, page = 1, limit = 20 } = params;
    const where: any = {};

    if (namespace) where.namespace = namespace;
    if (languageId) where.languageId = languageId;
    if (group) where.group = group;
    if (search) where.key = { contains: search, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.translationKey.findMany({
        where,
        include: { language: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { key: 'asc' },
      }),
      this.prisma.translationKey.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async upsertKey(dto: {
    key: string;
    namespace?: string;
    value?: string;
    languageId: string;
    context?: string;
    maxLength?: number;
    group?: string;
    tags?: string[];
    status?: TranslationStatus;
  }) {
    if (dto.value !== undefined && dto.maxLength && dto.value.length > dto.maxLength) {
      throw new BadRequestException(`Value exceeds maxLength of ${dto.maxLength}`);
    }

    const existing = await this.prisma.translationKey.findUnique({
      where: {
        key_namespace_languageId: {
          key: dto.key,
          namespace: dto.namespace || 'translation',
          languageId: dto.languageId,
        },
      },
    });

    if (existing) {
      return this.prisma.translationKey.update({
        where: { id: existing.id },
        data: {
          value: dto.value ?? existing.value,
          context: dto.context ?? existing.context,
          maxLength: dto.maxLength ?? existing.maxLength,
          group: dto.group ?? existing.group,
          tags: dto.tags ?? existing.tags,
          status: dto.status ?? existing.status,
        },
      });
    }

    return this.prisma.translationKey.create({
      data: {
        key: dto.key,
        namespace: dto.namespace || 'translation',
        value: dto.value,
        languageId: dto.languageId,
        context: dto.context,
        maxLength: dto.maxLength,
        group: dto.group,
        tags: dto.tags || [],
        status: dto.status || 'DRAFT',
      },
    });
  }

  async deleteKey(id: string) {
    const key = await this.prisma.translationKey.findUnique({ where: { id } });
    if (!key) throw new NotFoundException(`Translation key with id '${id}' not found`);
    return this.prisma.translationKey.delete({ where: { id } });
  }

  async getKey(key: string, namespace: string, languageId: string) {
    const entry = await this.prisma.translationKey.findUnique({
      where: { key_namespace_languageId: { key, namespace, languageId } },
    });
    if (!entry)
      throw new NotFoundException(
        `Translation key '${key}' not found in namespace '${namespace}' for language '${languageId}'`,
      );
    return entry;
  }

  async getMissingKeys(languageId: string) {
    const defaultLang = await this.prisma.language.findFirst({ where: { isDefault: true } });
    if (!defaultLang) throw new NotFoundException('No default language configured');

    const defaultKeys = await this.prisma.translationKey.findMany({
      where: { languageId: defaultLang.id },
    });

    const targetKeys = await this.prisma.translationKey.findMany({
      where: { languageId },
      select: { key: true, namespace: true },
    });

    const targetMap = new Set(targetKeys.map((k) => `${k.namespace}:${k.key}`));

    return defaultKeys.filter((k) => !targetMap.has(`${k.namespace}:${k.key}`));
  }

  async importTranslations(file: Express.Multer.File, format: string, languageId?: string) {
    let parsed: Array<{ key: string; namespace?: string; value: string; group?: string }>;
    const content = file.buffer.toString('utf-8');

    try {
      switch (format) {
        case 'json': {
          const json = JSON.parse(content);
          parsed = Object.entries(json).map(([key, value]) => ({
            key,
            value: String(value),
          }));
          break;
        }
        case 'csv': {
          const lines = content.split('\n').filter(Boolean);
          const headers = lines[0].split(',').map((h) => h.trim());
          parsed = lines.slice(1).map((line) => {
            const vals = line.split(',').map((v) => v.trim());
            const entry: any = { key: vals[0], value: vals[1] };
            if (headers.includes('namespace')) entry.namespace = vals[headers.indexOf('namespace')];
            if (headers.includes('group')) entry.group = vals[headers.indexOf('group')];
            return entry;
          });
          break;
        }
        default:
          throw new BadRequestException(`Unsupported import format: ${format}`);
      }
    } catch (error) {
      throw new BadRequestException(`Failed to parse import file: ${(error as Error).message}`);
    }

    let langs: string[];
    if (languageId) {
      langs = [languageId];
    } else {
      const languages = await this.prisma.language.findMany({ where: { isActive: true } });
      langs = languages.map((l) => l.id);
    }

    let successCount = 0;
    const errors: Array<{ key: string; error: string }> = [];

    for (const langId of langs) {
      for (const item of parsed) {
        try {
          await this.upsertKey({
            key: item.key,
            namespace: item.namespace,
            value: item.value,
            languageId: langId,
            group: item.group,
          });
          successCount++;
        } catch (error) {
          errors.push({ key: item.key, error: (error as Error).message });
        }
      }
    }

    await this.prisma.translationImport.create({
      data: {
        format,
        filename: file.originalname,
        languageId,
        count: successCount,
        errors: errors.length > 0 ? errors : undefined,
      },
    });

    return { imported: successCount, errors: errors.length, details: errors };
  }

  async exportTranslations(languageId: string, format: string = 'json', namespace?: string) {
    const lang = await this.prisma.language.findUnique({ where: { id: languageId } });
    if (!lang) throw new NotFoundException(`Language with id '${languageId}' not found`);

    const where: any = { languageId };
    if (namespace) where.namespace = namespace;

    const keys = await this.prisma.translationKey.findMany({ where });

    const result: Record<string, string> = {};
    for (const k of keys) {
      if (namespace) {
        result[k.key] = k.value || '';
      } else {
        result[`${k.namespace}.${k.key}`] = k.value || '';
      }
    }

    if (format === 'json') {
      return {
        data: JSON.stringify(result, null, 2),
        contentType: 'application/json',
        filename: `translations_${lang.code}.json`,
      };
    }

    if (format === 'csv') {
      const header = namespace ? 'key,value' : 'namespace,key,value';
      const rows = keys.map((k) => {
        if (namespace) return `${k.key},"${(k.value || '').replace(/"/g, '""')}"`;
        return `${k.namespace},${k.key},"${(k.value || '').replace(/"/g, '""')}"`;
      });
      const csv = [header, ...rows].join('\n');
      return { data: csv, contentType: 'text/csv', filename: `translations_${lang.code}.csv` };
    }

    throw new BadRequestException(`Unsupported export format: ${format}`);
  }

  async getTranslationStats() {
    const languages = await this.prisma.language.findMany({
      include: {
        _count: { select: { translationKeys: true } },
      },
    });

    const statusCounts = await this.prisma.translationKey.groupBy({
      by: ['status'],
      _count: true,
    });

    const totalKeys = await this.prisma.translationKey.count();
    const totalTranslations = await this.prisma.contentTranslation.count();

    return {
      totalKeys,
      totalContentTranslations: totalTranslations,
      languages: languages.map((l) => ({
        code: l.code,
        name: l.name,
        keyCount: l._count.translationKeys,
        isDefault: l.isDefault,
        isActive: l.isActive,
      })),
      byStatus: statusCounts.map((s) => ({ status: s.status, count: s._count })),
    };
  }
}
