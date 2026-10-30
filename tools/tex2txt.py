"""One-time helper: convert StotraSamhita puja/katha .tex into the simple Pujanidhi text format."""
import re, sys, pathlib

def braces(s, i):
    out = []
    while True:
        j = i
        while j < len(s) and s[j] in ' \t\n%': 
            if s[j] == '%':
                while j < len(s) and s[j] != '\n': j += 1
            j += 1
        if j >= len(s) or s[j] != '{': return out, i
        d, k = 0, j
        while k < len(s):
            if s[k] == '{': d += 1
            elif s[k] == '}':
                d -= 1
                if d == 0: break
            k += 1
        out.append(s[j+1:k]); i = k + 1

def clean(t, devaya=''):
    t = t.replace('\\devAya{}', devaya).replace('\\devAya', devaya)
    t = t.replace('\\OMshri', 'ॐ श्री-').replace('\\OM{}', 'ॐ').replace('\\OM', 'ॐ')
    t = re.sub(r'\\blank(\{\})?(\\see\{[^}]*\})?', '___ ', t)
    t = re.sub(r'\\see\{[^}]*\}', '', t)
    t = re.sub(r'\\textbf\{', '', t); t = re.sub(r'\\(small|medskip|bigskip|needspace\{[^}]*\}|noindent|hfill|rlap)', '', t)
    t = t.replace('\\-', '').replace('~', ' ').replace('{}', '')
    t = re.sub(r'\\\[[^\]]*\]', '', t)
    return t

def convert(path, devaya=''):
    s = pathlib.Path(path).read_text(encoding='utf-8')
    s = '\n'.join(re.sub(r'(?<!\\)%.*$', '', l) for l in s.split('\n'))
    out = []
    i = 0
    buf = []
    def flush():
        txt = ''.join(buf); buf.clear()
        txt = clean(txt, devaya)
        for line in re.split(r'\\\\|\n', txt):
            line = re.sub(r'[{}]', '', line).strip()
            line = re.sub(r'\s+', ' ', line)
            if not line: 
                if out and out[-1] != '': out.append('')
                continue
            if re.match(r'^\(.*\)$', line) or re.match(r'^\[.*\]$', line):
                out.append('( ' + line[1:-1].strip() + ' |  |  )')
            elif 'समर्पयामि' in line or 'धारयामि' in line or 'निवेदयामि' in line or 'दर्शयामि' in line or 'आघ्रापयामि' in line:
                out.append('! ' + line)
            else:
                out.append(line)
    while i < len(s):
        m = re.compile(r'\\([a-zA-Z]+)\*?').match(s, i)
        if not m:
            buf.append(s[i]); i += 1; continue
        cmd = m.group(1)
        if cmd in ('chapt',):
            flush(); g, i = braces(s, m.end())
            if g: out += ['', 'title: ' + clean(g[0]), '']
        elif cmd == 'sect':
            flush(); g, i = braces(s, m.end())
            if g: out += ['', '# ' + clean(g[0]), '']
        elif cmd == 'dnsub': flush(); g, i = braces(s, m.end()); out += ['', '## ' + clean(g[0]), '']
        elif cmd in ('uvacha', 'centerline'): flush(); g, i = braces(s, m.end()); out += ['', '### ' + clean(g[0]).strip('{}'), '']
        elif cmd.endswith('shloka'):
            flush(); g, i = braces(s, m.end())
            out += [''] + ['> ' + re.sub(r'\s+', ' ', clean(x)).strip() for x in g] + ['']
        elif cmd == 'input':
            flush(); g, i = braces(s, m.end()); out += ['', '@include ' + g[0], '']
        elif cmd == 'renewcommand':
            g, i = braces(s, m.end())
            if len(g) >= 2 and 'devAya' in g[0]: devaya = clean(g[1])
        elif cmd in ('begin', 'end'):
            g, i = braces(s, m.end())
            if cmd == 'begin' and g and g[0] in ('longtable', 'tabular', 'multicols'): _, i = braces(s, i)
            if cmd == 'begin' and g and g[0] == 'minipage': _, i = braces(s, i)
        elif cmd in ('ifbool',):
            g, i = braces(s, m.end())
            if len(g) >= 2: buf.append(g[1])
        elif cmd in ('item',):
            flush(); out.append('- '); i = m.end()
        elif cmd in ('graphicspath', 'includegraphics', 'resetShloka', 'closesub', 'closesection', 'columnbreak', 'centering', 'begingroup', 'endgroup', 'let', 'setlength', 'multicolumn', 'hiranyagarbha', 'bfseries'):
            g, i = braces(s, m.end())
        else:
            buf.append(s[i:m.end()]); i = m.end()
    flush()
    # tidy list items "- " followed by text on next line
    res = []
    for l in out:
        if res and res[-1] == '- ' and l: res[-1] = '- ' + l; continue
        if l.startswith('- ') and l.strip() == '-': res.append('- '); continue
        res.append(l)
    txt = '\n'.join(res)
    txt = re.sub(r'\n{3,}', '\n\n', txt)
    # table rows "१. & X & Y\" -> "- X | Y"
    txt = re.sub(r'^\s*[०-९]+\.\s*&\s*(.*?)\s*&\s*(.*?)(\s*&\s*)?$', lambda m: f'- {m.group(1)} | {m.group(2)}', txt, flags=re.M)
    return txt.strip() + '\n'

if __name__ == '__main__':
    print(convert(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else ''))
