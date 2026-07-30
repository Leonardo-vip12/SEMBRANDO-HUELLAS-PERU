"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../prisma/prisma.service");
const redis_service_1 = require("../../redis/redis.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, configService, redisService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.redisService = redisService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: { role: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Cuenta desactivada. Contacta al administrador.');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
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
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.ConflictException('El correo electrónico ya está registrado');
        }
        const defaultRole = await this.prisma.role.findUnique({
            where: { name: dto.roleId || 'REDACCTOR' },
        });
        if (!defaultRole) {
            throw new common_1.UnauthorizedException('Rol no encontrado');
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
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('jwt.refreshSecret'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                include: { role: true },
            });
            if (!user || !user.refreshToken || !(await this.compareToken(refreshToken, user.refreshToken))) {
                throw new common_1.UnauthorizedException('Refresh token inválido');
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
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token inválido o expirado');
        }
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        await this.logAudit(userId, 'LOGOUT', 'User', userId, {});
        this.logger.log(`User ${userId} logged out`);
    }
    async getProfile(userId) {
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
    async hashToken(token) {
        return bcrypt.hash(token, 10);
    }
    async compareToken(token, hash) {
        return bcrypt.compare(token, hash);
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('jwt.refreshSecret'),
                expiresIn: this.configService.get('jwt.refreshExpiration'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async logAudit(userId, action, entity, entityId, metadata) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    action: action,
                    entity,
                    entityId,
                    userId,
                    metadata,
                    severity: 'INFO',
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to create audit log: ${error.message}`);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map