(function () {
  const T = window.Translit;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const FONT = { deva: "var(--deva)", taml: "var(--tamil)", gran: "var(--gran)", latn: "var(--latn)" };
  const CONV = { deva: s => s, taml: T.tamil, gran: T.grantha, latn: T.iast };
  const VERSION = "2026.10.31r";
  const KINDS = [
    { k: "108", deva: "अष्टोत्तरशतनामावलिः", ta: "அஷ்டோத்தரம்", en: "Ashtottaram", sub: { ta: "108 நாமங்கள்", en: "108 names" } },
    { k: "300", deva: "त्रिशतीनामावलिः", ta: "த்ரிஶதீ", en: "Trishati", sub: { ta: "300 நாமங்கள்", en: "300 names" } },
    { k: "1000", deva: "सहस्रनामावलिः", ta: "ஸஹஸ்ரநாமம்", en: "Sahasranamam", sub: { ta: "1000 நாமங்கள்", en: "1000 names" } },
    { k: "small", n: "24", deva: "लघुनामावलयः", ta: "சிறு நாமாவளிகள்", en: "Short namavalis", sub: { ta: "12, 16, 21, 24 நாமங்கள் — நேரம் குறைவானபோது", en: "12, 16, 21, 24 names — when time is short" } },
  ];
  const STR = {
    ta: {
      vidhana: "விதான பூஜை", suktaOn: n => n, glossTitle: "தமிழ் பெயர்", today: "இன்று", upcoming: "வரும் நாட்கள்", pujas: "பூஜை · வ்ரதம்", tagline: "பூஜை · வ்ரதம் · அர்ச்சனை", archanaH: "அர்ச்சனை · நாமாவளிகள்", backToPuja: t => `← ${t} பூஜைக்குத் திரும்பு`,
      openNamavali: "நாமாவளியைத் திற", steps: "படிகள்", nParts: n => `${n} படிகள்`,
      appName: "பூஜாநிதி", menu: "பட்டியல்", close: "மூடு", home: "முகப்பு", fav: "அடிக்கடி படிப்பவை", namavalis: "நாமாவளிகள்",
      devatas: "தேவதைகள்", settings: "அமைப்பு", thAuto: "தானாக", thLight: "பகல்", thDark: "இரவு", about: "இந்த ஆப் பற்றி", aboutThanks: "இந்த ஆப் பற்றி · நன்றி",
      search: "நாமாவளியைத் தேடுக — लक्ष्मी · லக்ஷ்மீ · lakshmi", searchLabel: "தேடல்", install: "ஆப்பாக நிறுவு", all: "எல்லாம் →",
      recent: "சமீபத்தில் படித்தவை", backHome: "← முகப்பு", backNamavalis: "← நாமாவளிகள்",
      favEmpty: 'அடிக்கடி படிக்கும் நாமாவளிகளில் உள்ள <b class="star">☆</b> குறியைத் தொட்டால் அவை இங்கே முதலிலேயே வரும்.',
      favHint: "அடிக்கடி படிக்கும் நாமாவளிகளில் உள்ள ☆ குறியைத் தொட்டால் இங்கே சேரும். ↑ ↓ பொத்தான்களால் வரிசையை மாற்றலாம்.",
      addFav: "அடிக்கடி படிப்பவையில் சேர்", inFav: "அடிக்கடி படிப்பவையில் உள்ளது",
      tapHint: "ஒரு நாமத்தைத் தொட்டால் அது குறிக்கப்படும். பூஜையில் எங்கே இருக்கிறோம் என்று தெரியும். அழுத்திப் பிடித்தால் வண்ணக் குறியிடலாம், குறிப்பு எழுதலாம்.",
      archana: "அர்ச்சனை", archanaTitle: "அர்ச்சனை — ஒவ்வொரு நாமமாக", omTitle: "ஒவ்வொரு நாமத்துக்கும் ஓம்",
      smaller: "எழுத்து சிறிதாக", larger: "எழுத்து பெரிதாக", prev: "← முன்", next: "அடுத்து →", done: "நிறைவு ✓", tapNext: "பெயரைத் தொட்டால் அடுத்தது",
      nVar: n => `${n} பாடங்கள்`, paatha: "பாடம்", myMarks: "என் குறிப்புகள்", markT: "குறி · குறிப்பு", notePh: "உங்கள் குறிப்பு (உங்கள் ஃபோனில் மட்டும்)", save: "சேமி", clearMark: "குறியை நீக்கு", noMarks: "இன்னும் குறிப்பு இல்லை. ஸ்தோத்ரம், நாமாவளி அல்லது பூஜையில் ஒரு ஶ்லோகத்தை அழுத்திப் பிடித்தால் வண்ணக் குறியிடலாம், குறிப்பு எழுதலாம்.", markHint: "ஒரு ஶ்லோகத்தையோ நாமத்தையோ அழுத்திப் பிடித்தால் வண்ணக் குறியிடலாம், குறிப்பு எழுதலாம்.", backup: "பின்னெடுப்பு", backupSave: "கோப்பாகச் சேமி", backupLoad: "கோப்பிலிருந்து மீட்டெடு", backupDone: "மீட்டெடுக்கப்பட்டது ✓", backupBad: "இந்தக் கோப்பைப் படிக்க முடியவில்லை", backupNote: "அடிக்கடி படிப்பவை, என் பட்டியல்கள், குறிப்புகள் இந்த ஃபோனில் மட்டுமே இருக்கும். ஃபோன் மாற்றும் முன் கோப்பாகச் சேமித்து, புதிய ஃபோனில் மீட்டெடுக்கலாம்.", myLists: "என் பட்டியல்கள்", toList: "பட்டியலில் சேர்", addToList: "பட்டியலில் சேர்", listName: "புதிய பட்டியலின் பெயர் — உதா: காலை பாராயணம்", create: "உருவாக்கு", done: "முடிந்தது", startPara: "▶ பாராயணம் தொடங்கு", rename: "பெயர் மாற்று", delList: "பட்டியலை நீக்கு", backLists: "← என் பட்டியல்கள்", listsHint: "தினமும் படிப்பவற்றைப் பெயரிட்ட பட்டியல்களாக வைத்துக்கொள்ளலாம். எந்த ஸ்தோத்ரம், நாமாவளி, பூஜைப் பக்கத்திலும் உள்ள ＋ பட்டியலில் சேர் பொத்தானைத் தொடுங்கள்.", listHint: "⠿ குறியைப் பிடித்து இழுத்தோ ↑ ↓ தொட்டோ வரிசையை மாற்றலாம்.", noLists: "இன்னும் பட்டியல் இல்லை. மேலே பெயர் கொடுத்து உருவாக்குங்கள்.", emptyList: "இந்தப் பட்டியல் காலியாக உள்ளது. ஸ்தோத்ர/நாமாவளி பக்கங்களில் ＋ பட்டியலில் சேர் தொடுங்கள்.", nItems: n => `${n} பகுதிகள்`, paraOf: (i, n, name) => `பாராயணம் · ${name} · ${i}/${n}`, nextIs: x => `அடுத்தது: ${x}`, lastOne: "இது கடைசி — ✓ முடிக்கவும்", confirmDel: "நிச்சயமாக நீக்கவா? மீண்டும் தொடுங்கள்", newName: "புதிய பெயர்", stotras: "ஸ்தோத்ரங்கள்", toNama: "நாமாவளி", toSto: "ஸ்தோத்ரம்", nVerses: n => `${n} ஶ்லோகங்கள்`, mNama: "நாமாவளி", mStotra: "ஸ்தோத்ரம்", veda: "வேத மந்த்ரங்கள்", yajur: "க்ருஷ்ண யஜுர்வேதம்", sama: "ஸாமவேதம்",
      names: n => `${n} நாமங்கள்`, nNamavalis: n => `${n} நாமாவளிகள்`, notFound: q => `“${q}” — எதுவும் கிடைக்கவில்லை.`,
      loadFail: "ஏற்ற முடியவில்லை. இணைய இணைப்பைச் சரிபார்க்கவும்.", listFail: "பட்டியலை ஏற்ற முடியவில்லை.",
      svaraNote: "ஸ்வரக் குறிகள் தேவநாகரி, க்ரந்தத்தில் மட்டும் காட்டப்படும்.", version: "பதிப்பு",
      up: "மேலே", down: "கீழே", remove: "நீக்கு",
      setupScript: "நாமாவளியைப் படிக்கும் எழுத்து", setupNote: "இவற்றைப் பிறகு எப்போது வேண்டுமானாலும் மாற்றலாம்: எழுத்தை மேலே உள்ள பொத்தானிலும், மொழியை ☰ பட்டியலிலும்.", start: "தொடங்கு →",
    },
    en: {
      vidhana: "Vidhana puja", suktaOn: n => n, glossTitle: "Name", today: "Today", upcoming: "Coming up", pujas: "Puja · Vrata", tagline: "Puja · Vrata · Archana", archanaH: "Archana · Namavalis", backToPuja: t => `← Back to ${t}`,
      openNamavali: "Open namavali", steps: "Steps", nParts: n => `${n} steps`,
      appName: "Pujanidhi", menu: "Menu", close: "Close", home: "Home", fav: "Favourites", namavalis: "Namavalis",
      devatas: "Devatas", settings: "Settings", thAuto: "Auto", thLight: "Light", thDark: "Dark", about: "About this app", aboutThanks: "About · Thanks",
      search: "Search — lakshmi · लक्ष्मी · லக்ஷ்மீ", searchLabel: "Search", install: "Install app", all: "All →",
      recent: "Recently read", backHome: "← Home", backNamavalis: "← Namavalis",
      favEmpty: 'Tap the <b class="star">☆</b> on any namavali you read often and it will appear here first.',
      favHint: "Tap ☆ on a namavali to add it here. Use ↑ ↓ to set the order.",
      addFav: "Add to favourites", inFav: "In favourites",
      tapHint: "Tap a name to mark it, so you keep your place during the puja. Press and hold to highlight or add a note.",
      archana: "Archana", archanaTitle: "Archana — one name at a time", omTitle: "Om before every name",
      smaller: "Smaller text", larger: "Larger text", prev: "← Back", next: "Next →", done: "Done ✓", tapNext: "Tap the name for the next one",
      nVar: n => `${n} versions`, paatha: "Version", myMarks: "My notes", markT: "Highlight · note", notePh: "Your note (kept only on this phone)", save: "Save", clearMark: "Remove", noMarks: "No notes yet. Press and hold a verse or name in any stotra, namavali or puja to highlight it or add a note.", markHint: "Press and hold a verse or name to highlight it or add a note.", backup: "Backup", backupSave: "Save to a file", backupLoad: "Restore from a file", backupDone: "Restored ✓", backupBad: "Could not read this file", backupNote: "Favourites, lists and notes live only on this phone. Save them to a file before changing phones and restore them on the new one.", myLists: "My lists", toList: "Add to list", addToList: "Add to a list", listName: "New list name — e.g. Morning parayana", create: "Create", done: "Done", startPara: "▶ Start parayana", rename: "Rename", delList: "Delete list", backLists: "← My lists", listsHint: "Keep what you read daily as named lists. Tap ＋ Add to list on any stotra, namavali or puja page.", listHint: "Drag ⠿ or use ↑ ↓ to set the order.", noLists: "No lists yet. Give a name above and create one.", emptyList: "This list is empty. Tap ＋ Add to list on a stotra or namavali page.", nItems: n => `${n} items`, paraOf: (i, n, name) => `Parayana · ${name} · ${i}/${n}`, nextIs: x => `Next: ${x}`, lastOne: "Last one — tap ✓ to finish", confirmDel: "Tap again to delete", newName: "New name", stotras: "Stotras", toNama: "Nāmāvalī", toSto: "Stotram", nVerses: n => `${n} verses`, mNama: "Nāmāvalī", mStotra: "Stotram", veda: "Veda mantras", yajur: "Krishna Yajurveda", sama: "Samaveda",
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
    "மஹாபாரதம்": "Mahabharata", "மஹாபாகவதம்": "Mahabhagavata", "ப்ரஸித்த பாடம்": "common version", "லிங்க புராணம்": "Linga Purana", "ருத்ரயாமளம்": "Rudrayamala", "ஸுப்ரஹ்மண்ய ஶாஸ்த்ரிகள்": "by Subrahmanya Shastri", "10 நாமங்கள்": "10 names", "8 நாமங்கள்": "8 names", "மஹாஸிம்ஹாதி": "Mahāsiṃhādi", "புஷ்கராக்ஷாதி": "Puṣkarākṣādi", "த்ரிபுரா ரஹஸ்யம்": "Tripura Rahasya", "1. ஈஶான முகம்": "1. Īśāna face", "2. தத்புருஷ முகம்": "2. Tatpuruṣa face", "3. அகோர முகம்": "3. Aghora face", "4. வாமதேவ முகம்": "4. Vāmadeva face", "5. ஸத்யோஜாத முகம்": "5. Sadyojāta face", "6. அதோ முகம்": "6. Adhomukha face", "நித்யகர்ம ப்ரயோகமாலா": "Nityakarma Prayogamala", "மார்க்கண்டேய புராணம் · ஶாந்தி செய்தது": "Markandeya Purana · by Shanti", "மார்க்கண்டேய புராணம் · ருசி செய்தது": "Markandeya Purana · by Ruci", "ஶ்ரீஶங்கரபகவத்பாதர்களுடைய பாஷ்யத்தை அனுசரித்த பாடம்": "the reading followed in Śrī Śaṅkara Bhagavatpāda’s bhāṣya" };
  const GURU_SHLOKA = ["कामाक्षीकरुणारूपं कामकोटिजगद्गुरुम् ।", "चिन्मूर्तिं कलये चित्ते शङ्कराचार्यमव्ययम् ॥"];
  const MANGALA = ["शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् ।", "प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥"];

  let prefs = { theme: "auto", script: "taml", omEach: false, fs: 1.45, kind: "", cur: {}, recent: [], fav: [] };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem("nv-prefs") || "{}")); } catch (e) {}
  if (!Array.isArray(prefs.recent)) prefs.recent = [];
  if (!Array.isArray(prefs.fav)) prefs.fav = [];
  if (!Array.isArray(prefs.lists)) prefs.lists = [];
  if (!prefs.marks || typeof prefs.marks !== "object") prefs.marks = {};
  if (prefs.sukta === true) { prefs.suktaOn = { "purusha-sukta-vidhana": true }; delete prefs.sukta; }
  const save = () => { try { localStorage.setItem("nv-prefs", JSON.stringify(prefs)); } catch (e) {} };

  let GLOSS = {}, DAYS = null, INDEX = null, PUJAS = [], STOTRAS = [], stoDoc = null, current = null, view = "home", groupKey = null, pujaDoc = null;
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

  // Grantha: browsers break lines anywhere inside Grantha words; wrap each word so lines break only at spaces
  const GRAN_RE = /[\u{11300}-\u{1137F}]/u;
  let granObs = null;
  function granWrap(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.parentNode && !n.parentNode.closest(".nw,input,textarea,script,style") && GRAN_RE.test(n.data)) ? 1 : 2 });
    const list = []; while (w.nextNode()) list.push(w.currentNode);
    list.forEach(n => {
      const f = document.createDocumentFragment();
      n.data.replace(/[ \t]+(?=[।॥|])/g, "\u00a0").split(/([ \t\n\r]+)/).forEach(p => { if (!p) return; if (/^[ \t\n\r]+$/.test(p) || !GRAN_RE.test(p)) f.append(p); else { const s = document.createElement("span"); s.className = "nw"; s.textContent = p; f.append(s); } });
      n.replaceWith(f);
    });
  }
  function granWatch() {
    if (prefs.script === "gran") {
      granWrap(document.body);
      if (!granObs) { granObs = new MutationObserver(ms => { granObs.disconnect(); ms.forEach(m => m.addedNodes.forEach(x => granWrap(x.nodeType === 1 ? x : x.parentNode || document.body))); granObs.observe(document.body, { childList: true, subtree: true, characterData: true }); }); }
      granObs.observe(document.body, { childList: true, subtree: true, characterData: true });
    } else if (granObs) { granObs.disconnect(); }
  }
  function applyPrefs() {
    const r = document.documentElement.style;
    r.setProperty("--script", FONT[prefs.script]);
    document.documentElement.dataset.script = prefs.script;
    granWatch();
    if (prefs.theme === "light" || prefs.theme === "dark") document.documentElement.dataset.theme = prefs.theme; else delete document.documentElement.dataset.theme;
    document.querySelectorAll("#themeSeg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.th === (prefs.theme || "auto")));
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
  const variants = it => INDEX.items.filter(x => x.vg === it.vg);
  const prim = items => items.filter(i => i.vg === i.id);
  const card = it => {
    const vs = variants(it), many = vs.length > 1;
    return `<a class="card" href="#${it.id}">${star(it.id)}${four(it.deva, it.en)}<span class="meta">` +
      `<span class="pill k">${it.count} · ${kindLabel(it.kind)}</span>` +
      (many ? `<span class="pill">${esc(t("nVar", vs.length))}: ${vs.map(v => esc(noteL(v.note))).join(" · ")}</span>`
            : it.note ? `<span class="pill">${esc(noteL(it.note))}</span>` : "") + `</span></a>`;
  };

  const VEDAS = ["yajur", "sama"];
  const pujaName = p => (L() === "en" ? p.en : p.ta);
  const pujaCard = p =>
    `<a class="card pcard" href="#p-${p.id}">${star("p-" + p.id)}<span class="sym sm">${window.symbolSVG(p.deity)}</span>` +
    `<span class="d">${esc(p.title)}</span><span class="t">${esc(pujaName(p))}</span>` +
    `<span class="e">${esc(L() === "en" ? p.when_en : p.when_ta)}</span></a>`;
  const favOk = id => id.startsWith("s-") ? STOTRAS.some(x => "s-" + x.id === id) : id.startsWith("p-") ? PUJAS.some(p => "p-" + p.id === id) : !!byId(id);
  const stoCard = x => `<a class="card pcard" href="#s-${x.id}">${star("s-" + x.id)}<span class="sym sm">${window.symbolSVG(x.group)}</span>` +
    `<span class="d">${esc(x.title)}</span><span class="t">${esc(L() === "en" ? x.en : x.ta)}</span><span class="e">${esc(t("toSto"))}</span></a>`;
  const favCard = id => id.startsWith("s-") ? ((x => x ? stoCard(x) : "")(STOTRAS.find(x => "s-" + x.id === id))) : (id.startsWith("p-") ? (PUJAS.find(p => "p-" + p.id === id) ? pujaCard(PUJAS.find(p => "p-" + p.id === id)) : "") : (byId(id) ? card(byId(id)) : ""));

  function renderToday(raw) {
    const box = $("todayBox");
    if (!DAYS || raw) { box.hidden = true; return; }
    const now = new Date(), wd = DAYS.weekdays[now.getDay()];
    const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const today = iso(now), in7 = iso(new Date(now.getTime() + 7 * 864e5));
    const todays = (DAYS.dates || []).filter(x => x.date === today);
    const soon = (DAYS.dates || []).filter(x => x.date > today && x.date <= in7);
    const linkFor = id => { if (id.startsWith("p-")) { const p = PUJAS.find(q => "p-" + q.id === id); return p ? `<a class="chip" href="#${id}"><span class="d">${esc(p.title)}</span><span class="t">${esc(pujaName(p))}</span></a>` : ""; }
      const it = byId(id); return it ? `<a class="chip" href="#${id}"><span class="d">${esc(it.deva)}</span><span class="t">${esc(L() === "en" ? it.en : T.tamil(it.deva))}</span><span class="pill">${it.count}</span></a>` : ""; };
    const dateLbl = d => new Date(d + "T00:00").toLocaleDateString(L() === "en" ? "en-IN" : "ta-IN", { day: "numeric", month: "short", weekday: "short" });
    box.innerHTML = `<div class="tcard"><span class="sym">${window.symbolSVG(wd.deity)}</span><div class="tc"><div class="lbl2">${t("today")} · ${esc(L() === "en" ? wd.en : wd.ta)}</div>` +
      todays.map(x => `<div class="fest">${esc(L() === "en" ? x.en : x.ta)}</div>`).join("") +
      `<div class="tshl">${wd.shloka.map(l => `<p>${esc(tr(l))}</p>`).join("")}</div>` +
      `<div class="chips wrap2">${[...todays.flatMap(x => x.links || []), ...wd.links].map(linkFor).join("")}</div></div></div>` +
      (soon.length ? `<div class="soon"><div class="lbl2">${t("upcoming")}</div>${soon.map(x => `<a class="srow" ${x.links && x.links[0] ? `href="#${x.links[0]}"` : ""}><span class="sd">${esc(dateLbl(x.date))}</span><span>${esc(L() === "en" ? x.en : x.ta)}</span></a>`).join("")}</div>` : "");
    box.hidden = false;
  }

  /* ---------- search: namavalis, stotras, pujas and veda pages, typed in any script ---------- */
  // Tamil typed loosely: ச/ஸ/ஶ/ஷ/ஜ, ந/ன/ண, ல/ள/ழ, ர/ற, long/short vowels, aspiration marks
  const tl = x => (x || "").replace(/[²³⁴₂₃₄\u200c\u200d:ः]/g, "").replace(/க்ஷ/g, "ட்ச").replace(/ட்சு/g, "ட்ச").replace(/ஶ்ரீ|ஸ்ரீ/g, "ஸ்ரீ")
    .replace(/[ஶஸஷஜச]/g, "ச").replace(/[னண]/g, "ந").replace(/[ளழ]/g, "ல").replace(/ற/g, "ர").replace(/ஹ/g, "க")
    .replace(/ீ/g, "ி").replace(/ூ/g, "ு").replace(/ே/g, "ெ").replace(/ோ/g, "ொ").replace(/ை/g, "ெ")
    .replace(/ஈ/g, "இ").replace(/ஊ/g, "உ").replace(/ஏ/g, "எ").replace(/ஓ/g, "ஒ").replace(/ட்ட/g, "ட்").replace(/த்த/g, "த்").replace(/[்\s]/g, "").replace(/ி(?=ர)/g, "").toLowerCase();
  const KIND_WORDS = { "108": "அஷ்டோத்தரம் அஷ்டோத்திரம் நாமாவளி ashtottaram ashtothram 108 namavali", "300": "த்ரிஶதீ திரிசதி நாமாவளி trishati trisati 300 namavali",
    "1000": "ஸஹஸ்ரநாமம் சகஸ்ரநாமம் நாமாவளி sahasranamam sahasranama 1000 namavali", small: "நாமாவளி namavali" };
  const GROUP_ALIAS = { ganapati: "ganesha ganesh vinayaka pillaiyar பிள்ளையார் விநாயகர் கணேசர் கணபதி", shiva: "siva sivan shivan சிவன் ஈஸ்வரன் ஈசன் மகாதேவன்",
    devi: "amman ambal ambika devi அம்மன் அம்பாள் தேவி", subrahmanya: "murugan muruga skanda kartikeya subramanya முருகன் கந்தன் சுப்பிரமணியர் ஷண்முகர்",
    vishnu: "perumal narayana பெருமாள் நாராயணன்", hanuman: "anjaneya hanuman ஆஞ்சநேயர் அனுமன் ஹனுமான்", navagraha: "navagraha graha நவகிரகம் நவக்கிரகம் கிரகம்",
    guru: "acharya guru ஆசார்யர் குரு", nitya: "காலை ப்ராதஸ்மரணம் பிராதஸ்மரணம் நித்ய morning daily pratah smaranam suprabhatam", dikpala: "dikpalaka திக்பாலகர்" };
  let SEARCH = null;
  function searchIndex() {
    if (SEARCH) return SEARCH;
    const grp = k => INDEX.groups.find(g => g.key === k) || {};
    const ent = (type, href, deva, ta, en, extra, sub, sym, rank) => {
      const names = [deva, ta, en];
      return { type, href, deva, ta, en, sub, sym, rank,
        nameTA: tl([T.tamil(deva), ta].join(" ")), nameLA: T.looseLatin(en + " " + T.key(deva)),
        TA: tl([T.tamil(deva), ta, ...extra.map(x => /[\u0900-\u097F]/.test(x) ? T.tamil(x) : x)].join(" ")),
        LA: T.looseLatin([en, T.key(deva), ...extra.map(x => /[\u0900-\u097F]/.test(x) ? T.key(x) : x)].join(" ")),
        DV: [deva, ...extra].join(" ") };
    };
    const E = [];
    for (const x of STOTRAS) { const g = grp(x.group);
      E.push(ent("sto", "#s-" + x.id, x.title, x.ta, x.en, [g.deva, g.ta, g.en || "", GROUP_ALIAS[x.group] || "", "ஸ்தோத்ரம் ஸ்தோத்திரம் stotram stotra", x.note], "", x.group, 0)); }
    for (const it of INDEX.items) { const g = grp(it.group), K = KINDS.find(k => k.k === it.kind) || {};
      E.push(ent("nama", "#" + it.id, it.deva, T.tamil(it.deva), it.en, [it.title, g.deva, g.ta, g.en || "", GROUP_ALIAS[it.group] || "", K.deva || "", K.ta || "", K.en || "", KIND_WORDS[it.kind] || "", it.note, String(it.count)],
        `${it.count} · ${kindLabel(it.kind)}${it.note ? " · " + noteL(it.note) : ""}`, it.group, 1));
      Object.assign(E[E.length - 1], { showD: it.title, showT: T.tamil(it.title) }); }
    for (const p of PUJAS) {
      const w = p.kind === "veda" ? "வேதம் மந்த்ரம் veda mantra sukta ஸூக்தம்" : p.kind === "vidhana" ? "விதானம் பூஜை vidhana puja" : "பூஜை பூஜா வ்ரதம் விரதம் puja pooja vratam";
      E.push(ent(p.kind === "veda" ? "veda" : "puja", "#p-" + p.id, p.title, p.ta, p.en, [w, p.when_ta || "", p.when_en || "", GROUP_ALIAS[p.deity] || ""], "", p.deity, 2)); }
    return (SEARCH = E);
  }
  function searchFind(raw) {
    let toks = raw.trim().split(/\s+/).filter(Boolean);
    if (toks.length > 1) toks = toks.filter(q => !/^(ஸ்ரீ|ஶ்ரீ|ஷ்ரீ|श्री|sri|shri|sree|śrī)$/i.test(q));
    const test = (e, q, name) => {
      if (/[\u0B80-\u0BFF]/.test(q)) { const z = tl(q), H = name ? e.nameTA : e.TA; return !!z && (H.includes(z) || (z.length > 4 && /ம$/.test(z) && H.includes(z.slice(0, -1)))); }
      if (/[\u0900-\u097F]/.test(q)) return (name ? e.deva : e.DV).includes(q) || (name ? e.nameTA : e.TA).includes(tl(T.tamil(q)));
      let z = T.looseLatin(q.toLowerCase()); if (z.length < 2 && !/^\d+$/.test(q)) return false;
      const H = name ? e.nameLA : e.LA;
      return H.includes(z) || (z.length > 5 && /m$/.test(z) && H.includes(z.slice(0, -1)));
    };
    return searchIndex().map(e => {
      if (!toks.every(q => test(e, q, false))) return null;
      return { e, score: toks.filter(q => test(e, q, true)).length * 10 - e.rank };
    }).filter(Boolean).sort((a, b) => b.score - a.score).map(x => x.e);
  }
  function renderSearch(raw) {
    const found = searchFind(raw);
    const row = e => `<a class="hit" href="${e.href}"><span class="sym xs">${window.symbolSVG(e.sym)}</span><span class="hb"><span class="d">${esc(e.showD || e.deva)}</span>` +
      `<span class="t">${esc(L() === "en" ? e.en : (e.showT || e.ta))}</span>${e.sub ? `<span class="hs">${esc(e.sub)}</span>` : ""}</span></a>`;
    const SECT = [["sto", t("stotras")], ["nama", t("namavalis")], ["puja", t("pujas")], ["veda", t("veda")]];
    $("results").innerHTML = found.length
      ? SECT.map(([k, lbl]) => { const xs = found.filter(e => e.type === k); return xs.length ? `<h2 class="lbl">${esc(lbl)} · ${xs.length}</h2><div class="hits">${xs.map(row).join("")}</div>` : ""; }).join("")
      : `<p class="empty">${esc(t("notFound", raw))}</p>`;
  }

  /* ---------- home ---------- */
  function renderHome() {
    if (!INDEX) return;
    $("mangala").innerHTML = MANGALA.map(l => `<span>${esc(tr(l))}</span>`).join("");
    $("gshloka").innerHTML = GURU_SHLOKA.map(l => `<span>${esc(tr(l))}</span>`).join("");
    const raw = $("q").value.trim();
    $("tilesBox").hidden = !!raw; $("results").hidden = !raw;
    const favs = prefs.fav.filter(favOk);
    $("favBox").hidden = !!raw;
    $("favMore").hidden = favs.length <= 6;
    $("favHome").innerHTML = favs.length
      ? `<div class="grid">${favs.slice(0, 6).map(favCard).join("")}</div>`
      : `<p class="hint favempty">${t("favEmpty")}</p>`;
    const rec = prefs.recent.map(id => id.startsWith("s-") ? (x => x && { id, deva: x.title, en: x.en, ta: x.ta, count: "" })(STOTRAS.find(x => "s-" + x.id === id)) : id.startsWith("p-") ? (p => p && { id, deva: p.title, en: p.en, ta: p.ta, count: "" })(PUJAS.find(p => "p-" + p.id === id)) : byId(id)).filter(Boolean);
    $("recentBox").hidden = !!raw || !rec.length;
    $("listBox").hidden = !!raw || !prefs.lists.length;
    $("listHome").innerHTML = prefs.lists.map(l => { const n = l.items.filter(itemInfo).length;
      return `<div class="lcard"><a class="lmain" href="#list-${l.id}"><span class="lname">${esc(l.name)}</span><span class="lsub">${esc(t("nItems", n))}</span></a>${n ? `<button class="pbtn" data-start="${l.id}">${esc(t("startPara"))}</button>` : ""}</div>`; }).join("");
    $("recent").innerHTML = rec.map(it => `<a class="chip" href="#${it.id}"><span class="d">${esc(it.deva)}</span><span class="t">${esc(L() === "en" ? it.en : (it.ta || T.tamil(it.deva)))}</span>${it.count ? `<span class="pill">${it.count}</span>` : ""}</a>`).join("");
    if (raw) { renderToday(raw); renderSearch(raw); return; }
    $("pujaTiles").innerHTML = PUJAS.filter(p => !p.kind || p.kind === "common").map(pujaCard).join("");
    $("vidhanaTiles").innerHTML = PUJAS.filter(p => p.kind === "vidhana").map(pujaCard).join("");
    $("vedaTiles").innerHTML = VEDAS.filter(v => PUJAS.some(p => p.kind === "veda" && p.veda === v)).map(v =>
      `<h3 class="lbl2 vedah">${esc(t(v))}</h3><div class="grid pujas">${PUJAS.filter(p => p.kind === "veda" && p.veda === v).map(pujaCard).join("")}</div>`).join("");
    renderToday(raw);
    $("tiles").innerHTML = KINDS.map(K => {
      const items = prim(INDEX.items.filter(i => i.kind === K.k));
      const gs = INDEX.groups.filter(g => items.some(i => i.group === g.key)).map(gShort);
      return `<a class="ktile" href="#k-${K.k}"><span class="sym num">${K.n || K.k}</span><span class="kt">` +
        `<span class="d">${esc(K.deva)}</span><span class="t">${esc(K[L()])}</span><span class="e">${esc(K.sub[L()])}</span>` +
        `<span class="n">${t("nNamavalis", items.length)} · ${esc(gs.slice(0, 5).join(", "))}${gs.length > 5 ? "…" : ""}</span></span></a>`;
    }).join("");
  }

  /* ---------- one kind (108 / 300 / 1000), grouped by deity ---------- */
  let kindKey = null;
  function renderKind() {
    const K = KINDS.find(x => x.k === kindKey); if (!K) return;
    $("kNum").textContent = K.n || K.k;
    $("kDeva").textContent = K.deva;
    $("kAlt").innerHTML = `<span>${esc(K[L()])} · ${esc(K.sub[L()])}</span><span class="gran">${esc(T.grantha(K.deva))}</span>`;
    const items = INDEX.items.filter(i => i.kind === K.k);
    const groups = INDEX.groups.filter(g => items.some(i => i.group === g.key));
    $("kJump").hidden = groups.length < 3;
    $("kJump").innerHTML = groups.map(g => `<button class="chip" data-g="${g.key}"><span class="d">${esc(g.deva)}</span><span class="t">${esc(gShort(g))}</span></button>`).join("");
    $("klist").innerHTML = groups.map(g =>
      `<section class="sec" id="sec-${g.key}"><h2><span class="sym sm">${window.symbolSVG(g.key)}</span><span class="d">${esc(g.deva)}</span><span class="t">${esc(gName(g))}</span></h2>` +
      `<div class="grid">${prim(items.filter(i => i.group === g.key)).map(card).join("")}</div></section>`).join("");
  }

  /* ---------- one deity, all its namavalis (108 / 300 / 1000) ---------- */
  function renderGroup() {
    const g = INDEX.groups.find(x => x.key === groupKey); if (!g) return;
    $("gSym").innerHTML = window.symbolSVG(g.key);
    $("gDeva").textContent = g.deva;
    $("gAlt").innerHTML = `<span>${esc(gName(g))}</span><span class="gran">${esc(T.grantha(g.deva))}</span>`;
    const items = INDEX.items.filter(i => i.group === g.key);
    $("glist").innerHTML = KINDS.filter(K => items.some(i => i.kind === K.k)).map(K =>
      `<section class="sec"><h2><span class="sym sm num">${K.n || K.k}</span><span class="d">${esc(K.deva)}</span><span class="t">${esc(K[L()])}</span></h2>` +
      `<div class="grid">${prim(items.filter(i => i.kind === K.k)).map(card).join("")}</div></section>`).join("");
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
    if (stoDoc) { const on = isFav("s-" + stoDoc.id); $("sFav").setAttribute("aria-pressed", on); $("sFav").querySelector(".star").textContent = on ? "★" : "☆"; $("sFav").querySelector(".fl").textContent = on ? t("inFav") : t("addFav"); }
    if (pujaDoc) { const on = isFav("p-" + pujaDoc.id); $("pFav").setAttribute("aria-pressed", on); $("pFav").querySelector(".star").textContent = on ? "★" : "☆"; $("pFav").querySelector(".fl").textContent = on ? t("inFav") : t("addFav"); }
    $("dFavN").textContent = prefs.fav.length || "";
    if (view === "fav") renderFav();
    if (view === "home") renderHome();
  }
  function renderFav() {
    const favs = prefs.fav.filter(favOk);
    $("favList").innerHTML = favs.map((id, i) =>
      `<li>${favCard(id).replace(/<button class="cstar"[^>]*>.<\/button>/, "")}` +
      `<span class="ord"><button class="icon" data-up="${id}" ${i === 0 ? "disabled" : ""} aria-label="${t("up")}">↑</button><button class="icon" data-down="${id}" ${i === favs.length - 1 ? "disabled" : ""} aria-label="${t("down")}">↓</button><button class="icon" data-fav="${id}" aria-pressed="true" title="${t("remove")}">★</button></span></li>`).join("");
  }

  /* ---------- side menu ---------- */
  function renderDrawer() {
    $("dVidhana").innerHTML = PUJAS.filter(p => p.kind === "vidhana").map(p => `<a class="dl" href="#p-${p.id}"><span class="sym xs">${window.symbolSVG(p.deity)}</span><span><span class="dd">${esc(p.title)}</span><span class="dt">${esc(pujaName(p))}</span></span></a>`).join("");
    $("dVeda").innerHTML = PUJAS.filter(p => p.kind === "veda").map(p => `<a class="dl" href="#p-${p.id}"><span class="sym xs">${window.symbolSVG(p.deity)}</span><span><span class="dd">${esc(p.title)}</span><span class="dt">${esc(pujaName(p))}</span></span></a>`).join("");
    $("dPujas").innerHTML = PUJAS.filter(p => !p.kind || p.kind === "common").map(p => `<a class="dl" href="#p-${p.id}"><span class="sym xs">${window.symbolSVG(p.deity)}</span><span><span class="dd">${esc(p.title)}</span><span class="dt">${esc(pujaName(p))}</span></span></a>`).join("");
    const sgs = INDEX.groups.filter(g => STOTRAS.some(x => x.group === g.key));
    $("dStotraSec").hidden = !STOTRAS.length;
    $("dStotra").innerHTML = sgs.map(g => {
      const xs = STOTRAS.filter(x => x.group === g.key);
      return `<details class="dg ds" data-g="${g.key}"><summary class="dl gsum"><span class="sym xs">${window.symbolSVG(g.key)}</span><span><span class="dd">${esc(g.deva)}</span><span class="dt">${esc(gName(g))}</span></span><span class="dn">${xs.length}</span><span class="chev" aria-hidden="true">›</span></summary><div class="dsub">` +
        xs.map(x => `<a class="dl sub" href="#s-${x.id}"><span class="cnt">${x.verses || ""}</span><span><span class="dd">${esc(x.title)}</span><span class="dt">${esc(L() === "en" ? x.en : x.ta)}</span></span></a>`).join("") + `</div></details>`;
    }).join("");
    // namavalis: kind (108 / 300 / 1000) → devata → that devata's lists of this kind only
    const subRow = i => `<a class="dl sub" href="#${i.id}"><span class="cnt">${i.count}</span><span><span class="dd">${esc(i.deva)}</span><span class="dt">${esc(T.tamil(i.deva))}${variants(i).length > 1 ? " · " + esc(t("nVar", variants(i).length)) : i.note ? " · " + esc(noteL(i.note)) : ""}</span></span></a>`;
    $("dKinds").innerHTML = KINDS.map(K => {
      const kits = prim(INDEX.items.filter(i => i.kind === K.k));
      const gs = INDEX.groups.filter(g => kits.some(i => i.group === g.key));
      return `<details class="dg dk" data-k="${K.k}"><summary class="dl"><span class="sym xs num">${K.n || K.k}</span><span><span class="dd">${esc(K.deva)}</span><span class="dt">${esc(K[L()])}</span></span><span class="dn">${kits.length}</span><span class="chev" aria-hidden="true">›</span></summary><div class="dsub">` +
        gs.map(g => {
          const its = kits.filter(i => i.group === g.key);
          return `<details class="dg" data-k="${K.k}" data-g="${g.key}"><summary class="dl sub gsum"><span class="sym xxs">${window.symbolSVG(g.key)}</span><span><span class="dd">${esc(g.deva)}</span><span class="dt">${esc(gName(g))}</span></span><span class="dn">${its.length}</span><span class="chev" aria-hidden="true">›</span></summary>` +
            `<div class="dsub">${its.map(subRow).join("")}</div></details>`;
        }).join("") + `<a class="dl sub all" href="#k-${K.k}"><span class="dt">${esc(t("all"))}</span></a></div></details>`;
    }).join("");
  }
  function markDrawer() {
    const h = location.hash || "#";
    const vgOf = id => (byId(id) || {}).vg;
    const g = (byId(h.slice(1)) || {}).group || (h.startsWith("#g-") ? h.slice(3) : "");
    const k = (byId(h.slice(1)) || {}).kind || (h.startsWith("#k-") ? h.slice(3) : "");
    if (k) { const dk = document.querySelector(`#dKinds details.dk[data-k="${k}"]`); if (dk) dk.open = true;
      const dg = g && document.querySelector(`#dKinds details[data-k="${k}"][data-g="${g}"]`); if (dg) dg.open = true; }
    if (h.startsWith("#s-")) { const x = STOTRAS.find(x => x.id === h.slice(3)); const dg = x && document.querySelector(`#dStotra details[data-g="${x.group}"]`); if (dg) dg.open = true; }
    document.querySelectorAll("#drawer a.dl").forEach(a => { const hr = a.getAttribute("href"); a.classList.toggle("on", hr === h || (a.classList.contains("sub") && vgOf(hr.slice(1)) && vgOf(hr.slice(1)) === vgOf(h.slice(1)))); });
  }
  function drawer(open) {
    $("drawer").classList.toggle("open", open); $("scrim").hidden = !open;
    $("drawer").setAttribute("aria-hidden", !open); $("menuBtn").setAttribute("aria-expanded", open);
    document.body.classList.toggle("noscroll", open);
  }

  /* ---------- puja reader ---------- */
  const pdocs = {};
  async function loadPuja(id) {
    if (pdocs[id]) return pdocs[id];
    return (pdocs[id] = await getJSON(`data/puja/${id}.json`));
  }
  function blockHTML(b) {
    switch (b.t) {
      case "h3": return `<h4 class="ph3">${esc(tr(b.x))}</h4>`;
      case "verse": return `<div class="pverse">${b.x.map(l => `<p>${esc(tr(l))}</p>`).join("")}</div>`;
      case "prose": return `<div class="pprose">${b.x.map(l => `<p>${esc(tr(l))}</p>`).join("")}</div>`;
      case "offer": return `<div class="poffer">${b.x.map(l => `<p>${esc(tr(l))}</p>`).join("")}</div>`;
      case "rubric": {
        const tl = L() === "en" ? b.en : b.ta;
        return `<div class="prubric">${b.sa ? `<span class="rs">(${esc(tr(b.sa))})</span>` : ""}${tl ? `<span class="rt">${esc(tl)}</span>` : ""}</div>`;
      }
      case "note": return `<div class="pnote">${esc(L() === "en" ? b.en || b.ta : b.ta)}</div>`;
      case "list": {
        const two = b.x.some(r => r.length > 1);
        const gl = v => { if (!v) return ""; const k = v.replace(/(पत्रम्|पत्रं|पुष्पम्|पुष्पं|पत्र|पुष्प)$/, ""); const g = GLOSS[k] || GLOSS[v]; return g ? `<span class="g">${esc(L() === "en" ? g[1] : g[0])}</span>` : ""; };
        return `<ol class="plist${two ? " two" : ""}">` + b.x.map(r => `<li><span class="a">${esc(tr(r[0]))}</span>${r[1] ? `<span class="b">${esc(tr(r[1]))}${gl(r[1])}</span>` : ""}</li>`).join("") + `</ol>`;
      }
      case "namavali": return `<div class="plinks">` + b.ids.map(id => { const it = byId(id); if (!it) return ""; return `<button class="nlink" data-nv="${id}"><span class="cnt">${it.count}</span><span class="nl">${esc(tr(it.deva))} · ${esc(kindLabel(it.kind))}${it.note ? ` <small>(${esc(noteL(it.note))})</small>` : ""}</span><span class="arr">→</span></button>`; }).join("") + `</div>`;
      case "link": { const tp = PUJAS.find(p => p.id === b.puja); return `<button class="xlink" data-pl="${esc(b.puja)}" data-sec="${esc(b.sec)}"><span class="ic">↗</span><span class="nl">${esc(tr(b.sec || (tp ? tp.title : b.puja)))}</span><span class="sub">${esc(tp ? pujaName(tp) : "")}</span></button>`; }
    }
    return "";
  }
  let suktaDocs = [], usedSk = null;
  const SB = { "purusha-sukta-vidhana": ["புருஷஸூக்தம்", "Purusha Suktam"], "sri-sukta-vidhana": ["ஶ்ரீஸூக்தம்", "Sri Suktam"], "rudra-vidhana": ["ருத்ர விதானம்", "Rudra Vidhanam"] };
  // Vedic vidhana by deity: Ambal → Sri Sukta, Vishnu → Purusha Sukta, Shiva → Rudra; every other deity may choose
  // Rudra or Purusha Sukta. A puja's "sukta:" header overrides (several ids = a choice; "none" = no vidhana).
  const VIDHANA_BY_DEITY = { shiva: ["rudra-vidhana"], devi: ["sri-sukta-vidhana"], vishnu: ["purusha-sukta-vidhana"] };
  const suktaIds = () => {
    if (!pujaDoc || pujaDoc.kind) return [];
    const ids = (pujaDoc.sukta || "").trim() ? pujaDoc.sukta.trim().split(/\s+/) : (VIDHANA_BY_DEITY[pujaDoc.deity] || ["rudra-vidhana", "purusha-sukta-vidhana"]);
    return ids.filter(id => PUJAS.some(p => p.id === id));
  };
  // one vidhana at a time, remembered per puja
  const skOn = id => { if (!pujaDoc) return false; const v = (prefs.vid || {})[pujaDoc.id];
    if (v !== undefined) return v === id; return suktaIds().find(x => (prefs.suktaOn || {})[x]) === id; };
  async function ensureSukta() {
    suktaDocs = [];
    for (const id of suktaIds()) { try { suktaDocs.push(await loadPuja(id)); } catch (e) {} }
  }
  const titles = t => (t || "").split("|").map(x => x.trim());
  // Where each vidhana mantra goes: before the upachara it belongs to, found by the offering line
  // ("…, आसनं समर्पयामि") wherever it sits in the puja, then moved back over that upachara's own verses.
  // Falls back to a section with the same title. Each mantra is placed once (first occurrence).
  const OFFER_V = /(समर्पयामि|कल्पयामि|आवाहयामि|ध्यायामि|स्नपयामि|पूजयामि|दर्शयामि|निवेदयामि|धारयामि|करोमि|समर्पये|र्पयामि|घ्रापयामि|परिकल्पयामि|बध्नामि)/;
  const UPA = [
    ["ध्यान", [/ध्यायामि/]], ["आवाहन", [/[आा]वाहयामि|इहागच्छ|[आा]वाहनं/]], ["आसन", [/[आा]सन/]],
    ["पाद्य", [/पाद्य/]], ["अर्घ्य", [/र्घ्य/]], ["आचमनीय", [/[आा]चमन/]],
    ["मधुपर्क", [/मधुपर्क/]], ["अभिषेक", [/भिषेक/]], ["स्नान", [/शुद्धोदक/, /स्नपयामि|स्नान/]],
    ["वस्त्र", [/वस्त्र/]], ["यज्ञोपवीत", [/उपवीत/]],
    ["कण्ठसूत्र", [/कण्ठसूत्र|मङ्गलसूत्र/]], ["आभरण", [/आभरण|आभूषण|भूषणं|अलङ्कार/]],
    ["गन्ध", [/गन्ध|चन्दनं/]], ["अक्षत", [/^(?!.*र्थम्?अक्षतान्)(?!.*र्थेअक्षतान्).*(अक्षतान्|अक्षताः)/]],
    ["पुष्प", [/(?<!मन्त्र)पुष्पाणि|(?<!मन्त्र)पुष्पैः|(?<!मन्त्र)पुष्पं|पुष्पमाल/]],
    ["अर्चना", [/नामभिः|अर्चनां|नामपूजां|अष्टोत्तर/]], ["धूप", [/धूप/]],
    ["दीप", [/(?<!कर्पूर|नीराजन)दीप/]], ["नैवेद्य", [/नैवेद्य|निवेदयामि/]],
    ["ताम्बूल", [/ताम्बूल/]], ["नीराजन", [/नीराजन|कर्पूरदीप/]],
    ["मन्त्रपुष्प", [/मन्त्रपुष्प/]], ["प्रदक्षिण", [/प्रदक्षिण/]],
    ["राजोपचार", [/राजोपचार|छत्रं|चामरं/]], ["रक्षा", [/रक्षा|दोरक|कङ्कण/]], ["प्रार्थना", [/प्रार्थनां|प्रार्थयामि/]],
  ];
  const plain = x => (x || "").replace(/[॒॑᳚॓॔\-]/g, "");
  function planSukta(d, sd) {
    // flat list of blocks: {s: section index, b: block index, txt}
    const flat = []; let si = 0, start = -1;
    d.parts.forEach(p => p.sections.forEach(sec => { if (start < 0 && /षोडशोपचार/.test(p.title || "")) start = flat.length; sec.blocks.forEach((bl, bi) => flat.push({ s: si, b: bi, t: bl.t, txt: plain([].concat(bl.x || []).flat().join(" ")) })); flat.push({ s: si, b: sec.blocks.length, t: "end", txt: "" }); si++; }));
    const secTitles = []; d.parts.forEach(p => p.sections.forEach(sec => secTitles.push(titles(sec.title))));
    const plan = {}; // "s:b" -> [html]
    const add = (s, b, html) => { (plan[s + ":" + b] = plan[s + ":" + b] || []).push(html); };
    const vhtml = sc => `<div class="pvedic"><span class="vl">${esc((SB[sd.id] || [sd.ta, sd.en])[L() === "en" ? 1 : 0])}</span>` + sc.blocks.filter(b => b.t === "verse" || b.t === "list" || (b.t === "prose" && !/ध्यायामि|आवाहयामि|समर्पयामि|परिषिञ्चामि|स्वाहा|तत्सवितु/.test([].concat(b.x || []).join(" ")))).map(blockHTML).join("") + `</div>`;
    const taken = new Set(), anchors = [], pending = []; let lastPos = null;
    // a line that names several upacharas at once ("ध्यायामि। आवाहयामि। आसनं…") is a short sub-puja, not the main one
    const many = txt => UPA.filter(([, rs]) => rs.some(r => r.test(txt))).length >= 3;
    for (const p of sd.parts) for (const sc of p.sections) {
      const keys = titles(sc.title).filter(Boolean); if (!keys.length) continue;
      let at = -1;
      for (const k of keys) {
        const u = UPA.find(([n]) => plain(k).startsWith(n)); if (!u) continue;
        for (const re of u[1]) {
          const from = anchors.length > 1 ? anchors[anchors.length - 2] : Math.max(start, 0);
          const i = flat.findIndex((f, j) => j >= from && !taken.has(j) && !/अनन्तरम्|उत्तरम्/.test(f.txt) && !many(f.txt.replace(/\s+/g, "")) && (f.t === "offer" || f.t === "prose" || (u[0] === "अर्चना" && f.t === "namavali")) && (f.t === "namavali" || f.t === "offer" || OFFER_V.test(f.txt) || (f.t === "prose" && f.txt.length < 40 && /॥\s*$/.test(f.txt))) && re.test(f.txt.replace(/\s+/g, "")));
          if (i >= 0 && (at < 0 || i < at)) at = i;
          if (i >= 0) break;
        }
      }
      if (at >= 0) {
        taken.add(at); anchors.push(at);
        let j = at; // move back over this upachara's verses and bare markers ("आवाहनम्।")
        while (j > 0 && flat[j - 1].s === flat[at].s && (flat[j - 1].t === "verse" || flat[j - 1].t === "rubric" || flat[j - 1].t === "note" || ((flat[j - 1].t === "offer" || (flat[j - 1].t === "prose" && /परिषि|भूर्भुवः|स्वाहा/.test(flat[j - 1].txt))) && !OFFER_V.test(flat[j - 1].txt) && !/॥इति|इति |नमः/.test(flat[j - 1].txt) && !UPA.some(([, rs]) => rs.some(r => r.test(flat[j - 1].txt.replace(/\s+/g, ""))))))) j--;
        pending.forEach(h => add(flat[j].s, flat[j].b, h)); pending.length = 0;
        add(flat[j].s, flat[j].b, vhtml(sc)); lastPos = [flat[at].s, flat[at].b + 1]; continue;
      }
      const s2 = secTitles.findIndex(ts => ts.some(x => keys.includes(x)));
      if (s2 >= 0) add(s2, 0, vhtml(sc)); else if (!keys.some(k => /रक्षा|प्रार्थना/.test(k))) pending.push(vhtml(sc));
    }
    // mantras whose upachara this puja does not have go right after the last placed one
    if (pending.length && lastPos) pending.forEach(h => add(lastPos[0], lastPos[1], h));
    return plan;
  }
  window.__planSukta = (d, sd) => planSukta(d, sd);
  function renderPuja() {
    const d = pujaDoc; if (!d) return;
    usedSk = new Set();
    $("suktaBtns").innerHTML = suktaIds().map(id => { const sp = PUJAS.find(p => p.id === id); return `<button class="icon vbtn" data-sk="${id}" aria-pressed="${skOn(id)}">${esc((SB[id] || [sp.ta, sp.en])[L() === "en" ? 1 : 0])}</button>`; }).join("");
    $("pTitle").textContent = tr(d.title);
    $("pAlt").innerHTML = `<span>${esc(pujaName(d))}</span>` + ["deva", "taml", "gran", "latn"].filter(s => s !== prefs.script).map(s => `<span class="${s}">${esc(tr(d.title, s))}</span>`).join("");
    $("pWhen").textContent = L() === "en" ? d.when_en : d.when_ta;
    const rt = prefs.returnTo && prefs.returnTo.puja !== d.id && PUJAS.find(p => p.id === prefs.returnTo.puja);
    $("pRet").hidden = !rt; if (rt) $("pRet").textContent = t("backToPuja", pujaName(rt));
    $("pSteps").innerHTML = d.parts.map((p, i) => `<button class="chip" data-step="${i}"><span class="sn">${i + 1}</span>${esc(tr(titles(p.title)[0]))}</button>`).join("");
    let h = "", k = 0;
    const plans = suktaDocs.filter(sd => skOn(sd.id)).map(sd => planSukta(d, sd));
    const at = (s, b) => plans.map(pl => (pl[s + ":" + b] || []).join("")).join("");
    d.parts.forEach((p, i) => {
      h += `<section class="ppart" id="part-${i}" data-title="${esc(titles(p.title)[0])}"><h2 class="ptitle"><span class="sn">${i + 1}</span>${esc(tr(titles(p.title)[0]))}</h2>`;
      for (const sec of p.sections) {
        const t0 = titles(sec.title)[0];
        const si = k;
        h += `<div class="psec" id="sec${k++}" data-title="${esc(t0)}">` + (t0 ? `<h3 class="psub">${esc(tr(t0))}</h3>` : "") + sec.blocks.map((bl, bi) => at(si, bi) + blockHTML(bl)).join("") + at(si, sec.blocks.length) + `</div>`;
      }
      h += `</section>`;
    });
    $("pBody").innerHTML = h; markUnits($("pBody"), "p-" + pujaDoc.id);
  }
  function markStep() {
    if (view !== "puja") return;
    const top = $("pSteps").getBoundingClientRect().bottom + 8;
    let cur = 0;
    document.querySelectorAll(".ppart").forEach((el, i) => { if (el.getBoundingClientRect().top <= top + 4) cur = i; });
    document.querySelectorAll("#pSteps .chip").forEach((c, i) => c.setAttribute("aria-current", i === cur ? "step" : "false"));
    const on = $("pSteps").querySelector('[aria-current="step"]'); if (on && on.scrollIntoViewIfNeeded) on.scrollIntoViewIfNeeded(false);
  }
  let scrollSaveT = null;
  window.addEventListener("scroll", () => {
    if (view !== "puja") return; markStep();
    clearTimeout(scrollSaveT); scrollSaveT = setTimeout(() => { if (pujaDoc) { prefs.pscroll = prefs.pscroll || {}; prefs.pscroll[pujaDoc.id] = Math.round(scrollY); save(); } }, 400);
  }, { passive: true });

  /* data: packed .dat on the published site (zlib + xor), plain .json while developing */
  const PK = new TextEncoder().encode("pujanidhi:nidhishvara-shrautinah");
  async function getJSON(path) {
    const r = await fetch(path.replace(/\.json$/, ".dat"));
    if (r.ok && !/text\/html/.test(r.headers.get("content-type") || "")) {
      const u = new Uint8Array(await r.arrayBuffer());
      for (let i = 0; i < u.length; i++) u[i] ^= PK[i % PK.length];
      return JSON.parse(await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream("deflate"))).text());
    }
    const j = await fetch(path); if (!j.ok) throw new Error(j.status); return j.json();
  }

  /* ---------- my lists & parayana ---------- */
  // prefs.lists = [{id, name, items: [itemId]}]; itemId: namavali id, "p-<puja>", "s-<stotra>". prefs.para = {list, i} while reading through a list.
  function itemInfo(id) {
    if (id.startsWith("s-")) { const x = STOTRAS.find(x => "s-" + x.id === id); return x && { id, deva: x.title, name: L() === "en" ? x.en : x.ta, sub: t("toSto"), sym: x.group }; }
    if (id.startsWith("p-")) { const p = PUJAS.find(p => "p-" + p.id === id); return p && { id, deva: p.title, name: pujaName(p), sub: L() === "en" ? p.when_en : p.when_ta, sym: p.deity }; }
    const it = byId(id); return it && { id, deva: it.title || it.deva, name: L() === "en" ? it.en : T.tamil(it.deva), sub: `${it.count} · ${kindLabel(it.kind)}`, sym: it.group };
  }
  const listById = id => prefs.lists.find(l => l.id === id);
  const curItemId = () => view === "stotra" && stoDoc ? "s-" + stoDoc.id : view === "puja" && pujaDoc ? "p-" + pujaDoc.id : view === "reader" && current ? current.id : null;
  function newList(name) {
    name = (name || "").trim(); if (!name) return null;
    const l = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), name, items: [] };
    prefs.lists.push(l); save(); return l;
  }
  function renderLists() {
    $("dListN").textContent = prefs.lists.length || "";
    if (view !== "lists") return;
    $("listsBox").innerHTML = prefs.lists.length ? prefs.lists.map(l => {
      const first = l.items.map(itemInfo).filter(Boolean);
      return `<div class="lcard"><a class="lmain" href="#list-${l.id}"><span class="lname">${esc(l.name)}</span><span class="lsub">${esc(t("nItems", first.length))}${first.length ? " · " + first.slice(0, 3).map(x => esc(x.name)).join(", ") + (first.length > 3 ? "…" : "") : ""}</span></a>` +
        (first.length ? `<button class="pbtn" data-start="${l.id}">${esc(t("startPara"))}</button>` : "") + `</div>`;
    }).join("") : `<p class="empty">${esc(t("noLists"))}</p>`;
  }
  let listKey = null, delArm = false;
  function renderList() {
    const l = listById(listKey); if (!l) { location.hash = "lists"; return; }
    l.items = l.items.filter(id => itemInfo(id));
    $("lTitle").textContent = l.name; $("lCount").textContent = t("nItems", l.items.length);
    $("lStart").hidden = !l.items.length; delArm = false; $("lDelete").textContent = t("delList");
    $("lItems").innerHTML = l.items.length ? l.items.map((id, i) => { const x = itemInfo(id);
      return `<li data-id="${esc(id)}"><span class="grip" aria-hidden="true">⠿</span><a class="lit" href="#${esc(id)}"><span class="sym xs">${window.symbolSVG(x.sym)}</span><span class="hb"><span class="d">${esc(x.deva)}</span><span class="t">${esc(x.name)}</span><span class="hs">${esc(x.sub || "")}</span></span></a>` +
        `<span class="ord"><button class="icon" data-lup="${i}" ${i === 0 ? "disabled" : ""} aria-label="${t("up")}">↑</button><button class="icon" data-ldown="${i}" ${i === l.items.length - 1 ? "disabled" : ""} aria-label="${t("down")}">↓</button><button class="icon" data-ldel="${i}" aria-label="${t("remove")}">✕</button></span></li>`; }).join("")
      : `<li class="empty">${esc(t("emptyList"))}</li>`;
  }
  function moveItem(l, i, j) { if (j < 0 || j >= l.items.length) return; const [x] = l.items.splice(i, 1); l.items.splice(j, 0, x); save(); renderList(); }
  // drag by the ⠿ grip (works with touch and mouse)
  (function () {
    let drag = null;
    document.addEventListener("pointerdown", e => {
      const g = e.target.closest("#lItems .grip"); if (!g) return;
      const li = g.closest("li"); drag = { li, id: li.dataset.id }; li.classList.add("dragging"); g.setPointerCapture(e.pointerId); e.preventDefault();
    });
    document.addEventListener("pointermove", e => {
      if (!drag) return; const ol = $("lItems"), y = e.clientY;
      const sibs = [...ol.children].filter(x => x !== drag.li);
      const after = sibs.find(x => { const r = x.getBoundingClientRect(); return y < r.top + r.height / 2; });
      if (after) { if (drag.li.nextElementSibling !== after) ol.insertBefore(drag.li, after); } else if (ol.lastElementChild !== drag.li) ol.appendChild(drag.li);
      if (y < 60) window.scrollBy(0, -12); else if (y > innerHeight - 60) window.scrollBy(0, 12);
    });
    const end = () => { if (!drag) return; drag.li.classList.remove("dragging"); const l = listById(listKey);
      if (l) { l.items = [...$("lItems").children].map(x => x.dataset.id).filter(Boolean); save(); renderList(); } drag = null; };
    document.addEventListener("pointerup", end); document.addEventListener("pointercancel", end);
  })();
  // add-to-list sheet
  let sheetFor = null;
  function openSheet(id) {
    sheetFor = id; const x = itemInfo(id); if (!x) return;
    $("sheetItem").textContent = x.name;
    paintSheet(); $("sheet").hidden = false; document.body.classList.add("noscroll");
  }
  function paintSheet() {
    $("sheetLists").innerHTML = prefs.lists.length ? prefs.lists.map(l => `<label class="srowl"><input type="checkbox" data-sl="${l.id}" ${l.items.includes(sheetFor) ? "checked" : ""}><span>${esc(l.name)}</span><span class="hs">${l.items.length}</span></label>`).join("") : `<p class="hint">${esc(t("noLists"))}</p>`;
  }
  function closeSheet() { $("sheet").hidden = true; document.body.classList.remove("noscroll"); renderLists(); refreshListBtns(); }
  function refreshListBtns() { const id = curItemId(); const n = id ? prefs.lists.filter(l => l.items.includes(id)).length : 0;
    document.querySelectorAll("[data-addlist]").forEach(b => { b.setAttribute("aria-pressed", n > 0); b.querySelector(".star").textContent = n ? "✓" : "＋"; }); }
  // parayana bar
  function paraStart(lid, i) { const l = listById(lid); if (!l || !l.items.length) return; prefs.para = { list: lid, i: i || 0 }; save(); location.hash = l.items[prefs.para.i]; }
  function paintPara() {
    const P = prefs.para, l = P && listById(P.list), id = curItemId();
    const on = !!(l && id && l.items[P.i] === id);
    $("paraBar").hidden = !on; document.body.classList.toggle("para", on);
    if (!on) return;
    const n = l.items.length, nx = l.items[P.i + 1] && itemInfo(l.items[P.i + 1]);
    $("paraLbl").textContent = t("paraOf", P.i + 1, n, l.name);
    $("paraNext").textContent = nx ? t("nextIs", nx.name) : t("lastOne");
    $("paraGo").textContent = nx ? "→" : "✓"; $("paraPrev").disabled = P.i === 0;
  }


  /* ---------- highlights & notes ---------- */
  // prefs.marks["<doc>#<n>"] = {c: 1-3 colour (0 = none), note, x: first words, at}; units are whole verses/names, so no text selection is needed
  const UNIT = ".blk-shloka,.blk-para,.names>li,.pverse,.pprose,.poffer,.plist>li";
  function markUnits(root, doc) {
    root.querySelectorAll(UNIT).forEach((el, n) => { el.dataset.hk = doc + "#" + n; paintMark(el); });
    const j = prefs.jumpMark; if (j && j.startsWith(doc + "#")) { delete prefs.jumpMark; save();
      const el = root.querySelector(`[data-hk="${j}"]`); if (el) setTimeout(() => { el.scrollIntoView({ block: "center" }); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 1600); }, 120); }
  }
  function paintMark(el) {
    const m = prefs.marks[el.dataset.hk]; el.classList.remove("hl1", "hl2", "hl3"); const old = el.querySelector(":scope > .mnote"); if (old) old.remove();
    if (!m) return; if (m.c) el.classList.add("hl" + m.c);
    if (m.note) { const d = document.createElement(el.tagName === "LI" ? "span" : "div"); d.className = "mnote"; d.textContent = "✎ " + m.note; el.appendChild(d); }
  }
  let markKey = null, markEl = null, markC = 0;
  function openMark(el) {
    markEl = el; markKey = el.dataset.hk; const m = prefs.marks[markKey] || {}; markC = m.c || 0;
    const clone = el.cloneNode(true); clone.querySelectorAll(".mnote,.n").forEach(x => x.remove());
    $("markSnip").textContent = clone.textContent.trim().replace(/\s+/g, " ").slice(0, 120);
    $("markNote").value = m.note || ""; paintSwatches(); $("markSheet").hidden = false; document.body.classList.add("noscroll");
  }
  function paintSwatches() { document.querySelectorAll("#markSheet [data-c]").forEach(b => b.setAttribute("aria-pressed", +b.dataset.c === markC)); }
  function closeMark() { $("markSheet").hidden = true; document.body.classList.remove("noscroll"); }
  function saveMark() {
    const note = $("markNote").value.trim();
    if (!markC && !note) delete prefs.marks[markKey];
    else prefs.marks[markKey] = { c: markC, note, x: $("markSnip").textContent.slice(0, 80), at: Date.now() };
    save(); if (markEl) paintMark(markEl); closeMark(); renderMarksCount();
  }
  function renderMarksCount() { $("dMarkN").textContent = Object.keys(prefs.marks).length || ""; }
  function docInfo(doc) { return itemInfo(doc) || null; }
  function renderMarks() {
    const keys = Object.keys(prefs.marks).sort((a, b) => (prefs.marks[b].at || 0) - (prefs.marks[a].at || 0));
    const byDoc = {}; keys.forEach(k => { const d = k.split("#")[0]; (byDoc[d] = byDoc[d] || []).push(k); });
    $("marksBox").innerHTML = keys.length ? Object.entries(byDoc).map(([d, ks]) => { const x = docInfo(d); if (!x) return "";
      return `<section class="mdoc"><h2 class="lbl">${esc(x.name)}</h2>` + ks.sort((a, b) => +a.split("#")[1] - +b.split("#")[1]).map(k => { const m = prefs.marks[k];
        return `<button class="mrow hl${m.c || 0}" data-goto="${esc(k)}"><span class="mx">${esc(m.x || "")}</span>${m.note ? `<span class="mn">✎ ${esc(m.note)}</span>` : ""}</button>`; }).join("") + `</section>`; }).join("")
      : `<p class="empty">${esc(t("noMarks"))}</p>`;
  }
  // press and hold
  (function () {
    let tm = null, sx = 0, sy = 0, fired = false;
    document.addEventListener("pointerdown", e => {
      const el = e.target.closest("[data-hk]"); if (!el || e.button > 0) return;
      sx = e.clientX; sy = e.clientY; fired = false; clearTimeout(tm);
      tm = setTimeout(() => { fired = true; if (navigator.vibrate) try { navigator.vibrate(15); } catch (x) {} openMark(el); }, 550);
    });
    document.addEventListener("pointermove", e => { if (tm && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) { clearTimeout(tm); tm = null; } });
    ["pointerup", "pointercancel", "scroll"].forEach(ev => document.addEventListener(ev, () => { clearTimeout(tm); tm = null; }, { passive: true }));
    document.addEventListener("click", e => { if (fired) { fired = false; e.stopPropagation(); e.preventDefault(); } }, true);
  })();
  // backup of favourites, lists, notes
  function backupSave() {
    const data = { app: "pujanidhi", v: 1, fav: prefs.fav, lists: prefs.lists, marks: prefs.marks, rmode: prefs.rmode || {} };
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" }));
    a.download = "pujanidhi-backup-" + new Date().toISOString().slice(0, 10) + ".json"; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function backupLoad(file) {
    const r = new FileReader();
    r.onload = () => { try { const d = JSON.parse(r.result); if (d.app !== "pujanidhi") throw 0;
        prefs.fav = [...new Set([...(prefs.fav || []), ...(d.fav || [])])];
        const have = new Set(prefs.lists.map(l => l.id)); (d.lists || []).forEach(l => { if (!have.has(l.id)) prefs.lists.push(l); });
        Object.assign(prefs.marks, d.marks || {}); prefs.rmode = Object.assign(prefs.rmode || {}, d.rmode || {});
        save(); renderDrawer(); renderLists(); renderMarksCount(); $("dFavN").textContent = prefs.fav.length || ""; $("bkMsg").textContent = t("backupDone"); }
      catch (x) { $("bkMsg").textContent = t("backupBad"); } };
    r.readAsText(file);
  }

  /* ---------- reader ---------- */
  async function loadDoc(id) {
    if (docs[id]) return docs[id];
    return (docs[id] = await getJSON(`data/${id}.json`));
  }
  const stos = {};
  async function loadSto(id) { if (stos[id]) return stos[id]; return (stos[id] = await getJSON(`data/stotra/${id}.json`)); }
  let forceNama = false; // opened from a puja: show the names first, until the reader taps Stotram
  const rMode = id => ((byId(id) || {}).st && !forceNama && (prefs.rmode || {})[id] === "s") ? "s" : "n";
  let flat = []; // names of the current doc, in order
  const nameHTML = (x, i, d) => {
    const pre = (prefs.omEach && !/^(ॐ|ओं)/.test(x)) || (!d.svara && i === 0 && !/^(ॐ|ओं)/.test(x)) ? `<span class="om">${esc(tr("ॐ"))}</span> ` : "";
    return pre + esc(tr(x));
  };
  const markHTML = l => esc(tr(l)).replace(/\[([^\]]+)\]/g, '<span class="mk">$1</span>');
  const blocksHTML = bl => bl.map(b => b.t === "note" ? `<div class="blk-note">${esc(L() === "en" ? (b.en || b.ta || "") : (b.ta || b.en || ""))}</div>` : b.t === "head" ? `<div class="blk-head">${esc(tr(b.x))}</div>` : `<div class="blk-${b.t}">${b.x.map(l => `<p>${markHTML(l)}</p>`).join("")}</div>`).join("");
  function renderStotra() {
    const x = stoDoc && STOTRAS.find(s => s.id === stoDoc.id); if (!x) return;
    $("sTitle").textContent = tr(x.title);
    $("sAlt").innerHTML = ["deva", "taml", "gran", "latn"].filter(s => s !== prefs.script).map(s => `<span class="${s}">${esc(tr(x.title, s))}</span>`).join("");
    const nv = x.namavali && byId(x.namavali);
    $("sNote").textContent = [x.note ? noteL(x.note) : ""].filter(Boolean).join(" · "); $("sNote").hidden = !x.note;
    $("sNama").hidden = !nv; if (nv) { $("sNama").href = "#" + nv.id; $("sNama").textContent = t("toNama") + " · " + tr(nv.deva) + " →"; }
    $("sBody").innerHTML = blocksHTML(stoDoc.blocks); markUnits($("sBody"), "s-" + stoDoc.id);
  }
  function renderReader() {
    const d = current; if (!d) return;
    const meta = byId(d.id) || {};
    $("backBtn").textContent = "← " + (kindLabel(meta.kind) || t("namavalis"));
    const rt = prefs.returnTo && PUJAS.find(p => p.id === prefs.returnTo.puja);
    $("retPuja").hidden = !rt; if (rt) $("retPuja").textContent = t("backToPuja", pujaName(rt));
    const sc = prefs.script;
    $("rTitle").textContent = tr(d.title);
    $("rAlt").innerHTML = ["deva", "taml", "gran", "latn"].filter(s => s !== sc).map(s => `<span class="${s}">${esc(tr(d.title, s))}</span>`).join("");
    const notes = [t("names", meta.count)];
    if (meta.note && !/நாமங்கள்$/.test(meta.note)) notes.push(noteL(meta.note));
    if (d.svara && (sc === "taml" || sc === "latn")) notes.push(t("svaraNote"));
    $("rNote").hidden = false; $("rNote").textContent = notes.join(" · ");
    const vs = meta.vg ? variants(meta) : [];
    $("rVar").hidden = vs.length < 2;
    $("rVar").innerHTML = vs.length < 2 ? "" : `<span class="vl">${esc(t("paatha"))}:</span>` + vs.map(v =>
      `<a class="chip" href="#${v.id}" ${v.id === d.id ? 'aria-current="true"' : ""}>${esc(noteL(v.note))}</a>`).join("");
    document.body.classList.toggle("svara", !!d.svara);
    $("rMode").hidden = !meta.st;
    $("rMode").innerHTML = meta.st ? `<button data-m="n" aria-pressed="${rMode(d.id) === "n"}">${esc(t("mNama"))}</button><button data-m="s" aria-pressed="${rMode(d.id) === "s"}">${esc(t("mStotra"))}</button>` : "";
    const stoMode = rMode(d.id) === "s";
    document.body.classList.toggle("sto", stoMode);
    if (view === "reader") $("archBtn").hidden = stoMode;
    if (stoMode) {
      const want = d.id;
      loadSto(meta.st).then(S => { if (!current || current.id !== want || rMode(want) !== "s") return; $("rBody").innerHTML = blocksHTML(S.blocks); markUnits($("rBody"), "s-" + meta.st); })
        .catch(() => { $("rBody").innerHTML = `<p class="empty">${t("loadFail")}</p>`; });
      flat = d.blocks.filter(b => b.t === "names").flatMap(b => b.x);
      return;
    }
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
    $("rBody").innerHTML = h; markUnits($("rBody"), d.id);
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
    ["home", "kind", "group", "fav", "lists", "list", "marks", "puja", "reader", "stotra", "about"].forEach(x => ($(x).hidden = x !== v));
    $("rtools").hidden = v !== "reader" && v !== "puja" && v !== "stotra";
    $("omBtn").hidden = v !== "reader"; $("archBtn").hidden = v !== "reader" || document.body.classList.contains("sto");
    if (v !== "puja") $("suktaBtns").innerHTML = "";
    if (v !== "reader" && !$("archana").hidden) closeArchana();
    keepAwake(v === "reader" || v === "puja" || v === "stotra");
    setTimeout(() => { paintPara(); refreshListBtns(); }, 0);
  }
  async function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id === "about") { show("about"); window.scrollTo(0, 0); return; }
    if (id === "fav") { show("fav"); renderFav(); window.scrollTo(0, 0); return; }
    if (id === "marks") { show("marks"); renderMarks(); window.scrollTo(0, 0); return; }
    if (id === "lists") { show("lists"); renderLists(); window.scrollTo(0, 0); return; }
    if (id.startsWith("list-") && listById(id.slice(5))) { listKey = id.slice(5); show("list"); renderList(); window.scrollTo(0, 0); return; }
    if (id.startsWith("p-") && PUJAS.some(p => p.id === id.slice(2))) {
      try { pujaDoc = await loadPuja(id.slice(2)); } catch (e) { $("pBody").innerHTML = `<p class="empty">${t("loadFail")}</p>`; }
      prefs.recent = [id, ...prefs.recent.filter(x => x !== id)].slice(0, 6); save();
      await ensureSukta(); show("puja"); renderPuja(); refreshStars();
      let back = prefs.returnTo && prefs.returnTo.puja === pujaDoc.id ? prefs.returnTo.y : (prefs.pscroll || {})[pujaDoc.id];
      if (prefs.returnTo && prefs.returnTo.puja === pujaDoc.id) { delete prefs.returnTo; save(); }
      const jt = prefs.jumpTo; if (jt != null) { delete prefs.jumpTo; save(); }
      requestAnimationFrame(() => {
        const el = jt ? [...document.querySelectorAll("#pBody [data-title]")].find(x => x.dataset.title === jt) : null;
        if (el) back = el.getBoundingClientRect().top + scrollY - $("pSteps").offsetHeight - document.querySelector(".bar").offsetHeight - 8;
        window.scrollTo(0, back || 0); markStep();
      });
      return;
    }
    if (id.startsWith("s-") && STOTRAS.some(x => x.id === id.slice(2))) {
      const sid = id.slice(2);
      try { stoDoc = await loadSto(sid); } catch (e) { stoDoc = null; $("sBody").innerHTML = `<p class="empty">${t("loadFail")}</p>`; }
      prefs.recent = [id, ...prefs.recent.filter(x => x !== id)].slice(0, 6); save();
      markDrawer(); show("stotra"); renderStotra(); refreshStars(); window.scrollTo(0, 0); return;
    }
    if (!byId(id) && prefs.returnTo) { delete prefs.returnTo; save(); }
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
      forceNama = !!prefs.returnTo;
      show("reader"); renderReader(); refreshStars(); window.scrollTo(0, 0); return;
    }
    current = null; show("home"); renderHome();
  }

  /* ---------- language & first-run setup ---------- */
  function rerenderAll() {
    applyLang(); if (!INDEX) return;
    renderDrawer(); $("dFavN").textContent = prefs.fav.length || "";
    if (view === "home") renderHome(); else if (view === "kind") renderKind(); else if (view === "group") renderGroup();
    else if (view === "fav") renderFav(); else if (view === "reader") { renderReader(); refreshStars(); } else if (view === "puja") { renderPuja(); refreshStars(); } else if (view === "stotra") renderStotra();
  }
  function setLang(l) { prefs.lang = l; save(); SEARCH = null; rerenderAll(); }
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
  $("themeSeg").onclick = e => { const b = e.target.closest("button"); if (b) { prefs.theme = b.dataset.th; save(); applyPrefs(); } };
  $("langSeg").onclick = e => { const b = e.target.closest("button"); if (b) setLang(b.dataset.l); };

  /* ---------- events ---------- */
  $("scripts").onclick = e => { const b = e.target.closest("button"); if (!b) return; prefs.script = b.dataset.s; save(); applyPrefs(); if (view === "reader") renderReader(); if (view === "puja") renderPuja(); if (view === "stotra") renderStotra(); if (view === "home") renderHome(); };
  $("kJump").onclick = e => { const b = e.target.closest("button[data-g]"); if (!b) return; const el = $("sec-" + b.dataset.g); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - $("kJump").offsetHeight - 70, behavior: "smooth" }); };
  $("omBtn").onclick = () => { prefs.omEach = !prefs.omEach; save(); applyPrefs(); renderReader(); };
  $("fsUp").onclick = () => { prefs.fs = Math.min(3.2, +(prefs.fs + 0.15).toFixed(2)); save(); applyPrefs(); };
  $("fsDown").onclick = () => { prefs.fs = Math.max(0.95, +(prefs.fs - 0.15).toFixed(2)); save(); applyPrefs(); };
  $("q").oninput = renderHome;
  $("q").addEventListener("focus", () => { const f = document.querySelector(".find"), bar = document.querySelector(".bar");
    setTimeout(() => window.scrollTo({ top: f.getBoundingClientRect().top + scrollY - (bar ? bar.offsetHeight : 0) - 8, behavior: "smooth" }), 250); });
  $("q").addEventListener("keydown", e => { if (e.key === "Enter") { const a = $("results").querySelector("a.hit"); if (a) { $("q").blur(); location.hash = a.getAttribute("href"); } } });
  $("backBtn").onclick = () => (location.hash = kindKey ? "k-" + kindKey : "");
  document.querySelectorAll("[data-home]").forEach(b => (b.onclick = () => (location.hash = "")));
  $("rBody").onclick = e => {
    const li = e.target.closest("li[data-i]"); if (!li || !current) return;
    const i = +li.dataset.i;
    if (prefs.cur[current.id] === i) { delete prefs.cur[current.id]; save(); li.classList.remove("cur"); } else setCur(i);
  };
  $("archBtn").onclick = openArchana;
  $("rMode").onclick = e => { const b = e.target.closest("button"); if (!b || !current) return; forceNama = false; prefs.rmode = prefs.rmode || {}; prefs.rmode[current.id] = b.dataset.m; save(); renderReader(); window.scrollTo(0, 0); };
  $("pSteps").onclick = e => { const b = e.target.closest("[data-step]"); if (!b) return; const el = $("part-" + b.dataset.step); window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - $("pSteps").getBoundingClientRect().bottom + 2, behavior: "smooth" }); };
  $("pBody").onclick = e => {
    if (!pujaDoc) return;
    const b = e.target.closest("[data-nv]"), l = e.target.closest("[data-pl]");
    if (b) { prefs.returnTo = { puja: pujaDoc.id, y: Math.round(scrollY) }; save(); location.hash = b.dataset.nv; }
    else if (l) { prefs.returnTo = { puja: pujaDoc.id, y: Math.round(scrollY) }; prefs.jumpTo = l.dataset.sec; save(); location.hash = "p-" + l.dataset.pl; }
  };
  $("suktaBtns").onclick = e => { const b = e.target.closest("[data-sk]"); if (!b) return; const y = scrollY, anchor = [...document.querySelectorAll("#pBody .psec")].find(el => el.getBoundingClientRect().bottom > 120); prefs.vid = prefs.vid || {}; prefs.vid[pujaDoc.id] = skOn(b.dataset.sk) ? null : b.dataset.sk; save(); renderPuja(); if (anchor) { const el = document.getElementById(anchor.id); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 120); } else window.scrollTo(0, y); };
  $("pRet").onclick = () => { if (prefs.returnTo) location.hash = "p-" + prefs.returnTo.puja; };
  $("pFav").onclick = () => pujaDoc && toggleFav("p-" + pujaDoc.id);
  $("sFav").onclick = () => stoDoc && toggleFav("s-" + stoDoc.id);
  document.querySelectorAll("[data-addlist]").forEach(b => b.onclick = () => { const id = curItemId(); if (id) openSheet(id); });
  $("sheet").onclick = e => { if (e.target === $("sheet")) closeSheet(); };
  $("sheetDone").onclick = closeSheet;
  $("sheetLists").onchange = e => { const c = e.target.closest("[data-sl]"); if (!c) return; const l = listById(c.dataset.sl);
    if (c.checked) { if (!l.items.includes(sheetFor)) l.items.push(sheetFor); } else l.items = l.items.filter(x => x !== sheetFor); save(); paintSheet(); };
  $("sheetNew").onsubmit = e => { e.preventDefault(); const l = newList($("sheetNewName").value); if (l) { l.items.push(sheetFor); save(); $("sheetNewName").value = ""; paintSheet(); } };
  $("newListForm").onsubmit = e => { e.preventDefault(); const l = newList($("newListName").value); if (l) { $("newListName").value = ""; renderLists(); } };
  $("listHome").onclick = e => { const b = e.target.closest("[data-start]"); if (b) paraStart(b.dataset.start, 0); };
  $("listsBox").onclick = e => { const b = e.target.closest("[data-start]"); if (b) paraStart(b.dataset.start, 0); };
  $("lStart").onclick = () => paraStart(listKey, 0);
  $("lRename").onclick = () => { const l = listById(listKey); const h = $("lTitle"); h.contentEditable = "true"; h.focus();
    const r = document.createRange(); r.selectNodeContents(h); const sl = getSelection(); sl.removeAllRanges(); sl.addRange(r);
    const fin = () => { h.contentEditable = "false"; const v = h.textContent.trim(); if (v) { l.name = v.slice(0, 40); save(); } renderList(); renderLists(); };
    h.onblur = fin; h.onkeydown = ev => { if (ev.key === "Enter") { ev.preventDefault(); h.blur(); } }; };
  $("lDelete").onclick = () => { if (!delArm) { delArm = true; $("lDelete").textContent = t("confirmDel"); return; }
    prefs.lists = prefs.lists.filter(l => l.id !== listKey); if (prefs.para && prefs.para.list === listKey) delete prefs.para; save(); renderLists(); location.hash = "lists"; };
  $("lItems").onclick = e => { const l = listById(listKey); if (!l) return; const u = e.target.closest("[data-lup]"), d = e.target.closest("[data-ldown]"), x = e.target.closest("[data-ldel]");
    if (u) moveItem(l, +u.dataset.lup, +u.dataset.lup - 1); else if (d) moveItem(l, +d.dataset.ldown, +d.dataset.ldown + 1);
    else if (x) { l.items.splice(+x.dataset.ldel, 1); save(); renderList(); } };
  $("paraGo").onclick = () => { const P = prefs.para, l = P && listById(P.list); if (!l) return;
    if (P.i + 1 < l.items.length) { P.i++; save(); location.hash = l.items[P.i]; } else { delete prefs.para; save(); location.hash = "list-" + l.id; } };
  $("paraPrev").onclick = () => { const P = prefs.para, l = P && listById(P.list); if (!l || P.i === 0) return; P.i--; save(); location.hash = l.items[P.i]; };
  $("markSheet").onclick = e => { if (e.target === $("markSheet")) closeMark(); const b = e.target.closest("[data-c]"); if (b) { markC = +b.dataset.c; paintSwatches(); } };
  $("markSave").onclick = saveMark;
  $("markClear").onclick = () => { markC = 0; $("markNote").value = ""; saveMark(); };
  $("marksBox").onclick = e => { const b = e.target.closest("[data-goto]"); if (!b) return; const k = b.dataset.goto, d = k.split("#")[0];
    prefs.jumpMark = k; if (!d.startsWith("s-") && !d.startsWith("p-")) { prefs.rmode = prefs.rmode || {}; prefs.rmode[d] = "n"; } save(); location.hash = d; };
  $("bkSave").onclick = backupSave;
  $("bkFile").onchange = e => { const f = e.target.files[0]; if (f) backupLoad(f); e.target.value = ""; };
  $("paraStop").onclick = () => { delete prefs.para; save(); paintPara(); };
  $("retPuja").onclick = () => { if (prefs.returnTo) location.hash = "p-" + prefs.returnTo.puja; };
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

  // new version: check whenever the app comes back to the screen, and reload once the new one takes over
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    const hadSW = !!navigator.serviceWorker.controller; let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (hadSW && !reloaded) { reloaded = true; location.reload(); } });
    navigator.serviceWorker.register("sw.js").then(reg => {
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") reg.update().catch(() => {}); });
    }).catch(() => {});
  }

  const setHdr = () => document.documentElement.style.setProperty("--hdr", document.querySelector(".bar").offsetHeight + "px");
  new ResizeObserver(setHdr).observe(document.querySelector(".bar")); setHdr();
  applyPrefs(); applyLang();
  if (!prefs.setupDone) openSetup();
  // no selecting or copying of the texts (search box excepted); screenshots remain possible
  ["copy", "cut", "contextmenu", "selectstart", "dragstart"].forEach(ev => document.addEventListener(ev, e => {
    const el = e.target && e.target.nodeType === 1 ? e.target : e.target && e.target.parentElement;
    if (!(el && el.closest("input,textarea"))) e.preventDefault();
  }));
  Promise.all([getJSON("data/index.json"), getJSON("data/pujas.json").catch(() => []), getJSON("data/days.json").catch(() => null), getJSON("data/glossary.json").catch(() => ({})), getJSON("data/stotras.json").catch(() => [])]).then(([j, pj, dy, gl, st]) => { INDEX = j; PUJAS = pj; DAYS = dy; GLOSS = gl; STOTRAS = st; renderDrawer(); $("dFavN").textContent = prefs.fav.length || ""; renderLists(); renderMarksCount(); route(); })
    .catch(() => ($("tiles").innerHTML = `<p class="empty">${t("listFail")}</p>`));
})();
