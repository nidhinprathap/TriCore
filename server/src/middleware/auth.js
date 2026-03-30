import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: { message: 'No token provided' } });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user || !user.active) return res.status(401).json({ error: { message: 'Invalid token' } });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: { message: 'Token expired or invalid' } });
  }
};

export default auth;
