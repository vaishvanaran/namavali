"""Convert a puja from the friend's puja-vidhanam (.tex) into our content/puja text format (a draft to be checked).

usage: python3 tools/tex2puja.py <puja.tex> [out.txt]
The result follows the house rules: pūrvāṅga sections become links to the common pūrvāṅga page,
blanks become ___, Vedic (svara) mantras are left out (they live on the vidhāna pages), and
naivedya pariṣecana is kept without svara.
"""
import re, sys, pathlib

PV = pathlib.Path('/home/claude/src/pv')
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools'))
from catalog import ITEMS

NAMAVALI_BY_SRC = {src.rsplit('/', 1)[-1].replace('.tex', ''): iid for iid, src, *_ in ITEMS}
PURVANGA = {'vighneshwara-puja': 'विघ्नेश्वर-पूजा', 'aasana-puja': 'आसन-पूजा', 'ghanta-puja': 'घण्टा-पूजा',
            'kalasha-puja': 'कलश-पूजा', 'aatma-puja': 'आत्म-पूजा', 'pitha-puja': 'पीठ-पूजा',
            'guru-dhyanam': 'गुरु-ध्यानम्', 'prana-pratishtha': 'प्राण-प्रतिष्ठा'}
IGNORE = set('medskip smallskip bigskip hfill nobreak clearpage newpage small scriptsize footnotesize normalsize large Large '
             'sffamily bfseries rmfamily centering begingroup endgroup closesection closesub noindent par relax footnotemark '
             'vfill linebreak pagebreak tamfamily itshape'.split())
VEDA = False   # True for Vedic karmas (upākarma, sūrya-namaskāra …): svara mantras are kept
SVARA = re.compile('[॒॑᳚᳛]')
PARISHECHANA = re.compile('परिषिञ्चामि|प्राणाय स्वाहा|अपानाय स्वाहा|अमृतोपस्तरण|अमृतापिधान|ब्रह्मणि म आत्मा|देव सवितः|तत्सवितु')


class TeX:
    def __init__(self):
        self.macros = {}   # name -> (nargs, body)
        self.out = []
        self.katha = []

    # ---------- reading helpers ----------
    @staticmethod
    def group(s, i):
        """s[i] == '{' -> (content, index after closing brace)"""
        assert s[i] == '{', s[i:i + 30]
        d, j = 0, i
        while j < len(s):
            c = s[j]
            if c == '\\': j += 2; continue
            if c == '{': d += 1
            elif c == '}':
                d -= 1
                if d == 0: return s[i + 1:j], j + 1
            j += 1
        raise ValueError('unbalanced ' + s[i:i + 60])

    def args(self, s, i, n, optional_star=True):
        if optional_star and i < len(s) and s[i] == '*': i += 1
        out = []
        for _ in range(n):
            while i < len(s) and s[i] in ' \n\t': i += 1
            if i < len(s) and s[i] == '[':
                i = s.index(']', i) + 1
                while i < len(s) and s[i] in ' \n\t': i += 1
            if i < len(s) and s[i] == '{':
                a, i = self.group(s, i)
            else:
                m = re.match(r'\\[A-Za-z]+|.', s[i:], re.S); a = m.group(0) if m else ''; i += len(a)
            out.append(a)
        return out, i

    def define(self, s, i):
        while s[i] in ' \n': i += 1
        if s[i] == '{': name, i = self.group(s, i)
        else:
            m = re.match(r'\\[A-Za-z]+', s[i:]); name = m.group(0); i += len(name)
        name = name.strip().lstrip('\\')
        n = 0
        m = re.match(r'\s*\[(\d)\]', s[i:])
        if m: n = int(m.group(1)); i += m.end()
        m2 = re.match(r'\s*\[[^\]]*\]', s[i:])
        if m2: i += m2.end()
        while s[i] in ' \n': i += 1
        body, i = self.group(s, i)
        self.macros[name] = (n, body)
        return i

    # ---------- expansion to marked-up text ----------
    def run(self, s):
        s = re.sub(r'(?<!\\)%.*', '', s)
        o, i = [], 0
        while i < len(s):
            c = s[i]
            if c == '\\':
                m = re.match(r'\\([A-Za-z]+)|\\(.)', s[i:])
                if not m: i += 1; continue
                name = m.group(1) or m.group(2); i += m.end()
                if m.group(2):
                    o.append({'\\': '\n', '-': '', ' ': ' ', '&': '&', '%': '%', '_': '_', ',': ' '}.get(name, '')); continue
                r, i = self.cs(name, s, i)
                o.append(r)
            elif c == '{':
                a, i = self.group(s, i); o.append(self.run(a))
            elif c == '}': i += 1
            elif c == '~': o.append(' '); i += 1
            else: o.append(c); i += 1
        return ''.join(o)

    def cs(self, name, s, i):
        if name in ('newcommand', 'renewcommand', 'providecommand'):
            return '', self.define(s, i)
        if name in IGNORE: return '', i
        if name in ('setlength', 'addtolength', 'setcounter'):
            _, i = self.args(s, i, 2, False); return '', i
        if name == 'let':
            m = re.match(r'\s*\\[A-Za-z]+\s*=?\s*\\[A-Za-z]+', s[i:]); return '', i + (m.end() if m else 0)
        if name == 'kshama':
            m = re.match(r'\s*\{', s[i:])
            arg = 'तमच्युतम्'
            if m: a, i = self.args(s, i, 1, False); arg = a[0] or arg
            n_, body = self.macros['kshama']; return self.run(body.replace('#1', arg)), i
        if name in ('see', 'label', 'needspace', 'footnotetext', 'pageref', 'ref', 'vspace', 'hspace', 'columnseprule', 'includegraphics'):
            _, i = self.args(s, i, 1); return '', i
        if name == 'hyperref':
            a, i = self.args(s, i, 1); return self.run(a[0]), i
        if name in ('chapt', 'chapter'):
            a, i = self.args(s, i, 1); return f'\n@@TITLE {self.run(a[0]).strip()}\n', i
        if name == 'uvacha':
            a, i = self.args(s, i, 1); return f'\n\n### {self.run(a[0]).strip()}\n\n', i
        if name in ('sect', 'section'):
            a, i = self.args(s, i, 1); return f'\n\n# {self.run(a[0]).strip()}\n\n', i
        if name in ('dnsub', 'subsection'):
            a, i = self.args(s, i, 1); return f'\n\n## {self.run(a[0]).strip()}\n\n', i
        if name in ('twolineshloka', 'threelineshloka', 'fourlineindentedshloka', 'fourlineshloka'):
            n = {'twolineshloka': 2, 'threelineshloka': 3}.get(name, 4)
            a, i = self.args(s, i, n)
            ls = [re.sub(r'\s+', ' ', self.run(x)).strip() for x in a]
            if n == 4: ls = [ls[0] + ' ' + ls[1], ls[2] + ' ' + ls[3]]
            if n == 3: ls = [ls[0] + ' ' + ls[1], ls[2]]
            ls = [l.rstrip('।॥ ') for l in ls]
            return '\n\n' + '\n'.join('> ' + l + ('॥' if k == len(ls) - 1 else '।') for k, l in enumerate(ls)) + '\n\n', i
        if name == 'textbf':
            a, i = self.args(s, i, 1); return '\x01' + self.run(a[0]) + '\x02', i
        if name == 'centerline':
            a, i = self.args(s, i, 1)
            if re.match(r'\s*\\(scriptsize|footnotesize|small)', a[0]): return '', i
            return '\n' + self.run(a[0]).strip() + '\n', i
        if name == 'instruct':
            a, i = self.args(s, i, 3)
            sa, en, ta = (re.sub(r'\s+', ' ', self.run(x)).strip() for x in a)
            return f'\n\n( {sa} | {ta} | {en} )\n\n', i
        if name == 'pujanote':
            a, i = self.args(s, i, 1); return f'\n\n{self.run(a[0]).strip()}\n\n', i
        if name == 'ifbool':
            a, i = self.args(s, i, 3, False)
            flag = a[0].strip()
            pick = a[2] if flag == 'veda' and not VEDA else a[1]   # no Vedic mantras inline (unless a Vedic karma); kathas included
            return self.run(pick), i
        if name == 'ifblank':
            a, i = self.args(s, i, 3, False); return self.run(a[1] if not a[0].strip() else a[2]), i
        if name == 'input':
            a, i = self.args(s, i, 1, False); return self.include(a[0].strip()), i
        if name == 'item':
            return '\n- ', i
        if name == 'begin':
            a, i = self.args(s, i, 1, False); env = a[0]
            b_, e_, d, j = '\\begin{' + env + '}', '\\end{' + env + '}', 1, i
            while d:
                nb, ne = s.find(b_, j), s.find(e_, j)
                if ne < 0: return '', i          # unmatched: ignore the \\begin
                if 0 <= nb < ne: d += 1; j = nb + len(b_)
                else: d -= 1; j = ne + len(e_)
            inner, i = s[i:j - len(e_)], j
            return self.env(env, inner), i
        if name == 'end':
            _, i = self.args(s, i, 1, False); return '', i
        if name in self.macros:
            n, body = self.macros[name]
            a, i = self.args(s, i, n, False) if n else ([], i)
            for k, x in enumerate(a): body = body.replace('#' + str(k + 1), x)
            return self.run(body), i
        return '', i   # unknown: drop

    def env(self, env, inner):
        if env in ('longtable', 'supertabular', 'tabular'):
            spec, j = self.group(inner, inner.index('{'))
            seps = self.colseps(spec)
            rows = [r for r in self.split_top(inner[j:], '\\\\') if r.strip()]
            out = []
            for r in rows:
                cells = [re.sub(r'\s+', ' ', self.run(c)).strip() for c in self.split_top(self.run_ifs(r), '&')]
                txt = ''.join(seps[0] + ''.join(c + (seps[k + 1] if k + 1 < len(seps) else ' ') for k, c in enumerate(cells)))
                txt = re.sub(r'\s+', ' ', txt).strip()
                if txt: out.append('- ' + txt)
            return '\n\n' + '\n'.join(out) + '\n\n'
        if env == 'multicols':
            inner = re.sub(r'^\{\d\}', '', inner.lstrip()); return self.run(inner)
        if env in ('minipage',):
            inner = re.sub(r'^\{[^}]*\}', '', inner.lstrip()); return self.run(inner)
        return self.run(inner)

    @staticmethod
    def split_top(s, sep):
        out, d, cur, i = [], 0, '', 0
        while i < len(s):
            if s.startswith('\\', i) and not s.startswith(sep, i): cur += s[i:i + 2]; i += 2; continue
            if s[i] == '{': d += 1
            elif s[i] == '}': d -= 1
            if d == 0 and s.startswith(sep, i): out.append(cur); cur = ''; i += len(sep); continue
            cur += s[i]; i += 1
        out.append(cur); return out

    def run_ifs(self, r):
        # resolve \ifbool{veda}{A}{B} inside a table row before splitting cells (A may contain &)
        while True:
            k = r.find('\\ifbool')
            if k < 0: return r
            a, j = self.args(r, k + len('\\ifbool'), 3, False)
            r = r[:k] + (a[2] if a[0].strip() == 'veda' and not VEDA else a[1]) + r[j:]

    def colseps(self, spec):
        """'ll@{~नमः — }l@{-पत्रं समर्पयामि}' -> text after each column: ['', ' ', ' नमः — ', '-पत्रं समर्पयामि']"""
        seps, k = [''], 0
        while k < len(spec):
            c = spec[k]
            if c in 'lcr': seps.append(' '); k += 1
            elif c == 'p': _, k = self.group(spec, k + 1); seps.append(' ')
            elif c == '@':
                g, k = self.group(spec, k + 1); seps[-1] = self.run(g).replace('~', ' ')
            else: k += 1
        return seps

    def include(self, path):
        p = path.replace('.tex', '')
        if p.startswith('purvanga/'):
            key = p.split('/', 1)[1]
            if key in PURVANGA: return f'\n\n@link purvanga {PURVANGA[key]}\n\n'
            return self.run((PV / (p + '.tex')).read_text(encoding='utf-8'))
        if 'namavali-manjari' in p:
            iid = NAMAVALI_BY_SRC.get(p.rsplit('/', 1)[-1])
            return f'\n\n@namavali {iid}\n\n' if iid else ''
        if p == 'pujas/MahaNyasah':
            return '\n\n@note மஹாந்யாஸம், ருத்ர ஜபம் — தனிப் பக்கங்களில் | Mahānyāsa and Rudra japa — on their own pages\n\n@link rudra-prashna\n\n@link chamaka-prashna\n\n'
        if p.startswith('pujas/') and (PV / (p + '.tex')).exists():
            return self.run((PV / (p + '.tex')).read_text(encoding='utf-8'))
        if p.startswith('kathas/'):
            self.katha.append(p); return f'\n\n@@KATHA {p}\n\n'
        return ''   # stotras etc. from other books are left out


def load_preamble(t):
    for f in ['preamble.tex', 'purana-dhyana-shloka.tex']:
        src = (PV / f).read_text(encoding='utf-8')
        src = re.sub(r'(?<!\\)%.*', '', src)
        for m in re.finditer(r'\\(?:re)?newcommand', src):
            try: t.define(src, m.end())
            except Exception: pass


def tidy(text):
    """marked text -> our line format"""
    text = re.sub(r'\x01([^\x02]*)\x02', lambda m: '\x01' + re.sub(r'\s*\n\s*', '\x02\n\x01', m.group(1).strip()) + '\x02', text)
    lines, out = text.replace('\r', '').split('\n'), []
    for ln in lines:
        s = re.sub(r'[ \t]+', ' ', ln).strip()
        s = s.replace('(   )', '___').replace('( )', '___').replace('()', '___')
        s = re.sub(r'\(\s*\)', '___', s)
        if not s: out.append(''); continue
        if s.startswith(('> ', '#', '- ', '@', '( ')):
            out.append(s.replace('\x01', '').replace('\x02', '')); continue
        if s.startswith('\x01') and s.endswith('\x02') and s.count('\x01') == 1:
            out.append('! ' + s[1:-1].strip()); continue
        out.append(s.replace('\x01', '').replace('\x02', ''))
    # merge, drop vedic (svara) lines except naivedya parishechana
    res = []
    for s in out:
        if SVARA.search(s) and not VEDA:
            if PARISHECHANA.search(s): s = SVARA.sub('', s)
            else: continue
        res.append(s)
    # English explanations from the book are left out (the app has its own Tamil/English notes)
    res = [x for x in res if not (re.search('[A-Za-z]{3}', x) and not re.search('[ऀ-ॿ]', x) and not x.startswith(('#', '@', '(')))]
    # a sankalpa printed one item per line becomes one paragraph
    j = 0
    while j < len(res):
        if 'ममोपात्त' in res[j] and not res[j].startswith('>'):
            k = j
            while k < len(res) - 1 and 'करिष्ये' not in res[k] and k - j < 40 and not res[k + 1].startswith(('#', '>', '@')): k += 1
            if 'करिष्ये' in res[k]:
                joined = ' '.join(x.lstrip('! ').strip() for x in res[j:k + 1] if x.strip())
                res[j:k + 1] = [re.sub(r'\s+', ' ', joined).replace('- ', '-').replace(' -', '-')]
        j += 1
    t = '\n'.join(res)
    t = re.sub(r'\n{3,}', '\n\n', t)
    t = re.sub(r'\(\s*___\s*\)', '___', t)
    return t.strip() + '\n'


STD_OPEN = '''( आचम्य | ஆசமனம் செய்யவும் | Do āchamanam )

> शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम्।
> प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये॥

( प्राणान् आयम्य | ப்ராணாயாமம் செய்யவும் | Do prāṇāyāmam )

ॐ भूः। ॐ भुवः। ॐ सुवः। ॐ महः। ॐ जनः। ॐ तपः। ॐ सत्यम्।
ॐ तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि। धियो यो नः प्रचोदयात्॥
ओमापो ज्योती रसोऽमृतं ब्रह्म भूर्भुवस्सुवरोम्॥
'''
LINKS_AFTER = ['विघ्नेश्वर-उद्वासनम्', 'आसन-पूजा', 'घण्टा-पूजा', 'कलश-पूजा', 'आत्म-पूजा', 'पीठ-पूजा', 'गुरु-ध्यानम्', 'प्राण-प्रतिष्ठा']


def restructure(t):
    """pūrvāṅga part: vighneshwara link, our standard opening + the puja's own sankalpa, then the pūrvāṅga links"""
    if '@link purvanga विघ्नेश्वर-पूजा' not in t: return t
    head, rest = t.split('@link purvanga विघ्नेश्वर-पूजा', 1)
    # the sankalpa paragraph(s): from ममोपात्त to the end of करिष्ये।
    m = re.search(r'ममोपात्त.*?करिष्ये।(?:\s*तदङ्गं[^\n।]*करिष्ये।)?', rest, re.S)
    if not m: return t
    sank = re.sub(r'\s*\n\s*', ' ', m.group(0)).strip()
    # everything after the sankalpa up to the first part that is not pūrvāṅga
    after = rest[m.end():]
    k = re.search(r'\n# ', after)
    tail = after[k.start():] if k else ''
    mid = after[:k.start()] if k else after
    keep = []
    for ln in mid.split('\n'):
        if ln.startswith('@link purvanga') or 'यथास्थानं प्रतिष्ठापयामि' in ln or 'गणपति-प्रसादं' in ln: continue
        keep.append(ln)
    mid = '\n'.join(keep).strip()
    if re.search(r'^(?!#)\S', mid, re.M):
        tail = '\n\n# प्रधान-पूजा\n\n' + mid + '\n' + tail
    body = (f'{head.rstrip()}\n\n# पूर्वाङ्गम्\n\n@link purvanga विघ्नेश्वर-पूजा\n\n## सङ्कल्पः\n\n{STD_OPEN}\n{sank}\n\n'
            '( इति पात्रस्थं जलं स्पृशेत् | என்று சொல்லி பாத்ரத்திலுள்ள ஜலத்தைத் தொடவும் | Touch the water in the vessel )\n\n'
            + '\n'.join(f'@link purvanga {x}' for x in LINKS_AFTER) + '\n' + tail)
    return body


UPA = [('स्वर्णपुष्प', None), ('मन्त्रपुष्प', 'मन्त्रपुष्पम्'), ('ध्यायामि', 'ध्यानम्'), ('वाहयामि', 'आवाहनम्'), ('वाहनं', 'आवाहनम्'), ('आसनं', 'आसनम्'), ('रत्नसिंहासनं', 'आसनम्'),
       ('पाद्यं', 'पाद्यम्'), ('अर्घ्यं', 'अर्घ्यम्'), ('आचमनीयं', 'आचमनीयम्'), ('आचमनं', 'आचमनीयम्'), ('मधुपर्कं', 'मधुपर्कः'),
       ('पञ्चामृत', 'पञ्चामृत-स्नानम्'), ('शुद्धोदक', 'शुद्धोदक-स्नानम्'), ('स्नानं', 'शुद्धोदक-स्नानम्'), ('वस्त्र', 'वस्त्रम्'),
       ('यज्ञोपवीत', 'यज्ञोपवीतम्'), ('उपवीतं', 'यज्ञोपवीतम्'), ('कण्ठसूत्र', 'यज्ञोपवीतम्'), ('आभरण', 'आभरणानि'), ('भूषणानि', 'आभरणानि'),
       ('गन्ध', 'गन्धः'), ('अक्षता', 'अक्षताः'), ('पुष्प', 'पुष्पाणि'), ('धूप', 'धूपः'), ('दीपं', 'दीपः'), ('दीप', 'दीपः'),
       ('नैवेद्य', 'नैवेद्यम्'), ('निवेदयामि', 'नैवेद्यम्'), ('ताम्बूल', 'ताम्बूलम्'), ('नीराजन', 'नीराजनम्'), ('मन्त्रपुष्प', 'मन्त्रपुष्पम्'),
       ('प्रदक्षिण', 'प्रदक्षिण-नमस्काराः'), ('नमस्कारान्', 'प्रदक्षिण-नमस्काराः'), ('प्रार्थना', 'प्रार्थना'), ('राजोपचार', 'राजोपचाराः'),
       ('छत्त्र', 'राजोपचाराः'), ('पानीयं', 'नैवेद्यम्')]


def upachara_heads(t):
    """inside the ṣoḍaśopacāra part, give each upacāra its own ## heading (the Vedic-vidhāna toggles find them by name)"""
    L = t.split('\n'); out, inpart, boundary, have, last = [], False, 0, False, None
    for ln in L:
        if ln.startswith('# '):
            inpart = any(k in ln for k in ('पचार', 'उत्तराङ्ग', 'प्रधान')); boundary = len(out) + 1; have = False; last = None; out.append(ln); continue
        if ln.startswith('## '):
            have = True; boundary = len(out) + 1; out.append(ln); continue
        out.append(ln)
        if ln.startswith('अमृतापिधान') and boundary == len(out) - 1: boundary = len(out); continue
        if inpart and ln.startswith('! '):
            name = None if 'नन्तरम्' in ln else next((n for k, n in UPA if k in ln), None) if not any(k in ln for k in ('स्वर्णपुष्प',)) else None
            if name and not have and name != last:
                out.insert(boundary, f'\n## {name}\n')
            last = name or last
            boundary = len(out); have = False
    t = re.sub(r'\n{3,}', '\n\n', '\n'.join(out))
    return re.sub(r'(\n- [^\n]*)\n\n(?=- )', r'\1\n', re.sub(r'(\n- [^\n]*)\n\n(?=- )', r'\1\n', t))


NAIV_PRE = """ॐ भूर्भुवः सुवः। ॐ तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि। धियो यो नः प्रचोदयात्।
देव सवितः प्रसुव। सत्यं त्वर्तेन परिषिञ्चामि। अमृतमस्तु। अमृतोपस्तरणमसि।
ॐ प्राणाय स्वाहा। ॐ अपानाय स्वाहा। ॐ व्यानाय स्वाहा। ॐ उदानाय स्वाहा। ॐ समानाय स्वाहा। ॐ ब्रह्मणे स्वाहा।
ब्रह्मणि म आत्माऽमृतत्वाय॥"""
NAIV_POST = "अमृतापिधानमसि। निवेदनानन्तरम् आचमनीयं समर्पयामि। मध्ये मध्ये पानीयं समर्पयामि।"
NAIV_DROP = re.compile('परिषिञ्चामि|प्राणाय स्वाहा|अपानाय स्वाहा|व्यानाय स्वाहा|उदानाय स्वाहा|समानाय स्वाहा|ब्रह्मणे स्वाहा|अमृतोपस्तरण|अमृतापिधान|ब्रह्मणि म आत्मा|देव सवितः|मध्ये मध्ये|निवेदनानन्तरम्|नैवेद्यानन्तरम्|^ॐ भूर्भुवः सुवः')


def naivedya(t):
    """one uniform naivedya pariṣecana (no svara) around the naivedya offering, as in our Vighneśvara pūjā"""
    out, done = [], False
    for l in t.split('\n'):
        m = re.search(r'(नैवेद्यं|नैवेद्यम्|नैवेद्यानि|निवेदयामि)[^।]*(।|$)', l)
        if not l.startswith(('> ', '#', '@', '- ', '(')) and m and not done:
            offer = l[:m.end()].lstrip('! ').strip()
            out += NAIV_PRE.split('\n') + ['! ' + offer, NAIV_POST]; done = True; continue
        if NAIV_DROP.search(l) and not l.startswith(('> ', '#', '@')): continue
        out.append(l)
    return '\n'.join(out)


def convert(path, veda=False):
    global VEDA; VEDA = veda
    t = TeX(); load_preamble(t)
    src = pathlib.Path(path).read_text(encoding='utf-8')
    raw = t.run(src)
    m = re.search(r'@@TITLE (.+)', raw); title = m.group(1).strip() if m else ''
    raw = raw.replace(m.group(0), '') if m else raw
    raw = re.sub(r'\b\d+(?:em|pt|ex)\b', '', raw)
    txt = upachara_heads(naivedya(restructure(tidy(raw))))
    # drop the old "प्रधान-पूजा" part heading left empty, and duplicate shuklambara before sankalpa
    txt = re.sub(r'\n# प्रधान-पूजा — (?![^\n]*याम)[^\n]*\n', '\n', txt)
    txt = re.sub(r'\n# प्रधान-पूजा — ([^\n]*)\n', r'\n# \1\n', txt)
    return title, txt, t.katha


if __name__ == '__main__':
    title, txt, kathas = convert(sys.argv[1])
    out = f'title: {title}\n\n' + txt
    if len(sys.argv) > 2: pathlib.Path(sys.argv[2]).write_text(out, encoding='utf-8')
    else: print(out)
    print('KATHAS:', kathas, file=sys.stderr)


def convert_katha(path):
    t = TeX(); load_preamble(t)
    raw = t.run(pathlib.Path(path).read_text(encoding='utf-8'))
    raw = re.sub(r'@@TITLE (.+)', r'\n# \1\n', raw)
    return tidy(raw)
