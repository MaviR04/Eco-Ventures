import webpush from 'web-push';
import dotenv from 'dotenv';
dotenv.config();

const PUBLIC = process.env.VAPID_PUBLIC_KEY;
const PRIVATE = process.env.VAPID_PRIVATE_KEY;
const SUBJECT = process.env.VAPID_SUBJECT || 'mailto:you@domain.com';

if (!PUBLIC || !PRIVATE) {
  console.warn('VAPID keys missing. Generate them and set VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY.');
} else {
  webpush.setVapidDetails(SUBJECT, PUBLIC, PRIVATE);
}

export default webpush;
export const VAPID_PUBLIC_KEY = PUBLIC;