self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  const data = event.data.json();
  console.log(event.data.json());
  /*
  const title = 'SAKURA AYANE';
  const options = {
    body: 'IROHASUUUUUU',
    icon: 'test.jpg',
  };
  */
  const title = data.title;
  const options = {
    body : data.body,
    icon: 'test.jpg'
  }
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  );
});
