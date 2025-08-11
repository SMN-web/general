self.addEventListener('push', e => {
  let data = {};
  if (e.data) data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(
      data.title || 'Notification',
      {
        body: data.body || '',
        icon: data.icon || 'icon.png',
        data: data
      }
    )
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
