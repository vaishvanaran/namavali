"""Rebuild site/data/<id>.json for every content/namavali/<id>.txt and refresh its count/title
in site/data/index.json. Runs on GitHub, so a corrected namavali text reaches the site directly.
(New lists, or changes to deva/group/kind headers, still need the full tools/build.py.)"""
import json, pathlib, re, sys
ROOT = pathlib.Path(__file__).parent.parent
OUT = ROOT / 'site' / 'data'
TXT = ROOT / 'content' / 'namavali'
def parse_txt(path):
    head, blocks, i = {}, [], 0
    L = path.read_text(encoding='utf-8').split('\n')
    while i < len(L) and re.match(r'^[a-z]+:\s', L[i]):
        k, v = L[i].split(':', 1); head[k] = v.strip(); i += 1
    for ln in L[i:]:
        s = ln.strip()
        if not s: continue
        if s.startswith('## '): blocks.append({'t': 'head', 'x': s[3:]})
        elif s.startswith('> '):
            v = s[2:]; m = re.match(r'(.+?।)\s*(.+)', v)
            blocks.append({'t': 'shloka', 'x': [m.group(1), m.group(2)] if m else [v]})
        elif s.startswith('end:'): blocks.append({'t': 'end', 'x': s[4:].strip()})
        else:
            if blocks and blocks[-1]['t'] == 'names': blocks[-1]['x'].append(s)
            else: blocks.append({'t': 'names', 'x': [s]})
    return head, blocks
index = json.loads((OUT / 'index.json').read_text())
ids = {i['id']: i for i in index['items']}
n = 0
for f in sorted(TXT.glob('[a-z]*.txt')):
    if f.stem not in ids: continue
    h, b = parse_txt(f)
    doc = {'title': h['title'], 'blocks': b, 'id': f.stem, 'source': h.get('source', ''), 'svara': False}
    (OUT / f'{f.stem}.json').write_text(json.dumps(doc, ensure_ascii=False, separators=(',', ':')))
    it = ids[f.stem]; it['count'] = sum(len(x['x']) for x in b if x['t'] == 'names'); it['title'] = h['title']; n += 1
(OUT / 'index.json').write_text(json.dumps(index, ensure_ascii=False, separators=(',', ':')))
print(n, 'text namavalis refreshed')
