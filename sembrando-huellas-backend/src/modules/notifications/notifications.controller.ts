import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth('JWT-auth')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Mis notificaciones' })
  async findByUser(@CurrentUser('id') userId: string, @Query('page') page = 1) {
    return this.service.findByUser(userId, page);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Contar no leídas' })
  async getUnreadCount(@CurrentUser('id') userId: string) {
    const count = await this.service.getUnreadCount(userId);
    return { count };
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Marcar como leída' })
  async markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(id);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Marcar todas como leídas' })
  async markAllAsRead(@CurrentUser('id') userId: string) {
    await this.service.markAllAsRead(userId);
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Eliminar notificación' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Notificación eliminada' };
  }
}
