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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const i18n_service_1 = require("./i18n.service");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const client_1 = require("@prisma/client");
let I18nController = class I18nController {
    constructor(i18nService) {
        this.i18nService = i18nService;
    }
    async getLanguages(activeOnly) {
        return this.i18nService.getLanguages(activeOnly === 'true');
    }
    async createLanguage(dto) {
        return this.i18nService.createLanguage(dto);
    }
    async updateLanguage(id, dto) {
        return this.i18nService.updateLanguage(id, dto);
    }
    async deleteLanguage(id) {
        return this.i18nService.deleteLanguage(id);
    }
    async setDefault(id) {
        return this.i18nService.setDefault(id);
    }
    async getTranslations(entityType, entityId, languageId) {
        return this.i18nService.getTranslations(entityType, entityId, languageId);
    }
    async upsertTranslation(dto) {
        return this.i18nService.upsertTranslation(dto);
    }
    async getTranslationKeys(namespace, languageId, group, search, page, limit) {
        return this.i18nService.getTranslationKeys({
            namespace,
            languageId,
            group,
            search,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 20,
        });
    }
    async upsertKey(dto) {
        return this.i18nService.upsertKey(dto);
    }
    async deleteKey(id) {
        return this.i18nService.deleteKey(id);
    }
    async getKey(key, namespace, languageId) {
        return this.i18nService.getKey(key, namespace, languageId);
    }
    async getMissingKeys(languageId) {
        return this.i18nService.getMissingKeys(languageId);
    }
    async importTranslations(file, format, languageId) {
        return this.i18nService.importTranslations(file, format, languageId);
    }
    async exportTranslations(languageId, format, namespace) {
        return this.i18nService.exportTranslations(languageId, format, namespace);
    }
    async getStats() {
        return this.i18nService.getTranslationStats();
    }
    async translateAll(dto) {
        const missing = await this.i18nService.getMissingKeys(dto.targetLanguageId);
        return {
            message: `Found ${missing.length} untranslated keys. AI batch translation not yet implemented.`,
            missing: missing.length,
        };
    }
};
exports.I18nController = I18nController;
__decorate([
    (0, common_1.Get)('languages'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all languages' }),
    __param(0, (0, common_1.Query)('activeOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "getLanguages", null);
__decorate([
    (0, common_1.Post)('languages'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.ADMINISTRADOR),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new language' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "createLanguage", null);
__decorate([
    (0, common_1.Patch)('languages/:id'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.ADMINISTRADOR),
    (0, swagger_1.ApiOperation)({ summary: 'Update a language' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "updateLanguage", null);
__decorate([
    (0, common_1.Delete)('languages/:id'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.ADMINISTRADOR),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a language' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "deleteLanguage", null);
__decorate([
    (0, common_1.Post)('languages/:id/default'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.ADMINISTRADOR),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Set a language as default' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "setDefault", null);
__decorate([
    (0, common_1.Get)('translations/:entityType/:entityId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get content translations' }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId')),
    __param(2, (0, common_1.Query)('languageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "getTranslations", null);
__decorate([
    (0, common_1.Put)('translations'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.ADMINISTRADOR, client_1.RoleName.EDITOR),
    (0, swagger_1.ApiOperation)({ summary: 'Upsert a content translation' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "upsertTranslation", null);
__decorate([
    (0, common_1.Get)('keys'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get translation keys' }),
    __param(0, (0, common_1.Query)('namespace')),
    __param(1, (0, common_1.Query)('languageId')),
    __param(2, (0, common_1.Query)('group')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "getTranslationKeys", null);
__decorate([
    (0, common_1.Post)('keys'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.ADMINISTRADOR),
    (0, swagger_1.ApiOperation)({ summary: 'Upsert a translation key' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "upsertKey", null);
__decorate([
    (0, common_1.Delete)('keys/:id'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.ADMINISTRADOR),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a translation key' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "deleteKey", null);
__decorate([
    (0, common_1.Get)('keys/:key/:namespace/:languageId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single translation key' }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Param)('namespace')),
    __param(2, (0, common_1.Param)('languageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "getKey", null);
__decorate([
    (0, common_1.Get)('missing/:languageId'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.ADMINISTRADOR, client_1.RoleName.EDITOR),
    (0, swagger_1.ApiOperation)({ summary: 'Get missing translation keys for a language' }),
    __param(0, (0, common_1.Param)('languageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "getMissingKeys", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.ADMINISTRADOR),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Import translations from file' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('format')),
    __param(2, (0, common_1.Query)('languageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "importTranslations", null);
__decorate([
    (0, common_1.Get)('export/:languageId'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.ADMINISTRADOR, client_1.RoleName.EDITOR),
    (0, swagger_1.ApiOperation)({ summary: 'Export translations' }),
    __param(0, (0, common_1.Param)('languageId')),
    __param(1, (0, common_1.Query)('format')),
    __param(2, (0, common_1.Query)('namespace')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "exportTranslations", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.ADMINISTRADOR),
    (0, swagger_1.ApiOperation)({ summary: 'Get translation statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('translate-all'),
    (0, roles_decorator_1.Roles)(client_1.RoleName.ADMINISTRADOR),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Auto-translate all missing keys via AI' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], I18nController.prototype, "translateAll", null);
exports.I18nController = I18nController = __decorate([
    (0, swagger_1.ApiTags)('i18n'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('i18n'),
    __metadata("design:paramtypes", [i18n_service_1.I18nService])
], I18nController);
//# sourceMappingURL=i18n.controller.js.map