import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AnalyticsService } from './analytics.service';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Analytics')
@Controller('analytics')
@ApiBearerAuth('JWT-auth')
@Roles('ADMINISTRADOR')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('content-by-month')
  @ApiOperation({ summary: 'Contenido creado por mes' })
  async getContentByMonth() {
    return this.service.getContentByMonth();
  }

  @Get('donation-trend')
  @ApiOperation({ summary: 'Tendencia de donaciones' })
  async getDonationTrend() {
    return this.service.getDonationTrend();
  }
}
