// public/js/top.js
const PROCS = [
  { pid: 1, name: 'career_pivot', base: 82, time: '5y' },
  { pid: 137, name: 'triage_agent', base: 34, time: '2:41' },
  { pid: 2014, name: 'law_degree', base: 2, time: '7y', state: 'sleeping' },
  { pid: 404, name: 'imposter_syndrome', base: 0, time: '?:??', state: 'zombie' },
  { pid: 8787, name: 'wil-scott.com', base: 12, time: '0:01' },
];

const AGENTS = [
  { name: 'talos', status: 'building' },
];

const SPARK = '▁▂▃▄▅▆▇█';
const HIST_WIDE = 30;
const HIST_NARROW = 16;
const NET_HIST = 12;
const CORE_BASES = [72, 48, 61, 33];
const PANEL_W = 56; // full bordered width, incl. corner chars
const INNER_W = PANEL_W - 4; // minus '| ' and ' |'

const jitter = (n) => Math.max(0, Math.min(99, n + Math.round((Math.random() - 0.5) * 14)));
const jitterFloat = (n) => Math.max(0, n + (Math.random() - 0.5) * 0.4);

function walk(current) {
  const step = Math.round((Math.random() - 0.5) * 24); // ±12
  return Math.max(15, Math.min(95, current + step));
}

const span = (cls, text) => `<span class="${cls}">${text}</span>`;
const dim = (text) => span('top-dim', text);

// btop-style value buckets: teal below 40, amber to 75, red above.
function levelClass(pct) {
  if (pct > 75) return 'top-high';
  if (pct >= 40) return 'top-mid';
  return 'top-low';
}

// Same buckets as levelClass, but for numeric/text labels rather than
// bar/sparkline glyphs: these get their own classes so day theme can
// darken them for contrast without touching the fixed glyph palette.
function levelTextClass(pct) {
  return `${levelClass(pct)}-t`;
}

function pctSpan(pct) {
  return span(levelTextClass(pct), pct3(pct));
}

function bar(pct, width) {
  const fill = Math.round((pct / 100) * width);
  return `${span(levelClass(pct), '█'.repeat(fill))}<span class="bar-empty">${'░'.repeat(width - fill)}</span>`;
}

function sparkChar(pct) {
  const idx = Math.max(0, Math.min(SPARK.length - 1, Math.floor((pct / 100) * SPARK.length)));
  return SPARK[idx];
}

function seedHistory(len, base) {
  const h = [];
  for (let i = 0; i < len; i += 1) h.push(jitter(base));
  return h;
}

function pushHistory(hist, val, len) {
  hist.push(val);
  while (hist.length > len) hist.shift();
}

// Each glyph colored by its own value bucket; adjacent same-bucket
// glyphs share one span to keep the node count down.
function sparkline(hist) {
  let html = '';
  let cls = null;
  let buf = '';
  for (const v of hist) {
    const c = levelClass(v);
    if (c !== cls && buf) {
      html += span(cls, buf);
      buf = '';
    }
    cls = c;
    buf += sparkChar(v);
  }
  if (buf) html += span(cls, buf);
  return html;
}

function pct3(n) {
  return `${String(n).padStart(3)}%`;
}

/* ---- bordered panel helpers (desktop) ---- */

function panelTop(title, sub) {
  const subVis = sub ? 3 + sub.length : 0;
  const dashes = PANEL_W - 5 - title.length - subVis;
  let html = dim('┌─ ') + title;
  if (sub) html += dim(` ─ ${sub}`);
  return `${html} ${dim(`${'─'.repeat(dashes)}┐`)}`;
}

function panelBottom() {
  return dim(`└${'─'.repeat(PANEL_W - 2)}┘`);
}

function panelRow(html, visibleLen) {
  return dim('│ ') + html + ' '.repeat(Math.max(0, INNER_W - visibleLen)) + dim(' │');
}

function sortedProcs(cpuByPid) {
  return [...PROCS].sort((a, b) => {
    const aZombie = a.state === 'zombie';
    const bZombie = b.state === 'zombie';
    if (aZombie && !bZombie) return 1;
    if (bZombie && !aZombie) return -1;
    return cpuByPid.get(b.pid) - cpuByPid.get(a.pid);
  });
}

function loadAvgLine(base) {
  return base.map((n) => jitterFloat(n).toFixed(2)).join(', ');
}

function frame(state, narrow, footer) {
  const barWidth = 12;
  const histLen = narrow ? HIST_NARROW : HIST_WIDE;

  const cpu = walk(state.lastCpu);
  const mem = walk(state.lastMem);
  state.lastCpu = cpu;
  state.lastMem = mem;
  pushHistory(state.cpuHistory, cpu, histLen);
  pushHistory(state.memHistory, mem, histLen);
  state.cores = state.cores.map(walk);
  state.netUp = walk(state.netUp);
  state.netDown = walk(state.netDown);
  pushHistory(state.upHistory, state.netUp, NET_HIST);
  pushHistory(state.downHistory, state.netDown, NET_HIST);
  const upKbs = (state.netUp * 0.42).toFixed(1);
  const downKbs = (state.netDown * 1.9).toFixed(1);

  const cpuByPid = new Map(PROCS.map((p) => [p.pid, p.state === 'zombie' ? 0 : jitter(p.base)]));
  const procs = sortedProcs(cpuByPid);

  const rows = procs.map((p) => {
    const c = cpuByPid.get(p.pid);
    const state2 = p.state || 'running';
    const dot = state2 === 'running' ? '<span class="top-dot">●</span>' : ' ';
    if (narrow) {
      if (state2 === 'zombie') {
        return `  ${dim(`${String(p.pid).padStart(4)} ${p.name.padEnd(16)} ${pct3(c)} zombie`)}`;
      }
      return `${dot} ${String(p.pid).padStart(4)} ${p.name.padEnd(16)} ${pctSpan(c)} ${state2.padEnd(8)}`.trimEnd();
    }
    if (state2 === 'zombie') {
      return `  ${dim(`${String(p.pid).padStart(5)}  ${p.name.padEnd(20)} ${pct3(c)}  ${'zombie'.padEnd(9)} ${p.time}`)}`;
    }
    return `${dot} ${String(p.pid).padStart(5)}  ${p.name.padEnd(20)} ${pctSpan(c)}  ${state2.padEnd(9)} ${p.time}`;
  }).join('\n');

  const header = narrow
    ? 'w@vancouver   uptime: 3 careers'
    : `w@vancouver   load avg: ${loadAvgLine(state.loadBase)}   uptime: 3 careers`;

  if (narrow) {
    const agentLines = AGENTS.map((a) => `  <span class="top-dot">●</span> ${a.name.padEnd(12)} ${a.status}`).join('\n');
    const procHeader = `  ${'pid'.padStart(4)} ${'name'.padEnd(16)} ${'cpu'.padStart(3)}% ${'state'.padEnd(8)}`.trimEnd();
    return [
      header,
      '',
      `cpu  [${bar(cpu, barWidth)}] ${pctSpan(cpu)}`,
      `     ${sparkline(state.cpuHistory)}`,
      `mem  [${bar(mem, barWidth)}] ${pctSpan(mem)}`,
      `     ${sparkline(state.memHistory)}`,
      `net  up ${upKbs}  down ${downKbs} kb/s`,
      '',
      'agents',
      agentLines,
      '',
      procHeader,
      rows,
      '',
      footer,
    ].join('\n');
  }

  const coreRows = state.cores.map((v, i) => panelRow(
    `core${i} [${bar(v, barWidth)}] ${pctSpan(v)}`,
    5 + 2 + barWidth + 2 + 4,
  ));

  const memRow = panelRow(
    `[${bar(mem, barWidth)}] ${pctSpan(mem)}  ${sparkline(state.memHistory)}`,
    1 + barWidth + 2 + 4 + 2 + state.memHistory.length,
  );

  const netRow = (label, kbs, hist) => panelRow(
    `${label.padEnd(4)} ${kbs.padStart(5)} kb/s  ${sparkline(hist)}`,
    4 + 1 + 5 + 5 + 2 + hist.length,
  );

  const agentRows = AGENTS.map((a) => panelRow(
    `<span class="top-dot">●</span> ${a.name.padEnd(16)} ${a.status}`,
    1 + 1 + 16 + 1 + a.status.length,
  ));

  return [
    header,
    '',
    panelTop('cpu'),
    ...coreRows,
    panelRow(sparkline(state.cpuHistory), state.cpuHistory.length),
    panelBottom(),
    panelTop('mem'),
    memRow,
    panelBottom(),
    panelTop('net', 'agents chattering'),
    netRow('up', upKbs, state.upHistory),
    netRow('down', downKbs, state.downHistory),
    panelBottom(),
    panelTop('agents'),
    ...agentRows,
    panelBottom(),
    '',
    '    pid  name                 cpu   state     time',
    rows,
    '',
    footer,
  ].join('\n');
}

// Grows or shrinks a rolling history array to a new target length so the
// sparkline is fully populated immediately after a layout flip, instead of
// slowly refilling one draw tick at a time.
function resizeHistory(hist, newLen, base) {
  if (hist.length > newLen) {
    hist.splice(0, hist.length - newLen);
  } else if (hist.length < newLen) {
    const pad = [];
    for (let i = hist.length; i < newLen; i += 1) pad.push(jitter(base));
    hist.unshift(...pad);
  }
}

export function runTop(outputEl, onQuit) {
  const narrowQuery = matchMedia('(max-width: 600px)');
  let narrow = narrowQuery.matches;
  // pointer-aware footer wording, evaluated once: a device's coarse/fine
  // pointer capability doesn't change mid-session the way viewport width does.
  const footer = matchMedia('(pointer: coarse)').matches ? 'q or tap to quit' : 'q or click to quit';
  const panel = document.createElement('pre');
  panel.id = 'top-panel';
  panel.setAttribute('aria-hidden', 'true');
  outputEl.appendChild(panel);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cmd = document.getElementById('cmd');
  cmd.blur();

  const histLen = narrow ? HIST_NARROW : HIST_WIDE;
  const cpuHist = seedHistory(histLen, 68);
  const memHist = seedHistory(histLen, 41);
  const state = {
    cpuHistory: cpuHist,
    memHistory: memHist,
    lastCpu: cpuHist[cpuHist.length - 1],
    lastMem: memHist[memHist.length - 1],
    loadBase: [0.92, 0.78, 0.63],
    cores: [...CORE_BASES],
    netUp: 30,
    netDown: 62,
    upHistory: seedHistory(NET_HIST, 30),
    downHistory: seedHistory(NET_HIST, 62),
  };

  // innerHTML is safe here: all rendered content is static or generated
  // in-module (no user input, no untrusted strings).
  const draw = () => { panel.innerHTML = frame(state, narrow, footer); };
  draw();
  const timer = reduced ? null : setInterval(draw, 1000);

  function onLayoutChange(e) {
    narrow = e.matches;
    const newHistLen = narrow ? HIST_NARROW : HIST_WIDE;
    resizeHistory(state.cpuHistory, newHistLen, state.lastCpu);
    resizeHistory(state.memHistory, newHistLen, state.lastMem);
    draw();
  }

  narrowQuery.addEventListener('change', onLayoutChange);

  function quit() {
    if (timer) clearInterval(timer);
    document.removeEventListener('keydown', onKey, true);
    document.removeEventListener('click', onClick, true);
    narrowQuery.removeEventListener('change', onLayoutChange);
    panel.remove();
    onQuit();
  }

  function onKey(e) {
    if (e.key === 'q' || e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      quit();
    }
  }

  function onClick(e) {
    if (!e.target.closest('#screen')) return;
    e.stopPropagation();
    e.preventDefault();
    quit();
  }

  document.addEventListener('keydown', onKey, true);
  document.addEventListener('click', onClick, true);
}
