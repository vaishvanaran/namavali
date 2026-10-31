"""Build site/data/stotras.json and site/data/stotra/<id>.json from content/stotra/*.txt,
and mark linked namavalis in site/data/index.json ('st'). Runs on GitHub too, so edits to
content/stotra/*.txt reach the site without a local build.
Format: header lines (title, ta, en, group, optional namavali/order/note), then
'## heading', ': prose line', 'ta> '/'en> ' explanation in Tamil/English, and verses as consecutive lines separated by blank lines."""
import json, pathlib, re, sys
ROOT = pathlib.Path(__file__).parent.parent
OUT = ROOT / 'site' / 'data'
STO = ROOT / 'content' / 'stotra'
index = json.loads((OUT / 'index.json').read_text())
ids = {i['id']: i for i in index['items']}
gkeys = [g['key'] for g in index['groups']]
for i in index['items']: i.pop('st', None)
(OUT / 'stotra').mkdir(exist_ok=True)
stotras, errs = [], []
for f in sorted(STO.glob('*.txt')):
    head, blocks, buf = {}, [], []
    L = f.read_text(encoding='utf-8').split('\n'); i = 0
    while i < len(L) and re.match(r'^[a-z_]+:\s', L[i]):
        k, v = L[i].split(':', 1); head[k] = v.strip(); i += 1
    miss = [k for k in ('title', 'ta', 'en', 'group') if k not in head]
    if miss: errs.append(f'{f.name}: missing header {", ".join(miss)}'); continue
    if head['group'] not in gkeys: errs.append(f'{f.name}: unknown group {head["group"]}'); continue
    nv = head.get('namavali', '')
    if nv and nv not in ids: errs.append(f'{f.name}: no namavali {nv}'); nv = ''
    def flush():
        if buf: blocks.append({'t': 'shloka', 'x': buf[:]}); buf.clear()
    for ln in L[i:]:
        s = ln.strip()
        if not s: flush(); [b.pop('_open', None) for b in blocks[-1:]]; continue
        if s.startswith('ta> ') or s.startswith('en> '):
            flush(); k = s[:2]
            if not (blocks and blocks[-1]['t'] == 'note' and blocks[-1].get('_open')): blocks.append({'t': 'note', '_open': True})
            blocks[-1][k] = (blocks[-1][k] + '\n' if k in blocks[-1] else '') + s[4:]
            continue
        if blocks and blocks[-1].get('_open'): blocks[-1].pop('_open')
        if s.startswith('## '): flush(); blocks.append({'t': 'head', 'x': s[3:]})
        elif s.startswith(': '): flush(); blocks.append({'t': 'para', 'x': [s[2:]]})
        else: buf.append(s)
    flush()
    for b in blocks: b.pop('_open', None)
    (OUT / 'stotra' / f'{f.stem}.json').write_text(json.dumps({'id': f.stem, 'title': head['title'], 'blocks': blocks}, ensure_ascii=False, separators=(',', ':')))
    stotras.append({'id': f.stem, 'title': head['title'], 'ta': head['ta'], 'en': head['en'], 'group': head['group'],
                    'namavali': nv, 'note': head.get('note', ''), 'order': int(head.get('order', 500) or 500),
                    'verses': sum(1 for b in blocks if b['t'] == 'shloka')})
    if nv: ids[nv]['st'] = f.stem
keep = {x['id'] for x in stotras}
for j in (OUT / 'stotra').glob('*.json'):
    if j.stem not in keep: j.unlink()
stotras.sort(key=lambda x: (gkeys.index(x['group']), x['order'], x['id']))
(OUT / 'stotras.json').write_text(json.dumps(stotras, ensure_ascii=False, separators=(',', ':')))
(OUT / 'index.json').write_text(json.dumps(index, ensure_ascii=False, separators=(',', ':')))
print(len(stotras), 'stotras')
if errs:
    print('\n'.join(errs), file=sys.stderr)
    if '--strict' in sys.argv: sys.exit(1)
