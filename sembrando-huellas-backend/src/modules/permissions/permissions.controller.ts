import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { PermissionsService } from './permissions.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Permissions')
@Controller('permissions')
@ApiBearerAuth('JWT-auth')
@Roles('ADMINISTRADOR')
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar permisos' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener permiso' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id, { roles: true });
  }

  @Post()
  @ApiOperation({ summary: 'Crear permiso' })
  async create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar permiso' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar permiso' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Permiso eliminado' };
  }
}
