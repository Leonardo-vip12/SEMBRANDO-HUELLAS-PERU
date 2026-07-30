import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<import("./interfaces/auth.interface").AuthResponse>;
    register(dto: RegisterDto): Promise<import("./interfaces/auth.interface").AuthResponse>;
    refresh(dto: RefreshTokenDto): Promise<import("./interfaces/auth.interface").AuthResponse>;
    logout(userId: string): Promise<{
        message: string;
    }>;
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
}
