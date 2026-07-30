import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar eventos' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query, { category: true });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener evento' })
  async findOne(@Param('id') id: string) {
    const isUuid = id.includes('-');
    const include = { category: true };
    if (isUuid) return this.service.findById(id, include);
    return this.service.findBySlug(id, include);
  }

  @Post()
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear evento' })
  async create(@Body() dto: CreateEventDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar evento' })
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar evento' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Evento eliminado' };
  }
}
