// tests/content.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../public/js/content.js';

test('no em dashes anywhere in content', () => {
  const blob = JSON.stringify(content);
  assert.ok(!blob.includes('—'), 'found an em dash');
  assert.ok(!blob.includes('–'), 'found an en dash');
});

test('whoami has name and the sentence', () => {
  assert.equal(content.whoami[0].text, 'Wil Scott');
  const all = content.whoami.map(l => l.text).join(' ');
  assert.match(all, /Courtrooms, contracts, firmware, now AI\./);
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
  for (const cmd of ['whoami', 'projects', 'resume', 'contact', 'clear', 'exit']) {
    assert.ok(helpText.includes(cmd), `help missing ${cmd}`);
  }
});

test('files include the .plan deep cut', () => {
  assert.ok(content.files['.plan'].length >= 3);
  assert.ok(content.files['resume.pdf']);
});

test('contact has the three links', () => {
  const hrefs = content.contact.filter(l => l.href).map(l => l.href);
  assert.equal(hrefs.length, 3);
  assert.ok(hrefs.some(h => h.startsWith('mailto:')));
  assert.ok(hrefs.some(h => h.includes('github.com')));
  assert.ok(hrefs.some(h => h.includes('linkedin.com')));
});
