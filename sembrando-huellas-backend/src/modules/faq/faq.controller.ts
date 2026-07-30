import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly service: FaqService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar preguntas frecuentes' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener FAQ' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear FAQ' })
  async create(@Body() dto: CreateFaqDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar FAQ' })
  async update(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar FAQ' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'FAQ eliminada' };
  }
}
