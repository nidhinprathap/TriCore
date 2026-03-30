import crypto from 'crypto';
import { createOrder } from '../services/paymentService.js';
import Registration from '../models/Registration.js';
import config from '../config/env.js';

export const initiatePayment = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.registrationId);
    if (!registration) return res.status(404).json({ error: { message: 'Registration not found' } });
    if (!registration.user.equals(req.user._id)) {
      return res.status(403).json({ error: { message: 'Not authorized' } });
    }
    if (registration.payment.status === 'completed') {
      return res.status(400).json({ error: { message: 'Already paid' } });
    }
    const order = await createOrder(registration.payment.amount, registration._id);
    registration.payment.razorpayOrderId = order.id;
    await registration.save();
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) { next(err); }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.validatedBody;
    const generated = crypto.createHmac('sha256', config.razorpay.keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
    if (generated !== razorpaySignature) return res.status(400).json({ error: { message: 'Payment verification failed' } });
    const registration = await Registration.findOne({ 'payment.razorpayOrderId': razorpayOrderId });
    if (!registration) return res.status(404).json({ error: { message: 'Registration not found' } });
    if (!registration.user.equals(req.user._id)) {
      return res.status(403).json({ error: { message: 'Not authorized' } });
    }
    registration.payment.status = 'completed';
    registration.payment.razorpayPaymentId = razorpayPaymentId;
    registration.payment.paidAt = new Date();
    registration.status = 'approved';
    await registration.save();
    res.json({ message: 'Payment confirmed', registration });
  } catch (err) { next(err); }
};
