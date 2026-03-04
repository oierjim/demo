import api from '../api';

export interface User {
  name: string;
  surname1: string;
  roles: string[];
}

export interface SessionInfo {
  authenticated: boolean;
  name?: string;
  surname1?: string;
  roles?: string[];
  locale?: string;
}

export const AuthService = {
  getSessionInfo: async (): Promise<SessionInfo> => {
    const response = await api.get<SessionInfo>('/sessionInfo');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
    window.location.href = '/';
  }
};
