// Import Firebase scripts for compat messaging
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Same config as in your frontend
firebase.initializeApp({
  apiKey: "AIzaSyDtZnYYDb5TR01G6zsCtrF0HBR6pnQ2Beg",
    authDomain: "general-68ca7.firebaseapp.com",
    projectId: "general-68ca7",
    storageBucket: "general-68ca7.firebasestorage.app",
    messagingSenderId: "674522865143",
    appId: "1:674522865143:web:c4ec47f2e370c33c3ca2f2"
});

const messaging = firebase.messaging();

// Listen for background push messages
messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Background message', payload);
  const { title, body, icon } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: icon || '/icon.png',
    data: payload.data || {}
  });
});

// Optional: handle clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  // Open homepage or a URL
  event.waitUntil(clients.openWindow('/'));
});
