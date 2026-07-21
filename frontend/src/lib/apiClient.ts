import Cookies from 'js-cookie';

export const fetchApi = async (url: string, options: RequestInit = {}) => {
  const token = Cookies.get('auth-token');
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {})
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Clean any accidental double slashes (e.g. https://domain.com//api -> https://domain.com/api)
  const cleanUrl = url.replace(/([^:]\/)\/+/g, "$1");

  return fetch(cleanUrl, { ...options, headers });
};
