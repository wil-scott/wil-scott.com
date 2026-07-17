import { content } from './content.js';

// command tables. every handler returns { lines, effect }

const commands = {
  help: () => ({ lines: content.help, effect: null }),
  whoami: () => ({ lines: content.whoami, effect: null }),
  contact: () => ({ lines: content.contact, effect: null }),
  ls: () => ({ lines: content.lsListing, effect: null }),
  pwd: () => ({ lines: content.jokes.pwd, effect: null }),
  history: () => ({ lines: content.history, effect: null }),
  neofetch: () => ({ lines: content.neofetch, effect: null }),
  colophon: () => ({ lines: content.colophon, effect: null }),
  vim: () => ({ lines: content.jokes.vim, effect: null }),
  clear: () => ({ lines: [], effect: 'clear' }),
  exit: () => ({ lines: [], effect: 'exit' }),
  top: () => ({ lines: [], effect: 'top' }),
  // argument-taking commands delegate to their handlers below
  projects: (args) => projectsCmd(args),
  cat: (args) => catCmd(args),
};

// two-token commands. route() checks these before the single-token table,
// by joining the lowercased command with the SECOND token:
//   `${cmd} ${rest[0]}`
// '$PATH' is case-sensitive: only the first token is lowercased, so
// building the key from cmd + the raw second token is correct.
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

// argument-taking handlers

function projectsCmd(args) {
  const name = args[0]?.toLowerCase();

  if (!name) {
    const lines = [];
    for (const p of Object.values(content.projects)) {
      lines.push({ text: `  ${p.title.padEnd(30)} ${p.status}`, style: 'out' });
    }
    lines.push(...content.projectsHint);
    return { lines, effect: null };
  }

  const project = content.projects[name];
  if (project) return { lines: project.detail, effect: null };
  return { lines: [{ text: `projects: ${name}: no such project`, style: 'error' }], effect: null };
}

function catCmd(args) {
  // cat stays case-sensitive, unlike projects.
  const name = args[0];
  if (!name) return { lines: content.jokes.catNoArg, effect: null };
  const file = content.files[name];
  if (file) return { lines: file, effect: null };
  return { lines: content.jokes.catMissing(name), effect: null };
}

// tab completion

export function complete(input) {
  if (!input.includes(' ')) {
    return Object.keys(commands).filter((name) => name.startsWith(input));
  }

  const [word, partial] = input.split(/\s+/);
  let candidates = [];
  if (word === 'cat') candidates = Object.keys(content.files);
  else if (word === 'projects') candidates = Object.keys(content.projects);

  return candidates
    .filter((c) => c.startsWith(partial))
    .map((c) => `${word} ${c}`);
}
