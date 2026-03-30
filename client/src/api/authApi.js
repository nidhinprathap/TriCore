import axiosClient from './axiosClient.js';

export const adminLogin = (data) => axiosClient.post('/auth/login', data);
export const getAdminMe = () => axiosClient.get('/auth/me');

export const publicRegister = (data) => axiosClient.post('/public/auth/register', data);
export const publicLogin = (data) => axiosClient.post('/public/auth/login', data);
export const publicGoogleLogin = (data) => axiosClient.post('/public/auth/google', data);
