import axiosClient from './axiosClient.js';

export const uploadImage = (formData) =>
  axiosClient.post('/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getAssets = (params) => axiosClient.get('/uploads', { params });
export const deleteAsset = (id) => axiosClient.delete(`/uploads/${id}`);
