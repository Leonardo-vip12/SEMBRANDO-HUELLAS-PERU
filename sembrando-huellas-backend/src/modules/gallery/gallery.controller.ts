import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly service: GalleryService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar galerías' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query, { images: true });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener galería' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id, { images: true });
  }

  @Post()
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear galería' })
  async create(@Body() dto: CreateGalleryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar galería' })
  async update(@Param('id') id: string, @Body() dto: UpdateGalleryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar galería' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Galería eliminada' };
  }
}
