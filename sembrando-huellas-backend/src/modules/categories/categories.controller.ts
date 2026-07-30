import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar categorías' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener categoría' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear categoría' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar categoría' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar categoría' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Categoría eliminada' };
  }
}
