import axiosClient from './axiosClient.js';

export const createRegistration = (data) => axiosClient.post('/registrations', data);
export const getMyRegistrations = () => axiosClient.get('/registrations/my');
export const getRegistration = (id) => axiosClient.get(`/registrations/${id}`);
