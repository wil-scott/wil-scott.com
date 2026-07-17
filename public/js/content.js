// public/js/content.js
// every string in this file is draft copy until the copy workshop (task 9).
// verify before launch: employment dates and linkedin url against the real
// linkedin profile; email choice (gmail vs hello@ alias) is a task 9 decision.
// window-chrome strings (prompt, closed message, reconnect, plain-link,
// icon labels) live in index.html and plain/index.html, so the copy pass
// must cover those files too.

const fg = (text) => ({ text, style: 'fg' });
const out = (text) => ({ text, style: 'out' });
const dim = (text) => ({ text, style: 'dim' });

export const content = {
  whoami: [
    fg('Wil Scott'),
    out('I build technical things and make them make sense to people.'),
    out('Courtrooms, contracts, firmware, now AI.'),
  ],

  help: [
    dim('commands:'),
    out('  whoami      who is this'),
    out('  projects    what I am building'),
    out('  resume      the serious version'),
    out('  contact     say hello'),
    out('  clear       tidy up'),
    out('  exit        leave (this is not vim, you can)'),
    dim('or poke around. the window buttons work. so does ls.'),
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

  resume: [
    fg('wil scott, vancouver bc'),
    out('2025-       technical support engineer, pocus (acquired by apollo.io)'),
    out('2023-2025   firmware developer, polyga (3d scanners, c++ in production)'),
    out('2014-2021   lawyer, courtrooms then contracts'),
    out('tools: c++, python, typescript, claude agent sdk, esp32'),
    { text: 'pdf version: resume.pdf', style: 'dim', href: '/resume.pdf' },
  ],

  contact: [
    { text: 'email     wilwscott@gmail.com', style: 'out', href: 'mailto:wilwscott@gmail.com' },
    { text: 'github    github.com/wil-scott', style: 'out', href: 'https://github.com/wil-scott' },
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
    'resume.pdf': [
      { text: 'it is a pdf. grab it here: resume.pdf', style: 'out', href: '/resume.pdf' },
    ],
    'projects/': [dim('it is a directory. try: projects')],
  },

  lsListing: [out('projects/   resume.pdf   .plan')],

  projectsHint: [dim('try: projects <name>')],

  history: [
    out('  2010  enroll law-school'),
    out('  2014  pass bar-exam'),
    out('  2016  argue first-trial'),
    out('  2019  git init career-pivot'),
    out('  2021  cd ~/firmware && make'),
    out('  2023  ship scanner-firmware --production'),
    out('  2025  systemctl start pocus.service'),
    out('  2025  git merge apollo.io'),
    out('  2026  ./build-agents.sh --all-in'),
  ],

  neofetch: [
    { text: '  ██     ██  ███████    w@vancouver', style: 'accent' },
    { text: '  ██     ██  ██         -----------', style: 'accent' },
    out('  ██  █  ██  ███████    os: human, canadian edition'),
    out('  ██ ███ ██       ██    host: meatspace, vancouver bc'),
    out('   ███ ███   ███████    kernel: law 1.0 > firmware 2.0 > ai 3.0'),
    out('                        uptime: three careers, zero reboots I admit to'),
    out('                        shell: /bin/lawyer (deprecated)'),
    out('                        packages: c++, python, typescript, claude-sdk'),
    dim('                        theme: amber on void'),
  ],

  jokes: {
    sudoHireMe: [
      out('user is not in the payroll file.'),
      { text: 'this incident will be reported to wilwscott@gmail.com.', style: 'out', href: 'mailto:wilwscott@gmail.com' },
    ],
    sshDaedalus: [{ text: 'permission denied. get your own server.', style: 'error' }],
    rmRf: [out('nice try. this business card is read-only.')],
    vim: [out('the one terminal where you cannot get stuck in vim. :q')],
    echoPath: [out('/courtrooms:/contracts:/firmware:/ai')],
    pwd: [out('/home/w')],
    unknown: [dim('not a command yet. freeform questions are coming; try help.')],
    catMissing: (name) => [{ text: `cat: ${name}: no such file`, style: 'error' }],
    catNoArg: [{ text: 'cat: missing operand. try ls.', style: 'error' }],
  },

  desktop: {
    resume: {
      // until the sanitized pdf exists at public/resume.pdf, ui.js shows
      // fallbackLine instead of downloading. honest degradation.
      fallbackLine: 'resume.pdf is being updated. email me and I will send it.',
    },
    daedalus: {
      line: 'home server. runs the agents. live status is a future phase.',
    },
    trash: {
      line: 'hugo_site_v1. it pretended to be a terminal. we do not talk about it.',
    },
  },
};
