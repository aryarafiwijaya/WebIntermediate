// Import CSS & App
import '../styles/styles.css';
import App from './pages/app';
import { registerSW } from 'virtual:pwa-register';

// 🔧 Konfigurasi URL dasar & public key dari instruksi
const BASE_URL = 'https://story-api.dicoding.dev/v1';
const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

// ✅ Register Service Worker
const updateSW = registerSW({
  onRegistered(swReg) {
    console.log('Service Worker registered:', swReg);
  },
  onRegisterError(error) {
    console.error('Service Worker registration failed:', error);
  },
});

// 🔄 Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();

  // Render ulang saat navigasi hash berubah
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  // 🔔 Inisialisasi Push Notification jika browser mendukung
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      console.log('SW ready for Push Notification');
      initPushNotification(registration);
    } catch (err) {
      console.error('Service Worker setup failed:', err);
    }
  } else {
    console.warn('Browser tidak mendukung Service Worker atau Push API');
  }
});


// ========================================
// 🔔 PUSH NOTIFICATION HANDLER
// ========================================
async function initPushNotification(registration) {
  // Note: Push notification handling is now moved to app-bar.js for better UI management
  console.log('Push notification initialized in app-bar component');
}

// 🔐 Helper: Konversi Base64 ke Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
