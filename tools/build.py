"""Build site/data/*.json from namavali-manjari."""
import json, sys, pathlib, re
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from parse_tex import parse
from catalog import GROUPS, ITEMS, FIXES

NM = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '/home/claude/src/nm')
OUT = pathlib.Path(__file__).parent.parent / 'site' / 'data'
OUT.mkdir(parents=True, exist_ok=True)
SRC = {
  'stotrasamhita': {'ta': 'ஸ்தோத்ர ஸம்ஹிதா — நாமாவளீ மஞ்ஜரீ', 'en': 'StotraSamhita — Nāmāvalī-mañjarī', 'url': 'https://stotrasamhita.github.io/'},
  'yogesha': {'ta': 'திருவிடைமருதூர் யோகேஶ ஶர்மா', 'en': 'Thiruvidaimarudur Yogeśa Śarmā'},
}
# order of lists inside a group: text lists are placed after these ids
AFTER = {'navagraha': 'surya-mahabharata', 'dikpala': None}
TXT = pathlib.Path(__file__).parent.parent / 'content' / 'namavali'


def parse_txt(path):
    """content/namavali/<id>.txt: header lines, '## head', '> verse', one name per line, 'end: ...'."""
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

index = {'groups': [dict(zip(('key', 'deva', 'ta', 'en'), g)) for g in GROUPS], 'items': []}
kindOf = lambda n, k=None: k or ('1000' if n >= 900 else '300' if n >= 250 else '108' if n >= 90 else 'small')
def txt_item(f):
    h, b = parse_txt(f); iid = f.stem
    doc = {'title': h['title'], 'blocks': b, 'id': iid, 'source': h.get('source', ''), 'svara': False}
    (OUT / f'{iid}.json').write_text(json.dumps(doc, ensure_ascii=False, separators=(',', ':')))
    n = sum(len(x['x']) for x in b if x['t'] == 'names')
    return {'id': iid, 'deva': h['deva'], 'en': h['en'], 'group': h['group'], 'note': h.get('note', ''), 'count': n,
            'kind': kindOf(n, h.get('kind')), 'title': h['title'], 'source': doc['source'], 'svara': False}
used = set()
for (iid, src, deva, en, group, note) in ITEMS:
    if (TXT / f'{iid}.txt').exists():   # a checked text in content/namavali replaces the book version
        it = txt_item(TXT / f'{iid}.txt'); it['note'] = it['note'] or note
        index['items'].append(it); used.add(iid); continue
    t, b = parse(NM / src); doc = {'title': t, 'blocks': b}; s = 'stotrasamhita'
    for a, z in FIXES.get(iid, []):
        doc = json.loads(json.dumps(doc, ensure_ascii=False).replace(a, z))
    n = sum(len(x['x']) for x in doc['blocks'] if x['t'] == 'names')
    svara = bool(re.search('[॒॑᳚]', json.dumps(doc, ensure_ascii=False)))
    doc.update(id=iid, source=s, svara=svara)
    (OUT / f'{iid}.json').write_text(json.dumps(doc, ensure_ascii=False, separators=(',', ':')))
    index['items'].append({'id': iid, 'deva': deva, 'en': en, 'group': group, 'note': note,
                           'count': n, 'kind': kindOf(n), 'title': doc['title'], 'source': s, 'svara': svara})
for f in sorted(TXT.glob('[a-z]*.txt')):
    if f.stem not in used: index['items'].append(txt_item(f))
ORDER = 'dakshinamurti vyasa adi-shankara adi-shankara-24 acharya-parampara chandrashekharendra-guru chandrashekharendra jayendra lalita-300 lalita-1000 lakshmi-1000 durga-1000 saraswati-1008 navagraha surya surya-mahabharata chandra angaraka budha brihaspati shukra shani rahu ketu indra agni yama nirriti varuna vayu soma kubera ishana brahma vastu'.split()
index['items'].sort(key=lambda i: ORDER.index(i['id']) if i['id'] in ORDER else 500)
index['items'].sort(key=lambda i: [g[0] for g in GROUPS].index(i['group']))
# variants: lists of the same deity and kind become one card with a choice of pāṭha inside
vg = {}
for it in index['items']:
    vg.setdefault((it['group'], it['kind'], it['deva']), []).append(it)
for mem in vg.values():
    for it in mem:
        it['vg'] = mem[0]['id']
        if len(mem) > 1 and not it['note']: it['note'] = 'ப்ரஸித்த பாடம்'
index['sources'] = SRC
(OUT / 'index.json').write_text(json.dumps(index, ensure_ascii=False, separators=(',', ':')))
print(len(index['items']), 'lists;', sum(i['count'] for i in index['items']), 'names')
