import Cookies from 'js-cookie';

export const fetchApi = async (url: string, options: RequestInit = {}) => {
  const token = Cookies.get('auth-token');
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {})
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, { ...options, headers });
};
