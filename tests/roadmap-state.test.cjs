const { test } = require('node:test');
const assert = require('node:assert/strict');
const { emptyTerms, normalizeCourse, placeCourse, readPlan, recommendedTerms } = require('../roadmap-state.js');

test('a new roadmap is empty with independent nodes across eight semesters', () => {
  const terms = emptyTerms();
  assert.equal(terms.length, 8);
  assert.ok(terms.every(term => term.length === 2 && term.every(code => code === '')));
  terms[0][0] = '4710';
  assert.equal(terms[1][0], '');
});

test('course input accepts a number or MATH prefix and rejects malformed entries', () => {
  assert.equal(normalizeCourse('  MATH 4710 '), '4710');
  assert.equal(normalizeCourse('4250'), '4250');
  assert.equal(normalizeCourse(''), '');
  for (const raw of ['471', '47100', 'CS 4710', '<img>', null]) assert.equal(normalizeCourse(raw), null);
});

test('placing a recommendation fills only the chosen node without mutating the old plan', () => {
  const before = emptyTerms();
  const result = placeCourse(before, {term: 2, node: 1}, '4710');
  assert.ok(result.ok);
  assert.equal(result.terms[2][1], '4710');
  assert.equal(before[2][1], '');
  assert.equal(result.terms.flat().filter(Boolean).length, 1);
});

test('moving a course clears its source and swapping preserves both courses', () => {
  let terms = emptyTerms();
  terms[0][0] = '4710';
  let result = placeCourse(terms, {term: 4, node: 1}, '4710', {term: 0, node: 0});
  assert.equal(result.terms[0][0], '');
  assert.equal(result.terms[4][1], '4710');
  terms = result.terms;
  terms[5][0] = '4250';
  result = placeCourse(terms, {term: 5, node: 0}, '4710', {term: 4, node: 1});
  assert.ok(result.swapped);
  assert.equal(result.terms[4][1], '4250');
  assert.equal(result.terms[5][0], '4710');
});

test('dropping recommendations on filled nodes and stale moves cannot discard courses', () => {
  const terms = emptyTerms();
  terms[0][0] = '4710';
  assert.equal(placeCourse(terms, {term: 0, node: 0}, '4250').reason, 'occupied');
  assert.equal(placeCourse(terms, {term: 1, node: 0}, '4250', {term: 0, node: 0}).reason, 'stale');
  assert.equal(placeCourse(terms, {term: -1, node: 0}, '4710').reason, 'invalid');
  assert.equal(placeCourse(terms, {term: 1, node: 0}, 4710).reason, 'invalid');
  assert.equal(terms[0][0], '4710');
});

test('saved plans retain custom nodes and reject corrupt or unbounded data', () => {
  const terms = emptyTerms();
  terms[2].push('9999');
  const raw = JSON.stringify({ version: 1, terms, filters: { concentration: 'cs' } });
  assert.deepEqual(readPlan(raw), { terms, filters: { concentration: 'cs' } });
  for (const invalid of ['bad json', 'null', '{}', JSON.stringify({version:1, terms:[['4710']]})]) {
    assert.equal(readPlan(invalid), null);
  }
  terms[0] = Array(9).fill('4710');
  assert.equal(readPlan(JSON.stringify({version:1,terms})), null);
});

test('every concentration and preparation gets an editable plan without overlapping alternatives', () => {
  for (const concentration of ['mathematics', 'cs', 'econ']) {
    for (const preparation of ['foundations', 'calculus', 'proofs', 'honors']) {
      for (const graduate of [false, true]) {
        const terms = recommendedTerms({ concentration, preparation, graduate });
        assert.equal(terms.length, 8);
        assert.ok(terms.every(term => term.length === 2));
        const codes = terms.flat().filter(Boolean);
        assert.equal(new Set(codes).size, codes.length);
        for (const [first, second] of [['3110', '4130'], ['3340', '4340'], ['4310', '4330'], ['4200', '4210']]) {
          assert.ok(!(codes.includes(first) && codes.includes(second)));
        }
        assert.ok(readPlan(JSON.stringify({ version: 1, terms })));
        const semesterOf = code => terms.findIndex(term => term.includes(code));
        for (const [before, after] of [['2210','3040'], ['4130','4140'], ['4330','4340'], ['3270','4280'], ['4710','4740']]) {
          if (codes.includes(before) && codes.includes(after)) assert.ok(semesterOf(before) < semesterOf(after));
        }
        if (preparation === 'foundations') {
          assert.equal(semesterOf('2210'), 0);
          assert.equal(semesterOf('2220'), 1);
        } else {
          assert.ok(!codes.includes('2210') && !codes.includes('2220'));
        }
        if (concentration === 'mathematics' && preparation === 'honors') assert.ok(!codes.includes('3210'));
        if (preparation === 'honors') {
          assert.deepEqual(terms[0], ['2230', '']);
          assert.deepEqual(terms[1], ['2240', '']);
          assert.ok(terms.slice(2).flat().some(Boolean));
          assert.ok(!terms.slice(2).flat().some(code => code === '2230' || code === '2240'));
        }
      }
    }
  }
});

test('concentrations and graduate preferences produce distinct plans without sharing state', () => {
  const options = { concentration: 'mathematics', preparation: 'proofs' };
  const math = recommendedTerms(options);
  const cs = recommendedTerms({ ...options, concentration: 'cs' });
  const econ = recommendedTerms({ ...options, concentration: 'econ' });
  assert.ok(cs.flat().includes('3320'));
  assert.ok(econ.flat().includes('4740'));
  assert.ok(!math.flat().includes('4740'));
  assert.ok(recommendedTerms({ ...options, graduate: true }).flat().includes('4340'));
  math[0][0] = '9999';
  assert.notEqual(recommendedTerms(options)[0][0], '9999');
});
