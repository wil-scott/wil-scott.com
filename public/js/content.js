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
    out('Courtrooms, contracts, code, now AI.'),
  ],

  help: [
    dim('commands:'),
    out('  whoami      who is this'),
    out('  projects    what I am building'),
    out('  history     the timeline'),
    out('  neofetch    the flex'),
    out('  top         see what is running'),
    out('  contact     say hello'),
    out('  clear       tidy up'),
    out('  exit        leave (not vim, you can)'),
    dim('or poke around: buttons work, ls too.'),
  ],

  projects: {
    sentinel: {
      title: 'talos, radio sentinel',
      status: 'building',
      summary: 'esp32 watching my home airwaves',
      detail: [
        out('talos: esp32 firmware that watches my home airwaves for'),
        out('wifi deauth attacks and unknown ble trackers.'),
        out('stack: c++, esp-idf. reports to daedalus.'),
        dim('status: building. named for the automaton that patrolled crete.'),
      ],
    },
    site: {
      title: 'this site',
      status: 'shipped',
      summary: 'a terminal that tells the truth',
      detail: [
        out('the site you are reading. a terminal, but the content is real,'),
        out('rendered, and crawlable. no framework, no build step.'),
        out('stack: vanilla js, cloudflare workers static assets.'),
        { text: 'source: github.com/wil-scott/wil-scott.com', style: 'out', href: 'https://github.com/wil-scott/wil-scott.com' },
        dim('status: shipped. you are looking at the demo.'),
      ],
    },
    daedalus: {
      title: 'daedalus, home server',
      status: 'running',
      summary: 'the workshop the agents run in',
      detail: [
        out('a thinkstation in vancouver running the agents I build.'),
        out('its agents are named for daedalus’ creations: talos patrols'),
        out('the airwaves. more under construction.'),
        dim('status: running. live status on the site is a future phase,'),
        dim('so no numbers here until they are real.'),
      ],
    },
  },

  contact: [
    { text: 'email     hello@wil-scott.com', style: 'out', href: 'mailto:hello@wil-scott.com' },
    { text: 'linkedin  linkedin.com/in/wil-scott', style: 'out', href: 'https://www.linkedin.com/in/wil-scott' },
  ],

  files: {
    '.plan': [
      dim('current plan (updated 2026-07):'),
      out('1. ship this site'),
      out('2. ship talos'),
      out('3. build agents until someone pays me to do it full time'),
      out('4. forward deployed engineer'),
      out('there is no step 5.'),
    ],
    'projects/': [dim('it is a directory. try: projects')],
  },

  lsListing: [out('projects/   .plan')],

  projectsHint: [dim('try: projects <name>')],

  history: [
    out('  2013  enroll law-school'),
    out('  2016  ubc jd'),
    out('  2017  called to bar'),
    out('  2019  counsel at murphy and co'),
    out('  2021  git init career-pivot'),
    out('  2022  embedded internship at sierra wireless'),
    out('  2023  bcit cst diploma'),
    out('  2024  software engineer at polyga'),
    out('  2025  systemctl start pocus.service'),
    out('  2025  git merge apollo.io'),
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
    out('os: human, canadian edition'),
    out('host: vancouver, bc'),
    out('kernel: law 1.0 > code 2.0 > ai 3.0'),
    out('uptime: three careers, zero reboots'),
    out('shell: /bin/lawyer (deprecated)'),
    out('packages: c++, python, ts, claude-sdk'),
    dim('theme: amber on void'),
  ],

  jokes: {
    sudoHireMe: [
      out('user is not in the payroll file.'),
      { text: 'this incident will be reported to hello@wil-scott.com.', style: 'out', href: 'mailto:hello@wil-scott.com' },
    ],
    sshDaedalus: [{ text: 'permission denied. get your own server.', style: 'error' }],
    rmRf: [out('nice try. this business card is read-only.')],
    vim: [out('the one terminal where you cannot get stuck in vim. :q')],
    echoPath: [out('/courtrooms:/contracts:/code:/ai')],
    pwd: [out('/home/w')],
    unknown: [dim('not a command yet. freeform questions are coming; try help.')],
    catMissing: (name) => [{ text: `cat: ${name}: no such file`, style: 'error' }],
    catNoArg: [{ text: 'cat: missing operand. try ls.', style: 'error' }],
  },

  desktop: {
    daedalus: {
      line: 'home server. runs the agents. live status is a future phase.',
    },
    trash: {
      line: 'hugo_site_v1 and resume_v7_final_FINAL.pdf. we do not talk about either.',
    },
  },
};
