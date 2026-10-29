"""Build site/data/*.json from namavali-manjari + book transcriptions."""
import json, sys, pathlib, re
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from parse_tex import parse
from catalog import GROUPS, ITEMS, FIXES

NM = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '/home/claude/src/nm')
OUT = pathlib.Path(__file__).parent.parent / 'site' / 'data'
OUT.mkdir(parents=True, exist_ok=True)
SRC = {
  'stotrasamhita': {'ta': 'ஸ்தோத்ர ஸம்ஹிதா — நாமாவளீ மஞ்ஜரீ', 'en': 'StotraSamhita — Nāmāvalī-mañjarī', 'url': 'https://stotrasamhita.github.io/'},
  'book': {'ta': 'அஷ்டோத்தர ஶதநாமாவளி ஶதகம் — ரா. முரளீக்ருஷ்ண ஶ்ரௌதி (வேதஶாஸ்த்ர ரிஸர்ச் சென்டர், 2009)', 'en': 'Aṣṭottara Śatanāmāvali Śatakam — R. Muralikrishna Shrouti', 'url': ''},
}
index = {'groups': [dict(zip(('key', 'deva', 'ta', 'en'), g)) for g in GROUPS], 'items': []}
for (iid, src, deva, en, group, note) in ITEMS:
    if src.startswith('book:'):
        doc = json.load(open(pathlib.Path(__file__).parent / 'book' / (src[5:] + '.json'))); s = 'book'
    else:
        t, b = parse(NM / src); doc = {'title': t, 'blocks': b}; s = 'stotrasamhita'
    for a, z in FIXES.get(iid, []):
        doc = json.loads(json.dumps(doc, ensure_ascii=False).replace(a, z))
    n = sum(len(x['x']) for x in doc['blocks'] if x['t'] == 'names')
    svara = bool(re.search('[॒॑᳚]', json.dumps(doc, ensure_ascii=False)))
    doc.update(id=iid, source=s, svara=svara)
    (OUT / f'{iid}.json').write_text(json.dumps(doc, ensure_ascii=False, separators=(',', ':')))
    kind = '1000' if n >= 900 else '300' if n >= 250 else '108'
    index['items'].append({'id': iid, 'deva': deva, 'en': en, 'group': group, 'note': note,
                           'count': n, 'kind': kind, 'title': doc['title'], 'source': s, 'svara': svara})
index['sources'] = SRC
(OUT / 'index.json').write_text(json.dumps(index, ensure_ascii=False, separators=(',', ':')))
print(len(index['items']), 'lists;', sum(i['count'] for i in index['items']), 'names')
