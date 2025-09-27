import prisma from '../db.js';
import { authenticateToken } from '../middleware.js';
import express from 'express';
import webpush, { VAPID_PUBLIC_KEY } from '../pushhelper.js'; 

const router = express.Router();


router.get('/vapidPublicKey', (req, res) => {
  if (!VAPID_PUBLIC_KEY) return res.status(500).json({ error: 'VAPID not configured' });
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});


router.post('/subscribe', authenticateToken, async (req, res) => {
  const subscription = req.body; // the subscription object from pushManager.subscribe()
  const userId = req.userId;

  if (!subscription || !subscription.endpoint) return res.status(400).json({ error: 'Invalid subscription' });

  try {
    // upsert by endpoint to avoid duplicates
    const saved = await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        p256dh: subscription.keys?.p256dh || '',
        auth: subscription.keys?.auth || '',
        userId: userId || null
      },
      create: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys?.p256dh || '',
        auth: subscription.keys?.auth || '',
        userId: userId || null
      },
    });

    return res.json({ ok: true, savedId: saved.id });
  } catch (err) {
    console.error('subscribe error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 3) unsubscribe (delete subscription) - requires auth
router.post('/unsubscribe', authenticateToken, async (req, res) => {
  const { endpoint } = req.body;
  if (!endpoint) return res.status(400).json({ error: 'endpoint required' });

  try {
    await prisma.pushSubscription.deleteMany({
      where: {
        endpoint,
        userId: req.userId
      }
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('unsubscribe error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper: send notification to a subscription object
export async function sendNotificationToSubscription(subscriptionRow, payload) {
  try {
    const subscription = {
      endpoint: subscriptionRow.endpoint,
      keys: {
        p256dh: subscriptionRow.p256dh,
        auth: subscriptionRow.auth
      }
    };
    console.log(subscription)
    console.log(payload)
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (err) {
    // 410/404 => subscription is gone: remove from DB
    const status = err?.statusCode || err?.status;
    if (status === 404 || status === 410) {
      try {
        await prisma.pushSubscription.delete({ where: { endpoint: subscriptionRow.endpoint } });
      } catch (e) { /* ignore */ }
    }
    console.warn('sendNotification error', err);
    return false;
  }
}

// Send to all subscriptions for a user
export async function sendNotificationToUser(userId, payload) {
  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  await Promise.all(subs.map(s => sendNotificationToSubscription(s, payload)));
}

// Optional admin endpoint to broadcast
router.post('/send', authenticateToken, async (req, res) => {
  // check role
  if (req.userRole !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const { title, body, url } = req.body;
  const payload = { title, body, url };

  const subs = await prisma.pushSubscription.findMany();
  const results = await Promise.all(subs.map(s => sendNotificationToSubscription(s, payload)));

  res.json({ sent: results.filter(Boolean).length, total: subs.length });
});

export default router;
