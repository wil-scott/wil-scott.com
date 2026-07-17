// public/js/terminal.js
import { route, complete } from './router.js';

const HELP_HINT = { text: 'type help to look around', style: 'dim' };

export function initTerminal() {
  const output = document.getElementById('output');
  const screen = document.getElementById('screen');
  const promptLine = document.getElementById('prompt-line');
  const echo = document.getElementById('echo');
  const cmd = document.getElementById('cmd');

  // the live prompt already carries the right host/path text in the HTML;
  // reuse it instead of duplicating the strings here.
  const promptUserText = promptLine.querySelector('.prompt-user').textContent;
  const promptPathText = promptLine.querySelector('.prompt-path').textContent;

  const history = [];
  let historyIndex = -1; // -1 = viewing the in-progress draft, not history
  let draft = '';

  function isExternalHref(href) {
    return /^https?:\/\//i.test(href);
  }

  function renderLine(line) {
    const style = line.style || 'out';
    const div = document.createElement('div');
    div.className = `line-${style}`;

    // 'cmd' style is reserved for echoed commands: prefix with the prompt
    // spans so history echoes look like the live prompt line.
    if (style === 'cmd' && !line.href) {
      const user = document.createElement('span');
      user.className = 'prompt-user';
      user.textContent = promptUserText;
      const path = document.createElement('span');
      path.className = 'prompt-path';
      path.textContent = promptPathText;
      div.append(user, path, document.createTextNode(line.text));
      return div;
    }

    if (line.href) {
      const a = document.createElement('a');
      a.href = line.href;
      a.textContent = line.text;
      if (isExternalHref(line.href)) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      div.append(a);
    } else {
      div.textContent = line.text;
    }

    return div;
  }

  function scrollToBottom() {
    screen.scrollTop = screen.scrollHeight;
  }

  function print(lines) {
    for (const line of lines) {
      output.append(renderLine(line));
    }
    scrollToBottom();
  }

  function clear() {
    output.replaceChildren();
  }

  function echoCommand(text) {
    output.append(renderLine({ text, style: 'cmd' }));
  }

  function suspendPrompt(suspended) {
    // #prompt-line has an explicit `display: flex` rule in site.css, whose ID
    // specificity beats the UA [hidden] rule, so toggling the hidden
    // attribute alone would not hide it. Use an inline style instead.
    promptLine.style.display = suspended ? 'none' : '';
  }

  function resetInput() {
    cmd.value = '';
    echo.textContent = '';
    historyIndex = -1;
    draft = '';
  }

  async function applyEffect(effect) {
    if (effect === 'clear') {
      clear();
      return;
    }

    if (effect === 'exit') {
      try {
        const ui = await import('./ui.js');
        ui.closeWindow();
      } catch {
        // ui.js not landed yet (task 6 pending); no-op, no console error.
      }
      return;
    }

    if (effect === 'top') {
      suspendPrompt(true);
      try {
        const topModule = await import('./top.js');
        topModule.runTop(output, () => {
          suspendPrompt(false);
          cmd.focus();
          scrollToBottom();
        });
      } catch {
        // top.js not landed yet (task 7 pending); restore the prompt.
        suspendPrompt(false);
      }
    }
  }

  async function handleEnter() {
    const text = cmd.value;
    echoCommand(text);

    if (text.trim()) {
      history.unshift(text);
    }

    const { lines, effect } = route(text);
    print(lines);
    resetInput();
    await applyEffect(effect);
    scrollToBottom();
  }

  function handleTab(evt) {
    evt.preventDefault();
    const matches = complete(cmd.value);

    if (matches.length === 1) {
      cmd.value = matches[0];
      echo.textContent = cmd.value;
    } else if (matches.length > 1) {
      print([{ text: matches.join('  '), style: 'dim' }]);
    }
  }

  function handleArrowUp() {
    if (history.length === 0) return;
    if (historyIndex === -1) {
      draft = cmd.value;
    }
    if (historyIndex < history.length - 1) {
      historyIndex += 1;
      cmd.value = history[historyIndex];
      echo.textContent = cmd.value;
    }
  }

  function handleArrowDown() {
    if (historyIndex === -1) return;
    historyIndex -= 1;
    cmd.value = historyIndex === -1 ? draft : history[historyIndex];
    echo.textContent = cmd.value;
  }

  cmd.addEventListener('input', () => {
    echo.textContent = cmd.value;
  });

  cmd.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      handleEnter();
    } else if (evt.key === 'Tab') {
      handleTab(evt);
    } else if (evt.key === 'ArrowUp') {
      evt.preventDefault();
      handleArrowUp();
    } else if (evt.key === 'ArrowDown') {
      evt.preventDefault();
      handleArrowDown();
    }
  });

  screen.addEventListener('click', () => {
    cmd.focus();
  });

  async function boot() {
    let introPlayed = null;
    try { introPlayed = sessionStorage.getItem('introPlayed'); } catch { /* storage blocked */ }
    if (introPlayed) {
      cmd.focus();
      return;
    }
    try { sessionStorage.setItem('introPlayed', '1'); } catch { /* storage blocked */ }

    const { lines } = route('whoami');
    const introLines = [{ text: 'whoami', style: 'cmd' }, ...lines, HELP_HINT];
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animated = false;

    if (!reducedMotion) {
      try {
        const ui = await import('./ui.js');
        await ui.typeLines(introLines, print);
        animated = true;
      } catch {
        // ui.js/typeLines not available yet; fall through to instant print
        // so the end state is identical either way.
        animated = false;
      }
    }

    if (!animated) {
      print(introLines);
    }

    scrollToBottom();
    cmd.focus();
  }

  boot();

  return { print, clear };
}
