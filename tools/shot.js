const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = '/tmp/claude-0/-home-claude/f33dec00-1d49-5b4c-80ba-c431692f0dd4/scratchpad/';
  const errs = [];
  for (const [name, w, h, hash, script, dark] of [
    ['home-phone', 400, 900, '', 'taml', false],
    ['home-desk', 1200, 900, '', 'taml', false],
    ['read-taml', 400, 900, '#dakshinamurti', 'taml', false],
    ['read-gran', 400, 900, '#lakshmi', 'gran', true],
    ['read-rudra', 1100, 800, '#rudra-300', 'deva', false],
    ['read-latn', 400, 800, '#lalita-300', 'latn', false],
  ]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: dark ? 'dark' : 'light' });
    p.on('console', m => m.type() === 'error' && errs.push(name + ': ' + m.text()));
    p.on('pageerror', e => errs.push(name + ': ' + e.message));
    await p.addInitScript(s => localStorage.setItem('nv-prefs', JSON.stringify({ script: s })), script);
    await p.goto('http://localhost:8765/' + hash); await p.waitForTimeout(900);
    const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (ov) errs.push(name + ': horizontal overflow');
    await p.screenshot({ path: out + name + '.png' });
  }
  const p = await b.newPage(); await p.goto('http://localhost:8765/'); await p.waitForTimeout(500);
  await p.fill('#q', 'lakshmi'); await p.waitForTimeout(200);
  console.log('search lakshmi ->', await p.$$eval('.card .e', e => e.map(x => x.textContent).join(', ')));
  await p.fill('#q', 'லலிதா'); console.log('search லலிதா ->', await p.$$eval('.card .e', e => e.map(x => x.textContent).join(', ')));
  await p.fill('#q', 'दुर्गा'); console.log('search दुर्गा ->', await p.$$eval('.card .e', e => e.map(x => x.textContent).join(', ')));
  console.log('errors:', errs);
  await b.close();
})();
