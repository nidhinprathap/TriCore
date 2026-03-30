import axiosClient from './axiosClient.js';

export const getAdminEvents = (params) => axiosClient.get('/admin/events', { params });
export const getAdminEvent = (id) => axiosClient.get(`/admin/events/${id}`);
export const createEvent = (data) => axiosClient.post('/admin/events', data);
export const updateEvent = (id, data) => axiosClient.put(`/admin/events/${id}`, data);
export const deleteEvent = (id) => axiosClient.delete(`/admin/events/${id}`);

export const getEventItems = (eventId) => axiosClient.get(`/admin/events/${eventId}/items`);
export const createEventItem = (eventId, data) => axiosClient.post(`/admin/events/${eventId}/items`, data);
export const updateEventItem = (eventId, itemId, data) => axiosClient.put(`/admin/events/${eventId}/items/${itemId}`, data);
export const deleteEventItem = (eventId, itemId) => axiosClient.delete(`/admin/events/${eventId}/items/${itemId}`);

export const getAdminTestimonials = (params) => axiosClient.get('/admin/testimonials', { params });
export const createTestimonial = (data) => axiosClient.post('/admin/testimonials', data);
export const updateTestimonial = (id, data) => axiosClient.put(`/admin/testimonials/${id}`, data);
export const deleteTestimonial = (id) => axiosClient.delete(`/admin/testimonials/${id}`);

export const getAdminRegistrations = (params) => axiosClient.get('/admin/registrations', { params });
export const updateRegistrationStatus = (id, status) => axiosClient.patch(`/admin/registrations/${id}/status`, { status });

export const getCalendarFeeds = () => axiosClient.get('/admin/calendar/feeds');
