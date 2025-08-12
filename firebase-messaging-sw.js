// Import the Firebase scripts needed for messaging
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');

// Your Firebase config
firebase.initializeApp({
    apiKey: "AIzaSyDtZnYYDb5TR01G6zsCtrF0HBR6pnQ2Beg",
    authDomain: "general-68ca7.firebaseapp.com",
    projectId: "general-68ca7",
    storageBucket: "general-68ca7.firebasestorage.app",
    messagingSenderId: "674522865143",
    appId: "1:674522865143:web:c4ec47f2e370c33c3ca2f2"
});

const messaging = firebase.messaging();

// Handle background push messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});