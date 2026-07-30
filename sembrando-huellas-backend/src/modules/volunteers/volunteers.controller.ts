import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { VolunteersService } from './volunteers.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Volunteers')
@Controller('volunteers')
export class VolunteersController {
  constructor(private readonly service: VolunteersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Registrarse como voluntario' })
  async create(@Body() dto: CreateVolunteerDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar voluntarios' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener voluntario' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar voluntario' })
  async update(@Param('id') id: string, @Body() dto: UpdateVolunteerDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar voluntario' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Voluntario eliminado' };
  }
}
