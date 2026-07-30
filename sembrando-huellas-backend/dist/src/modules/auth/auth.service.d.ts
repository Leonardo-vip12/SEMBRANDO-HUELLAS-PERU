import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './interfaces/auth.interface';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private redisService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, redisService: RedisService);
    login(dto: LoginDto): Promise<AuthResponse>;
    register(dto: RegisterDto): Promise<AuthResponse>;
    refreshToken(refreshToken: string): Promise<AuthResponse>;
    logout(userId: string): Promise<void>;
    getProfile(userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        role: {
            name: import(".prisma/client").$Enums.RoleName;
            rolePermissions: {
                permission: {
                    name: string;
                    key: string;
                };
            }[];
        };
        email: string;
        avatar: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
    } | null>;
    private hashToken;
    private compareToken;
    private generateTokens;
    private logAudit;
}
