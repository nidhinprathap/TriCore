import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../models/User.js';

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: { message: 'Invalid email or password' } });
    }
    if (!user.active) {
      return res.status(403).json({ error: { message: 'Account is disabled' } });
    }
    user.lastLogin = new Date();
    await user.save();
    res.json({ token: generateToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

export const getMe = async (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
};
