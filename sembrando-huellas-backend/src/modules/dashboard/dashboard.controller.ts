import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
@ApiBearerAuth('JWT-auth')
@Roles('ADMINISTRADOR')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas del dashboard' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Actividad reciente' })
  async getRecentActivity() {
    return this.service.getRecentActivity();
  }
}
