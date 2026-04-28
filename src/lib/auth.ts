import api from './api';

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await api.post('/auth/refresh/', { refresh });
    const { access } = res.data;
    localStorage.setItem('access_token', access);
    return access;
  } catch {
    clearTokens();
    return null;
  }
};

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login/', { email, password });
  setTokens(res.data.access, res.data.refresh);
  return res.data;
};

export const register = async (data: any) => {
  const res = await api.post('/auth/register/', data);
  return res.data;
};

export const logout = async () => {
  const refresh = getRefreshToken();
  if (refresh) {
    try {
      await api.post('/auth/logout/', { refresh });
    } catch {}
  }
  clearTokens();
};