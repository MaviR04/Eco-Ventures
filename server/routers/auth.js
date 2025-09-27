// routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const router = express.Router();

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// helpers
function generateAccessToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}
function generateRefreshToken(user) {
  return jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

// register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'User already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name: name || null }
  });

  res.json({ id: user.id, email: user.email, name: user.name });
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // store refresh token in DB (so we can revoke it)
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  // set refresh token in httpOnly cookie
  res.cookie('jid', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // or 'none' if cross-site and secure
    path: '/api/auth/refresh',
    maxAge: 1000 * 60 * 60 * 24 * 7 // match REFRESH_EXPIRES
  });

  res.json({ accessToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// refresh
router.post('/refresh', async (req, res) => {
  const token = req.cookies.jid;
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // rotate refresh token
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken } });

    res.cookie('jid', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// logout
router.post('/logout', async (req, res) => {
  const token = req.cookies.jid;
  if (token) {
    try {
      const payload = jwt.verify(token, REFRESH_SECRET);
      await prisma.user.update({ where: { id: payload.userId }, data: { refreshToken: null } });
    } catch (e) {
        console.error('Error during logout:', e)
    }
  }
  res.clearCookie('jid', { path: '/api/auth/refresh' });
  res.json({ ok: true });
});

export default router;
