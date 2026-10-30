(function () {
  const T = window.Translit;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const FONT = { deva: "var(--deva)", taml: "var(--tamil)", gran: "var(--gran)", latn: "var(--latn)" };
  const CONV = { deva: s => s, taml: T.tamil, gran: T.grantha, latn: T.iast };
  const VERSION = "2026.10.30";
  const KINDS = [
    { k: "108", deva: "अष्टोत्तरशतनामावलिः", ta: "அஷ்டோத்தரம்", en: "Ashtottaram", sub: { ta: "108 நாமங்கள்", en: "108 names" } },
    { k: "300", deva: "त्रिशतीनामावलिः", ta: "த்ரிஶதீ", en: "Trishati", sub: { ta: "300 நாமங்கள்", en: "300 names" } },
    { k: "1000", deva: "सहस्रनामावलिः", ta: "ஸஹஸ்ரநாமம்", en: "Sahasranamam", sub: { ta: "1000 நாமங்கள்", en: "1000 names" } },
  ];
  const STR = {
    ta: {
      appName: "நாமாவளி", menu: "பட்டியல்", close: "மூடு", home: "முகப்பு", fav: "அடிக்கடி படிப்பவை", namavalis: "நாமாவளிகள்",
      devatas: "தேவதைகள்", settings: "அமைப்பு", about: "இந்த ஆப் பற்றி", aboutThanks: "இந்த ஆப் பற்றி · நன்றி",
      search: "நாமாவளியைத் தேடுக — लक्ष्मी · லக்ஷ்மீ · lakshmi", searchLabel: "தேடல்", install: "ஆப்பாக நிறுவு", all: "எல்லாம் →",
      recent: "சமீபத்தில் படித்தவை", backHome: "← முகப்பு", backNamavalis: "← நாமாவளிகள்",
      favEmpty: 'அடிக்கடி படிக்கும் நாமாவளிகளில் உள்ள <b class="star">☆</b> குறியைத் தொட்டால் அவை இங்கே முதலிலேயே வரும்.',
      favHint: "அடிக்கடி படிக்கும் நாமாவளிகளில் உள்ள ☆ குறியைத் தொட்டால் இங்கே சேரும். ↑ ↓ பொத்தான்களால் வரிசையை மாற்றலாம்.",
      addFav: "அடிக்கடி படிப்பவையில் சேர்", inFav: "அடிக்கடி படிப்பவையில் உள்ளது",
      tapHint: "ஒரு நாமத்தைத் தொட்டால் அது குறிக்கப்படும். பூஜையில் எங்கே இருக்கிறோம் என்று தெரியும்.",
      archana: "அர்ச்சனை", archanaTitle: "அர்ச்சனை — ஒவ்வொரு நாமமாக", omTitle: "ஒவ்வொரு நாமத்துக்கும் ஓம்",
      smaller: "எழுத்து சிறிதாக", larger: "எழுத்து பெரிதாக", prev: "← முன்", next: "அடுத்து →", done: "நிறைவு ✓", tapNext: "பெயரைத் தொட்டால் அடுத்தது",
      names: n => `${n} நாமங்கள்`, nNamavalis: n => `${n} நாமாவளிகள்`, notFound: q => `“${q}” — எதுவும் கிடைக்கவில்லை.`,
      loadFail: "ஏற்ற முடியவில்லை. இணைய இணைப்பைச் சரிபார்க்கவும்.", listFail: "பட்டியலை ஏற்ற முடியவில்லை.",
      svaraNote: "ஸ்வரக் குறிகள் தேவநாகரி, க்ரந்தத்தில் மட்டும் காட்டப்படும்.", version: "பதிப்பு",
      up: "மேலே", down: "கீழே", remove: "நீக்கு",
      setupScript: "நாமாவளியைப் படிக்கும் எழுத்து", setupNote: "இவற்றைப் பிறகு எப்போது வேண்டுமானாலும் மாற்றலாம்: எழுத்தை மேலே உள்ள பொத்தானிலும், மொழியை ☰ பட்டியலிலும்.", start: "தொடங்கு →",
    },
    en: {
      appName: "Namavali", menu: "Menu", close: "Close", home: "Home", fav: "Favourites", namavalis: "Namavalis",
      devatas: "Devatas", settings: "Settings", about: "About this app", aboutThanks: "About · Thanks",
      search: "Search — lakshmi · लक्ष्मी · லக்ஷ்மீ", searchLabel: "Search", install: "Install app", all: "All →",
      recent: "Recently read", backHome: "← Home", backNamavalis: "← Namavalis",
      favEmpty: 'Tap the <b class="star">☆</b> on any namavali you read often and it will appear here first.',
      favHint: "Tap ☆ on a namavali to add it here. Use ↑ ↓ to set the order.",
      addFav: "Add to favourites", inFav: "In favourites",
      tapHint: "Tap a name to mark it, so you keep your place during the puja.",
      archana: "Archana", archanaTitle: "Archana — one name at a time", omTitle: "Om before every name",
      smaller: "Smaller text", larger: "Larger text", prev: "← Back", next: "Next →", done: "Done ✓", tapNext: "Tap the name for the next one",
      names: n => `${n} names`, nNamavalis: n => `${n} namavalis`, notFound: q => `Nothing found for “${q}”.`,
      loadFail: "Could not load. Check your internet connection.", listFail: "Could not load the list.",
      svaraNote: "Svara marks are shown only in Devanagari and Grantha.", version: "Version",
      up: "Move up", down: "Move down", remove: "Remove",
      setupScript: "Read namavalis in", setupNote: "You can change both later: the script from the switch at the top, the language from the ☰ menu.", start: "Start →",
    },
  };
  const NOTE_EN = { "கணேச புராணம்": "Ganesha Purana", "ஸ்காந்தம்": "Skanda Purana", "ஸ்வரத்துடன்": "with svaras", "216 நாமங்கள்": "216 names",
    "க்ஷேத்ர நாமங்கள்": "sacred places", "பத்ம புராணம்": "Padma Purana", "ராம ரஹஸ்யம்": "Rama Rahasya", "100 நாமங்கள்": "100 names",
    "பாடம் 2": "version 2", "வராஹ புராணம்": "Varaha Purana", "27 நாமங்கள்": "27 names", "ஆனந்த ராமாயணம்": "Ananda Ramayana",
    "மஹாபாரதம்": "Mahabharata", "மஹாபாகவதம்": "Mahabhagavata" };
  const MANGALA = ["शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् ।", "प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥"];

  let prefs = { script: "taml", omEach: false, fs: 1.45, kind: "", cur: {}, recent: [], fav: [] };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem("nv-prefs") || "{}")); } catch (e) {}
  if (!Array.isArray(prefs.recent)) prefs.recent = [];
  if (!Array.isArray(prefs.fav)) prefs.fav = [];
  const save = () => { try { localStorage.setItem("nv-prefs", JSON.stringify(prefs)); } catch (e) {} };

  let INDEX = null, current = null, view = "home", groupKey = null;
  const docs = {};
  const tr = (s, sc = prefs.script) => {
    const out = CONV[sc](s);
    return sc === "deva" || sc === "gran" ? out : T.stripSvara(out);
  };
  const L = () => (prefs.lang === "en" ? "en" : "ta");
  const t = (k, ...a) => { const v = STR[L()][k]; return typeof v === "function" ? v(...a) : v; };
  const kindLabel = k => { const K = KINDS.find(x => x.k === k); return K ? K[L()] : ""; };
  const gName = g => (L() === "en" ? g.en : g.ta);
  const gShort = g => (L() === "en" ? g.en : g.ta.split(",")[0]);
  const noteL = n => (n && L() === "en" ? NOTE_EN[n] || n : n);
  function applyLang() {
    const l = L();
    document.documentElement.lang = l;
    document.body.classList.toggle("en", l === "en");
    document.querySelectorAll("[data-t]").forEach(e => { const v = t(e.dataset.t); if (typeof v === "string") e.innerHTML = v; });
    document.querySelectorAll("[data-tp]").forEach(e => (e.placeholder = t(e.dataset.tp)));
    document.querySelectorAll("[data-tt]").forEach(e => (e.title = t(e.dataset.tt)));
    document.querySelectorAll("[data-ta]").forEach(e => e.setAttribute("aria-label", t(e.dataset.ta)));
    document.querySelectorAll("#langSeg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.l === l));
    $("fsDown").textContent = l === "en" ? "A−" : "அ−"; $("fsUp").textContent = l === "en" ? "A+" : "அ+";
    $("ver").textContent = t("version") + " " + VERSION;
  }
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
  const isFav = id => prefs.fav.includes(id);
  const star = id => `<button class="cstar" data-fav="${id}" aria-pressed="${isFav(id)}" title="${t("fav")}">${isFav(id) ? "★" : "☆"}</button>`;
  const card = it =>
    `<a class="card" href="#${it.id}">${star(it.id)}${four(it.deva, it.en)}<span class="meta">` +
    `<span class="pill k">${it.count} · ${kindLabel(it.kind)}</span>` +
    (it.note ? `<span class="pill">${esc(noteL(it.note))}</span>` : "") + `</span></a>`;

  /* ---------- home ---------- */
  function renderHome() {
    if (!INDEX) return;
    $("mangala").innerHTML = MANGALA.map(l => `<span>${esc(tr(l))}</span>`).join("");
    const raw = $("q").value.trim();
    $("tilesBox").hidden = !!raw; $("results").hidden = !raw;
    const favs = prefs.fav.map(byId).filter(Boolean);
    $("favBox").hidden = !!raw;
    $("favMore").hidden = favs.length <= 6;
    $("favHome").innerHTML = favs.length
      ? `<div class="grid">${favs.slice(0, 6).map(card).join("")}</div>`
      : `<p class="hint favempty">${t("favEmpty")}</p>`;
    const rec = prefs.recent.map(byId).filter(Boolean);
    $("recentBox").hidden = !!raw || !rec.length;
    $("recent").innerHTML = rec.map(it => `<a class="chip" href="#${it.id}"><span class="d">${esc(it.deva)}</span><span class="t">${esc(L() === "en" ? it.en : T.tamil(it.deva))}</span><span class="pill">${it.count}</span></a>`).join("");
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
        ? `<h2 class="lbl">${t("nNamavalis", found.length)}</h2><div class="grid">${found.map(card).join("")}</div>`
        : `<p class="empty">${esc(t("notFound", raw))}</p>`;
      return;
    }
    $("tiles").innerHTML = KINDS.map(K => {
      const items = INDEX.items.filter(i => i.kind === K.k);
      const gs = INDEX.groups.filter(g => items.some(i => i.group === g.key)).map(gShort);
      return `<a class="ktile" href="#k-${K.k}"><span class="sym num">${K.k}</span><span class="kt">` +
        `<span class="d">${esc(K.deva)}</span><span class="t">${esc(K[L()])}</span><span class="e">${esc(K.sub[L()])}</span>` +
        `<span class="n">${t("nNamavalis", items.length)} · ${esc(gs.slice(0, 5).join(", "))}${gs.length > 5 ? "…" : ""}</span></span></a>`;
    }).join("");
  }

  /* ---------- one kind (108 / 300 / 1000), grouped by deity ---------- */
  let kindKey = null;
  function renderKind() {
    const K = KINDS.find(x => x.k === kindKey); if (!K) return;
    $("kNum").textContent = K.k;
    $("kDeva").textContent = K.deva;
    $("kAlt").innerHTML = `<span>${esc(K[L()])} · ${esc(K.sub[L()])}</span><span class="gran">${esc(T.grantha(K.deva))}</span>`;
    const items = INDEX.items.filter(i => i.kind === K.k);
    const groups = INDEX.groups.filter(g => items.some(i => i.group === g.key));
    $("kJump").hidden = groups.length < 3;
    $("kJump").innerHTML = groups.map(g => `<button class="chip" data-g="${g.key}"><span class="d">${esc(g.deva)}</span><span class="t">${esc(gShort(g))}</span></button>`).join("");
    $("klist").innerHTML = groups.map(g =>
      `<section class="sec" id="sec-${g.key}"><h2><span class="sym sm">${window.symbolSVG(g.key)}</span><span class="d">${esc(g.deva)}</span><span class="t">${esc(gName(g))}</span></h2>` +
      `<div class="grid">${items.filter(i => i.group === g.key).map(card).join("")}</div></section>`).join("");
  }

  /* ---------- one deity, all its namavalis (108 / 300 / 1000) ---------- */
  function renderGroup() {
    const g = INDEX.groups.find(x => x.key === groupKey); if (!g) return;
    $("gSym").innerHTML = window.symbolSVG(g.key);
    $("gDeva").textContent = g.deva;
    $("gAlt").innerHTML = `<span>${esc(gName(g))}</span><span class="gran">${esc(T.grantha(g.deva))}</span>`;
    const items = INDEX.items.filter(i => i.group === g.key);
    $("glist").innerHTML = KINDS.filter(K => items.some(i => i.kind === K.k)).map(K =>
      `<section class="sec"><h2><span class="sym sm num">${K.k}</span><span class="d">${esc(K.deva)}</span><span class="t">${esc(K[L()])}</span></h2>` +
      `<div class="grid">${items.filter(i => i.kind === K.k).map(card).join("")}</div></section>`).join("");
  }

  /* ---------- favourites ---------- */
  function toggleFav(id) {
    prefs.fav = isFav(id) ? prefs.fav.filter(x => x !== id) : [...prefs.fav, id];
    save(); refreshStars();
  }
  function moveFav(id, dir) {
    const i = prefs.fav.indexOf(id), j = i + dir;
    if (i < 0 || j < 0 || j >= prefs.fav.length) return;
    [prefs.fav[i], prefs.fav[j]] = [prefs.fav[j], prefs.fav[i]]; save(); renderFav();
  }
  function refreshStars() {
    document.querySelectorAll("[data-fav]").forEach(b => { const on = isFav(b.dataset.fav); b.setAttribute("aria-pressed", on); b.textContent = on ? "★" : "☆"; });
    if (current) { const on = isFav(current.id); $("rFav").setAttribute("aria-pressed", on); $("rFav").querySelector(".star").textContent = on ? "★" : "☆"; $("rFav").querySelector(".fl").textContent = on ? t("inFav") : t("addFav"); }
    $("dFavN").textContent = prefs.fav.length || "";
    if (view === "fav") renderFav();
    if (view === "home") renderHome();
  }
  function renderFav() {
    const favs = prefs.fav.map(byId).filter(Boolean);
    $("favHint").hidden = !!favs.length && false;
    $("favList").innerHTML = favs.map((it, i) =>
      `<li><a class="card" href="#${it.id}">${four(it.deva, it.en)}<span class="meta"><span class="pill k">${it.count} · ${kindLabel(it.kind)}</span>${it.note ? `<span class="pill">${esc(noteL(it.note))}</span>` : ""}</span></a>` +
      `<span class="ord"><button class="icon" data-up="${it.id}" ${i === 0 ? "disabled" : ""} aria-label="${t("up")}">↑</button><button class="icon" data-down="${it.id}" ${i === favs.length - 1 ? "disabled" : ""} aria-label="${t("down")}">↓</button><button class="icon" data-fav="${it.id}" aria-pressed="true" title="${t("remove")}">★</button></span></li>`).join("");
  }

  /* ---------- side menu ---------- */
  function renderDrawer() {
    $("dKinds").innerHTML = KINDS.map(K => `<a class="dl" href="#k-${K.k}"><span class="sym xs num">${K.k}</span><span><span class="dd">${esc(K.deva)}</span><span class="dt">${esc(K[L()])}</span></span></a>`).join("");
    $("dGroups").innerHTML = INDEX.groups.map(g => `<a class="dl" href="#g-${g.key}"><span class="sym xs">${window.symbolSVG(g.key)}</span><span><span class="dd">${esc(g.deva)}</span><span class="dt">${esc(gName(g))}</span></span><span class="dn">${INDEX.items.filter(i => i.group === g.key).length}</span></a>`).join("");
  }
  function markDrawer() {
    const h = location.hash || "#";
    document.querySelectorAll("#drawer a.dl").forEach(a => a.classList.toggle("on", a.getAttribute("href") === h));
  }
  function drawer(open) {
    $("drawer").classList.toggle("open", open); $("scrim").hidden = !open;
    $("drawer").setAttribute("aria-hidden", !open); $("menuBtn").setAttribute("aria-expanded", open);
    document.body.classList.toggle("noscroll", open);
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
    $("backBtn").textContent = "← " + (kindLabel(meta.kind) || t("namavalis"));
    const sc = prefs.script;
    $("rTitle").textContent = tr(d.title);
    $("rAlt").innerHTML = ["deva", "taml", "gran", "latn"].filter(s => s !== sc).map(s => `<span class="${s}">${esc(tr(d.title, s))}</span>`).join("");
    const notes = [t("names", meta.count)];
    if (meta.note && !/நாமங்கள்$/.test(meta.note)) notes.push(noteL(meta.note));
    if (d.svara && (sc === "taml" || sc === "latn")) notes.push(t("svaraNote"));
    $("rNote").hidden = false; $("rNote").textContent = notes.join(" · ");
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
    $("aNext").textContent = i === flat.length - 1 ? t("done") : t("next");
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
    ["home", "kind", "group", "fav", "reader", "about"].forEach(x => ($(x).hidden = x !== v));
    $("rtools").hidden = v !== "reader";
    if (v !== "reader" && !$("archana").hidden) closeArchana();
    keepAwake(v === "reader");
  }
  async function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id === "about") { show("about"); window.scrollTo(0, 0); return; }
    if (id === "fav") { show("fav"); renderFav(); window.scrollTo(0, 0); return; }
    markDrawer();
    if (id.startsWith("g-") && INDEX.groups.some(g => g.key === id.slice(2))) {
      groupKey = id.slice(2); show("group"); renderGroup(); window.scrollTo(0, 0); return;
    }
    if (id.startsWith("k-") && KINDS.some(k => k.k === id.slice(2))) {
      kindKey = id.slice(2); show("kind"); renderKind(); window.scrollTo(0, 0); return;
    }
    if (id && INDEX && byId(id)) {
      try { current = await loadDoc(id); } catch (e) { $("rBody").innerHTML = `<p class="empty">${t("loadFail")}</p>`; }
      prefs.recent = [id, ...prefs.recent.filter(x => x !== id)].slice(0, 6); save();
      kindKey = (byId(id) || {}).kind;
      show("reader"); renderReader(); refreshStars(); window.scrollTo(0, 0); return;
    }
    current = null; show("home"); renderHome();
  }

  /* ---------- language & first-run setup ---------- */
  function rerenderAll() {
    applyLang(); if (!INDEX) return;
    renderDrawer(); $("dFavN").textContent = prefs.fav.length || "";
    if (view === "home") renderHome(); else if (view === "kind") renderKind(); else if (view === "group") renderGroup();
    else if (view === "fav") renderFav(); else if (view === "reader") { renderReader(); refreshStars(); }
  }
  function setLang(l) { prefs.lang = l; save(); rerenderAll(); }
  function paintSetup() {
    const l = L();
    document.querySelectorAll("#setupLang button").forEach(b => b.setAttribute("aria-pressed", b.dataset.l === prefs.lang));
    document.querySelectorAll("#setupScript button").forEach(b => b.setAttribute("aria-pressed", b.dataset.s === prefs.script));
    $("setupScriptLbl").textContent = t("setupScript");
    $("setupNote").textContent = t("setupNote");
    $("setupGo").textContent = t("start");
    $("setupGo").disabled = !prefs.lang;
  }
  function openSetup() { $("setup").hidden = false; document.body.classList.add("noscroll"); paintSetup(); }
  $("setupLang").onclick = e => { const b = e.target.closest("button"); if (!b) return; prefs.lang = b.dataset.l; if (!prefs.scriptChosen) prefs.script = b.dataset.l === "en" ? "latn" : "taml"; applyPrefs(); applyLang(); paintSetup(); };
  $("setupScript").onclick = e => { const b = e.target.closest("button"); if (!b) return; prefs.script = b.dataset.s; prefs.scriptChosen = true; applyPrefs(); paintSetup(); };
  $("setupGo").onclick = () => { if (!prefs.lang) return; prefs.setupDone = true; save(); $("setup").hidden = true; document.body.classList.remove("noscroll"); rerenderAll(); };
  $("langSeg").onclick = e => { const b = e.target.closest("button"); if (b) setLang(b.dataset.l); };

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
  $("rFav").onclick = () => current && toggleFav(current.id);
  document.addEventListener("click", e => {
    const f = e.target.closest("[data-fav]"), u = e.target.closest("[data-up]"), d = e.target.closest("[data-down]");
    if (f) { e.preventDefault(); e.stopPropagation(); toggleFav(f.dataset.fav); }
    else if (u) { e.preventDefault(); moveFav(u.dataset.up, -1); }
    else if (d) { e.preventDefault(); moveFav(d.dataset.down, 1); }
  }, true);
  $("menuBtn").onclick = () => drawer(true);
  $("drawerClose").onclick = () => drawer(false);
  $("scrim").onclick = () => drawer(false);
  $("drawer").onclick = e => { if (e.target.closest("a")) drawer(false); };
  $("aClose").onclick = closeArchana;
  $("aName").onclick = () => archStep(1);
  $("aNext").onclick = () => archStep(1);
  $("aPrev").onclick = () => archStep(-1);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && $("drawer").classList.contains("open")) { drawer(false); return; }
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

  applyPrefs(); applyLang();
  if (!prefs.setupDone) openSetup();
  fetch("data/index.json").then(r => r.json()).then(j => { INDEX = j; renderDrawer(); $("dFavN").textContent = prefs.fav.length || ""; route(); })
    .catch(() => ($("tiles").innerHTML = `<p class="empty">${t("listFail")}</p>`));
})();
