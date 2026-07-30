import { ApiService } from './api';
import type { APIResponse } from '@/types';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
}

export class AuthService {
  static login(payload: LoginPayload): Promise<APIResponse<AuthTokens>> {
    return ApiService.post<AuthTokens>('/auth/login', payload);
  }

  static register(payload: RegisterPayload): Promise<APIResponse<AuthUser>> {
    return ApiService.post<AuthUser>('/auth/register', payload);
  }

  static logout(): Promise<APIResponse<null>> {
    return ApiService.post<null>('/auth/logout');
  }

  static getCurrentUser(): Promise<APIResponse<AuthUser>> {
    return ApiService.get<AuthUser>('/auth/me');
  }

  static refreshToken(refreshToken: string): Promise<APIResponse<AuthTokens>> {
    return ApiService.post<AuthTokens>('/auth/refresh', { refreshToken });
  }

  static forgotPassword(payload: ForgotPasswordPayload): Promise<APIResponse<null>> {
    return ApiService.post<null>('/auth/forgot-password', payload);
  }

  static resetPassword(payload: ResetPasswordPayload): Promise<APIResponse<null>> {
    return ApiService.post<null>('/auth/reset-password', payload);
  }
}
