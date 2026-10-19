/* Small, dependency-free model shared by the editor and its interaction tests. */
(function (root) {
  "use strict";
  const emptyTerms = () => Array.from({ length: 8 }, () => ["", ""]);
  const normalizeCourse = value => {
    if (typeof value !== "string") return null;
    if (!value.trim()) return "";
    const match = value.trim().match(/^(?:([A-Z]{2,8})[\s-]*)?(\d{4})$/i);
    if (!match) return null;
    const subject = (match[1] || "MATH").toUpperCase();
    return subject === "MATH" ? match[2] : `${subject} ${match[2]}`;
  };
  const courseLabel = value => {
    const code = normalizeCourse(value);
    return code ? (/^\d{4}$/.test(code) ? `MATH ${code}` : code) : "";
  };
  function courseDetails(value, catalog = {}) {
    const label = courseLabel(value);
    if (!label) return null;
    const entry = catalog[label];
    return { label, title: entry?.title || "Custom course",
      href: entry?.href || `https://catalog.cornell.edu/search/?P=${encodeURIComponent(label)}` };
  }
  function findCourseSuggestions(subject, number, catalog, limit = 6) {
    const prefix = typeof subject === "string" ? subject.trim().toUpperCase() : "";
    const digits = typeof number === "string" ? number.trim() : "";
    if (!/^[A-Z]{2,8}$/.test(prefix) || !/^\d{1,4}$/.test(digits)) return [];
    return Object.keys(catalog).filter(label => label.startsWith(`${prefix} ${digits}`))
      .sort().slice(0, limit).map(label => courseDetails(label, catalog));
  }
  const courseSet = courses => new Set(courses.map(courseLabel).filter(Boolean));
  function requirementMet(rule, available) {
    if (typeof rule === "string") return available.has(courseLabel(rule));
    if (rule.all) return rule.all.every(part => requirementMet(part, available));
    if (rule.any) return rule.any.some(part => requirementMet(part, available));
    if (rule.level) return [...available].some(label => {
      const [subject, number] = label.split(" ");
      return subject === rule.subject && Number(number) >= rule.level;
    });
    return false;
  }
  function requirementLabel(rule) {
    if (typeof rule === "string") return courseLabel(rule);
    if (rule.all) return `(${rule.all.map(requirementLabel).join(" and ")})`;
    if (rule.any) return `(${rule.any.map(requirementLabel).join(" or ")})`;
    return `a ${rule.subject} course numbered ${rule.level} or above`;
  }
  function missingRequirements(rule, available) {
    if (!rule || requirementMet(rule, available)) return [];
    return rule.all ? rule.all.flatMap(part => missingRequirements(part, available)) : [requirementLabel(rule)];
  }
  function checkPrerequisites(terms, completedCourses, prerequisites) {
    const completed = courseSet(completedCourses);
    return terms.flatMap((term, termIndex) => term.flatMap((code, node) => {
      if (!code) return [];
      const label = courseLabel(code);
      const entry = prerequisites[label];
      if (!entry) return [{ term: termIndex, node, code, kind: "review", missing: [], corequisites: [],
        note: "Prerequisite data unavailable. Check the course details." }];
      const earlier = new Set([...completed, ...courseSet(terms.slice(0, termIndex).flat())]);
      // Corequisites may be in this semester; a node can never satisfy itself.
      const concurrent = new Set([...earlier, ...courseSet(term.filter((_, index) => index !== node))]);
      const missing = missingRequirements(entry.required, earlier);
      const corequisites = missingRequirements(entry.concurrent, concurrent);
      const kind = missing.length || corequisites.length ? "warning" : entry.manual || entry.note ? "review" : "ok";
      return [{ term: termIndex, node, code, kind, missing, corequisites, entry,
        note: entry.manual ? "Some prerequisite conditions need a manual check." : entry.note || "" }];
    }));
  }
  const validTarget = (terms, target) => target && Number.isInteger(target.term) &&
    Number.isInteger(target.node) && Array.isArray(terms[target.term]) &&
    target.node >= 0 && target.node < terms[target.term].length;

  function placeCourse(terms, target, code, source = null) {
    if (!validTarget(terms, target) || !code || normalizeCourse(code) !== code) return { ok: false, reason: "invalid" };
    if (source && (!validTarget(terms, source) || terms[source.term][source.node] !== code)) {
      return { ok: false, reason: "stale" };
    }
    if (!source && terms[target.term][target.node]) return { ok: false, reason: "occupied" };
    const next = terms.map(term => [...term]);
    const previous = next[target.term][target.node];
    if (source) next[source.term][source.node] = previous;
    next[target.term][target.node] = code;
    return { ok: true, terms: next, swapped: Boolean(source && previous) };
  }

  function readPlan(raw) {
    try {
      const plan = JSON.parse(raw);
      if (plan.version !== 1 || !Array.isArray(plan.terms) || plan.terms.length !== 8) return null;
      if (!plan.terms.every(term => Array.isArray(term) && term.length >= 1 && term.length <= 8 &&
        term.every(code => normalizeCourse(code) !== null))) return null;
      const customCourses = Array.isArray(plan.customCourses)
        ? [...new Set(plan.customCourses.slice(0, 100).map(normalizeCourse).filter(Boolean))] : [];
      const completedCourses = Array.isArray(plan.completedCourses)
        ? [...new Set(plan.completedCourses.slice(0, 100).map(normalizeCourse).filter(Boolean))] : [];
      return { terms: plan.terms.map(term => term.map(normalizeCourse)), filters: plan.filters || {}, customCourses, completedCourses };
    } catch { return null; }
  }

  // Editable starter plans, not degree audits or term-offering guarantees.
  function recommendedTerms({ concentration, preparation, graduate = false }) {
    if (!["mathematics", "cs", "econ"].includes(concentration) ||
        !["foundations", "calculus", "proofs", "honors"].includes(preparation)) {
      throw new RangeError("Unknown roadmap preferences");
    }
    const terms = emptyTerms();
    let offset = 0;
    if (preparation === "foundations") {
      terms[0] = ["2210", ""];
      terms[1] = ["2220", "3040"];
      offset = 2;
    } else if (preparation === "calculus") {
      terms[0] = ["3040", ""];
      offset = 1;
    } else if (preparation === "honors") {
      terms[0] = ["2230", ""];
      terms[1] = ["2240", ""];
      offset = 2;
    }
    let stages;
    if (concentration === "mathematics") {
      stages = graduate
        ? [[4130, 4330], [4140, 4340], [4180, 4530], [4710]]
        : [[3110, 3340], [3270, 4310], preparation === "honors" ? [4180] : [4180, 3210],
          [4280, 4710], [4200, 4500], [4540]];
    } else if (concentration === "cs") {
      stages = [[3320, 3610], [4710, 4500], [4250, 4260], [4540], [4200], [4810]];
    } else {
      stages = graduate
        ? [[4130, 3360], [4140, 4710], [4310, 3270], [4410, 4250], [4280, 4370], [4260, 4740]]
        : [[3110, 3360], [4310, 4710], [3270, 4410], [4370, 4250], [4280, 4260], [4740]];
    }
    stages.forEach((courses, index) => {
      terms[offset + index] = courses.map(String);
      while (terms[offset + index].length < 2) terms[offset + index].push("");
    });
    return terms;
  }

  const api = { emptyTerms, normalizeCourse, courseLabel, courseDetails, findCourseSuggestions, checkPrerequisites, placeCourse, readPlan, recommendedTerms };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.MathRoadmapState = api;
})(globalThis);
