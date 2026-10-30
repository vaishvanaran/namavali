"""Convert namavali-manjari .tex files into JSON blocks for the app."""
import re, json, sys, pathlib

DIG = str.maketrans('', '', '०१२३४५६७८९0123456789')

def braces(s, i):
    """read consecutive {..} groups starting at i; return (groups, end)"""
    groups = []
    while True:
        j = i
        while j < len(s) and s[j] in ' \t\n': j += 1
        if j >= len(s) or s[j] != '{': return groups, i
        depth, k = 0, j
        while k < len(s):
            if s[k] == '{': depth += 1
            elif s[k] == '}':
                depth -= 1
                if depth == 0: break
            k += 1
        groups.append(s[j+1:k]); i = k + 1

def clean(t):
    t = re.sub(r'\\mbox\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}', r'\1', t)
    t = re.sub(r'\\hfill\s*\\devanumber\{\d+\}', '', t)
    t = re.sub(r'\\devanumber\{\d+\}', '', t)
    t = re.sub(r'\\hfill\s*[०-९0-9]*', '', t)
    t = t.replace('\\-', '').replace('~', ' ')
    t = t.replace('\u200c', '')
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def parse(path):
    src = pathlib.Path(path).read_text(encoding='utf-8')
    src = src.replace('\\\\%', '\\\\ %')
    src = '\n'.join(re.sub(r'(?<!\\)%.*$', '', l) for l in src.split('\n'))
    title, blocks, buf = None, [], []
    def flush():
        txt = ''.join(buf); buf.clear()
        for raw in re.split(r'\\\\', txt):
            for line in raw.split('\n'):
                c = clean(line)
                if not c: continue
                if blocks and blocks[-1]['t'] == 'end' and blocks[-1]['x'].count('॥') < 2:
                    blocks[-1]['x'] += ' ' + c; continue
                if c.startswith('॥इति') or c.startswith('॥ इति') or c.startswith('॥ अथ'):
                    blocks.append({'t': 'end', 'x': c}); continue
                if blocks and blocks[-1]['t'] == 'names': blocks[-1]['x'].append(c)
                else: blocks.append({'t': 'names', 'x': [c]})
    i = 0
    while i < len(src):
        m = re.compile(r'\\([a-zA-Z]+)\*?').match(src, i)
        if not m:
            buf.append(src[i]); i += 1; continue
        cmd = m.group(1)
        if cmd in ('chapt', 'sect', 'dnsub', 'centerline'):
            flush(); g, i = braces(src, m.end()); val = clean(g[0])
            if cmd in ('chapt', 'sect'): title = val
            elif cmd == 'dnsub': blocks.append({'t': 'head', 'x': val})
            else: blocks.append({'t': 'end', 'x': val})
        elif cmd.endswith('shloka'):
            flush(); g, i = braces(src, m.end())
            blocks.append({'t': 'shloka', 'x': [clean(x) for x in g]})
        elif cmd in ('begin', 'end', 'setmainfont'):
            j = m.end()
            if src[j:j+1] == '[': j = src.index(']', j) + 1
            g, i = braces(src, j)
            if cmd == 'begin' and g and g[0] == 'multicols': _, i = braces(src, i)
        elif cmd in ('hfill', 'devanumber', 'mbox'):
            buf.append(src[i:m.end()]); i = m.end()
        else:
            buf.append(src[i:m.end()]); i = m.end()
    flush()
    return title, tidy(blocks)

def is_name(x):
    x = x.rstrip('।॥ ')
    return x.endswith('नमः') or x.endswith('नमः॑') or 'नमः' in x[-6:]

def tidy(blocks):
    out = []
    for b in blocks:
        if b['t'] != 'names': out.append(b); continue
        xs = b['x']
        if all(is_name(x) or re.search('[॒॑]', x) for x in xs) or not any(is_name(x) for x in xs):
            out.append(b); continue
        first = next(i for i, x in enumerate(xs) if is_name(x))
        last = max(i for i, x in enumerate(xs) if is_name(x))
        if first: out.append({'t': 'para', 'x': xs[:first]})
        names, carry = [], ''
        for x in xs[first:last+1]:
            if is_name(x): names.append((carry + x).strip()); carry = ''
            else: carry += x if x.endswith('-') else x + ' '
        out.append({'t': 'names', 'x': names})
        if last < len(xs) - 1: out.append({'t': 'para', 'x': xs[last+1:]})
    return out

if __name__ == '__main__':
    t, b = parse(sys.argv[1])
    print(t); print(json.dumps(b, ensure_ascii=False, indent=0)[:3000])
