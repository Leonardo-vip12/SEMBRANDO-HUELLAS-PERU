import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AuditService } from './audit.service';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Audit')
@Controller('audit')
@ApiBearerAuth('JWT-auth')
@Roles('ADMINISTRADOR')
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Listar logs de auditoría' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.findAll(page, limit);
  }
}
