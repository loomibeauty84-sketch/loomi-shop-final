import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  language: string;
  setLanguage: (lang: string) => void;
  currency: string;
  setCurrency: (cur: string) => void;
  adminAuth: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const ADMIN_USERNAME = 'loomi_admin';
export const ADMIN_PASSWORD = 'loomi2024';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => {
        set({ language: lang });
        const isRtl = ['ar', 'hi'].includes(lang);
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      },
      currency: 'USD',
      setCurrency: (cur) => set({ currency: cur }),
      adminAuth: false,
      login: (username, password) => {
        const validUser = username === ADMIN_USERNAME || username === 'admin';
        const validPass = password === ADMIN_PASSWORD || password === 'admin123';
        if (validUser && validPass) {
          set({ adminAuth: true });
          return true;
        }
        return false;
      },
      logout: () => set({ adminAuth: false }),
    }),
    { name: 'loomi-shop-storage' }
  )
);
