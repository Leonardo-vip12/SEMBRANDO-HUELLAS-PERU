import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Listar usuarios' })
  async findAll(@Query() query: PaginationDto) {
    const include = { role: true };
    return this.service.findAll(query, include);
  }

  @Get(':id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Obtener usuario' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id, { role: { include: { permissions: true } } });
  }

  @Post()
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Crear usuario' })
  async create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Actualizar usuario' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Eliminar usuario' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Usuario eliminado' };
  }
}
