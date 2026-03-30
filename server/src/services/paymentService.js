import Razorpay from 'razorpay';
import config from '../config/env.js';
import SiteSettings from '../models/SiteSettings.js';

let razorpay = null;

const getRazorpay = async () => {
  if (razorpay) return razorpay;

  // Try env vars first, fall back to DB settings
  let keyId = config.razorpay.keyId;
  let keySecret = config.razorpay.keySecret;

  if (!keyId || !keySecret) {
    const settings = await SiteSettings.findOne();
    if (settings?.integrations?.razorpay?.enabled) {
      keyId = settings.integrations.razorpay.keyId;
      keySecret = settings.integrations.razorpay.keySecret;
    }
  }

  if (!keyId || !keySecret) {
    throw new Error('Razorpay is not configured. Set keys in Admin → Integrations or in .env');
  }

  razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return razorpay;
};

// Reset cached client when settings change
export const resetRazorpay = () => { razorpay = null; };

export const createOrder = async (amount, registrationId) => {
  const client = await getRazorpay();
  const order = await client.orders.create({
    amount: amount * 100,
    currency: 'INR',
    receipt: `reg_${registrationId}`,
  });
  return order;
};
