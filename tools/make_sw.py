"""Write site/sw.js with a precache list of every file in site/ (offline use)."""
import pathlib, hashlib
site = pathlib.Path(__file__).parent.parent / 'site'
files = sorted(str(p.relative_to(site)) for p in site.rglob('*') if p.is_file() and p.name not in ('sw.js',) and not p.name.endswith('.txt') and p.name != 'CNAME')
h = hashlib.sha1(b''.join((site / f).read_bytes() for f in files)).hexdigest()[:10]
(site / 'sw.js').write_text(f"""const CACHE = "namavali-{h}";
const FILES = {['./'] + files!r};
self.addEventListener("install", e => {{ e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {{ cache: "reload" }})))).then(() => self.skipWaiting())); }});
self.addEventListener("activate", e => {{ e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); }});
self.addEventListener("fetch", e => {{
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  const put = res => {{ if (res.ok) {{ const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }} return res; }};
  if (url.pathname.includes("/fonts/")) {{
    // fonts never change: cache first
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(put)));
    return;
  }}
  // everything else: network first (so updates show at once), cache when offline
  e.respondWith(fetch(e.request).then(put).catch(() => caches.match(e.request, {{ ignoreSearch: true }}).then(r => r || caches.match("./"))));
}});
""")
print('sw cache', h, len(files), 'files')
