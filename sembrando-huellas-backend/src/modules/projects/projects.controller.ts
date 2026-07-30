import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar proyectos' })
  async findAll(@Query() query: PaginationDto) {
    const include = { program: { select: { id: true, name: true } } };
    return this.service.findAll(query, include);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener proyecto' })
  async findOne(@Param('id') id: string) {
    const isUuid = id.includes('-');
    const include = { program: true };
    if (isUuid) return this.service.findById(id, include);
    return this.service.findBySlug(id, include);
  }

  @Post()
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear proyecto' })
  async create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar proyecto' })
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar proyecto' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Proyecto eliminado' };
  }
}
