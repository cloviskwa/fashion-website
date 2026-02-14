/**
 * ============================================
 * LIPEK FASHION - SERVICE WORKER
 * Handles offline caching and push notifications
 * Version: 1.0.0
 * ============================================
 */

const CACHE_NAME = 'lipek-fashion-v1';
const API_CACHE_NAME = 'lipek-api-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/js/pwa.js',
  '/assets/js/config.js',
  '/assets/images/logo.svg',
  '/assets/images/icon-72x72.png',
  '/assets/images/icon-96x96.png',
  '/assets/images/icon-128x128.png',
  '/assets/images/icon-144x144.png',
  '/assets/images/icon-152x152.png',
  '/assets/images/icon-192x192.png',
  '/assets/images/icon-384x384.png',
  '/assets/images/icon-512x512.png',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap'
];

// API routes to cache
const API_ROUTES = [
  '/api/services',
  '/api/gallery',
  '/api/blog',
  '/api/testimonials'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('👷 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('👷 Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('🗑️ Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(event.request));
    return;
  }
  
  // Handle page requests
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(event.request));
    return;
  }
  
  // Handle static assets
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(networkResponse => {
          // Cache successful responses
          if (networkResponse.ok && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Return offline page for failed navigations
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        return new Response('Offline', { status: 503 });
      })
  );
});

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache the page
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    console.log('📴 Network failed, serving from cache');
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/offline.html');
  }
}

// Handle API requests with stale-while-revalidate strategy
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache fresh data
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    console.log('📴 API offline, serving from cache');
    
    // Serve from cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('📨 Push notification received:', event);
  
  let data = {
    title: 'Lipek Fashion',
    body: 'Something new from Lipek Fashion!',
    icon: '/assets/images/icon-192x192.png',
    badge: '/assets/images/icon-72x72.png',
    timestamp: new Date().toISOString()
  };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      console.error('Error parsing push data:', e);
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: [200, 100, 200],
    data: data,
    actions: [
      {
        action: 'open',
        title: 'View'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ],
    tag: data.tag || 'default',
    renotify: true,
    requireInteraction: true,
    timestamp: new Date(data.timestamp).getTime()
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('📨 Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(windowClients => {
      // Check if there's already a window/tab open with the target URL
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle sync events for offline data
self.addEventListener('sync', (event) => {
  console.log('🔄 Sync event:', event.tag);
  
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncOfflineBookings());
  }
  
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncOfflineForms());
  }
});

// Sync offline bookings
async function syncOfflineBookings() {
  try {
    const response = await fetch('/api/bookings/offline');
    const bookings = await response.json();
    
    for (const booking of bookings) {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
    }
    
    console.log('✅ Synced offline bookings');
  } catch (error) {
    console.error('Failed to sync bookings:', error);
  }
}

// Sync offline forms
async function syncOfflineForms() {
  try {
    const response = await fetch('/api/contact/offline');
    const forms = await response.json();
    
    for (const form of forms) {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }
    
    console.log('✅ Synced offline forms');
  } catch (error) {
    console.error('Failed to sync forms:', error);
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  console.log('📨 Message from client:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_PAGE') {
    caches.open(CACHE_NAME).then(cache => {
      cache.add(event.data.url);
    });
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('🔄 Periodic sync:', event.tag);
  
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

// Update cached content
async function updateContent() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  
  for (const request of keys) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response);
      }
    } catch (error) {
      console.log('Failed to update:', request.url);
    }
  }
}

// Log service worker events for debugging
self.addEventListener('message', (event) => {
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: '1.0.0',
      cacheName: CACHE_NAME
    });
  }
});