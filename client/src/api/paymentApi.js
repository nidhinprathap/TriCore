import axiosClient from './axiosClient.js';

export const initiatePayment = (registrationId) => axiosClient.post(`/registrations/${registrationId}/pay`);
export const confirmPayment = (data) => axiosClient.post('/registrations/payment/confirm', data);
