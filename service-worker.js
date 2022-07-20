const version = "1.29";
const cacheName = `jb-${version}`;

self.addEventListener("install", e => {
	console.log('Service worker installing...');
	e.waitUntil(
		caches.open(cacheName).then(cache => {
			return cache.addAll([
				"/",
				"/index.html",
				"/manifest.json",
				"/sitemap.xml",
				"/images/icons/ace-of-clubs.svg",
				"/images/icons/ace-of-diamonds.svg",
				"/images/icons/ace-of-hearts.svg",
				"/images/icons/ace-of-spades.svg",
				"/images/icons/card-back.svg",
				"/images/icons/eight-of-clubs.svg",
				"/images/icons/eight-of-diamonds.svg",
				"/images/icons/eight-of-hearts.svg",
				"/images/icons/eight-of-spades.svg",
				"/images/icons/five-of-clubs.svg",
				"/images/icons/five-of-diamonds.svg",
				"/images/icons/five-of-hearts.svg",
				"/images/icons/five-of-spades.svg",
				"/images/icons/four-of-clubs.svg",
				"/images/icons/four-of-diamonds.svg",
				"/images/icons/four-of-hearts.svg",
				"/images/icons/four-of-spades.svg",
				"/images/icons/jack-of-clubs.svg",
				"/images/icons/jack-of-diamonds.svg",
				"/images/icons/jack-of-hearts.svg",
				"/images/icons/jack-of-spades.svg",
				"/images/icons/king-of-clubs.svg",
				"/images/icons/king-of-diamonds.svg",
				"/images/icons/king-of-hearts.svg",
				"/images/icons/king-of-spades.svg",
				"/images/icons/nine-of-clubs.svg",
				"/images/icons/nine-of-diamonds.svg",
				"/images/icons/nine-of-hearts.svg",
				"/images/icons/nine-of-spades.svg",
				"/images/icons/queen-of-clubs.svg",
				"/images/icons/queen-of-diamonds.svg",
				"/images/icons/queen-of-hearts.svg",
				"/images/icons/queen-of-spades.svg",
				"/images/icons/seven-of-clubs.svg",
				"/images/icons/seven-of-diamonds.svg",
				"/images/icons/seven-of-hearts.svg",
				"/images/icons/seven-of-spades.svg",
				"/images/icons/six-of-clubs.svg",
				"/images/icons/six-of-diamonds.svg",
				"/images/icons/six-of-hearts.svg",
				"/images/icons/six-of-spades.svg",
				"/images/icons/ten-of-clubs.svg",
				"/images/icons/ten-of-diamonds.svg",
				"/images/icons/ten-of-hearts.svg",
				"/images/icons/ten-of-spades.svg",
				"/images/icons/three-of-clubs.svg",
				"/images/icons/three-of-diamonds.svg",
				"/images/icons/three-of-hearts.svg",
				"/images/icons/three-of-spades.svg",
				"/images/icons/two-of-clubs.svg",
				"/images/icons/two-of-diamonds.svg",
				"/images/icons/two-of-hearts.svg",
				"/images/icons/two-of-spades.svg",
				"/images/logos/company-logo-192.png",
				"/images/logos/company-logo-192.svg",
				"/images/logos/company-logo-512.png",
				"/images/logos/company-logo-512.svg",
				"/images/logos/logo-192.png",
				"/images/logos/logo-192.svg",
				"/images/logos/logo-512.png",
				"/images/logos/logo-512.svg",
				"/scripts/main.js",
				"/scripts/worker.js",
				"/scripts/team.js",
				"/styles/1-settings/color.css",
				"/styles/1-settings/font.css",
				"/styles/3-generic/reset.css",
				"/styles/4-elements/body.css",
				"/styles/4-elements/main.css",
				"/styles/4-elements/table.css",
				"/styles/6-components/button.css",
				"/styles/6-components/card.css",
				"/styles/6-components/container.css",
				"/styles/6-components/footer.css",
				"/styles/6-components/section.css",
				"/styles/6-components/settings.css"
			])
			.then(() => self.skipWaiting());
		})
	);
});

self.addEventListener("activate", event => {
	console.log('Service worker activating...');
	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
	console.log('Service worker fetching:', event.request.url);
	event.respondWith(
		caches.open(cacheName)
		.then(cache => cache.match(event.request, {ignoreSearch: true}))
		.then(response => {
			return response || fetch(event.request);
		})
	);
});
