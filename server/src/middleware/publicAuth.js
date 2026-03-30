import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import PublicUser from '../models/PublicUser.js';

const publicAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: { message: 'No token provided' } });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (decoded.type !== 'public') return res.status(401).json({ error: { message: 'Invalid token type' } });
    const user = await PublicUser.findById(decoded.id);
    if (!user) return res.status(401).json({ error: { message: 'Invalid token' } });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: { message: 'Token expired or invalid' } });
  }
};

export default publicAuth;
