const channel = new BroadcastChannel('notifications-audio-player');

self.addEventListener('notificationclick', (e) => channel.postMessage(e.action));
