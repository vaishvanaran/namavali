(function () {
  const T = window.Translit;
  const $ = id => document.getElementById(id);
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const FONT = { deva: "var(--deva)", taml: "var(--tamil)", gran: "var(--gran)", latn: "var(--latn)" };
  const CONV = { deva: s => s, taml: T.tamil, gran: T.grantha, latn: T.iast };
  const VERSION = "2026.10.29";

  let prefs = { script: "taml", omEach: false, fs: 1.45, kind: "", cur: {} };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem("nv-prefs") || "{}")); } catch (e) {}
  const save = () => { try { localStorage.setItem("nv-prefs", JSON.stringify(prefs)); } catch (e) {} };

  let INDEX = null, current = null;
  const docs = {};
  const tr = (s, sc = prefs.script) => {
    let out = CONV[sc](s);
    if (sc !== "deva" && sc !== "gran") out = T.stripSvara(out);
    return out;
  };
  const kindLabel = k => ({ "108": "அஷ்டோத்தரம்", "300": "த்ரிஶதீ", "1000": "ஸஹஸ்ரநாமம்" }[k] || "");

  function applyPrefs() {
    const r = document.documentElement.style;
    r.setProperty("--script", FONT[prefs.script]);
    r.setProperty("--fs", prefs.fs + "rem");
    document.querySelectorAll("#scripts button").forEach(b => b.setAttribute("aria-pressed", b.dataset.s === prefs.script));
    document.querySelectorAll("#kinds button").forEach(b => b.setAttribute("aria-pressed", b.dataset.k === prefs.kind));
    $("omBtn").setAttribute("aria-pressed", prefs.omEach);
  }

  /* ---------- catalogue ---------- */
  function four(deva, en) {
    return `<span class="d">${esc(deva)}</span><span class="t">${esc(T.tamil(deva))}</span>` +
      `<span class="g">${esc(T.grantha(deva))}</span><span class="e">${esc(en)}</span>`;
  }
  function renderHome() {
    if (!INDEX) return;
    const raw = $("q").value.trim(), q = raw.toLowerCase(), ql = T.looseLatin(raw);
    const match = it => {
      if (prefs.kind && it.kind !== prefs.kind) return false;
      if (!raw) return true;
      const hay = [it.deva, it.title, T.tamil(it.deva), T.tamil(it.title), it.en.toLowerCase(), it.note].join(" ");
      if (hay.includes(raw) || hay.includes(q)) return true;
      return ql.length > 1 && (T.key(it.deva + it.title).includes(ql) || T.looseLatin(it.en).includes(ql));
    };
    let h = "";
    for (const g of INDEX.groups) {
      const items = INDEX.items.filter(i => i.group === g.key && match(i));
      if (!items.length) continue;
      h += `<section class="sec"><h2><span class="d">${esc(g.deva)}</span><span class="t">${esc(g.ta)}</span><span class="e">${esc(g.en)}</span></h2><div class="grid">`;
      for (const it of items) {
        h += `<a class="card" href="#${it.id}">${four(it.deva, it.en)}<span class="meta">` +
          `<span class="pill k">${it.count} · ${kindLabel(it.kind)}</span>` +
          (it.note ? `<span class="pill">${esc(it.note)}</span>` : "") + `</span></a>`;
      }
      h += "</div></section>";
    }
    $("cat").innerHTML = h || `<p class="empty">“${esc(raw)}” — எதுவும் கிடைக்கவில்லை.</p>`;
  }

  /* ---------- reader ---------- */
  async function loadDoc(id) {
    if (docs[id]) return docs[id];
    const r = await fetch(`data/${id}.json`);
    if (!r.ok) throw new Error(r.status);
    return (docs[id] = await r.json());
  }
  function renderReader() {
    const d = current; if (!d) return;
    const meta = INDEX.items.find(i => i.id === d.id) || {};
    const sc = prefs.script;
    $("rTitle").textContent = tr(d.title);
    $("rAlt").innerHTML = ["deva", "taml", "gran", "latn"].filter(s => s !== sc)
      .map(s => `<span class="${s}">${esc(tr(d.title, s))}</span>`).join("");
    const src = INDEX.sources[d.source] || {};
    $("rSrc").innerHTML = `${meta.count} நாமங்கள் · மூலம்: ${src.url ? `<a href="${src.url}" target="_blank" rel="noopener">${esc(src.ta)}</a>` : esc(src.ta || "")}`;
    const notes = [];
    if (meta.note) notes.push(meta.note);
    if (d.svara && (sc === "taml" || sc === "latn")) notes.push("ஸ்வரக் குறிகள் தேவநாகரி, க்ரந்தத்தில் மட்டும் காட்டப்படும்.");
    $("rNote").hidden = !notes.length; $("rNote").textContent = notes.join(" · ");
    document.body.classList.toggle("svara", !!d.svara);

    const om = tr("ॐ"), curI = prefs.cur[d.id];
    let n = 0, h = "";
    for (const b of d.blocks) {
      if (b.t === "head") h += `<div class="blk-head">${esc(tr(b.x))}</div>`;
      else if (b.t === "shloka" || b.t === "para") h += `<div class="blk-${b.t}">${b.x.map(l => `<p>${esc(tr(l))}</p>`).join("")}</div>`;
      else if (b.t === "end") h += `<p class="blk-end">${esc(tr(b.x))}</p>`;
      else if (b.t === "names") {
        h += `<ol class="names">` + b.x.map(x => {
          const i = n++;
          const pre = (prefs.omEach && !d.svara) || (i === 0 && !d.svara && !/^ॐ/.test(x)) ? `<span class="om">${om}</span> ` : "";
          return `<li data-i="${i}"${curI === i ? ' class="cur"' : ""}><span class="n">${i + 1}</span><span class="x">${pre}${esc(tr(x))}</span></li>`;
        }).join("") + `</ol>`;
      }
    }
    $("rBody").innerHTML = h;
  }

  /* ---------- routing ---------- */
  let wake = null;
  async function keepAwake(on) {
    try {
      if (on && "wakeLock" in navigator && !wake) { wake = await navigator.wakeLock.request("screen"); wake.addEventListener("release", () => (wake = null)); }
      else if (!on && wake) { await wake.release(); wake = null; }
    } catch (e) {}
  }
  function show(view) {
    ["home", "reader", "about"].forEach(v => ($(v).hidden = v !== view));
    $("rtools").hidden = view !== "reader";
    keepAwake(view === "reader");
  }
  async function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id === "about") { show("about"); window.scrollTo(0, 0); return; }
    if (id && INDEX && INDEX.items.some(i => i.id === id)) {
      try { current = await loadDoc(id); } catch (e) { $("rBody").innerHTML = `<p class="empty">ஏற்ற முடியவில்லை. இணைய இணைப்பைச் சரிபார்க்கவும்.</p>`; }
      show("reader"); renderReader(); window.scrollTo(0, 0); return;
    }
    current = null; show("home"); renderHome();
  }

  /* ---------- events ---------- */
  $("scripts").onclick = e => { const b = e.target.closest("button"); if (!b) return; prefs.script = b.dataset.s; save(); applyPrefs(); renderReader(); };
  $("kinds").onclick = e => { const b = e.target.closest("button"); if (!b) return; prefs.kind = b.dataset.k; save(); applyPrefs(); renderHome(); };
  $("omBtn").onclick = () => { prefs.omEach = !prefs.omEach; save(); applyPrefs(); renderReader(); };
  $("fsUp").onclick = () => { prefs.fs = Math.min(3.2, +(prefs.fs + 0.15).toFixed(2)); save(); applyPrefs(); };
  $("fsDown").onclick = () => { prefs.fs = Math.max(0.95, +(prefs.fs - 0.15).toFixed(2)); save(); applyPrefs(); };
  $("q").oninput = renderHome;
  $("backBtn").onclick = () => (location.hash = "");
  document.querySelectorAll("[data-home]").forEach(b => (b.onclick = () => (location.hash = "")));
  $("rBody").onclick = e => {
    const li = e.target.closest("li[data-i]"); if (!li || !current) return;
    const i = +li.dataset.i, id = current.id;
    prefs.cur[id] = prefs.cur[id] === i ? undefined : i; save();
    $("rBody").querySelectorAll("li.cur").forEach(x => x.classList.remove("cur"));
    if (prefs.cur[id] === i) li.classList.add("cur");
  };
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && !$("reader").hidden) keepAwake(true); });
  window.addEventListener("hashchange", route);

  let deferred = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; $("installBtn").hidden = false; });
  $("installBtn").onclick = async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $("installBtn").hidden = true; };

  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
  $("ver").textContent = "பதிப்பு " + VERSION;

  applyPrefs();
  fetch("data/index.json").then(r => r.json()).then(j => { INDEX = j; route(); })
    .catch(() => ($("cat").innerHTML = `<p class="empty">பட்டியலை ஏற்ற முடியவில்லை.</p>`));
})();
