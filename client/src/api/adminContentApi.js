import axiosClient from './axiosClient.js';

export const getPages = () => axiosClient.get('/admin/pages');
export const getPage = (slug) => axiosClient.get(`/admin/pages/${slug}`);
export const addSection = (slug, data) => axiosClient.post(`/admin/pages/${slug}/sections`, data);
export const updateSection = (slug, sectionId, data) => axiosClient.put(`/admin/pages/${slug}/sections/${sectionId}`, data);
export const deleteSection = (slug, sectionId) => axiosClient.delete(`/admin/pages/${slug}/sections/${sectionId}`);
export const reorderSections = (slug, order) => axiosClient.put(`/admin/pages/${slug}/reorder`, { order });

export const getSettings = () => axiosClient.get('/admin/settings');
export const updateSettings = (data) => axiosClient.put('/admin/settings', data);
