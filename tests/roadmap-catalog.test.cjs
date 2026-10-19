const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const { courseDetails, findCourseSuggestions } = require('../roadmap-state.js');
const source = readFileSync(join(__dirname, '../roadmap.js'), 'utf8').replace(/\r\n/g, '\n');
const catalog = JSON.parse(source.split('  const catalog = ')[1].split(';\n\n  const suggestedMath')[0]);

test('every wiki course link points to an existing page', () => {
  for (const [label, entry] of Object.entries(catalog)) {
    assert.ok(entry.title, label);
    if (entry.href.startsWith('https://')) {
      assert.equal(entry.href, 'https://catalog.cornell.edu/search/?P=' + encodeURIComponent(label));
    } else assert.ok(existsSync(join(__dirname, '..', entry.href)), label);
  }
  assert.equal(courseDetails('4720', catalog).href, 'math-4720.html');
  assert.equal(courseDetails('CS 2110', catalog).href, 'cs-2110.html');
  assert.equal(courseDetails('ORIE 3500', catalog).href, 'orie-3500.html');
});



test('number suggestions stay within the selected subject and include course titles', () => {
  const math = findCourseSuggestions('MATH', '47', catalog);
  assert.ok(math.some(course => course.label === 'MATH 4710'));
  assert.ok(math.every(course => course.label.startsWith('MATH 47')));
  const cs = findCourseSuggestions('cs', '21', catalog);
  assert.ok(cs.some(course => course.label === 'CS 2110'));
  const econ = findCourseSuggestions('ECON', '30', catalog);
  assert.ok(econ.some(course => course.label === 'ECON 3030' && course.title === 'Intermediate Microeconomic Theory'));
  assert.ok(econ.every(course => course.href.startsWith('https://catalog.cornell.edu/')));
  assert.ok(findCourseSuggestions('MATH', '1', catalog).length <= 6);
  for (const number of ['', '9999', 'CS 21', '<script>', '12345']) {
    assert.deepEqual(findCourseSuggestions('CS', number, catalog), []);
  }
  assert.deepEqual(findCourseSuggestions('BAD SUBJECT', '21', catalog), []);
});
