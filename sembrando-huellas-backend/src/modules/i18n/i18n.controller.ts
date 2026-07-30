import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { I18nService } from './i18n.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { RoleName, TranslationStatus } from '@prisma/client';

@ApiTags('i18n')
@ApiBearerAuth('JWT-auth')
@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Get('languages')
  @Public()
  @ApiOperation({ summary: 'List all languages' })
  async getLanguages(@Query('activeOnly') activeOnly?: string) {
    return this.i18nService.getLanguages(activeOnly === 'true');
  }

  @Post('languages')
  @Roles(RoleName.ADMINISTRADOR)
  @ApiOperation({ summary: 'Create a new language' })
  async createLanguage(
    @Body() dto: { code: string; name: string; nativeName?: string; flag?: string; isDefault?: boolean },
  ) {
    return this.i18nService.createLanguage(dto);
  }

  @Patch('languages/:id')
  @Roles(RoleName.ADMINISTRADOR)
  @ApiOperation({ summary: 'Update a language' })
  async updateLanguage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: { name?: string; nativeName?: string; isActive?: boolean; flag?: string; isDefault?: boolean },
  ) {
    return this.i18nService.updateLanguage(id, dto);
  }

  @Delete('languages/:id')
  @Roles(RoleName.ADMINISTRADOR)
  @ApiOperation({ summary: 'Delete a language' })
  async deleteLanguage(@Param('id', ParseUUIDPipe) id: string) {
    return this.i18nService.deleteLanguage(id);
  }

  @Post('languages/:id/default')
  @Roles(RoleName.ADMINISTRADOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set a language as default' })
  async setDefault(@Param('id', ParseUUIDPipe) id: string) {
    return this.i18nService.setDefault(id);
  }

  @Get('translations/:entityType/:entityId')
  @Public()
  @ApiOperation({ summary: 'Get content translations' })
  async getTranslations(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Query('languageId') languageId?: string,
  ) {
    return this.i18nService.getTranslations(entityType, entityId, languageId);
  }

  @Put('translations')
  @Roles(RoleName.ADMINISTRADOR, RoleName.EDITOR)
  @ApiOperation({ summary: 'Upsert a content translation' })
  async upsertTranslation(
    @Body()
    dto: {
      entityType: string;
      entityId: string;
      field: string;
      value: string;
      languageId: string;
      status?: TranslationStatus;
    },
  ) {
    return this.i18nService.upsertTranslation(dto);
  }

  @Get('keys')
  @Public()
  @ApiOperation({ summary: 'Get translation keys' })
  async getTranslationKeys(
    @Query('namespace') namespace?: string,
    @Query('languageId') languageId?: string,
    @Query('group') group?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.i18nService.getTranslationKeys({
      namespace,
      languageId,
      group,
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Post('keys')
  @Roles(RoleName.ADMINISTRADOR)
  @ApiOperation({ summary: 'Upsert a translation key' })
  async upsertKey(
    @Body()
    dto: {
      key: string;
      namespace?: string;
      value?: string;
      languageId: string;
      context?: string;
      maxLength?: number;
      group?: string;
      tags?: string[];
      status?: TranslationStatus;
    },
  ) {
    return this.i18nService.upsertKey(dto);
  }

  @Delete('keys/:id')
  @Roles(RoleName.ADMINISTRADOR)
  @ApiOperation({ summary: 'Delete a translation key' })
  async deleteKey(@Param('id', ParseUUIDPipe) id: string) {
    return this.i18nService.deleteKey(id);
  }

  @Get('keys/:key/:namespace/:languageId')
  @Public()
  @ApiOperation({ summary: 'Get a single translation key' })
  async getKey(
    @Param('key') key: string,
    @Param('namespace') namespace: string,
    @Param('languageId') languageId: string,
  ) {
    return this.i18nService.getKey(key, namespace, languageId);
  }

  @Get('missing/:languageId')
  @Roles(RoleName.ADMINISTRADOR, RoleName.EDITOR)
  @ApiOperation({ summary: 'Get missing translation keys for a language' })
  async getMissingKeys(@Param('languageId') languageId: string) {
    return this.i18nService.getMissingKeys(languageId);
  }

  @Post('import')
  @Roles(RoleName.ADMINISTRADOR)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import translations from file' })
  async importTranslations(
    @UploadedFile() file: Express.Multer.File,
    @Query('format') format: string,
    @Query('languageId') languageId?: string,
  ) {
    return this.i18nService.importTranslations(file, format, languageId);
  }

  @Get('export/:languageId')
  @Roles(RoleName.ADMINISTRADOR, RoleName.EDITOR)
  @ApiOperation({ summary: 'Export translations' })
  async exportTranslations(
    @Param('languageId') languageId: string,
    @Query('format') format?: string,
    @Query('namespace') namespace?: string,
  ) {
    return this.i18nService.exportTranslations(languageId, format, namespace);
  }

  @Get('stats')
  @Roles(RoleName.ADMINISTRADOR)
  @ApiOperation({ summary: 'Get translation statistics' })
  async getStats() {
    return this.i18nService.getTranslationStats();
  }

  @Post('translate-all')
  @Roles(RoleName.ADMINISTRADOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Auto-translate all missing keys via AI' })
  async translateAll(@Body() dto: { sourceLanguageId: string; targetLanguageId: string; namespace?: string }) {
    const missing = await this.i18nService.getMissingKeys(dto.targetLanguageId);
    return {
      message: `Found ${missing.length} untranslated keys. AI batch translation not yet implemented.`,
      missing: missing.length,
    };
  }
}
