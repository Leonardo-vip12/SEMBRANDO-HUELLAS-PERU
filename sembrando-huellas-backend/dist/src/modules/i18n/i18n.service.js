"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var I18nService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let I18nService = I18nService_1 = class I18nService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(I18nService_1.name);
    }
    async getLanguages(activeOnly) {
        const where = activeOnly ? { isActive: true } : {};
        return this.prisma.language.findMany({
            where,
            orderBy: { isDefault: 'desc' },
        });
    }
    async createLanguage(dto) {
        const existing = await this.prisma.language.findUnique({ where: { code: dto.code } });
        if (existing)
            throw new common_1.BadRequestException(`Language with code '${dto.code}' already exists`);
        if (dto.isDefault) {
            await this.prisma.language.updateMany({
                where: { isDefault: true },
                data: { isDefault: false },
            });
        }
        return this.prisma.language.create({ data: dto });
    }
    async updateLanguage(id, dto) {
        const lang = await this.prisma.language.findUnique({ where: { id } });
        if (!lang)
            throw new common_1.NotFoundException(`Language with id '${id}' not found`);
        if (dto.isDefault) {
            await this.prisma.language.updateMany({
                where: { isDefault: true },
                data: { isDefault: false },
            });
        }
        return this.prisma.language.update({ where: { id }, data: dto });
    }
    async deleteLanguage(id) {
        const lang = await this.prisma.language.findUnique({ where: { id } });
        if (!lang)
            throw new common_1.NotFoundException(`Language with id '${id}' not found`);
        return this.prisma.language.delete({ where: { id } });
    }
    async setDefault(id) {
        const lang = await this.prisma.language.findUnique({ where: { id } });
        if (!lang)
            throw new common_1.NotFoundException(`Language with id '${id}' not found`);
        await this.prisma.language.updateMany({
            where: { isDefault: true },
            data: { isDefault: false },
        });
        return this.prisma.language.update({ where: { id }, data: { isDefault: true } });
    }
    async getTranslations(entityType, entityId, languageId) {
        const where = { entityType, entityId };
        if (languageId)
            where.languageId = languageId;
        return this.prisma.contentTranslation.findMany({
            where,
            include: { language: true },
        });
    }
    async upsertTranslation(dto) {
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
    async getTranslationKeys(params) {
        const { namespace, languageId, group, search, page = 1, limit = 20 } = params;
        const where = {};
        if (namespace)
            where.namespace = namespace;
        if (languageId)
            where.languageId = languageId;
        if (group)
            where.group = group;
        if (search)
            where.key = { contains: search, mode: 'insensitive' };
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
    async upsertKey(dto) {
        if (dto.value !== undefined && dto.maxLength && dto.value.length > dto.maxLength) {
            throw new common_1.BadRequestException(`Value exceeds maxLength of ${dto.maxLength}`);
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
    async deleteKey(id) {
        const key = await this.prisma.translationKey.findUnique({ where: { id } });
        if (!key)
            throw new common_1.NotFoundException(`Translation key with id '${id}' not found`);
        return this.prisma.translationKey.delete({ where: { id } });
    }
    async getKey(key, namespace, languageId) {
        const entry = await this.prisma.translationKey.findUnique({
            where: { key_namespace_languageId: { key, namespace, languageId } },
        });
        if (!entry)
            throw new common_1.NotFoundException(`Translation key '${key}' not found in namespace '${namespace}' for language '${languageId}'`);
        return entry;
    }
    async getMissingKeys(languageId) {
        const defaultLang = await this.prisma.language.findFirst({ where: { isDefault: true } });
        if (!defaultLang)
            throw new common_1.NotFoundException('No default language configured');
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
    async importTranslations(file, format, languageId) {
        let parsed;
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
                        const entry = { key: vals[0], value: vals[1] };
                        if (headers.includes('namespace'))
                            entry.namespace = vals[headers.indexOf('namespace')];
                        if (headers.includes('group'))
                            entry.group = vals[headers.indexOf('group')];
                        return entry;
                    });
                    break;
                }
                default:
                    throw new common_1.BadRequestException(`Unsupported import format: ${format}`);
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to parse import file: ${error.message}`);
        }
        let langs;
        if (languageId) {
            langs = [languageId];
        }
        else {
            const languages = await this.prisma.language.findMany({ where: { isActive: true } });
            langs = languages.map((l) => l.id);
        }
        let successCount = 0;
        const errors = [];
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
                }
                catch (error) {
                    errors.push({ key: item.key, error: error.message });
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
    async exportTranslations(languageId, format = 'json', namespace) {
        const lang = await this.prisma.language.findUnique({ where: { id: languageId } });
        if (!lang)
            throw new common_1.NotFoundException(`Language with id '${languageId}' not found`);
        const where = { languageId };
        if (namespace)
            where.namespace = namespace;
        const keys = await this.prisma.translationKey.findMany({ where });
        const result = {};
        for (const k of keys) {
            if (namespace) {
                result[k.key] = k.value || '';
            }
            else {
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
                if (namespace)
                    return `${k.key},"${(k.value || '').replace(/"/g, '""')}"`;
                return `${k.namespace},${k.key},"${(k.value || '').replace(/"/g, '""')}"`;
            });
            const csv = [header, ...rows].join('\n');
            return { data: csv, contentType: 'text/csv', filename: `translations_${lang.code}.csv` };
        }
        throw new common_1.BadRequestException(`Unsupported export format: ${format}`);
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
};
exports.I18nService = I18nService;
exports.I18nService = I18nService = I18nService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], I18nService);
//# sourceMappingURL=i18n.service.js.map