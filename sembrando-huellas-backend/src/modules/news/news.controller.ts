import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar noticias', description: 'Obtiene todas las noticias publicadas' })
  async findAll(@Query() query: PaginationDto) {
    const include = { category: true, user: { select: { id: true, name: true, email: true } } };
    return this.newsService.findAll(query, include);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener noticia', description: 'Obtiene una noticia por ID o slug' })
  async findOne(@Param('id') id: string) {
    const isUuid = id.includes('-');
    const include = { category: true, user: { select: { id: true, name: true, email: true } } };
    if (isUuid) {
      return this.newsService.findById(id, include);
    }
    return this.newsService.findBySlug(id, include);
  }

  @Post()
  @Roles('ADMINISTRADOR', 'EDITOR', 'REDACCTOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear noticia' })
  async create(@Body() dto: CreateNewsDto, @CurrentUser('id') userId: string) {
    return this.newsService.create(dto, userId);
  }

  @Put(':id')
  @Roles('ADMINISTRADOR', 'EDITOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar noticia' })
  async update(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar noticia' })
  async remove(@Param('id') id: string) {
    await this.newsService.remove(id);
    return { message: 'Noticia eliminada exitosamente' };
  }
}
