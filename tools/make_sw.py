"""Write site/sw.js with a precache list of every file in site/ (offline use)."""
import pathlib, hashlib
site = pathlib.Path(__file__).parent.parent / 'site'
files = sorted(str(p.relative_to(site)) for p in site.rglob('*') if p.is_file() and p.name not in ('sw.js',) and not p.name.endswith('.txt') and p.name != 'CNAME')
h = hashlib.sha1(b''.join((site / f).read_bytes() for f in files)).hexdigest()[:10]
(site / 'sw.js').write_text(f"""const CACHE = "namavali-{h}";
const FILES = {['./'] + files!r};
self.addEventListener("install", e => {{ e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); }});
self.addEventListener("activate", e => {{ e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); }});
self.addEventListener("fetch", e => {{
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, {{ ignoreSearch: true }}).then(r => r || fetch(e.request).then(res => {{
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; }}).catch(() => caches.match("./"))));
}});
""")
print('sw cache', h, len(files), 'files')
