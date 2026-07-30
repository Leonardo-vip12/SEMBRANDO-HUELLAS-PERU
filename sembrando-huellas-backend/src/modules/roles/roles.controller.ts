import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Roles')
@Controller('roles')
@ApiBearerAuth('JWT-auth')
@Roles('ADMINISTRADOR')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar roles' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query, { permissions: true });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener rol' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id, { permissions: true, users: { select: { id: true, name: true, email: true } } });
  }

  @Post()
  @ApiOperation({ summary: 'Crear rol' })
  async create(@Body() dto: CreateRoleDto) {
    const { permissionIds, ...roleData } = dto;
    const data: any = { ...roleData };
    if (permissionIds?.length) {
      data.permissions = { connect: permissionIds.map((id) => ({ id })) };
    }
    return this.service.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar rol' })
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    const { permissionIds, ...roleData } = dto;
    const data: any = { ...roleData };
    if (permissionIds) {
      data.permissions = { set: permissionIds.map((id) => ({ id })) };
    }
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar rol' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Rol eliminado' };
  }
}
