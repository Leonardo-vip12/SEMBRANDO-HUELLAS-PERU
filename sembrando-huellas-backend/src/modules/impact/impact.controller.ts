import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ImpactService } from './impact.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Impact')
@Controller('impact')
export class ImpactController {
  constructor(private readonly service: ImpactService) {}

  @Public()
  @Get('summary')
  @ApiOperation({ summary: 'Obtener resumen de impacto' })
  async getSummary() {
    return this.service.getSummary();
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar métricas de impacto' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener métrica' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear métrica' })
  async create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar métrica' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar métrica' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Métrica eliminada' };
  }
}
