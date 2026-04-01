const CACHE_NAME = 'scholarship-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

// 安裝 Service Worker 並快取基本檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 攔截網路請求
self.addEventListener('fetch', event => {
  // 排除 Google App Script 的 API 請求，確保每次都抓取最新資料
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  // 其他靜態檔案優先從快取讀取
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在快取中找到，就回傳快取
        if (response) {
          return response;
        }
        // 否則透過網路抓取
        return fetch(event.request);
      })
  );
});

// 更新 Service Worker 時清除舊快取
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
