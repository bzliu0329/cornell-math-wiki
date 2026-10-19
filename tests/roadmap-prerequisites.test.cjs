const { test } = require('node:test');
const assert = require('node:assert/strict');
const { emptyTerms, checkPrerequisites, readPlan, normalizeCourse } = require('../roadmap-state.js');
const prerequisites = require('../roadmap-prerequisites.js');
const check = (terms, code, completed = []) => checkPrerequisites(terms, completed, prerequisites).find(item => item.code === code);

test('missing prerequisites warn, earlier alternatives clear, and same/later semesters do not count', () => {
  const terms = emptyTerms();
  terms[2][0] = 'CS 2110';
  let result = check(terms, 'CS 2110');
  assert.equal(result.kind, 'warning');
  assert.ok(result.missing[0].includes('CS 1110') && result.missing[0].includes('CS 1112'));
  terms[2][1] = 'CS 1112';
  assert.equal(check(terms, 'CS 2110').kind, 'warning');
  terms[2][1] = ''; terms[4][0] = 'CS 1112';
  assert.equal(check(terms, 'CS 2110').kind, 'warning');
  terms[4][0] = ''; terms[0][0] = 'CS 1112';
  assert.equal(check(terms, 'CS 2110').kind, 'ok');
  terms[0][0] = '';
  assert.equal(check(terms, 'CS 2110', ['CS 1110']).kind, 'ok');
});

test('AND groups need both subjects and honors sequences need both courses', () => {
  const terms = emptyTerms(); terms[4][0] = '3110'; terms[0][0] = '2230';
  assert.equal(check(terms, '3110').kind, 'warning');
  terms[1][0] = '2240';
  assert.equal(check(terms, '3110').kind, 'ok');
  terms[4][0] = '4180'; terms[1][0] = '';
  assert.equal(check(terms, '4180').kind, 'warning');
  terms[1][0] = '2240';
  assert.equal(check(terms, '4180').kind, 'ok');
  terms[0][0] = '3110'; terms[1][0] = '';
  assert.equal(check(terms, '4180').kind, 'ok');
});

test('corequisites permit the same semester but not a later one', () => {
  const terms = emptyTerms(); terms[2][0] = 'CS 3110';
  assert.equal(check(terms, 'CS 3110', ['CS 2110']).corequisites.length, 1);
  terms[2][1] = 'CS 2800';
  assert.equal(check(terms, 'CS 3110', ['CS 2110']).kind, 'ok');
  terms[2][1] = ''; terms[3][0] = 'CS 2800';
  assert.equal(check(terms, 'CS 3110', ['CS 2110']).kind, 'warning');
});

test('minimum grades remain a manual check even with the prerequisite courses', () => {
  const terms = emptyTerms(); terms[2][0] = 'ECON 3030';
  assert.equal(check(terms, 'ECON 3030').kind, 'warning');
  const result = check(terms, 'ECON 3030', ['ECON 1110', '1110']);
  assert.equal(result.missing.length, 0);
  assert.equal(result.kind, 'review');
  assert.match(result.note, /grade/i);
});

test('math course-level requirement excludes the current node and later courses', () => {
  const terms = emptyTerms(); terms[2][0] = '4250';
  assert.equal(check(terms, '4250', ['2210']).kind, 'warning');
  terms[2][1] = '3110';
  assert.equal(check(terms, '4250', ['2210']).kind, 'warning');
  terms[2][1] = ''; terms[0][0] = '3110';
  assert.equal(check(terms, '4250', ['2210']).kind, 'ok');
});

test('recommended preparation is not treated as a required prerequisite', () => {
  const terms = emptyTerms(); terms[0][0] = '4710';
  assert.equal(check(terms, '4710', ['1110', '1120']).kind, 'ok');
});

test('unknown courses and unparsed conditions explicitly require review', () => {
  const terms = emptyTerms(); terms[0][0] = 'STSCI 9999'; terms[0][1] = 'CS 4744';
  assert.equal(check(terms, 'STSCI 9999').kind, 'review');
  assert.match(check(terms, 'STSCI 9999').note, /unavailable/);
  assert.equal(check(terms, 'CS 4744').kind, 'review');
});

test('prior coursework persists and old saved maps remain readable', () => {
  const terms = emptyTerms();
  assert.deepEqual(readPlan(JSON.stringify({version:1, terms})).completedCourses, []);
  const saved = readPlan(JSON.stringify({version:1, terms,
    completedCourses:['math1110','1110','cs 2110','<img>',null]}));
  assert.deepEqual(saved.completedCourses, ['1110','CS 2110']);
});

test('all machine rules have valid course references and official source URLs', () => {
  function inspect(rule) {
    if (typeof rule === 'string') assert.ok(normalizeCourse(rule));
    else if (rule.all || rule.any) {
      const children = rule.all || rule.any;
      assert.ok(children.length > 0); children.forEach(inspect);
    } else assert.ok(rule.subject === 'MATH' && rule.level === 3000);
  }
  for (const entry of Object.values(prerequisites)) {
    assert.match(entry.source, /^https:\/\/classes\.cornell\.edu\/browse\/roster\/(?:SP26|FA26)\/class\/[A-Z]+\/\d{4}$/);
    if (entry.required) inspect(entry.required);
    if (entry.concurrent) inspect(entry.concurrent);
    if (entry.prerequisite && !entry.required) assert.equal(entry.manual, true);
    if (entry.corequisite && !entry.concurrent) assert.equal(entry.manual, true);
  }
});
