// Fortune Master PWA Service Worker
const CACHE_NAME = 'fortune-master-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/favicon.png',
    '/apple-touch-icon.png',
    '/manifest.json'
];

// 설치 이벤트: 캐시 생성
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// 활성화 이벤트: 이전 캐시 정리
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 네트워크 요청 가로채기: Network First, 실패 시 Cache
self.addEventListener('fetch', (event) => {
    // skip non-http(s) requests
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // 성공적인 응답을 캐시에 저장
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // 네트워크 실패 시 캐시에서 응답
                return caches.match(event.request).then((response) => {
                    if (response) {
                        return response;
                    }
                    // HTML 요청인 경우 index.html 반환하여 SPA 대응
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// 백그라운드 동기화 (선택사항)
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    if (event.tag === 'sync-fortune-data') {
        event.waitUntil(syncFortuneData());
    }
});

// 푸시 알림 (선택사항)
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received:', event);
    const options = {
        body: event.data ? event.data.text() : '새로운 운세를 확인해보세요!',
        icon: '/favicon.png',
        badge: '/favicon.png'
    };
    event.waitUntil(
        self.registration.showNotification('2026 신년운세 마스터', options)
    );
});

// 유틸리티 함수
async function syncFortuneData() {
    console.log('[SW] Syncing fortune data...');
    // 추후 Supabase와의 동기화 로직 추가 가능
}

