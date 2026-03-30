import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const isAdminPath = window.location.pathname.startsWith('/admin');
      const loginPath = isAdminPath ? '/admin/login' : '/login';
      if (!window.location.pathname.includes('/login')) {
        window.location.href = loginPath;
      }
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
