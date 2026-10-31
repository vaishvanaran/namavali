"""Build site/data/puja/*.json and site/data/pujas.json from content/puja/*.txt.

Text format (see content/README.md):
  key: value         header lines at the top (title, ta, en, deity, devata, devaya, devatam, when_ta, when_en, order)
  # X                a part (shown as a step in the puja's step bar)
  ## X               a section
  ### X              a small heading
  > line             verse lines (consecutive lines form one verse)
  ( sa | ta | en )   an instruction, in Sanskrit, Tamil and English
  ! line             an offering line (shown in bold)
  - a | b            list rows (consecutive rows form one list)
  @include name      insert content/puja/_common/name.txt
  @include-katha n   insert content/katha/n.txt (headings moved one level down)
  @namavali id ...   buttons that open those namavalis
  @link puja title   button that opens another puja (e.g. purvanga) at the part/section with that title
  @note ta | en      a note for the reader
  anything else      prose (consecutive lines kept together)
"""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / 'content'
OUT = ROOT / 'site' / 'data' / 'puja'


def expand(lines, depth=0):
    out = []
    for ln in lines:
        s = ln.strip()
        if s.startswith('@include-katha '):
            name = s.split(None, 1)[1].strip()
            for k in (CONTENT / 'katha' / f'{name}.txt').read_text(encoding='utf-8').split('\n'):
                out.append('#' + k if re.match(r'^#{1,2} ', k) else k)
            out.append('')
        elif s.startswith('@include '):
            name = s.split(None, 1)[1].strip()
            if depth > 5: raise SystemExit(f'include loop at {name}')
            out += [''] + expand((CONTENT / 'puja' / '_common' / f'{name}.txt').read_text(encoding='utf-8').split('\n'), depth + 1) + ['']
        else:
            out.append(ln)
    return out


def parse(path):
    raw = path.read_text(encoding='utf-8').split('\n')
    head, i = {}, 0
    while i < len(raw) and re.match(r'^[a-z_]+:\s', raw[i]):
        k, v = raw[i].split(':', 1); head[k.strip()] = v.strip(); i += 1
    subs = {'{देवाय}': head.get('devaya', ''), '{देवता}': head.get('devata', ''), '{देवतम्}': head.get('devatam', '')}
    lines = []
    for ln in expand(raw[i:]):
        for a, b in subs.items(): ln = ln.replace(a, b)
        lines.append(ln.rstrip())

    parts = []
    def part(title=''):
        parts.append({'title': title, 'sections': []})
    def sec(title=''):
        if not parts: part('')
        parts[-1]['sections'].append({'title': title, 'blocks': []})
    def blocks():
        if not parts or not parts[-1]['sections']: sec('')
        return parts[-1]['sections'][-1]['blocks']
    def add(kind, item):
        b = blocks()
        if b and b[-1]['t'] == kind and kind in ('verse', 'prose', 'list', 'offer') and not add.gap:
            b[-1]['x'].append(item)
        else:
            b.append({'t': kind, 'x': [item]})
        add.gap = False
    add.gap = True

    for ln in lines:
        s = ln.strip()
        if not s:
            add.gap = True; continue
        if s.startswith('### '):
            blocks().append({'t': 'h3', 'x': s[4:].strip()}); add.gap = True
        elif s.startswith('## '):
            sec(s[3:].strip()); add.gap = True
        elif s.startswith('# '):
            part(s[2:].strip()); add.gap = True
        elif s.startswith('> '):
            if blocks() and blocks()[-1]['t'] == 'verse' and add.gap is False: blocks()[-1]['x'].append(s[2:].strip())
            else: add('verse', s[2:].strip())
        elif s.startswith('!'):
            add('offer', s[1:].strip())
        elif s.startswith('- '):
            add('list', [c.strip() for c in s[2:].split('|')])
        elif s.startswith('(') and s.endswith(')') and '|' in s:
            p = [c.strip() for c in s[1:-1].split('|')] + ['', '']
            blocks().append({'t': 'rubric', 'sa': p[0], 'ta': p[1], 'en': p[2]}); add.gap = True
        elif s.startswith('@link '):
            bits = s.split(None, 2)
            blocks().append({'t': 'link', 'puja': bits[1], 'sec': bits[2].strip() if len(bits) > 2 else ''}); add.gap = True
        elif s.startswith('@namavali '):
            blocks().append({'t': 'namavali', 'ids': s.split()[1:]}); add.gap = True
        elif s.startswith('@note '):
            p = [c.strip() for c in s[6:].split('|')] + ['']
            blocks().append({'t': 'note', 'ta': p[0], 'en': p[1]}); add.gap = True
        else:
            add('prose', s)
    # drop empty sections/parts
    for p in parts:
        p['sections'] = [s for s in p['sections'] if s['blocks'] or s['title']]
    parts = [p for p in parts if p['sections']]
    return head, parts


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    known = set()
    idx_path = ROOT / 'site' / 'data' / 'index.json'
    if idx_path.exists():
        known = {i['id'] for i in json.loads(idx_path.read_text(encoding='utf-8'))['items']}
    listing, problems, links, titles = [], [], [], {}
    parsed = [(f.stem, *parse(f)) for f in sorted((CONTENT / 'puja').glob('*.txt'))]
    # `hidden: yes` keeps a page out of the app (e.g. until its svara is re-checked);
    # links to it, and a note just before such a link, are dropped from other pages.
    hidden = {pid for pid, head, _ in parsed if head.get('hidden', '').strip()}
    for pid in hidden: (OUT / f'{pid}.json').unlink(missing_ok=True)
    for pid, head, parts in parsed:
        if pid in hidden: continue
        for p in parts:
            for s in p['sections']:
                bl, keep = s['blocks'], []
                for i, b in enumerate(bl):
                    if b['t'] == 'link' and b['puja'] in hidden: continue
                    if b['t'] == 'note' and i + 1 < len(bl) and bl[i + 1]['t'] == 'link' and bl[i + 1]['puja'] in hidden: continue
                    keep.append(b)
                s['blocks'] = keep
        for p in parts:
            for s in p['sections']:
                for b in s['blocks']:
                    if b['t'] == 'namavali':
                        problems += [f'{pid}: unknown namavali "{n}"' for n in b['ids'] if known and n not in known]
                    if b['t'] == 'link': links.append((pid, b['puja'], b['sec']))
                    for x in (b.get('x') if isinstance(b.get('x'), list) else [b.get('x', '')]):
                        if isinstance(x, str) and '{' in x: problems.append(f'{pid}: unfilled placeholder in "{x[:40]}"')
        doc = {'id': pid, **{k: head.get(k, '') for k in ('title', 'ta', 'en', 'deity', 'when_ta', 'when_en', 'kind', 'sukta')}, 'parts': parts}
        titles[pid] = {p['title'] for p in parts} | {s['title'] for p in parts for s in p['sections']}
        (OUT / f'{pid}.json').write_text(json.dumps(doc, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
        listing.append({'id': pid, 'title': doc['title'], 'ta': doc['ta'], 'en': doc['en'], 'deity': doc['deity'],
                        'when_ta': doc['when_ta'], 'when_en': doc['when_en'], 'order': int(head.get('order', 100)), 'kind': head.get('kind', ''), 'sukta': head.get('sukta', ''), 'veda': head.get('veda', ''),
                        'parts': [p['title'] for p in parts]})
    for src, tgt, sec in links:
        if tgt in hidden: continue
        if tgt not in titles: problems.append(f'{src}: link to unknown puja "{tgt}"')
        elif sec and sec not in titles[tgt]: problems.append(f'{src}: "{tgt}" has no part or section "{sec}"')
    listing.sort(key=lambda x: (x['order'], x['id']))
    (ROOT / 'site' / 'data' / 'pujas.json').write_text(json.dumps(listing, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f'{len(listing)} pujas ({len(hidden)} hidden)')
    for p in problems: print('WARNING:', p)
    if problems and '--strict' in sys.argv: sys.exit(1)


if __name__ == '__main__':
    main()
