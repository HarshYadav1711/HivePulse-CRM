const TOKEN_KEY = 'hivepulse_token';
const USER_KEY = 'hivepulse_user';

import type { UserPublic } from '@hivepulse/shared';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: (): UserPublic | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserPublic;
    } catch {
      return null;
    }
  },
  setUser: (user: UserPublic) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),

  clearSession: () => {
    storage.clearToken();
    storage.clearUser();
  },
};
