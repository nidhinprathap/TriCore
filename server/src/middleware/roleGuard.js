const roleGuard = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: { message: 'Not authenticated' } });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: { message: 'Insufficient permissions' } });
  }
  next();
};

export default roleGuard;
