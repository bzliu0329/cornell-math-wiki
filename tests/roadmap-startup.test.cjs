const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const { join } = require('node:path');
const html = readFileSync(join(__dirname, '../math-major-roadmap.html'), 'utf8');
const startup = html.match(/<script id="roadmap-startup-check">([\s\S]*?)<\/script>/)[1];

function finishStartup(editorHidden) {
  const fallback = { textContent: 'Loading your course map…', children: [], appendChild(node) { this.children.push(node); } };
  let ready;
  runInNewContext(startup, { document: {
    addEventListener(event, callback) { assert.equal(event, 'DOMContentLoaded'); ready = callback; },
    getElementById(id) { return id === 'roadmap-editor' ? { hidden: editorHidden } : fallback; },
    createElement(tag) { assert.equal(tag, 'a'); return {}; }
  } });
  ready();
  return fallback;
}

test('a successful editor startup is left alone', () => {
  const fallback = finishStartup(false);
  assert.equal(fallback.children.length, 0);
});

test('an interrupted startup offers reload rather than incorrectly blaming disabled JavaScript', () => {
  const fallback = finishStartup(true);
  assert.match(fallback.textContent, /could not be loaded/);
  assert.doesNotMatch(fallback.textContent, /needs JavaScript/);
  assert.equal(fallback.children[0].textContent, 'Reload the roadmap');
  assert.match(fallback.children[0].href, /\?preview=/);
});

test('the JavaScript-enabled notice is restricted to the actual noscript fallback', () => {
  const normalMarkup = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
  assert.doesNotMatch(normalMarkup, /needs JavaScript/);
  assert.match(html, /<noscript>[\s\S]*?needs JavaScript enabled[\s\S]*?<\/noscript>/);
  const scripts = [...html.matchAll(/<script src="(roadmap[^"?]+)(\?[^\"]+)" defer>/g)];
  assert.equal(scripts.length, 3);
  assert.ok(scripts.every(script => script[2] === scripts[0][2]));
  assert.equal(scripts[0][2], scripts[1][2]);
});
