(function () {
  const T = window.Translit;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const FONT = { deva: "var(--deva)", taml: "var(--tamil)", gran: "var(--gran)", latn: "var(--latn)" };
  const CONV = { deva: s => s, taml: T.tamil, gran: T.grantha, latn: T.iast };
  const VERSION = "2026.10.29d";
  const KINDS = [
    { k: "108", deva: "अष्टोत्तरशतनामावलिः", ta: "அஷ்டோத்தரம்", en: "Ashtottaram · 108 names" },
    { k: "300", deva: "त्रिशतीनामावलिः", ta: "த்ரிஶதீ", en: "Trishati · 300 names" },
    { k: "1000", deva: "सहस्रनामावलिः", ta: "ஸஹஸ்ரநாமம்", en: "Sahasranamam · 1000 names" },
  ];
  const MANGALA = ["शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् ।", "प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥"];

  let prefs = { script: "taml", omEach: false, fs: 1.45, kind: "", cur: {}, recent: [] };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem("nv-prefs") || "{}")); } catch (e) {}
  if (!Array.isArray(prefs.recent)) prefs.recent = [];
  const save = () => { try { localStorage.setItem("nv-prefs", JSON.stringify(prefs)); } catch (e) {} };

  let INDEX = null, current = null, view = "home", groupKey = null;
  const docs = {};
  const tr = (s, sc = prefs.script) => {
    const out = CONV[sc](s);
    return sc === "deva" || sc === "gran" ? out : T.stripSvara(out);
  };
  const kindLabel = k => ({ "108": "அஷ்டோத்தரம்", "300": "த்ரிஶதீ", "1000": "ஸஹஸ்ரநாமம்" }[k] || "");
  const byId = id => INDEX.items.find(i => i.id === id);

  function applyPrefs() {
    const r = document.documentElement.style;
    r.setProperty("--script", FONT[prefs.script]);
    r.setProperty("--fs", prefs.fs + "rem");
    document.querySelectorAll("#scripts button").forEach(b => b.setAttribute("aria-pressed", b.dataset.s === prefs.script));
    $("omBtn").setAttribute("aria-pressed", prefs.omEach);
  }

  /* ---------- shared pieces ---------- */
  const four = (deva, en) =>
    `<span class="d">${esc(deva)}</span><span class="t">${esc(T.tamil(deva))}</span>` +
    `<span class="g">${esc(T.grantha(deva))}</span><span class="e">${esc(en)}</span>`;
  const card = it =>
    `<a class="card" href="#${it.id}">${four(it.deva, it.en)}<span class="meta">` +
    `<span class="pill k">${it.count} · ${kindLabel(it.kind)}</span>` +
    (it.note ? `<span class="pill">${esc(it.note)}</span>` : "") + `</span></a>`;

  /* ---------- home ---------- */
  function renderHome() {
    if (!INDEX) return;
    $("mangala").innerHTML = MANGALA.map(l => `<span>${esc(tr(l))}</span>`).join("");
    const raw = $("q").value.trim();
    $("tilesBox").hidden = !!raw; $("results").hidden = !raw;
    const rec = prefs.recent.map(byId).filter(Boolean);
    $("recentBox").hidden = !!raw || !rec.length;
    $("recent").innerHTML = rec.map(it => `<a class="chip" href="#${it.id}"><span class="d">${esc(it.deva)}</span><span class="t">${esc(T.tamil(it.deva))}</span><span class="pill">${it.count}</span></a>`).join("");
    if (raw) {
      const q = raw.toLowerCase(), ql = T.looseLatin(raw);
      const hit = it => {
        const g = INDEX.groups.find(x => x.key === it.group) || {};
        const hay = [it.deva, it.title, T.tamil(it.deva), T.tamil(it.title), it.en.toLowerCase(), it.note, g.ta, g.deva, (g.en || "").toLowerCase()].join(" ");
        if (hay.includes(raw) || hay.includes(q)) return true;
        return ql.length > 1 && (T.key(it.deva + it.title).includes(ql) || T.looseLatin(it.en + " " + (g.en || "")).includes(ql));
      };
      const found = INDEX.items.filter(hit);
      $("results").innerHTML = found.length
        ? `<h2 class="lbl">${found.length} நாமாவளிகள்</h2><div class="grid">${found.map(card).join("")}</div>`
        : `<p class="empty">“${esc(raw)}” — எதுவும் கிடைக்கவில்லை.</p>`;
      return;
    }
    $("tiles").innerHTML = KINDS.map(K => {
      const items = INDEX.items.filter(i => i.kind === K.k);
      const gs = INDEX.groups.filter(g => items.some(i => i.group === g.key)).map(g => g.ta.split(",")[0]);
      return `<a class="ktile" href="#k-${K.k}"><span class="sym num">${K.k}</span><span class="kt">` +
        `<span class="d">${esc(K.deva)}</span><span class="t">${esc(K.ta)}</span><span class="e">${esc(K.en)}</span>` +
        `<span class="n">${items.length} நாமாவளிகள் · ${esc(gs.slice(0, 5).join(", "))}${gs.length > 5 ? "…" : ""}</span></span></a>`;
    }).join("");
  }

  /* ---------- one kind (108 / 300 / 1000), grouped by deity ---------- */
  let kindKey = null;
  function renderKind() {
    const K = KINDS.find(x => x.k === kindKey); if (!K) return;
    $("kNum").textContent = K.k;
    $("kDeva").textContent = K.deva;
    $("kAlt").innerHTML = `<span class="taml">${esc(K.ta)}</span><span class="gran">${esc(T.grantha(K.deva))}</span><span>${esc(K.en)}</span>`;
    const items = INDEX.items.filter(i => i.kind === K.k);
    const groups = INDEX.groups.filter(g => items.some(i => i.group === g.key));
    $("kJump").hidden = groups.length < 3;
    $("kJump").innerHTML = groups.map(g => `<button class="chip" data-g="${g.key}"><span class="d">${esc(g.deva)}</span><span class="t">${esc(g.ta.split(",")[0])}</span></button>`).join("");
    $("klist").innerHTML = groups.map(g =>
      `<section class="sec" id="sec-${g.key}"><h2><span class="sym sm">${window.symbolSVG(g.key)}</span><span class="d">${esc(g.deva)}</span><span class="t">${esc(g.ta)}</span><span class="e">${esc(g.en)}</span></h2>` +
      `<div class="grid">${items.filter(i => i.group === g.key).map(card).join("")}</div></section>`).join("");
  }

  /* ---------- reader ---------- */
  async function loadDoc(id) {
    if (docs[id]) return docs[id];
    const r = await fetch(`data/${id}.json`);
    if (!r.ok) throw new Error(r.status);
    return (docs[id] = await r.json());
  }
  let flat = []; // names of the current doc, in order
  const nameHTML = (x, i, d) => {
    const pre = d.svara ? "" : (prefs.omEach || (i === 0 && !/^ॐ/.test(x))) ? `<span class="om">${esc(tr("ॐ"))}</span> ` : "";
    return pre + esc(tr(x));
  };
  function renderReader() {
    const d = current; if (!d) return;
    const meta = byId(d.id) || {};
    $("backBtn").textContent = "← " + ((KINDS.find(k => k.k === meta.kind) || {}).ta || "நாமாவளிகள்");
    const sc = prefs.script;
    $("rTitle").textContent = tr(d.title);
    $("rAlt").innerHTML = ["deva", "taml", "gran", "latn"].filter(s => s !== sc).map(s => `<span class="${s}">${esc(tr(d.title, s))}</span>`).join("");
    const src = INDEX.sources[d.source] || {};
    $("rSrc").innerHTML = `${meta.count} நாமங்கள் · மூலம்: ${src.url ? `<a href="${src.url}" target="_blank" rel="noopener">${esc(src.ta)}</a>` : esc(src.ta || "")}`;
    const notes = [];
    if (meta.note) notes.push(meta.note);
    if (d.svara && (sc === "taml" || sc === "latn")) notes.push("ஸ்வரக் குறிகள் தேவநாகரி, க்ரந்தத்தில் மட்டும் காட்டப்படும்.");
    $("rNote").hidden = !notes.length; $("rNote").textContent = notes.join(" · ");
    document.body.classList.toggle("svara", !!d.svara);
    const curI = prefs.cur[d.id];
    let n = 0, h = ""; flat = [];
    for (const b of d.blocks) {
      if (b.t === "head") h += `<div class="blk-head">${esc(tr(b.x))}</div>`;
      else if (b.t === "shloka" || b.t === "para") h += `<div class="blk-${b.t}">${b.x.map(l => `<p>${esc(tr(l))}</p>`).join("")}</div>`;
      else if (b.t === "end") h += `<p class="blk-end">${esc(tr(b.x))}</p>`;
      else if (b.t === "names") h += `<ol class="names">` + b.x.map(x => {
        const i = n++; flat.push(x);
        return `<li data-i="${i}"${curI === i ? ' class="cur"' : ""}><span class="n">${i + 1}</span><span class="x">${nameHTML(x, i, d)}</span></li>`;
      }).join("") + `</ol>`;
    }
    $("rBody").innerHTML = h;
    if (!$("archana").hidden) renderArchana();
  }
  function setCur(i) {
    const id = current.id;
    prefs.cur[id] = i; save();
    $("rBody").querySelectorAll("li.cur").forEach(x => x.classList.remove("cur"));
    const li = $("rBody").querySelector(`li[data-i="${i}"]`); if (li) li.classList.add("cur");
  }

  /* ---------- archana: one name at a time ---------- */
  function renderArchana() {
    const i = Math.min(Math.max(prefs.cur[current.id] ?? 0, 0), flat.length - 1);
    $("aCount").textContent = `${i + 1} / ${flat.length}`;
    $("aTitle").textContent = tr((byId(current.id) || {}).deva || "");
    $("aName").innerHTML = nameHTML(flat[i], prefs.omEach ? i : (i === 0 ? 0 : i), current);
    $("aPrev").disabled = i === 0;
    $("aNext").textContent = i === flat.length - 1 ? "நிறைவு ✓" : "அடுத்து →";
  }
  function archStep(dir) {
    const i = prefs.cur[current.id] ?? 0, j = i + dir;
    if (j >= flat.length) { closeArchana(); return; }
    if (j < 0) return;
    setCur(j); renderArchana();
  }
  function openArchana() {
    if (!flat.length) return;
    if (prefs.cur[current.id] == null) setCur(0);
    $("archana").hidden = false; document.body.classList.add("noscroll"); renderArchana();
  }
  function closeArchana() {
    $("archana").hidden = true; document.body.classList.remove("noscroll");
    const li = $("rBody").querySelector("li.cur"); if (li) li.scrollIntoView({ block: "center" });
  }

  /* ---------- routing ---------- */
  let wake = null;
  async function keepAwake(on) {
    try {
      if (on && "wakeLock" in navigator && !wake) { wake = await navigator.wakeLock.request("screen"); wake.addEventListener("release", () => (wake = null)); }
      else if (!on && wake) { await wake.release(); wake = null; }
    } catch (e) {}
  }
  function show(v) {
    view = v;
    ["home", "kind", "reader", "about"].forEach(x => ($(x).hidden = x !== v));
    $("rtools").hidden = v !== "reader";
    if (v !== "reader" && !$("archana").hidden) closeArchana();
    keepAwake(v === "reader");
  }
  async function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id === "about") { show("about"); window.scrollTo(0, 0); return; }
    if (id.startsWith("k-") && KINDS.some(k => k.k === id.slice(2))) {
      kindKey = id.slice(2); show("kind"); renderKind(); window.scrollTo(0, 0); return;
    }
    if (id && INDEX && byId(id)) {
      try { current = await loadDoc(id); } catch (e) { $("rBody").innerHTML = `<p class="empty">ஏற்ற முடியவில்லை. இணைய இணைப்பைச் சரிபார்க்கவும்.</p>`; }
      prefs.recent = [id, ...prefs.recent.filter(x => x !== id)].slice(0, 6); save();
      kindKey = (byId(id) || {}).kind;
      show("reader"); renderReader(); window.scrollTo(0, 0); return;
    }
    current = null; show("home"); renderHome();
  }

  /* ---------- events ---------- */
  $("scripts").onclick = e => { const b = e.target.closest("button"); if (!b) return; prefs.script = b.dataset.s; save(); applyPrefs(); if (view === "reader") renderReader(); if (view === "home") renderHome(); };
  $("kJump").onclick = e => { const b = e.target.closest("button[data-g]"); if (!b) return; const el = $("sec-" + b.dataset.g); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - $("kJump").offsetHeight - 70, behavior: "smooth" }); };
  $("omBtn").onclick = () => { prefs.omEach = !prefs.omEach; save(); applyPrefs(); renderReader(); };
  $("fsUp").onclick = () => { prefs.fs = Math.min(3.2, +(prefs.fs + 0.15).toFixed(2)); save(); applyPrefs(); };
  $("fsDown").onclick = () => { prefs.fs = Math.max(0.95, +(prefs.fs - 0.15).toFixed(2)); save(); applyPrefs(); };
  $("q").oninput = renderHome;
  $("backBtn").onclick = () => (location.hash = kindKey ? "k-" + kindKey : "");
  document.querySelectorAll("[data-home]").forEach(b => (b.onclick = () => (location.hash = "")));
  $("rBody").onclick = e => {
    const li = e.target.closest("li[data-i]"); if (!li || !current) return;
    const i = +li.dataset.i;
    if (prefs.cur[current.id] === i) { delete prefs.cur[current.id]; save(); li.classList.remove("cur"); } else setCur(i);
  };
  $("archBtn").onclick = openArchana;
  $("aClose").onclick = closeArchana;
  $("aName").onclick = () => archStep(1);
  $("aNext").onclick = () => archStep(1);
  $("aPrev").onclick = () => archStep(-1);
  document.addEventListener("keydown", e => {
    if ($("archana").hidden) return;
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); archStep(1); }
    else if (e.key === "ArrowLeft") archStep(-1);
    else if (e.key === "Escape") closeArchana();
  });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && view === "reader") keepAwake(true); });
  window.addEventListener("hashchange", route);

  let deferred = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; $("installBtn").hidden = false; });
  $("installBtn").onclick = async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $("installBtn").hidden = true; };

  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
  $("ver").textContent = "பதிப்பு " + VERSION;

  applyPrefs();
  fetch("data/index.json").then(r => r.json()).then(j => { INDEX = j; route(); })
    .catch(() => ($("tiles").innerHTML = `<p class="empty">பட்டியலை ஏற்ற முடியவில்லை.</p>`));
})();
