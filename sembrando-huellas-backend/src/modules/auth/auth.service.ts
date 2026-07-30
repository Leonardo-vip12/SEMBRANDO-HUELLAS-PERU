import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Cuenta desactivada. Contacta al administrador.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role.name);

    const hashedRefreshToken = await this.hashToken(tokens.refreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), refreshToken: hashedRefreshToken },
    });

    await this.logAudit(user.id, 'LOGIN', 'User', user.id, { email: user.email });

    this.logger.log(`User ${user.email} logged in successfully`);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
      tokens,
    };
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const defaultRole = await this.prisma.role.findUnique({
      where: { name: (dto.roleId as any) || 'REDACCTOR' },
    });

    if (!defaultRole) {
      throw new UnauthorizedException('Rol no encontrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        roleId: defaultRole.id,
      },
      include: { role: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role.name);

    const hashedRefreshToken = await this.hashToken(tokens.refreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    await this.logAudit(user.id, 'CREATE', 'User', user.id, { email: user.email });

    this.logger.log(`User ${user.email} registered successfully`);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { role: true },
      });

      if (!user || !user.refreshToken || !(await this.compareToken(refreshToken, user.refreshToken))) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role.name);

      const hashedRefreshToken = await this.hashToken(tokens.refreshToken);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken },
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.name,
        },
        tokens,
      };
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    await this.logAudit(userId, 'LOGOUT', 'User', userId, {});
    this.logger.log(`User ${userId} logged out`);
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        role: {
          select: {
            name: true,
            rolePermissions: {
              select: {
                permission: { select: { key: true, name: true } },
              },
            },
          },
        },
      },
    });
  }

  private async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  private async compareToken(token: string, hash: string): Promise<boolean> {
    return bcrypt.compare(token, hash);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiration'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async logAudit(userId: string, action: string, entity: string, entityId: string, metadata: any) {
    try {
      await this.prisma.auditLog.create({
        data: {
          action: action as any,
          entity,
          entityId,
          userId,
          metadata,
          severity: 'INFO',
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${(error as Error).message}`);
    }
  }
}
