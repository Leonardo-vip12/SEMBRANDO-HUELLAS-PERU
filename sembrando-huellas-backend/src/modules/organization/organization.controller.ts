import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { OrganizationService } from './organization.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener información de la organización' })
  async find() {
    return this.service.find();
  }

  @Put()
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar información de la organización' })
  async update(@Body() dto: any) {
    return this.service.update(dto);
  }
}
