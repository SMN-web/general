self.addEventListener('push', e => {
  let data = {};
  if (e.data) data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title || 'Hi', {
      body: data.body || '',
      icon: 'icon.png'
    })
  );
});
