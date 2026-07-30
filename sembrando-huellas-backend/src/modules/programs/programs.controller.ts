import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly service: ProgramsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar programas' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query, { projects: { select: { id: true, name: true, status: true } } });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener programa' })
  async findOne(@Param('id') id: string) {
    const isUuid = id.includes('-');
    const include = { projects: true };
    if (isUuid) return this.service.findById(id, include);
    return this.service.findBySlug(id, include);
  }

  @Post()
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear programa' })
  async create(@Body() dto: CreateProgramDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar programa' })
  async update(@Param('id') id: string, @Body() dto: UpdateProgramDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar programa' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Programa eliminado' };
  }
}
