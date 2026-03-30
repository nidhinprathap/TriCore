import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import config from '../config/env.js';
import PublicUser from '../models/PublicUser.js';
import SiteSettings from '../models/SiteSettings.js';

let googleClient = config.googleClientId ? new OAuth2Client(config.googleClientId) : null;

const getGoogleClient = async () => {
  if (googleClient) return googleClient;

  // Try DB settings
  const settings = await SiteSettings.findOne();
  if (settings?.integrations?.google?.enabled && settings.integrations.google.clientId) {
    googleClient = new OAuth2Client(settings.integrations.google.clientId);
    return googleClient;
  }

  return null;
};

// Reset cached client when settings change
export const resetGoogleClient = () => { googleClient = null; };

const generateToken = (user) =>
  jwt.sign({ id: user._id, type: 'public' }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.validatedBody;
    const existing = await PublicUser.findOne({ email });
    if (existing) return res.status(409).json({ error: { message: 'Email already registered' } });
    const user = await PublicUser.create({ name, email, password, phone });
    res.status(201).json({ token: generateToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;
    const user = await PublicUser.findOne({ email }).select('+password');
    if (!user || !user.password || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: { message: 'Invalid email or password' } });
    }
    res.json({ token: generateToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

export const googleLogin = async (req, res, next) => {
  try {
    const client = await getGoogleClient();
    if (!client) {
      return res.status(503).json({ error: { message: 'Google login is not configured. Enable it in Admin → Integrations.' } });
    }

    const { credential } = req.validatedBody;
    const settings = await SiteSettings.findOne();
    const clientId = config.googleClientId || settings?.integrations?.google?.clientId;
    const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
    const { email, name, picture, sub } = ticket.getPayload();

    let user = await PublicUser.findOne({ $or: [{ googleId: sub }, { email }] });
    if (!user) {
      user = await PublicUser.create({ name, email, googleId: sub, avatar: picture, verified: true });
    } else if (!user.googleId) {
      user.googleId = sub;
      user.avatar = user.avatar || picture;
      user.verified = true;
      await user.save();
    }
    res.json({ token: generateToken(user), user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) { next(err); }
};

export const getMe = async (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, phone: req.user.phone, avatar: req.user.avatar } });
};
