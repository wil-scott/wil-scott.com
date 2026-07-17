// public/js/content.js
// employment facts verified against linkedin; email is the hello@ alias.
// window-chrome strings (prompt, closed message, reconnect, plain-link,
// icon labels) live in index.html and plain/index.html, not here.

const fg = (text) => ({ text, style: 'fg' });
const out = (text) => ({ text, style: 'out' });
const dim = (text) => ({ text, style: 'dim' });

export const content = {
  whoami: [
    fg('Wil Scott'),
    out('I build technical things and make them make sense to people.'),
    out('Courtrooms, contracts, code. Chasing AI next.'),
  ],

  help: [
    dim('Commands:'),
    out('  whoami      Who is this'),
    out('  projects    What I am building'),
    out('  history     The timeline'),
    out('  neofetch    System info, loosely defined'),
    out('  top         See what is running'),
    out('  colophon    How this was made'),
    out('  contact     Say hello'),
    out('  clear       Tidy up'),
    out('  exit        Leave'),
    dim('Or poke around: the buttons work, ls too.'),
  ],

  projects: {
    sentinel: {
      title: 'talos, radio sentinel',
      status: 'building',
      summary: 'esp32 watching my home airwaves',
      detail: [
        out('Talos: ESP32 firmware that watches my home airwaves for'),
        out('wifi deauth attacks and unknown BLE trackers.'),
        out('Stack: C++, ESP-IDF. Reports to daedalus.'),
        dim('Status: building. Named for the automaton that patrolled Crete.'),
      ],
    },
    site: {
      title: 'this site',
      status: 'shipped',
      summary: 'a terminal that tells the truth',
      detail: [
        out('The site you are reading. A terminal, but the content is real,'),
        out('rendered, and crawlable. No framework, no build step.'),
        out('Stack: vanilla JS, Cloudflare Workers static assets.'),
        { text: 'Source: github.com/wil-scott/wil-scott.com', style: 'out', href: 'https://github.com/wil-scott/wil-scott.com' },
        dim('Status: shipped. You are looking at the demo.'),
      ],
    },
    daedalus: {
      title: 'daedalus, home server',
      status: 'running',
      summary: 'the workshop the agents run in',
      detail: [
        out('A ThinkStation in Vancouver running the agents I build.'),
        out('Its agents are named for Daedalus’ creations: talos patrols'),
        out('the airwaves. More under construction.'),
        dim('Status: running. Live status on the site is a future phase,'),
        dim('so no numbers here until they are real.'),
      ],
    },
  },

  contact: [
    { text: 'Email     hello@wil-scott.com', style: 'out', href: 'mailto:hello@wil-scott.com' },
    { text: 'LinkedIn  linkedin.com/in/wil-scott', style: 'out', href: 'https://www.linkedin.com/in/wil-scott' },
  ],

  files: {
    '.plan': [
      dim('Current plan (updated 2026-07):'),
      out('1. Ship this site'),
      out('2. Ship talos'),
      out('3. More agents for daedalus'),
      out('4. Keep making technical things make sense to people'),
      out('There is no step 5.'),
    ],
    'projects/': [dim('It is a directory. Try: projects')],
  },

  lsListing: [out('projects/   .plan')],

  projectsHint: [dim('Try: projects <name>')],

  history: [
    out('  2013  Enroll law-school'),
    out('  2016  UBC JD'),
    out('  2017  Called to bar'),
    out('  2019  Counsel at Murphy and Co'),
    out('  2021  git init career-pivot'),
    out('  2022  Embedded intern, Sierra Wireless'),
    out('  2023  BCIT CST diploma'),
    out('  2024  Software engineer, Polyga'),
    out('  2025  Tech support engineer, Pocus'),
    out('  2025  Pocus acquired by Apollo.io'),
    out('  2026  ./build-agents.sh --all-in'),
  ],

  neofetch: [
    { text: '  ██     ██  ███████', style: 'accent' },
    { text: '  ██     ██  ██', style: 'accent' },
    { text: '  ██  █  ██  ███████', style: 'accent' },
    { text: '  ██ ███ ██       ██', style: 'accent' },
    { text: '   ███ ███   ███████', style: 'accent' },
    { text: 'w@vancouver', style: 'accent' },
    { text: '-----------', style: 'accent' },
    out('OS: human, rebuilt from source'),
    out('Host: Vancouver, BC'),
    out('Kernel: law 1.0 → code 2.0 → ai 3.0'),
    out('Uptime: 2 kernel upgrades, zero panics'),
    out('Shell: /bin/lawyer (in background)'),
    out('Packages: C++, Python, ESP-IDF, claude-sdk'),
    dim('Theme: amber on void'),
  ],

  colophon: [
    out('wil-scott.com. Vanilla JS, no framework, no build step.'),
    out('Hosted on Cloudflare. Type is JetBrains Mono.'),
    out('Built with agents. Argued with daily.'),
    { text: 'Source: github.com/wil-scott/wil-scott.com', style: 'out', href: 'https://github.com/wil-scott/wil-scott.com' },
  ],

  jokes: {
    sudoHireMe: [
      out('user is not in the payroll file.'),
      { text: 'This incident will be reported to hello@wil-scott.com.', style: 'out', href: 'mailto:hello@wil-scott.com' },
    ],
    sshDaedalus: [{ text: 'daedalus: Permission denied (get your own server).', style: 'error' }],
    rmRf: [out("rm: cannot remove '/': Read-only business card")],
    vim: [out('The one terminal where you cannot get stuck in vim. :q')],
    echoPath: [out('/courtrooms:/contracts:/code:/ai')],
    pwd: [out('/home/w')],
    unknown: [dim('command not found. Try help.')],
    catMissing: (name) => [{ text: `cat: ${name}: no such file`, style: 'error' }],
    catNoArg: [{ text: "cat: missing operand. Try 'ls'.", style: 'error' }],
  },

  desktop: {
    daedalus: {
      line: 'Home server. Runs the agents. Live status is a future phase.',
    },
    trash: {
      line: 'hugo_site_v1 and resume_v7_final_FINAL.pdf. Deleted, not forgotten.',
    },
  },
};
