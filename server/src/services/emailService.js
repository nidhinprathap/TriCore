import nodemailer from 'nodemailer';
import config from '../config/env.js';
import SiteSettings from '../models/SiteSettings.js';

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (config.smtp.host && config.smtp.user) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    });
    return transporter;
  }

  const settings = await SiteSettings.findOne();
  const email = settings?.integrations?.email;
  if (!email?.enabled) return null;

  if (email.provider === 'smtp' && email.host) {
    transporter = nodemailer.createTransport({ host: email.host, port: email.port || 587, auth: { user: email.user, pass: email.pass } });
  } else if (email.provider === 'brevo' && email.apiKey) {
    transporter = nodemailer.createTransport({ host: 'smtp-relay.brevo.com', port: 587, auth: { user: email.user, pass: email.apiKey } });
  } else if (email.provider === 'sendgrid' && email.apiKey) {
    transporter = nodemailer.createTransport({ host: 'smtp.sendgrid.net', port: 587, auth: { user: 'apikey', pass: email.apiKey } });
  }

  return transporter;
};

export const resetTransporter = () => { transporter = null; };

export const sendEmail = async ({ to, subject, html }) => {
  const t = await getTransporter();
  if (!t) {
    console.warn('Email not configured — skipping send to:', to);
    return null;
  }
  const settings = await SiteSettings.findOne();
  const from = settings?.contact?.email || config.smtp.user || 'noreply@tricore.in';
  return t.sendMail({ from: `TriCore Events <${from}>`, to, subject, html });
};

export const sendRegistrationConfirmation = async (registration, event, sportItem, user) => {
  return sendEmail({
    to: user.email,
    subject: `Registration Confirmed — ${event.title}`,
    html: `
      <div style="font-family: 'Space Grotesk', sans-serif; background: #0A0A0A; color: #fff; padding: 40px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D4AF37; font-size: 24px; margin-bottom: 8px;">Registration Confirmed</h1>
          <p style="color: #A0A0A0; margin-bottom: 32px;">Hi ${user.name}, you're registered!</p>
          <div style="background: #1A1A1A; border: 1px solid #2A2A2A; padding: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 18px; margin-bottom: 12px;">${event.title}</h2>
            <p style="color: #A0A0A0; font-size: 14px;">Activity: ${sportItem.name}</p>
            <p style="color: #A0A0A0; font-size: 14px;">Type: ${registration.type}</p>
            <p style="color: #A0A0A0; font-size: 14px;">Amount: ₹${registration.payment?.amount || 0}</p>
            <p style="color: #A0A0A0; font-size: 14px;">Status: ${registration.status}</p>
          </div>
          <p style="color: #666; font-size: 12px;">— TriCore Events</p>
        </div>
      </div>
    `,
  });
};

export const sendStatusUpdate = async (registration, event, user, newStatus) => {
  const msg = { approved: 'Your registration has been approved!', rejected: 'Your registration was not approved.', waitlisted: 'You have been placed on the waitlist.', cancelled: 'Your registration has been cancelled.' };
  return sendEmail({
    to: user.email,
    subject: `Registration ${newStatus} — ${event.title}`,
    html: `
      <div style="font-family: 'Space Grotesk', sans-serif; background: #0A0A0A; color: #fff; padding: 40px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D4AF37; font-size: 24px; margin-bottom: 8px;">Registration Update</h1>
          <p style="color: #A0A0A0; margin-bottom: 32px;">Hi ${user.name}, ${msg[newStatus] || `Status: ${newStatus}`}</p>
          <div style="background: #1A1A1A; border: 1px solid #2A2A2A; padding: 24px;">
            <h2 style="font-size: 18px; margin-bottom: 12px;">${event.title}</h2>
            <p style="color: #D4AF37; font-size: 16px; font-weight: bold;">Status: ${newStatus.toUpperCase()}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 24px;">— TriCore Events</p>
        </div>
      </div>
    `,
  });
};
