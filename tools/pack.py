"""Deploy step: turn site/data/**/*.json into packed .dat files (zlib + xor) so the
published data is not plain readable text. The app's getJSON() reads either form."""
import pathlib, zlib
KEY = b'pujanidhi:nidhishvara-shrautinah'
site = pathlib.Path(__file__).parent.parent / 'site'
n = 0
for f in (site / 'data').rglob('*.json'):
    z = zlib.compress(f.read_bytes(), 9)
    f.with_suffix('.dat').write_bytes(bytes(b ^ KEY[i % len(KEY)] for i, b in enumerate(z)))
    f.unlink(); n += 1
print('packed', n)
