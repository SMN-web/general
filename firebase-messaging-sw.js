importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDtZnYYDb5TR01G6zsCtrF0HBR6pnQ2Beg",
    authDomain: "general-68ca7.firebaseapp.com",
    projectId: "general-68ca7",
    storageBucket: "general-68ca7.firebasestorage.app",
    messagingSenderId: "674522865143",
    appId: "1:674522865143:web:c4ec47f2e370c33c3ca2f2",
    measurementId: "G-6L0DXHGCBE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon.png'
  });
});
