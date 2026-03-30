import axiosClient from './axiosClient.js';

export const getSettings = () => axiosClient.get('/content/settings');
export const getPage = (slug) => axiosClient.get(`/content/pages/${slug}`);
export const getEvents = (params) => axiosClient.get('/content/events', { params });
export const getEvent = (slug) => axiosClient.get(`/content/events/${slug}`);
export const getEventItems = (slug) => axiosClient.get(`/content/events/${slug}/items`);
export const getTestimonials = () => axiosClient.get('/content/testimonials');
