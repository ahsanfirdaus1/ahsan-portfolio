/* ============================================================
   AHSAN FIRDAUS — PORTFOLIO JAVASCRIPT
   Progressive enhancement: theme, nav, reveal, counters, widgets.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Theme Switcher (System / Dark / Light) ── */
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('af-theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', storedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      let next;
      if (!current) {
        next = isSystemDark ? 'light' : 'dark';
      } else if (current === 'dark') {
        next = 'light';
      } else {
        next = 'dark';
      }
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('af-theme', next);

      // Re-position segmented thumb after color-scheme transition if needed
      document.querySelectorAll('.has-thumb').forEach((g) => {
        const place = g.__placeThumb;
        if (typeof place === 'function') place();
      });
    });
  }

  /* ── Header + mobile menu ── */
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-menu');
  const mobileBar = document.getElementById('mobile-action-bar');
  const contactSec = document.getElementById('contact');

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 8);

    // Mobile action bar appearance
    if (mobileBar) {
      const contactTop = contactSec ? contactSec.offsetTop - 300 : 999999;
      const showMobileBar = y > 450 && y < contactTop;
      mobileBar.classList.toggle('visible', showMobileBar);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });

  /* ── Active section spy ── */
  const navLinks = document.querySelectorAll('.nav-link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((l) => {
        const on = l.getAttribute('href') === `#${entry.target.id}`;
        l.classList.toggle('active', on);
        if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

  /* ── Scroll reveal ── */
  const staggerGroups = '.hero-inner, .pillars, .project-grid, .insights-grid, .channels, .timeline, .edu-col';
  document.querySelectorAll(staggerGroups).forEach((group) => {
    [...group.children].forEach((child, i) => {
      const target = child.classList.contains('reveal') ? child : child.querySelector('.reveal');
      if (target) target.style.setProperty('--i', String(Math.min(i, 5)));
    });
  });
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('js-ready');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ── Stat counters ── */
  const counters = document.querySelectorAll('.count');
  const animateCount = (el) => {
    const target = Number(el.dataset.target);
    const start = performance.now();
    const duration = 1600;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const strip = document.querySelector('.hero-stats');
  if (strip && !reduceMotion && 'IntersectionObserver' in window) {
    counters.forEach((c) => { c.textContent = '0'; });
    const co = new IntersectionObserver((entries, obs) => {
      if (entries.some((e) => e.isIntersecting)) { counters.forEach(animateCount); obs.disconnect(); }
    }, { threshold: 0.6 });
    co.observe(strip);
  }

  /* ── Ahsan Labs workflow tabs ── */
  const stages = {
    trigger: ['Task ingestion and schema parser', 'Tasks arrive by webhook, CSV batch, or sensor stream anomaly.', 'The payload is normalized and tagged with schema constraints.'],
    planner: ['Planner and decomposer', 'Splits a complex request into atomic subtasks.', 'It checks which tools are available and sets priorities so context stays clean.'],
    tools: ['Tool calling and subagents', 'Runs tool calls in parallel: database query, point cloud validation, anomaly filter.', 'Each call runs in an isolated sandbox with rate limits and fallback retries.'],
    hitl: ['Human verification', 'Outputs with low confidence go to a human operator.', 'Annotators and team leads approve, adjust, or reject the model output.']
  };
  const steps = document.querySelectorAll('.wf-step');
  const stageDesc = document.getElementById('labs-stage-desc');
  steps.forEach((step) => step.addEventListener('click', () => {
    steps.forEach((s) => { s.classList.remove('is-active'); s.setAttribute('aria-selected', 'false'); });
    step.classList.add('is-active');
    step.setAttribute('aria-selected', 'true');
    const [title, sub, detail] = stages[step.dataset.stage];
    stageDesc.replaceChildren();
    const strong = document.createElement('strong');
    strong.textContent = `${title}:`;
    const small = document.createElement('small');
    small.textContent = detail;
    stageDesc.append(strong, ` ${sub}`, small);
  }));

  /* ── Agent simulator ── */
  const scripts = {
    lidar: [
      ['AGENT', '', 'Ingesting batch: 1,000 LiDAR point cloud frames (Scene ID: AV-X902)...'],
      ['PLANNER', '', 'Decomposing task: spatial bounding validation + temporal tracking integrity.'],
      ['TOOL', 'tool', 'Invoking tool: PointCloudDensityAuditor.exec(tolerance=0.02)...'],
      ['AGENT', '', 'Identified 3 edge cases with occlusion ambiguity (>45% reflection loss).'],
      ['HITL', 'hitl', 'Escalating 3 edge cases to QA Team Lead for manual review...'],
      ['QA_VERIFY', 'hitl', 'Human operator approved bounding re-anchoring. Audit complete.'],
      ['SUCCESS', 'success', 'Delivery status: 100% verified accuracy. Transmitted to perception repo.']
    ],
    shift: [
      ['AGENT', '', 'Analyzing shift metrics: 50 data professionals across 3 annotation tracks.'],
      ['TOOL', 'tool', 'Querying ERP & throughput tracker: 7,870 datasets / monthly velocity.'],
      ['PLANNER', '', 'Evaluating bottlenecks: QA queue latency at 8.4m. Target: <10m.'],
      ['AGENT', '', 'Dynamic rebalancing: assigned 4 senior annotators to secondary LiDAR QA tier.'],
      ['HITL', 'hitl', 'Shift Lead verified rebalancing dispatch. SOP notification broadcasted.'],
      ['SUCCESS', 'success', 'Daily SLA on track: post-revision accuracy projected at 100%.']
    ],
    triage: [
      ['AGENT', '', 'Trigger: anomaly alert in 2D camera-to-3D bounding projection alignment.'],
      ['TOOL', 'tool', 'Executing CameraLidarExtrinsicChecker(matrix_id="CALIB-88")...'],
      ['AGENT', '', 'Flagged calibration drift: +1.4mm pitch variance on front-left sensor.'],
      ['PLANNER', '', 'Auto-applying offset correction mask & queueing 12 affected clips.'],
      ['HITL', 'hitl', 'Technical Lead signed off on calibration override.'],
      ['SUCCESS', 'success', 'Pipeline restored. 0 data discarded. Zero disruption to client delivery.']
    ]
  };

  const terminal = document.getElementById('simulator-terminal-body');
  const runBtn = document.getElementById('btn-run-sim');
  const status = document.getElementById('sim-status');
  const missionBtns = document.querySelectorAll('[data-mission]');
  let mission = 'lidar';
  let running = false;

  const addLine = (time, tag, cls, msg) => {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    const t = document.createElement('span'); t.className = 't-time'; t.textContent = time;
    const g = document.createElement('span'); g.className = `t-tag ${cls}`.trim(); g.textContent = `[${tag}]`;
    const m = document.createElement('span'); m.className = 't-msg'; m.textContent = msg;
    line.append(t, g, m);
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
  };

  missionBtns.forEach((btn) => btn.addEventListener('click', () => {
    if (running) return;
    missionBtns.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');
    mission = btn.dataset.mission;
    terminal.replaceChildren();
    addLine('00:00', 'READY', '', `Selected scenario: ${btn.textContent}. Press "Run scenario".`);
  }));

  runBtn.addEventListener('click', () => {
    if (running) return;
    running = true;
    runBtn.disabled = true;
    runBtn.textContent = 'Running';
    status.textContent = 'Running';
    terminal.replaceChildren();
    const script = scripts[mission];
    const startedAt = Date.now();
    let i = 0;
    const next = () => {
      if (i >= script.length) {
        running = false;
        runBtn.disabled = false;
        runBtn.textContent = 'Run scenario';
        status.textContent = 'Done';
        return;
      }
      const s = Math.floor((Date.now() - startedAt) / 1000);
      const time = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
      const [tag, cls, msg] = script[i++];
      addLine(time, tag, cls, msg);
      setTimeout(next, reduceMotion ? 150 : 650);
    };
    next();
  });

  /* ── Project filter ── */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const projects = document.querySelectorAll('.project');
  filterBtns.forEach((btn) => btn.addEventListener('click', () => {
    filterBtns.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');
    const f = btn.dataset.filter;
    projects.forEach((p) => { p.hidden = !(f === 'all' || p.dataset.category === f); });
  }));

  /* ── Email: copy to clipboard with instant feedback ── */
  const emailCard = document.getElementById('email-action-card');
  if (emailCard && navigator.clipboard) {
    emailCard.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'ahsanfirdaus1@gmail.com';
      const val = emailCard.querySelector('.channel-val');
      try {
        await navigator.clipboard.writeText(email);
        val.textContent = 'Copied to clipboard!';
        val.classList.add('copied');
        setTimeout(() => { val.textContent = email; val.classList.remove('copied'); }, 1800);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  /* ── Jakarta time ── */
  const timeEl = document.getElementById('jakarta-time-val');
  if (timeEl) {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour12: false, hour: '2-digit', minute: '2-digit' });
    const update = () => { timeEl.textContent = `Jakarta · ${fmt.format(new Date())} WIB`; };
    update();
    setInterval(update, 30000);
  }

  /* ── Back to top ── */
  document.getElementById('btn-back-to-top')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ── Segmented controls: sliding thumb ── */
  document.querySelectorAll('.segmented, .sim-controls').forEach((group) => {
    const thumb = document.createElement('span');
    thumb.className = 'seg-thumb';
    thumb.setAttribute('aria-hidden', 'true');
    group.prepend(thumb);
    group.classList.add('has-thumb');

    const place = () => {
      const active = group.querySelector('.is-active');
      if (!active || !active.offsetWidth) return;
      thumb.style.width = `${active.offsetWidth}px`;
      thumb.style.height = `${active.offsetHeight}px`;
      thumb.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    };
    group.__placeThumb = place;
    place();
    requestAnimationFrame(() => requestAnimationFrame(() => thumb.classList.add('ready')));
    group.addEventListener('click', () => requestAnimationFrame(place));
    window.addEventListener('resize', place, { passive: true });
    document.fonts?.ready.then(place);
  });
});