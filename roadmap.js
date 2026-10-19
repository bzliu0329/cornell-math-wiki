/* Course recommendations from mathwiiki website.txt. */
(() => {
"use strict";
  // Course names and destinations from the existing wiki course pages.
  const catalog = {
    "CS 1110": {"title": "Introduction to Computing: A Design and Development Perspective", "href": "cs-1110.html"},
    "CS 2110": {"title": "Object-Oriented Programming and Data Structures", "href": "cs-2110.html"},
    "CS 2800": {"title": "Mathematical Foundations of Computing", "href": "cs-2800.html"},
    "CS 3110": {"title": "Functional Programming and Data Structures", "href": "cs-3110.html"},
    "CS 3410": {"title": "Computer System Organization and Programming", "href": "cs-3410.html"},
    "CS 4220": {"title": "Numerical Analysis: Linear and Nonlinear Problems", "href": "cs-4220.html"},
    "CS 4782": {"title": "Introduction to Deep Learning", "href": "cs-4782.html"},
    "CS 4820": {"title": "Introduction to Analysis of Algorithms", "href": "cs-4820.html"},
    "MATH 1006": {"title": "Academic Support for MATH 1106", "href": "math-1006.html"},
    "MATH 1011": {"title": "Academic Support for MATH 1110", "href": "math-1011.html"},
    "MATH 1012": {"title": "Academic Support for MATH 1120", "href": "math-1012.html"},
    "MATH 1021": {"title": "Academic Support for MATH 2210", "href": "math-1021.html"},
    "MATH 1101": {"title": "Calculus Preparation", "href": "math-1101.html"},
    "MATH 1105": {"title": "Finite Mathematics for the Life and Social Sciences", "href": "math-1105.html"},
    "MATH 1106": {"title": "Modeling with Calculus for the Life Sciences", "href": "math-1106.html"},
    "MATH 1110": {"title": "Calculus I", "href": "math-1110.html"},
    "MATH 1120": {"title": "Calculus II", "href": "math-1120.html"},
    "MATH 1300": {"title": "Mathematical Explorations", "href": "math-1300.html"},
    "MATH 1340": {"title": "Strategy, Cooperation, and Conflict", "href": "math-1340.html"},
    "MATH 1710": {"title": "Statistical Theory and Application in the Real World", "href": "math-1710.html"},
    "MATH 1900": {"title": "Introduction to Calculus For Engineers", "href": "math-1900.html"},
    "MATH 1910": {"title": "Calculus for Engineers", "href": "math-1910.html"},
    "MATH 1920": {"title": "Multivariable Calculus for Engineers", "href": "math-1920.html"},
    "MATH 2210": {"title": "Linear Algebra", "href": "math-2210.html"},
    "MATH 2220": {"title": "Multivariable Calculus", "href": "math-2220.html"},
    "MATH 2230": {"title": "Theoretical Linear Algebra and Vector Calculus I", "href": "math-2230.html"},
    "MATH 2240": {"title": "Theoretical Linear Algebra and Calculus", "href": "math-2240.html"},
    "MATH 2310": {"title": "Linear Algebra for Data Science", "href": "math-2310.html"},
    "MATH 2930": {"title": "Differential Equations for Engineers", "href": "math-2930.html"},
    "MATH 2940": {"title": "Linear Algebra for Engineers", "href": "math-2940.html"},
    "MATH 3040": {"title": "Prove It!", "href": "math-3040.html"},
    "MATH 3110": {"title": "Introduction to Analysis", "href": "math-3110.html"},
    "MATH 3210": {"title": "Manifolds and Differential Forms", "href": "math-3210.html"},
    "MATH 3270": {"title": "Introduction to Ordinary Differential Equations", "href": "math-3270.html"},
    "MATH 3320": {"title": "Introduction to Number Theory", "href": "math-3320.html"},
    "MATH 3340": {"title": "Abstract Algebra", "href": "math-3340.html"},
    "MATH 3360": {"title": "Applicable Algebra", "href": "math-3360.html"},
    "MATH 3610": {"title": "Mathematical Modeling", "href": "math-3610.html"},
    "MATH 3810": {"title": "Deductive Logic", "href": "math-3810.html"},
    "MATH 3840": {"title": "Introduction to Set Theory", "href": "math-3840.html"},
    "MATH 3850": {"title": "Modal Logic", "href": "math-3850.html"},
    "MATH 4030": {"title": "History of Mathematics", "href": "math-4030.html"},
    "MATH 4040": {"title": "Patterns, Proofs, and Problems", "href": "math-4040.html"},
    "MATH 4130": {"title": "Honors Introduction to Analysis I", "href": "math-4130.html"},
    "MATH 4140": {"title": "Honors Introduction to Analysis II", "href": "math-4140.html"},
    "MATH 4180": {"title": "Complex Analysis", "href": "math-4180.html"},
    "MATH 4200": {"title": "Differential Equations and Dynamical Systems", "href": "math-4200.html"},
    "MATH 4210": {"title": "Nonlinear Dynamics and Chaos", "href": "math-4210.html"},
    "MATH 4220": {"title": "Applied Complex Analysis", "href": "math-4220.html"},
    "MATH 4250": {"title": "Numerical Analysis and Differential Equations", "href": "math-4250.html"},
    "MATH 4260": {"title": "Numerical Analysis: Linear and Nonlinear Problems", "href": "math-4260.html"},
    "MATH 4280": {"title": "Introduction to Partial Differential Equations", "href": "math-4280.html"},
    "MATH 4310": {"title": "Linear Algebra", "href": "math-4310.html"},
    "MATH 4330": {"title": "Honors Linear Algebra", "href": "math-4330.html"},
    "MATH 4340": {"title": "Honors Introduction to Algebra", "href": "math-4340.html"},
    "MATH 4370": {"title": "Computational Algebra", "href": "math-4370.html"},
    "MATH 4410": {"title": "Introduction to Combinatorics I", "href": "math-4410.html"},
    "MATH 4420": {"title": "Introduction to Combinatorics II", "href": "math-4420.html"},
    "MATH 4430": {"title": "Introduction to Algebraic Combinatorics (NEW)", "href": "math-4430.html"},
    "MATH 4500": {"title": "Matrix Groups", "href": "math-4500.html"},
    "MATH 4520": {"title": "Classical Geometries and Modern Applications", "href": "math-4520.html"},
    "MATH 4530": {"title": "Introduction to Topology", "href": "math-4530.html"},
    "MATH 4540": {"title": "Introduction to Differential Geometry", "href": "math-4540.html"},
    "MATH 4710": {"title": "Basic Probability", "href": "math-4710.html"},
    "MATH 4720": {"title": "Theory of Statistics", "href": "math-4720.html"},
    "MATH 4740": {"title": "Stochastic Processes", "href": "math-4740.html"},
    "MATH 4810": {"title": "Mathematical Logic", "href": "math-4810.html"},
    "MATH 4820": {"title": "Topics in Logic and the Foundations of Mathematics", "href": "math-4820.html"},
    "MATH 4860": {"title": "Applied Logic", "href": "math-4860.html"},
    "MATH 4870": {"title": "Set Theory", "href": "math-4870.html"},
    "MATH 4900": {"title": "Supervised Research", "href": "math-4900.html"},
    "MATH 4901": {"title": "Supervised Reading", "href": "math-4901.html"},
    "MATH 4980": {"title": "Special Study for Mathematics Teaching", "href": "math-4980.html"},
    "MATH 4997": {"title": "Practical Training in Mathematics", "href": "math-4997.html"},
    "MATH 5080": {"title": "Special Study for Teachers", "href": "math-5080.html"},
    "MATH 5200": {"title": "Differential Equations and Dynamical Systems", "href": "math-5200.html"},
    "MATH 5220": {"title": "Applied Complex Analysis", "href": "math-5220.html"},
    "MATH 5250": {"title": "Numerical Analysis and Differential Equations", "href": "math-5250.html"},
    "MATH 5410": {"title": "Introduction to Combinatorics I", "href": "math-5410.html"},
    "MATH 5420": {"title": "Introduction to Combinatorics II", "href": "math-5420.html"},
    "MATH 5430": {"title": "Introduction to Algebraic Combinatorics", "href": "math-5430.html"},
    "MATH 6080": {"title": "Teaching and Learning Mathematics", "href": "math-6080.html"},
    "MATH 6110": {"title": "Real Analysis", "href": "math-6110.html"},
    "MATH 6120": {"title": "Complex Analysis", "href": "math-6120.html"},
    "MATH 6150": {"title": "Partial Differential Equations", "href": "math-6150.html"},
    "MATH 6160": {"title": "Partial Differential Equations", "href": "math-6160.html"},
    "MATH 6210": {"title": "Measure Theory and Lebesgue Integration", "href": "math-6210.html"},
    "MATH 6220": {"title": "Applied Functional Analysis", "href": "math-6220.html"},
    "MATH 6230": {"title": "Differential Games and Optimal Control", "href": "math-6230.html"},
    "MATH 6250": {"title": "Top Ten Algorithms of the 20th Century", "href": "math-6250.html"},
    "MATH 6260": {"title": "Dynamical Systems", "href": "math-6260.html"},
    "MATH 6270": {"title": "Applied Dynamical Systems", "href": "math-6270.html"},
    "MATH 6280": {"title": "Complex Dynamics", "href": "math-6280.html"},
    "MATH 6302": {"title": "Lattices: Geometry, Cryptography, and Algorithms", "href": "math-6302.html"},
    "MATH 6310": {"title": "Algebra", "href": "math-6310.html"},
    "MATH 6320": {"title": "Algebra", "href": "math-6320.html"},
    "MATH 6330": {"title": "Noncommutative Algebra", "href": "math-6330.html"},
    "MATH 6340": {"title": "Commutative Algebra with Applications in Algebraic Geometry", "href": "math-6340.html"},
    "MATH 6350": {"title": "Homological Algebra", "href": "math-6350.html"},
    "MATH 6370": {"title": "Algebraic Number Theory", "href": "math-6370.html"},
    "MATH 6390": {"title": "Lie Groups and Lie Algebras", "href": "math-6390.html"},
    "MATH 6410": {"title": "Enumerative Combinatorics", "href": "math-6410.html"},
    "MATH 6510": {"title": "Algebraic Topology", "href": "math-6510.html"},
    "MATH 6520": {"title": "Differentiable Manifolds", "href": "math-6520.html"},
    "MATH 6530": {"title": "K-Theory and Characteristic Classes", "href": "math-6530.html"},
    "MATH 6540": {"title": "Homotopy Theory", "href": "math-6540.html"},
    "MATH 6620": {"title": "Riemannian Geometry", "href": "math-6620.html"},
    "MATH 6630": {"title": "Symplectic Geometry", "href": "math-6630.html"},
    "MATH 6640": {"title": "Hyperbolic Geometry", "href": "math-6640.html"},
    "MATH 6670": {"title": "Algebraic Geometry", "href": "math-6670.html"},
    "MATH 6710": {"title": "Probability Theory I", "href": "math-6710.html"},
    "MATH 6720": {"title": "Probability Theory II", "href": "math-6720.html"},
    "MATH 6730": {"title": "Mathematical Statistics I", "href": "math-6730.html"},
    "MATH 6810": {"title": "Logic", "href": "math-6810.html"},
    "MATH 6830": {"title": "Model Theory", "href": "math-6830.html"},
    "MATH 6840": {"title": "Recursion Theory", "href": "math-6840.html"},
    "MATH 6870": {"title": "Set Theory", "href": "math-6870.html"},
    "ORIE 3300": {"title": "Optimization I", "href": "orie-3300.html"},
    "ORIE 3310": {"title": "Optimization II", "href": "orie-3310.html"},
    "ORIE 3500": {"title": "Eng Probability and Statistics: Modeling and Data Science II", "href": "orie-3500.html"},
    "ORIE 3510": {"title": "Stochastic Processes for Decision-Making", "href": "orie-3510.html"},
    "ORIE 4350": {"title": "Introduction to Game Theory", "href": "orie-4350.html"},
    "ORIE 4580": {"title": "Simulation Modeling and Analysis", "href": "orie-4580.html"},
    "ORIE 4600": {"title": "Introduction to Financial Engineering", "href": "orie-4600.html"},
    "ORIE 4820": {"title": "Data-Driven Decision Modeling and Analysis", "href": "orie-4820.html"},
    "PHYS 1112": {"title": "Physics I: Mechanics and Heat", "href": "phys-1112.html"},
    "PHYS 1116": {"title": "Physics I: Mechanics and Special Relativity", "href": "phys-1116.html"},
    "PHYS 2213": {"title": "Physics II: Electromagnetism", "href": "phys-2213.html"},
    "PHYS 2217": {"title": "Physics II: Electricity and Magnetism", "href": "phys-2217.html"},
    "PHYS 2218": {"title": "Physics III: Waves and Thermal Physics", "href": "phys-2218.html"},
    "PHYS 3316": {"title": "Basics of Quantum Mechanics", "href": "phys-3316.html"},
    "PHYS 3317": {"title": "Applications of Quantum Mechanics", "href": "phys-3317.html"},
    "PHYS 3327": {"title": "Advanced Electricity and Magnetism", "href": "phys-3327.html"}
  };

  const suggestedMath = "An option for students less focused on graduate school.";
  const suggestedCS = "An option for computer science interests.";
  const suggestedEcon = "An option for economics and ORIE interests.";
  const tracks = {
    mathematics: { name: "Mathematics", courses: [
      [3210, "Suggested if you have not taken MATH 2230–2240."],
      ...[3270, 3340, 4180, 4200, 4280, 4310, 4500, 4540, 4710].map(code => [code, suggestedMath])
    ] },
    cs: { name: "Computer Science", courses: [
      [3320, "Useful for students interested in cryptography coursework."],
      [3610, suggestedCS], [4200, suggestedCS], [4210, suggestedCS],
      [4250, "Suggested for computational aspects of mathematics."],
      [4260, "Suggested for computational aspects of mathematics."],
      [4500, "May be useful for computer graphics and robotics."],
      [4540, "May be useful for computer graphics and robotics."],
      [4710, "Complements machine learning."], [4810, suggestedCS]
    ] },
    econ: { name: "Economics", courses: [
      [3110, "An analysis option for economics and ORIE."],
      ...[3360, 4310, 4370].map(code => [code, suggestedEcon]),
      ...[3270, 4200, 4210, 4280].map(code => [code, "Differential equations can be useful in economic modeling and financial mathematics."]),
      ...[4250, 4260].map(code => [code, "Numerical analysis may be useful in economics."]),
      ...[4410, 4710, 4740].map(code => [code, suggestedEcon])
    ] }
  };
  const graduateMath = [
    ...[4130, 4140, 4330, 4340].map(code => [code, "Honors sequences provide natural preparation for graduate study in mathematics."]),
    [4180, "Specifically suggested for students interested in mathematics graduate study."],
    [4530, "Specifically suggested for students interested in mathematics graduate study."]
  ];
  const { emptyTerms, normalizeCourse, courseLabel, courseDetails, placeCourse, readPlan, recommendedTerms } = window.MathRoadmapState;
  const infoFor = code => courseDetails(code, catalog);
  const storageKey = "cornell-math-roadmap-editor-v1";
  const dragType = "application/x-cornell-math-course";
  const form = document.getElementById("roadmap-form");
  const bank = document.getElementById("roadmap-recommendations");
  const years = document.getElementById("roadmap-years");
  const status = document.getElementById("roadmap-status");
  const selection = document.getElementById("roadmap-selection");
  const cancel = document.getElementById("roadmap-cancel");
  const undo = document.getElementById("roadmap-undo");
  const board = document.getElementById("roadmap-board");
  const customForm = document.getElementById("roadmap-custom-form");
  const customInput = document.getElementById("roadmap-custom-course");
  const customError = document.getElementById("roadmap-custom-error");
  let terms = emptyTerms();
  let customCourses = [];
  let pending = null;
  let loadFailed = false;
  let previousTerms = null;
  const nodeViews = new Map();

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  const nodeKey = target => `${target.term}:${target.node}`;
  const termName = term => `Year ${Math.floor(term / 2) + 1}, ${term % 2 ? "Spring" : "Fall"}`;
  const nodeName = target => `${termName(target.term)}, node ${target.node + 1}`;
  const announce = message => { status.textContent = message; };
  const filters = () => ({ concentration: form.elements.concentration.value, preparation: form.elements.preparation.value,
    graduate: form.elements.graduate.checked });

  try {
    const raw = localStorage.getItem(storageKey);
    const saved = raw ? readPlan(raw) : null;
    if (saved) {
      terms = saved.terms;
      customCourses = saved.customCourses;
      for (const name of ["concentration", "preparation"]) {
        const select = form.elements[name];
        if ([...select.options].some(option => option.value === saved.filters[name])) select.value = saved.filters[name];
      }
      form.elements.graduate.checked = saved.filters.graduate === true;
    } else if (raw) loadFailed = true;
  } catch { /* Work without storage when the browser blocks it. */ }

  function forgetTemplateUndo() {
    previousTerms = null;
    undo.hidden = true;
  }

  function save() {
    const indicator = document.getElementById("roadmap-save-status");
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, terms, filters: filters(), customCourses }));
      indicator.textContent = "Saved in this browser";
    } catch { indicator.textContent = "Saving unavailable — keep this tab open to retain your plan."; }
  }

  function refreshNodes() {
    nodeViews.forEach((view, key) => {
      const [term, node] = key.split(":").map(Number);
      const code = terms[term][node];
      const info = infoFor(code);
      const isSource = pending?.source && nodeKey(pending.source) === key;
      view.container.classList.toggle("is-filled", Boolean(code));
      view.container.classList.toggle("is-moving", Boolean(isSource));
      if (view.input.getAttribute("aria-invalid") !== "true") view.input.value = info?.label || "";
      view.title.textContent = info ? info.title : "Drop a course here, or type its code";
      view.move.hidden = view.clear.hidden = view.details.hidden = !code;
      view.remove.hidden = Boolean(code) || node < 2;
      view.move.setAttribute("aria-label", `Move ${info?.label || "course"} from ${nodeName({ term, node })}`);
      view.move.setAttribute("aria-pressed", String(Boolean(isSource)));
      view.clear.setAttribute("aria-label", `Clear ${nodeName({ term, node })}`);
      view.details.href = info?.href || "math-classes.html";
      view.details.setAttribute("aria-label", `Course details for ${info?.label || "course"}`);
      view.place.hidden = !pending || Boolean(isSource);
      view.place.disabled = Boolean(code && !pending?.source);
      view.place.textContent = code ? "Swap here" : "Place here";
      view.place.setAttribute("aria-label", `${code ? "Swap with" : "Place course in"} ${nodeName({ term, node })}`);
    });
    bank.querySelectorAll("[data-course]").forEach(button => {
      button.setAttribute("aria-pressed", String(Boolean(pending && !pending.source && pending.code === button.dataset.course)));
    });
  }

  function setPending(next) {
    pending = next;
    selection.textContent = next
      ? `${courseLabel(next.code)} selected. ${next.source ? "Choose another node to move or swap it." : "Choose Place here on an empty node."}`
      : "Drag a course into a node, type its code, or select a course and choose Place here.";
    cancel.hidden = !next;
    refreshNodes();
  }

  function place(target, payload) {
    const result = placeCourse(terms, target, payload.code, payload.source || null);
    if (!result.ok) {
      announce(result.reason === "occupied"
        ? "That node is filled. Choose an empty node or clear it first. Moving a course already in your map will swap the two courses."
        : "That course could not be moved. Select it again and choose a node.");
      return;
    }
    forgetTemplateUndo();
    terms = result.terms;
    const targetView = nodeViews.get(nodeKey(target));
    targetView.input.removeAttribute("aria-invalid");
    targetView.input.setCustomValidity("");
    targetView.error.hidden = true;
    setPending(null);
    save();
    nodeViews.get(nodeKey(target)).input.focus();
    announce(`${courseLabel(payload.code)} ${result.swapped ? "swapped into" : "placed in"} ${nodeName(target)}.`);
  }

  function startDrag(event, payload) {
    if (!payload.code) { event.preventDefault(); return; }
    event.dataTransfer.setData(dragType, JSON.stringify(payload));
    event.dataTransfer.setData("text/plain", courseLabel(payload.code));
    event.dataTransfer.effectAllowed = payload.source ? "move" : "copy";
    setPending(payload);
    announce(`${courseLabel(payload.code)} selected. Drop it into a node or use Place here.`);
  }

  function makeNode(target) {
    const item = element("li", "", "roadmap-node");
    const id = `course-${target.term}-${target.node}`;
    const label = element("label", `Course code for ${nodeName(target)}`, "roadmap-sr-only");
    label.htmlFor = id;
    const number = element("div", "", "roadmap-node-number");
    const input = element("input");
    input.id = id;
    input.type = "text";
    input.inputMode = "text";
    input.placeholder = "Course code";
    input.maxLength = 20;
    input.autocomplete = "off";
    input.setAttribute("aria-describedby", `${id}-title ${id}-error`);
    number.append(input);
    const title = element("p", "", "roadmap-node-title");
    title.id = `${id}-title`;
    const error = element("p", "", "roadmap-node-error");
    error.id = `${id}-error`;
    error.hidden = true;
    const actions = element("div", "", "roadmap-node-actions");
    const placeButton = element("button", "Place here", "roadmap-place");
    const move = element("button", "Move");
    const clear = element("button", "Clear");
    const remove = element("button", "Remove node");
    const details = element("a", "Details");
    [placeButton, move, clear, remove].forEach(button => { button.type = "button"; });
    move.draggable = true;
    remove.setAttribute("aria-label", `Remove empty ${nodeName(target)}`);
    actions.append(placeButton, move, clear, details, remove);
    item.append(label, number, title, error, actions);
    nodeViews.set(nodeKey(target), { container: item, input, title, error, place: placeButton, move, clear, details, remove });
    const clearError = () => { input.removeAttribute("aria-invalid"); input.setCustomValidity(""); error.hidden = true; };
    function commit() {
      const code = normalizeCourse(input.value);
      if (code === null) {
        const message = "Enter a course code, such as MATH 4710 or CS 2110.";
        input.setAttribute("aria-invalid", "true"); input.setCustomValidity(message);
        error.textContent = message; error.hidden = false; announce(message);
        return;
      }
      clearError();
      forgetTemplateUndo();
      terms[target.term][target.node] = code;
      if (pending?.source && nodeKey(pending.source) === nodeKey(target)) setPending(null);
      refreshNodes(); save();
      announce(code ? `${courseLabel(code)} saved in ${nodeName(target)}.` : `${nodeName(target)} cleared.`);
    }
    input.addEventListener("input", clearError);
    input.addEventListener("change", commit);
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") { event.preventDefault(); commit(); }
      if (event.key === "Escape") { input.value = courseLabel(terms[target.term][target.node]); clearError(); }
    });
    placeButton.addEventListener("click", () => { if (pending) place(target, pending); });
    move.addEventListener("click", () => {
      const code = terms[target.term][target.node];
      setPending(pending?.source && nodeKey(pending.source) === nodeKey(target) ? null : { code, source: target });
      announce(selection.textContent);
    });
    move.addEventListener("dragstart", event => startDrag(event, { code: terms[target.term][target.node], source: target }));
    clear.addEventListener("click", () => {
      forgetTemplateUndo();
      terms[target.term][target.node] = ""; clearError();
      if (pending?.source && nodeKey(pending.source) === nodeKey(target)) setPending(null);
      refreshNodes(); save(); input.focus(); announce(`${nodeName(target)} cleared.`);
    });
    remove.addEventListener("click", () => {
      if (terms[target.term][target.node] || target.node < 2) return;
      forgetTemplateUndo();
      terms[target.term].splice(target.node, 1);
      setPending(null); renderBoard(); save();
      nodeViews.get(nodeKey({ term: target.term, node: Math.min(target.node, terms[target.term].length - 1) })).input.focus();
      announce(`Empty node removed from ${termName(target.term)}.`);
    });
    item.addEventListener("dragover", event => {
      if ([...event.dataTransfer.types].includes(dragType)) {
        event.preventDefault(); event.dataTransfer.dropEffect = pending?.source ? "move" : "copy";
        item.classList.add("is-drag-over");
      }
    });
    item.addEventListener("dragleave", event => { if (!item.contains(event.relatedTarget)) item.classList.remove("is-drag-over"); });
    item.addEventListener("drop", event => {
      event.preventDefault(); item.classList.remove("is-drag-over");
      try {
        const payload = JSON.parse(event.dataTransfer.getData(dragType));
        if (payload && payload.code && normalizeCourse(payload.code) === payload.code) place(target, payload);
      } catch { announce("Choose a course from the list or type its course code."); }
    });
    return item;
  }

  function renderBoard() {
    nodeViews.clear(); years.replaceChildren();
    for (let year = 0; year < 4; year++) {
      const column = element("section", "", "roadmap-year");
      column.append(element("h3", `Year ${year + 1}`));
      for (let half = 0; half < 2; half++) {
        const term = year * 2 + half;
        const semester = element("section", "", "roadmap-semester");
        semester.id = `roadmap-term-${term + 1}`;
        semester.setAttribute("aria-label", termName(term));
        semester.append(element("h4", half ? "Spring" : "Fall"));
        const list = element("ul", "", "roadmap-node-list");
        terms[term].forEach((code, node) => list.append(makeNode({ term, node })));
        const add = element("button", "Add node", "roadmap-add-node");
        add.type = "button"; add.disabled = terms[term].length >= 8;
        add.setAttribute("aria-label", `Add a node to ${termName(term)}`);
        add.addEventListener("click", () => {
          forgetTemplateUndo();
          terms[term].push(""); renderBoard(); save();
          nodeViews.get(nodeKey({ term, node: terms[term].length - 1 })).input.focus();
          announce(`Empty node added to ${termName(term)}.`);
        });
        semester.append(list, add); column.append(semester);
      }
      years.append(column);
    }
    refreshNodes();
  }

  function courseList(courses, custom = false) {
    const list = element("ul", "", "roadmap-course-list");
    courses.forEach(([number, reason]) => {
      const code = normalizeCourse(String(number));
      const info = infoFor(code);
      const item = element("li", "", "roadmap-suggestion");
      const pick = element("button", "", "roadmap-pick");
      pick.type = "button"; pick.draggable = true; pick.dataset.course = code;
      pick.setAttribute("aria-label", `Select ${info.label}: ${info.title}`);
      pick.setAttribute("aria-pressed", "false");
      pick.append(element("strong", info.label), element("span", info.title), element("small", "Select or drag into a node"));
      pick.addEventListener("click", () => {
        setPending(pending?.code === code && !pending.source ? null : { code }); announce(selection.textContent);
      });
      pick.addEventListener("dragstart", event => startDrag(event, { code }));
      const details = element("a", "Course details");
      details.href = info.href; details.setAttribute("aria-label", `Course details for ${info.label}`);
      item.append(pick, element("p", reason), details);
      if (custom) {
        const remove = element("button", "Remove from list", "roadmap-custom-remove");
        remove.type = "button";
        remove.setAttribute("aria-label", `Remove ${info.label} from custom courses`);
        remove.addEventListener("click", () => {
          customCourses = customCourses.filter(value => value !== code);
          if (pending?.code === code && !pending.source) setPending(null);
          renderRecommendations(); save(); customInput.focus();
          announce(`${info.label} removed from the custom course list. Placed courses are kept.`);
        });
        item.append(remove);
      }
      list.append(item);
    });
    return list;
  }

  function renderRecommendations() {
    const { concentration, preparation, graduate } = filters();
    const track = tracks[concentration];
    document.getElementById("roadmap-grad-control").hidden = concentration === "cs";
    let courses = track.courses;
    if (concentration === "mathematics") courses = graduate ? graduateMath : track.courses.filter(([code]) => code !== 3210 || preparation !== "honors");
    if (concentration === "econ" && graduate) courses = [
      [4130, "Part of the honors analysis sequence suggested for graduate study in economics."],
      [4140, "Part of the honors analysis sequence suggested for graduate study in economics."],
      ...track.courses.filter(([code]) => code !== 3110)
    ];
    bank.replaceChildren();
    if (customCourses.length) bank.append(element("h3", "Your custom courses"), courseList(customCourses.map(code => [code, "Added by you."]), true));
    const customSet = new Set(customCourses);
    const suggested = courses.filter(([code]) => !customSet.has(String(code)));
    bank.append(element("h3", `${track.name} suggestions`), courseList(suggested));
    const common = [[3610, "Suggested for students interested in competitions."],
      [4040, "Suggested for students interested in competitions."]];
    if (preparation === "foundations" || preparation === "calculus") common.unshift([3040, "Helps students learn to write mathematical proofs."]);
    const alreadyListed = new Set(courses.map(([code]) => code));
    bank.append(element("h3", "For any concentration"), courseList(common.filter(([code]) => !alreadyListed.has(code) && !customSet.has(String(code)))));
    document.getElementById("roadmap-preparation-advice").textContent = preparation === "foundations" || preparation === "calculus"
      ? "Building proof experience? Consider MATH 3040; many 3000-level courses also introduce proofs."
      : preparation === "honors"
        ? "Freshman year: MATH 2230 in Fall and MATH 2240 in Spring. Other recommended courses begin in sophomore year."
        : "Proof experience selected. Use each course’s details to check its subject prerequisites.";
    refreshNodes();
  }

  customInput.addEventListener("input", () => {
    customInput.setCustomValidity(""); customInput.removeAttribute("aria-invalid"); customError.hidden = true;
  });
  customForm.addEventListener("submit", event => {
    event.preventDefault();
    const code = normalizeCourse(customInput.value);
    if (!code || (!customCourses.includes(code) && customCourses.length >= 100)) {
      const message = code ? "Remove a custom course before adding another; the list holds up to 100 courses."
        : "Enter a subject and four-digit number, such as CS 2110. A number alone means MATH.";
      customInput.setCustomValidity(message); customInput.setAttribute("aria-invalid", "true");
      customError.textContent = message; customError.hidden = false; announce(message); return;
    }
    if (!customCourses.includes(code)) customCourses.push(code);
    customInput.value = "";
    renderRecommendations(); setPending({ code }); save();
    bank.scrollTop = 0;
    announce(`${courseLabel(code)} added and selected. Choose Place here on an empty node.`);
  });
  form.addEventListener("submit", event => event.preventDefault());
  form.addEventListener("change", () => {
    setPending(null); renderRecommendations(); save();
    announce("Recommendations updated. Your course map has been kept.");
  });
  document.getElementById("roadmap-show-recommended").addEventListener("click", () => {
    previousTerms = terms.map(term => [...term]);
    terms = recommendedTerms(filters());
    pending = null;
    renderBoard(); setPending(null); save();
    undo.hidden = false;
    const message = `Suggested ${tracks[filters().concentration].name.toLowerCase()} roadmap loaded. You can edit every node.`;
    selection.textContent = message;
    announce(message);
    board.scrollIntoView({ block: "start" });
    board.focus({ preventScroll: true });
  });
  undo.addEventListener("click", () => {
    if (!previousTerms) return;
    terms = previousTerms;
    forgetTemplateUndo();
    pending = null;
    renderBoard(); setPending(null); save();
    selection.textContent = "Your previous course map has been restored.";
    announce(selection.textContent);
    board.focus({ preventScroll: true });
  });
  cancel.addEventListener("click", () => { setPending(null); announce("Course selection canceled."); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && pending) setPending(null); });
  document.addEventListener("dragend", () => years.querySelectorAll(".is-drag-over").forEach(node => node.classList.remove("is-drag-over")));
  renderBoard(); renderRecommendations(); setPending(null);
  document.getElementById("roadmap-editor").hidden = false;
  document.getElementById("roadmap-fallback").hidden = true;
  save();
  if (loadFailed) announce("The previous saved plan could not be read. A new empty map is ready.");
})();
