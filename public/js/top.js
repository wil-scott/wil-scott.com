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

const jitter = (n) => Math.max(0, Math.min(99, n + Math.round((Math.random() - 0.5) * 14)));
const jitterFloat = (n) => Math.max(0, n + (Math.random() - 0.5) * 0.4);

function walk(current) {
  const step = Math.round((Math.random() - 0.5) * 24); // ±12
  return Math.max(15, Math.min(95, current + step));
}

function bar(pct, width) {
  const fill = Math.round((pct / 100) * width);
  return `<span class="bar-fill">${'█'.repeat(fill)}</span><span class="bar-empty">${'░'.repeat(width - fill)}</span>`;
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

function sparkline(hist) {
  return `<span class="bar-fill">${hist.map(sparkChar).join('')}</span>`;
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

function frame(state, narrow) {
  const barWidth = narrow ? 12 : 30;
  const histLen = narrow ? HIST_NARROW : HIST_WIDE;

  const cpu = walk(state.lastCpu);
  const mem = walk(state.lastMem);
  state.lastCpu = cpu;
  state.lastMem = mem;
  pushHistory(state.cpuHistory, cpu, histLen);
  pushHistory(state.memHistory, mem, histLen);

  const cpuByPid = new Map(PROCS.map((p) => [p.pid, p.state === 'zombie' ? 0 : jitter(p.base)]));
  const procs = sortedProcs(cpuByPid);

  const rows = procs.map((p) => {
    const c = cpuByPid.get(p.pid);
    const state2 = p.state || 'running';
    const dot = state2 === 'running' ? '<span class="top-dot">●</span>' : ' ';
    if (narrow) {
      return `${dot} ${String(p.pid).padStart(4)} ${p.name.padEnd(16)} ${String(c).padStart(3)}% ${state2.padEnd(8)}`.trimEnd();
    }
    return `${dot} ${String(p.pid).padStart(5)}  ${p.name.padEnd(20)} ${String(c).padStart(3)}%  ${state2.padEnd(9)} ${p.time}`;
  }).join('\n');

  const agentLines = AGENTS.map((a) => `  <span class="top-dot">●</span> ${a.name.padEnd(narrow ? 12 : 16)} ${a.status}`).join('\n');

  const header = narrow
    ? 'w@vancouver   uptime: 3 careers'
    : `w@vancouver   load avg: ${loadAvgLine(state.loadBase)}   uptime: 3 careers`;
  const footer = 'q or tap to quit';

  if (narrow) {
    const procHeader = `  ${'pid'.padStart(4)} ${'name'.padEnd(16)} ${'cpu'.padStart(3)}% ${'state'.padEnd(8)}`.trimEnd();
    return [
      header,
      '',
      `cpu  [${bar(cpu, barWidth)}] ${String(cpu).padStart(3)}%`,
      `     ${sparkline(state.cpuHistory)}`,
      `mem  [${bar(mem, barWidth)}] ${String(mem).padStart(3)}%`,
      `     ${sparkline(state.memHistory)}`,
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

  return [
    header,
    '',
    `cpu  [${bar(cpu, barWidth)}] ${String(cpu).padStart(3)}%   ${sparkline(state.cpuHistory)}`,
    `mem  [${bar(mem, barWidth)}] ${String(mem).padStart(3)}%   ${sparkline(state.memHistory)}`,
    '',
    'agents',
    agentLines,
    '',
    '    pid  name                 cpu   state     time',
    rows,
    '',
    footer,
  ].join('\n');
}

export function runTop(outputEl, onQuit) {
  const narrow = matchMedia('(max-width: 600px)').matches;
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
  };

  // innerHTML is safe here: all rendered content is static or generated
  // in-module (no user input, no untrusted strings).
  const draw = () => { panel.innerHTML = frame(state, narrow); };
  draw();
  const timer = reduced ? null : setInterval(draw, 1000);

  function quit() {
    if (timer) clearInterval(timer);
    document.removeEventListener('keydown', onKey, true);
    document.removeEventListener('click', quit, true);
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

  document.addEventListener('keydown', onKey, true);
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#screen')) return;
    e.stopPropagation();
    e.preventDefault();
    quit();
  }, true);
}
