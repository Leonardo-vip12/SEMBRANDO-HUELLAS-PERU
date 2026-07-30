import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly service: ResourcesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar recursos' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query, { category: true });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener recurso' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id, { category: true });
  }

  @Post()
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear recurso' })
  async create(@Body() dto: CreateResourceDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar recurso' })
  async update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar recurso' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Recurso eliminado' };
  }
}
