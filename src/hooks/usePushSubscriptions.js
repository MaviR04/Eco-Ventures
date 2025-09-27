// hooks/usePushSubscription.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';


 function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

 async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.register('/sw.js');
    return reg;
  }
  throw new Error('ServiceWorker not supported');
}

 async function askPermission() {
  const status = await Notification.requestPermission();
  return status === 'granted';
}




export function usePushSubscription() {
  const { accessToken } = useContext(AuthContext);

  async function subscribe() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push not supported');
    }

    const granted = await askPermission();
    if (!granted) throw new Error('Permission denied');

    const reg = await registerServiceWorker();
    // fetch public key
    const res = await fetch('http://localhost:3000/api/push/vapidPublicKey');
    const { publicKey } = await res.json();

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    // send to server
    await fetch('http://localhost:3000/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify(subscription),
    });

    return subscription;
  }

  async function unsubscribe() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return false;

    // tell push manager to unsubscribe
    await sub.unsubscribe();

    // inform server to delete
    await fetch('http://localhost:3000/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify({ endpoint: sub.endpoint })
    });

    return true;
  }

  return { subscribe, unsubscribe };
}
