// public/js/top.js
const PROCS = [
  { pid: 1, name: 'career_pivot', base: 82, time: '11y+' },
  { pid: 137, name: 'triage_agent', base: 34, time: '2:41' },
  { pid: 2014, name: 'law_degree', base: 2, time: '7y', state: 'sleeping' },
  { pid: 404, name: 'imposter_syndrome', base: 0, time: '?:??', state: 'zombie' },
  { pid: 8787, name: 'wil-scott.com', base: 12, time: '0:01' },
];

const jitter = (n) => Math.max(0, Math.min(99, n + Math.round((Math.random() - 0.5) * 14)));

function bar(pct, width = 30) {
  const fill = Math.round((pct / 100) * width);
  return `<span class="bar-fill">${'█'.repeat(fill)}</span><span class="bar-empty">${'░'.repeat(width - fill)}</span>`;
}

function frame(tick) {
  const cpu = jitter(68);
  const mem = jitter(41);
  const rows = PROCS.map((p) => {
    const c = p.state === 'zombie' ? 0 : jitter(p.base);
    const state = p.state || 'running';
    return `${String(p.pid).padStart(5)}  ${p.name.padEnd(20)} ${String(c).padStart(3)}%  ${state.padEnd(9)} ${p.time}`;
  }).join('\n');
  return [
    `cpu  [${bar(cpu)}] ${String(cpu).padStart(3)}%   uptime: 3 careers`,
    `mem  [${bar(mem)}] ${String(mem).padStart(3)}%   load: rising steadily`,
    '',
    '  pid  name                 cpu   state     time',
    rows,
    '',
    `press q to quit${tick % 2 ? '' : ' '}`,
  ].join('\n');
}

export function runTop(outputEl, onQuit) {
  const panel = document.createElement('pre');
  panel.id = 'top-panel';
  outputEl.appendChild(panel);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cmd = document.getElementById('cmd');
  cmd.blur();

  let tick = 0;
  const draw = () => { panel.innerHTML = frame(tick); tick += 1; };
  draw();
  const timer = reduced ? null : setInterval(draw, 1000);

  const onKey = (e) => {
    if (e.key === 'q' || e.key === 'Escape') {
      if (timer) clearInterval(timer);
      document.removeEventListener('keydown', onKey, true);
      panel.remove();
      cmd.focus();
      onQuit();
      e.preventDefault();
      e.stopPropagation();
    }
  };
  document.addEventListener('keydown', onKey, true);
}
