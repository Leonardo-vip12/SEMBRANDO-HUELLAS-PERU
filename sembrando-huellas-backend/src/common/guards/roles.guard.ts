import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RoleName } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user) return false;

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(user.role?.name);
      if (hasRole) return true;
    }

    if (requiredPermissions && requiredPermissions.length > 0 && user.permissions) {
      const hasPermission = requiredPermissions.some((perm) => user.permissions.includes(perm));
      if (hasPermission) return true;
    }

    if (requiredRoles && requiredRoles.length > 0) {
      throw new ForbiddenException('No tienes los permisos necesarios para acceder a este recurso.');
    }

    return false;
  }
}
