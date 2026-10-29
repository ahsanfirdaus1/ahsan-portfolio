const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createServer } = require('./server');

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
].filter(Boolean);
const CHROME_PATH = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));
const TMP = os.tmpdir();
const USER_DATA = path.join(TMP, 'chrome-qa-profile');
const CDP_PORT = 9222;
const HTTP_PORT = Number(process.env.PORT) || 3000;

function startServer() {
  const server = createServer();
  return new Promise((resolve) => {
    server.listen(HTTP_PORT, '127.0.0.1', () => {
      console.log(`Local HTTP server running at http://127.0.0.1:${HTTP_PORT}/`);
      resolve(server);
    });
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitForPageReady(send, timeoutMs = 15000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const res = await send('Runtime.evaluate', {
        expression: `({ state: document.readyState, hasContent: Boolean(document.querySelector('main')) })`,
        returnByValue: true
      });
      const value = res.result && res.result.value;
      if (value && value.state === 'complete' && value.hasContent) {
        return { complete: true, timeoutMs };
      }
    } catch (e) {
      // page may still be replacing its execution context
    }
    await sleep(250);
  }
  return { complete: false, timeoutMs };
}

async function getDebuggerUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch (e) {
      // wait
    }
    await sleep(250);
  }
  throw new Error('Could not get Chrome debugger URL');
}

async function run() {
  if (!CHROME_PATH) {
    throw new Error('Chrome not found. Set CHROME_PATH to the Chrome executable.');
  }

  const httpServer = await startServer();

  console.log('Spawning Chrome...');
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${USER_DATA}`,
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-extensions',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ], { stdio: 'ignore' });

  const cleanup = () => {
    try { chrome.kill(); } catch (e) {}
    try { httpServer.close(); } catch (e) {}
  };
  process.on('exit', cleanup);

  let exitCode = 1;
  try {
    const wsUrl = await getDebuggerUrl();
    console.log('Connected to Chrome CDP:', wsUrl);

    const ws = new WebSocket(wsUrl);
    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('[Browser Console]', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
      } else if (msg.method === 'Runtime.exceptionThrown') {
        console.error('[Browser Exception]', msg.params.exceptionDetails);
      }
    };

    await new Promise(r => ws.onopen = r);

    function send(method, params = {}) {
      const msgId = id++;
      return new Promise((resolve, reject) => {
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    // Enable events
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log(`Navigating to http://127.0.0.1:${HTTP_PORT}/ ...`);
    await send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/` });
    const ready = await waitForPageReady(send);
    if (!ready.complete) throw new Error(`Page did not finish loading within ${ready.timeoutMs}ms`);
    await sleep(2000); // let hero counters settle before assertions

    // Check DOM elements
    const evalRes = await send('Runtime.evaluate', {
      expression: `({
        title: document.title,
        heading: document.querySelector('.hero-title')?.innerText,
        sections: Array.from(document.querySelectorAll('section[id]')).map(s => s.id),
        stats: Array.from(document.querySelectorAll('.hero-stats li')).map(s => s.innerText.replace(/\\s+/g, ' ').trim()),
        jsReady: document.documentElement.classList.contains('js-ready'),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      })`,
      returnByValue: true
    });
    const pageData = evalRes.result.value;
    console.log('Page Evaluation Data:', JSON.stringify(pageData, null, 2));
    if (!pageData.title) {
      throw new Error('Page title is empty — QA attached to the wrong Chrome target');
    }

    // Project filter sanity check
    const filterCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = (name) => Array.from(document.querySelectorAll('[data-filter]')).find((b) => b.dataset.filter === name);
        const visible = () => Array.from(document.querySelectorAll('.project')).filter((p) => !p.hidden).map((p) => p.querySelector('h4')?.textContent?.trim());
        const names = {};
        for (const filter of ['all', 'ai-ml', 'systems']) {
          btn(filter)?.click();
          names[filter] = visible();
        }
        btn('all')?.click();
        return names;
      })()`,
      returnByValue: true
    });
    const filters = filterCheck.result.value;
    console.log('Project filter counts:', Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, v.length])));
    if (!filters['ai-ml'].includes('PPV')) throw new Error('PPV card missing from AI and ML filter');

    // Capture sections in dark mode
    const sections = ['home', 'about', 'featured', 'exploration', 'experience', 'education', 'insights', 'contact'];
    for (const sec of sections) {
      console.log(`Scrolling to #${sec}...`);
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.getElementById('${sec}');
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
            window.dispatchEvent(new Event('scroll'));
          }
        })()`
      });
      await sleep(1000);

      const screenshot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(screenshot.data, 'base64');
      const filename = path.join(TMP, `qa_${sec}.png`);
      fs.writeFileSync(filename, buffer);
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    }

    // Project grid close-up
    console.log('Capturing project grid...');
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.project-grid')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await sleep(1000);
    const gridShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(TMP, 'qa_projects.png'), Buffer.from(gridShot.data, 'base64'));
    console.log('Saved project grid screenshot: qa_projects.png');

    // Light mode pass
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
    for (const sec of ['home', 'about', 'featured', 'exploration', 'contact']) {
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.getElementById('${sec}');
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
            window.dispatchEvent(new Event('scroll'));
          }
        })()`
      });
      await sleep(1000);
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(TMP, `qa_light_${sec}.png`), Buffer.from(shot.data, 'base64'));
      console.log(`Saved light screenshot: qa_light_${sec}.png`);
    }

    // Mobile Viewport Test (390 x 844)
    console.log('Testing Mobile Viewport (390 x 844)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 0, behavior: 'instant' }); window.dispatchEvent(new Event('scroll'));`
    });
    await sleep(1000);
    const mobileOverflow = await send('Runtime.evaluate', {
      expression: 'document.documentElement.scrollWidth > document.documentElement.clientWidth',
      returnByValue: true
    });
    console.log('Mobile horizontal overflow:', mobileOverflow.result.value);
    if (mobileOverflow.result.value) throw new Error('Horizontal overflow detected at 390px width');
    const mobileScreenshot = await send('Page.captureScreenshot', { format: 'png' });
    const mobileBuffer = Buffer.from(mobileScreenshot.data, 'base64');
    const mobileFile = path.join(TMP, 'qa_mobile.png');
    fs.writeFileSync(mobileFile, mobileBuffer);
    console.log(`Saved mobile screenshot: ${mobileFile} (${mobileBuffer.length} bytes)`);

    ws.close();
    console.log('All QA tasks completed successfully!');
    exitCode = 0;
  } catch (err) {
    console.error('QA Script Error:', err);
  } finally {
    cleanup();
    process.exit(exitCode);
  }
}

run().catch((err) => {
  console.error('QA Script Error:', err);
  process.exit(1);
});
