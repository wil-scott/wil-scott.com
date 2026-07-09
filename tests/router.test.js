// tests/router.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { route, complete } from '../public/js/router.js';
import { content } from '../public/js/content.js';

const texts = (r) => r.lines.map((l) => l.text).join('\n');

test('empty input is a no-op', () => {
  assert.deepEqual(route('   '), { lines: [], effect: null });
});

test('whoami returns the whoami lines', () => {
  assert.deepEqual(route('whoami').lines, content.whoami);
});

test('parsing trims and lowercases the command', () => {
  assert.deepEqual(route('  WHOAMI  ').lines, content.whoami);
});

test('unknown input gets the honest line and no effect', () => {
  const r = route('make me a sandwich');
  assert.deepEqual(r.lines, content.jokes.unknown);
  assert.equal(r.effect, null);
});

test('clear and exit return their effects with no lines', () => {
  assert.equal(route('clear').effect, 'clear');
  assert.equal(route('exit').effect, 'exit');
  assert.equal(route('clear').lines.length, 0);
});

test('top returns the top effect', () => {
  assert.equal(route('top').effect, 'top');
});

test('projects lists all three with status', () => {
  const t = texts(route('projects'));
  for (const p of Object.values(content.projects)) {
    assert.ok(t.includes(p.title), `missing ${p.title}`);
    assert.ok(t.includes(p.status), `missing status ${p.status}`);
  }
  assert.match(t, /projects <name>/);
});

test('projects <name> shows the detail block', () => {
  assert.deepEqual(route('projects sentinel').lines, content.projects.sentinel.detail);
});

test('projects with unknown name errors gently', () => {
  const r = route('projects nope');
  assert.equal(r.lines[0].style, 'error');
});

test('ls lists the home dir', () => {
  assert.deepEqual(route('ls').lines, content.lsListing);
});

test('cat .plan prints the plan', () => {
  assert.deepEqual(route('cat .plan').lines, content.files['.plan']);
});

test('cat with a missing file errors', () => {
  const r = route('cat nope.txt');
  assert.equal(r.lines[0].style, 'error');
  assert.match(r.lines[0].text, /no such file/);
});

test('easter eggs route correctly', () => {
  assert.deepEqual(route('sudo hire-me').lines, content.jokes.sudoHireMe);
  assert.deepEqual(route('ssh daedalus').lines, content.jokes.sshDaedalus);
  assert.deepEqual(route('rm -rf /').lines, content.jokes.rmRf);
  assert.deepEqual(route('vim').lines, content.jokes.vim);
  assert.deepEqual(route('echo $PATH').lines, content.jokes.echoPath);
  assert.deepEqual(route('pwd').lines, content.jokes.pwd);
  assert.deepEqual(route('history').lines, content.history);
  assert.deepEqual(route('neofetch').lines, content.neofetch);
});

test('complete fills a unique command prefix', () => {
  assert.deepEqual(complete('who'), ['whoami']);
  assert.deepEqual(complete('nef'), []);
});

test('complete offers multiple matches', () => {
  const matches = complete('c');
  assert.ok(matches.includes('cat'));
  assert.ok(matches.includes('clear'));
  assert.ok(matches.includes('contact'));
});

test('complete works on cat and projects arguments', () => {
  assert.deepEqual(complete('cat .p'), ['cat .plan']);
  assert.deepEqual(complete('projects sen'), ['projects sentinel']);
});
