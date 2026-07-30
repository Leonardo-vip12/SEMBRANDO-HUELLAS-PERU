import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { SpeciesService } from './species.service';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Species')
@Controller('species')
export class SpeciesController {
  constructor(private readonly service: SpeciesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar especies' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener especie' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear especie' })
  async create(@Body() dto: CreateSpeciesDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar especie' })
  async update(@Param('id') id: string, @Body() dto: UpdateSpeciesDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar especie' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Especie eliminada' };
  }
}
