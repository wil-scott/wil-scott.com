// public/js/ui.js
import { content } from './content.js';

const $ = (id) => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

export function closeWindow() {
  document.body.classList.add('closed');
  document.body.classList.remove('min', 'maxed');
  $('dock').hidden = true;
}

function restore() {
  document.body.classList.remove('closed', 'min');
  $('cmd').focus();
}

function toast(text) {
  const t = $('desktop-toast');
  t.textContent = text;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { t.hidden = true; }, 6000);
}

function initTheme() {
  const btn = $('btn-theme');
  const apply = (t) => {
    document.documentElement.dataset.theme = t;
    btn.textContent = t === 'night' ? '☀' : '☽';
  };
  apply(document.documentElement.dataset.theme);
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'night' ? 'day' : 'night';
    try { localStorage.setItem('theme', next); } catch { /* storage blocked */ }
    apply(next);
  });
}

export function typeLines(lines, print, charDelay = 25) {
  // types lines one character at a time; resolves when done.
  // caller already checked sessionStorage; we still honor reduced motion.
  if (reducedMotion.matches) { print(lines); return Promise.resolve(); }
  return lines.reduce((chain, line) => chain.then(() => new Promise((done) => {
    let i = 0;
    // terminal.js's renderLine builds a 'cmd' (non-href) line as
    // [span.prompt-user][span.prompt-path][text node "<text>"], so the
    // animated text there lives in a trailing text node, not the whole
    // element. href lines hold their text in a single <a> child. plain
    // lines use `div.textContent = ...`, which for our empty partial
    // inserts NO child node at all, so lastChild is null there; type
    // into the line div itself in that case (safe: no sibling spans to
    // destroy, and the end state equals print()'s).
    const partial = { ...line, text: '' };
    print([partial]);
    const el = $('output').lastElementChild;
    const target = el.lastChild ?? el;
    const tick = setInterval(() => {
      i += 1;
      target.textContent = line.text.slice(0, i);
      if (i >= line.text.length) { clearInterval(tick); done(); }
    }, charDelay);
  })), Promise.resolve());
}

export function initUI() {
  initTheme();

  $('btn-close').addEventListener('click', closeWindow);
  $('btn-min').addEventListener('click', () => {
    document.body.classList.add('min');
    document.body.classList.remove('maxed');
    $('dock').hidden = false;
  });
  $('btn-max').addEventListener('click', () => {
    document.body.classList.toggle('maxed');
    $('cmd').focus();
  });
  $('dock').addEventListener('click', () => { $('dock').hidden = true; restore(); });
  $('reconnect').addEventListener('click', restore);

  $('icon-daedalus').addEventListener('click', () => toast(content.desktop.daedalus.line));
  $('icon-trash').addEventListener('click', () => toast(content.desktop.trash.line));
}
