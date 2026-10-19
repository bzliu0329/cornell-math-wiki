const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const { courseDetails } = require('../roadmap-state.js');
const source = readFileSync(join(__dirname, '../roadmap.js'), 'utf8').replace(/\r\n/g, '\n');
const catalog = JSON.parse(source.split('  const catalog = ')[1].split(';\n\n  const suggestedMath')[0]);

test('every wiki course link points to an existing page', () => {
  for (const [label, entry] of Object.entries(catalog)) {
    assert.ok(entry.title, label);
    assert.ok(existsSync(join(__dirname, '..', entry.href)), label);
  }
  assert.equal(courseDetails('4720', catalog).href, 'math-4720.html');
  assert.equal(courseDetails('CS 2110', catalog).href, 'cs-2110.html');
  assert.equal(courseDetails('ORIE 3500', catalog).href, 'orie-3500.html');
});

