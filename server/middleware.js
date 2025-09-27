// routes/middleware.js
import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'No token' });

  const parts = auth.split(' ');
  if (parts[0] !== 'Bearer' || !parts[1]) return res.status(401).json({ error: 'Invalid auth header' });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}


