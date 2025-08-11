self.addEventListener("push", e => {
  let data = {};
  if (e.data) data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title || "Notification", {
      body: data.body || "",
      icon: data.icon || "icon.png",
      data: data.data || {}
    })
  );
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  if (e.notification.data.url) {
    e.waitUntil(clients.openWindow(e.notification.data.url));
  }
});
