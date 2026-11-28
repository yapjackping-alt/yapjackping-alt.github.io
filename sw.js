// keeps the game playable offline; always tries the network first so updates arrive
const C = 'ember-1795856372';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'three.min.js', 'manifest.json', 'icon-180.png']))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
// 切换角色 reloads as index.html?fast=1: answer that from the cache (no 4 MB download); three.min.js never changes inside one build
self.addEventListener('fetch', e => { if (e.request.method !== 'GET') return; const u = new URL(e.request.url);
  if ((u.searchParams.get('fast') === '1' && e.request.mode === 'navigate') || /three\.min\.js$/.test(u.pathname)) { e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(h => h || fetch(e.request))); return; }
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }))); });
