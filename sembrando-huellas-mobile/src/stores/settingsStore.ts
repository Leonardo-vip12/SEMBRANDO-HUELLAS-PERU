import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { setLocale, type Locale } from '@/src/i18n';

interface SettingsState {
  locale: Locale;
  darkMode: boolean;
  notificationsEnabled: boolean;
  offlineMode: boolean;
  loadSettings: () => Promise<void>;
  setLocale: (locale: Locale) => Promise<void>;
  setDarkMode: (enabled: boolean) => Promise<void>;
  setNotifications: (enabled: boolean) => Promise<void>;
  setOfflineMode: (enabled: boolean) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  locale: 'es',
  darkMode: false,
  notificationsEnabled: true,
  offlineMode: false,

  loadSettings: async () => {
    try {
      const locale = (await SecureStore.getItemAsync('settings_locale')) as Locale | null;
      const darkMode = await SecureStore.getItemAsync('settings_darkMode');
      const notifications = await SecureStore.getItemAsync('settings_notifications');
      const offlineMode = await SecureStore.getItemAsync('settings_offlineMode');
      if (locale) { setLocale(locale as Locale); }
      set({
        locale: (locale as Locale) || 'es',
        darkMode: darkMode === 'true',
        notificationsEnabled: notifications !== 'false',
        offlineMode: offlineMode === 'true',
      });
    } catch {}
  },

  setLocale: async (locale) => {
    await SecureStore.setItemAsync('settings_locale', locale);
    setLocale(locale);
    set({ locale });
  },

  setDarkMode: async (enabled) => {
    await SecureStore.setItemAsync('settings_darkMode', String(enabled));
    set({ darkMode: enabled });
  },

  setNotifications: async (enabled) => {
    await SecureStore.setItemAsync('settings_notifications', String(enabled));
    set({ notificationsEnabled: enabled });
  },

  setOfflineMode: async (enabled) => {
    await SecureStore.setItemAsync('settings_offlineMode', String(enabled));
    set({ offlineMode: enabled });
  },
}));
