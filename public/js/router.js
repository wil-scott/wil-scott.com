import { content } from './content.js';

// ============================================================
// zone 1: command tables (complete — no work needed here)
// every handler returns { lines, effect }
// ============================================================

const commands = {
  help: () => ({ lines: content.help, effect: null }),
  whoami: () => ({ lines: content.whoami, effect: null }),
  resume: () => ({ lines: content.resume, effect: null }),
  contact: () => ({ lines: content.contact, effect: null }),
  ls: () => ({ lines: content.lsListing, effect: null }),
  pwd: () => ({ lines: content.jokes.pwd, effect: null }),
  history: () => ({ lines: content.history, effect: null }),
  neofetch: () => ({ lines: content.neofetch, effect: null }),
  vim: () => ({ lines: content.jokes.vim, effect: null }),
  clear: () => ({ lines: [], effect: 'clear' }),
  exit: () => ({ lines: [], effect: 'exit' }),
  top: () => ({ lines: [], effect: 'top' }),
  // argument-taking commands delegate to your functions in zone 3
  projects: (args) => projectsCmd(args),
  cat: (args) => catCmd(args),
};

// two-token commands. route() must check these BEFORE the single-token
// table, by joining the lowercased command with the SECOND token:
//   `${cmd} ${rest[0]}`
// careful: '$PATH' is case-sensitive. you lowercase only the FIRST
// token, so building the key from cmd + the raw second token is correct.
const twoWordCommands = {
  'sudo hire-me': () => ({ lines: content.jokes.sudoHireMe, effect: null }),
  'ssh daedalus': () => ({ lines: content.jokes.sshDaedalus, effect: null }),
  'echo $PATH': () => ({ lines: content.jokes.echoPath, effect: null }),
};

// rm doesn't fit either table: any `rm` with '-rf' among its args gets the joke.

export function route(input) {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [], effect: null };

  const [first, ...rest] = trimmed.split(/\s+/);
  const cmd = first.toLowerCase();

  if (cmd === 'rm' && rest.includes('-rf')) {
    return { lines: content.jokes.rmRf, effect: null };
  }

  if (rest[0]) {
    const twoWord = twoWordCommands[`${cmd} ${rest[0]}`];
    if (twoWord) return twoWord();
  }

  const handler = commands[cmd];
  if (handler) return handler(rest);

  return { lines: content.jokes.unknown, effect: null };
}

// ============================================================
// zone 3: argument-taking handlers (yours)
// ============================================================

function projectsCmd(args) {
  const name = args[0];

  if (!name) {
    const lines = [];
    for (const p of Object.values(content.projects)) {
      lines.push({ text: `  ${p.title.padEnd(30)} ${p.status}`, style: 'out' });
    }
    lines.push({ text: 'try: projects <name>', style: 'dim' });
    return { lines, effect: null };
  }

  const project = content.projects[name];
  if (project) return { lines: project.detail, effect: null };
  return { lines: [{ text: `projects: ${name}: no such project`, style: 'error' }], effect: null };
}

function catCmd(args) {
  const name = args[0];
  const file = name && content.files[name];
  if (file) return { lines: file, effect: null };
  return { lines: content.jokes.catMissing(name ?? ''), effect: null };
}

// ============================================================
// zone 4: tab completion (yours — last piece)
// ============================================================

export function complete(input) {
  if (!input.includes(' ')) {
    return Object.keys(commands).filter((name) => name.startsWith(input));
  }

  const [word, partial] = input.split(' ');
  let candidates = [];
  if (word === 'cat') candidates = Object.keys(content.files);
  else if (word === 'projects') candidates = Object.keys(content.projects);

  return candidates
    .filter((c) => c.startsWith(partial))
    .map((c) => `${word} ${c}`);
}
