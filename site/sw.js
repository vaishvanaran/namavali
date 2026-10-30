const CACHE = "namavali-39ad0adae6";
const FILES = ['./', 'app.js', 'data/adi-shankara.json', 'data/anjaneya-ramarahasya.json', 'data/anjaneya.json', 'data/annapurna.json', 'data/ardhanarishvara.json', 'data/astrayudha.json', 'data/chandrashekharendra.json', 'data/dakshinamurti.json', 'data/days.json', 'data/devasena.json', 'data/dhanvantari.json', 'data/durga.json', 'data/gakaradi-ganapati-1000.json', 'data/gakaradi-ganapati.json', 'data/ganapati.json', 'data/ganesha.json', 'data/ganga-2.json', 'data/ganga.json', 'data/glossary.json', 'data/goda.json', 'data/harihara.json', 'data/index.json', 'data/jagadanandakaraka.json', 'data/kamakshi.json', 'data/kartikeya.json', 'data/kaveri.json', 'data/krishna.json', 'data/kubera.json', 'data/lakshmi-nrisimha.json', 'data/lakshmi.json', 'data/lalita-300.json', 'data/mrtyunjaya.json', 'data/nrisimha.json', 'data/puja/purusha-sukta-vidhana.json', 'data/puja/purvanga.json', 'data/puja/rudra-prashna.json', 'data/puja/rudra-vidhana.json', 'data/puja/sri-sukta-vidhana.json', 'data/puja/vinayaka-chaturthi.json', 'data/pujas.json', 'data/rama-1000.json', 'data/rama-ramarahasya.json', 'data/rama.json', 'data/rudra-300.json', 'data/saraswati-1008.json', 'data/saraswati.json', 'data/shakti-divyasthaniya.json', 'data/shanmukha-1000.json', 'data/shiva-1008.json', 'data/shiva-divyasthaniya.json', 'data/shiva.json', 'data/sita-ramarahasya.json', 'data/sita.json', 'data/subrahmanya.json', 'data/sundara-hanuman.json', 'data/surya-mahabharata.json', 'data/surya.json', 'data/tulasi.json', 'data/vakratunda-1000.json', 'data/valli.json', 'data/venkatesha.json', 'data/venkateshwara.json', 'data/vishnu-1000.json', 'data/vishnu-divyasthaniya.json', 'data/vyasa.json', 'fonts/deva.woff2', 'fonts/grantha.woff2', 'fonts/tamil.woff2', 'fonts/ui.woff2', 'icons/icon-180-om.png', 'icons/icon-192-om.png', 'icons/icon-512-om.png', 'icons/icon-maskable-512-om.png', 'index.html', 'manifest.webmanifest', 'style.css', 'symbols.js', 'translit.js'];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  const put = res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return res; };
  if (url.pathname.includes("/fonts/")) {
    // fonts never change: cache first
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(put)));
    return;
  }
  // everything else: network first (so updates show at once), cache when offline
  e.respondWith(fetch(e.request).then(put).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./"))));
});
