const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP, 'chrome-qa-profile');
const CDP_PORT = 9222;
const HTTP_PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function createLocalServer() {
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(__dirname, decodeURIComponent(reqPath));

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });
  });

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

async function getDebuggerUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const list = await res.json();
      if (list && list.length > 0 && list[0].webSocketDebuggerUrl) {
        return list[0].webSocketDebuggerUrl;
      }
    } catch (e) {
      // wait
    }
    await sleep(250);
  }
  throw new Error('Could not get Chrome debugger URL');
}

async function run() {
  const httpServer = await createLocalServer();

  console.log('Spawning Chrome...');
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${USER_DATA}`,
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ], { stdio: 'ignore' });

  const cleanup = () => {
    try { chrome.kill(); } catch (e) {}
    try { httpServer.close(); } catch (e) {}
  };
  process.on('exit', cleanup);

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
    await sleep(1500);

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
    console.log('Page Evaluation Data:', JSON.stringify(evalRes.result.value, null, 2));

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
      const filename = path.join(process.env.TEMP, `qa_${sec}.png`);
      fs.writeFileSync(filename, buffer);
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    }

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
      fs.writeFileSync(path.join(process.env.TEMP, `qa_light_${sec}.png`), Buffer.from(shot.data, 'base64'));
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
    const mobileScreenshot = await send('Page.captureScreenshot', { format: 'png' });
    const mobileBuffer = Buffer.from(mobileScreenshot.data, 'base64');
    const mobileFile = path.join(process.env.TEMP, 'qa_mobile.png');
    fs.writeFileSync(mobileFile, mobileBuffer);
    console.log(`Saved mobile screenshot: ${mobileFile} (${mobileBuffer.length} bytes)`);

    ws.close();
    console.log('All QA tasks completed successfully!');
  } catch (err) {
    console.error('QA Script Error:', err);
  } finally {
    cleanup();
    process.exit(0);
  }
}

run();
