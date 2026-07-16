console.log('[SW] Archivo custom-sw.js cargado correctamente');

// Evento install: se ejecuta cuando se instala el Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Evento install ejecutado');
  console.log('[SW] El Service Worker se está instalando...');

  // Forzar el nuevo Service Worker a activarse sin esperar
  self.skipWaiting();
});

// Evento activate: se ejecuta cuando el Service Worker toma el control
self.addEventListener('activate', (event) => {
  console.log('[SW] Evento activate ejecutado');
  console.log('[SW] El Service Worker se ha activado');

  //Permitir que el Service Worker tome el control de las pestañas abiertas
  event.waitUntil(self.clients.claim());
});

// Evento fetch: se ejecuta cada vez que se realiza una solicitud de red
self.addEventListener('fetch', (event) => {
  console.log('[SW] Evento fetch ejecutado para:', event.request.url);
});

// Evento message: permite recibir mensajes desde la aplicación web
self.addEventListener('message', (event) => {
  console.log('[SW] Mensaje recibido:', event.data);
});

importScripts('./ngsw-worker.js');