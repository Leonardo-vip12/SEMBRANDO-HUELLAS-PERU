import { useEffect } from 'react';
import { useAuthStore } from '@/src/stores/authStore';
import { authService } from '@/src/services/api';

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    store.restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    const { token, refreshToken, user } = res;
    await store.login(token, refreshToken, user);
    return user;
  };

  const register = async (data: any) => {
    const res = await authService.register(data);
    const { token, refreshToken, user } = res;
    await store.login(token, refreshToken, user);
    return user;
  };

  const logout = async () => {
    await store.logout();
  };

  const refreshSession = async () => {
    if (!store.refreshToken) return;
    try {
      const res = await authService.refresh(store.refreshToken);
      await store.setTokens(res.token, res.refreshToken);
    } catch {
      await store.logout();
    }
  };

  return { ...store, login, register, logout, refreshSession };
}
