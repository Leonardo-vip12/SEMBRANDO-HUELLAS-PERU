import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { DonationsService } from './donations.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Donations')
@Controller('donations')
export class DonationsController {
  constructor(private readonly service: DonationsService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear donación (público)' })
  async create(@Body() dto: any) {
    return this.service.create({ ...dto, status: 'PENDING' });
  }

  @Get()
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar donaciones' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get('stats')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Estadísticas de donaciones' })
  async getStats() {
    return this.service.getStats();
  }

  @Get(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener donación' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar donación' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar donación' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Donación eliminada' };
  }
}
