import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { SettingsService } from './settings.service';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Settings')
@Controller('settings')
@ApiBearerAuth('JWT-auth')
@Roles('ADMINISTRADOR')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar configuraciones' })
  async findAll(@Query('group') group?: string) {
    if (group) {
      return this.service.findByGroup(group);
    }
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Actualizar configuraciones' })
  async update(@Body() body: any) {
    if (Array.isArray(body)) {
      return this.service.bulkUpdate(body);
    }
    return this.service.upsert(body.key, body.value, body.group);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Eliminar configuración' })
  async remove(@Param('key') key: string) {
    return this.service.remove(key);
  }
}
