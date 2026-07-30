import { Controller, Get, Post, Delete, Param, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadsService } from './uploads.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Uploads')
@Controller('uploads')
@ApiBearerAuth('JWT-auth')
@Roles('ADMINISTRADOR', 'EDITOR')
export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Subir archivo' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @CurrentUser('id') userId: string) {
    return this.service.upload(file);
  }

  @Get()
  @ApiOperation({ summary: 'Listar archivos' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.findAll(page, limit);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar archivo' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
