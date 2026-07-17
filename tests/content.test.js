// tests/content.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { content } from '../public/js/content.js';

test('no em dashes anywhere in content', () => {
  const blob = JSON.stringify(content);
  assert.ok(!blob.includes('—'), 'found an em dash');
  assert.ok(!blob.includes('–'), 'found an en dash');
});

test('whoami has name and the sentence', () => {
  assert.equal(content.whoami[0].text, 'Wil Scott');
  const all = content.whoami.map(l => l.text).join(' ');
  assert.match(all, /Courtrooms, contracts, code, now AI\./);
});

test('projects have honest statuses', () => {
  const allowed = new Set(['building', 'shipped', 'running']);
  const names = Object.keys(content.projects);
  assert.deepEqual(names.sort(), ['daedalus', 'sentinel', 'site']);
  for (const p of Object.values(content.projects)) {
    assert.ok(allowed.has(p.status), `bad status ${p.status}`);
    assert.ok(p.summary.length > 0);
    assert.ok(p.detail.length > 0);
  }
});

test('help mentions every core command', () => {
  const helpText = content.help.map(l => l.text).join(' ');
  for (const cmd of ['whoami', 'projects', 'history', 'neofetch', 'top', 'colophon', 'contact', 'clear', 'exit']) {
    assert.ok(helpText.includes(cmd), `help missing ${cmd}`);
  }
});

test('files include the .plan deep cut', () => {
  assert.ok(content.files['.plan'].length >= 3);
});

test('contact has exactly the two links', () => {
  const hrefs = content.contact.filter(l => l.href).map(l => l.href);
  assert.equal(hrefs.length, 2);
  assert.ok(hrefs.includes('mailto:hello@wil-scott.com'));
  assert.ok(hrefs.some(h => h.includes('linkedin.com')));
});

test('no em dashes in html pages either', async () => {
  for (const f of ['public/index.html', 'public/plain/index.html', 'public/404.html']) {
    const html = await readFile(f, 'utf8');
    assert.ok(!html.includes('—'), `em dash in ${f}`);
    assert.ok(!html.includes('–'), `en dash in ${f}`);
  }
});
