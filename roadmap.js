/* Course recommendations from mathwiiki website.txt. */
(() => {
"use strict";
  const titles = {
    2210: "Linear Algebra", 2220: "Multivariable Calculus",
    2230: "Theoretical Linear Algebra and Vector Calculus I",
    2240: "Theoretical Linear Algebra and Calculus", 3040: "Prove It!",
    3110: "Introduction to Analysis", 3210: "Manifolds and Differential Forms",
    3270: "Introduction to Ordinary Differential Equations", 3320: "Introduction to Number Theory",
    3340: "Abstract Algebra", 3360: "Applicable Algebra", 3610: "Mathematical Modeling",
    4040: "Patterns, Proofs, and Problems", 4130: "Honors Introduction to Analysis I",
    4140: "Honors Introduction to Analysis II", 4180: "Complex Analysis",
    4200: "Differential Equations and Dynamical Systems", 4210: "Nonlinear Dynamics and Chaos",
    4250: "Numerical Analysis and Differential Equations", 4260: "Numerical Analysis: Linear and Nonlinear Problems",
    4280: "Introduction to Partial Differential Equations", 4310: "Linear Algebra",
    4330: "Honors Linear Algebra", 4340: "Honors Introduction to Algebra", 4370: "Computational Algebra",
    4410: "Introduction to Combinatorics I", 4500: "Matrix Groups", 4530: "Introduction to Topology",
    4540: "Introduction to Differential Geometry", 4710: "Basic Probability",
    4740: "Stochastic Processes", 4810: "Mathematical Logic"
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
  const { emptyTerms, normalizeCourse, placeCourse, readPlan, recommendedTerms } = window.MathRoadmapState;
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
  let terms = emptyTerms();
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
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, terms, filters: filters() }));
      indicator.textContent = "Saved in this browser";
    } catch { indicator.textContent = "Saving unavailable — keep this tab open to retain your plan."; }
  }

  function refreshNodes() {
    nodeViews.forEach((view, key) => {
      const [term, node] = key.split(":").map(Number);
      const code = terms[term][node];
      const isSource = pending?.source && nodeKey(pending.source) === key;
      view.container.classList.toggle("is-filled", Boolean(code));
      view.container.classList.toggle("is-moving", Boolean(isSource));
      if (view.input.getAttribute("aria-invalid") !== "true") view.input.value = code;
      view.title.textContent = code ? (titles[code] || "Custom course") : "Drop a course here, or type its number";
      view.move.hidden = view.clear.hidden = view.details.hidden = !code;
      view.remove.hidden = Boolean(code) || node < 2;
      view.move.setAttribute("aria-label", `Move MATH ${code} from ${nodeName({ term, node })}`);
      view.move.setAttribute("aria-pressed", String(Boolean(isSource)));
      view.clear.setAttribute("aria-label", `Clear ${nodeName({ term, node })}`);
      view.details.href = code && titles[code] ? `math-${code}.html` : "math-classes.html";
      view.details.setAttribute("aria-label", `Course details for MATH ${code}`);
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
      ? `MATH ${next.code} selected. ${next.source ? "Choose another node to move or swap it." : "Choose Place here on an empty node."}`
      : "Drag a course into a node, type its number, or select a course and choose Place here.";
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
    announce(`MATH ${payload.code} ${result.swapped ? "swapped into" : "placed in"} ${nodeName(target)}.`);
  }

  function startDrag(event, payload) {
    if (!payload.code) { event.preventDefault(); return; }
    event.dataTransfer.setData(dragType, JSON.stringify(payload));
    event.dataTransfer.setData("text/plain", `MATH ${payload.code}`);
    event.dataTransfer.effectAllowed = payload.source ? "move" : "copy";
    setPending(payload);
    announce(`MATH ${payload.code} selected. Drop it into a node or use Place here.`);
  }

  function makeNode(target) {
    const item = element("li", "", "roadmap-node");
    const id = `course-${target.term}-${target.node}`;
    const label = element("label", `Course number for ${nodeName(target)}`, "roadmap-sr-only");
    label.htmlFor = id;
    const number = element("div", "", "roadmap-node-number");
    const input = element("input");
    input.id = id;
    input.type = "text";
    input.inputMode = "numeric";
    input.placeholder = "Course #";
    input.maxLength = 12;
    input.autocomplete = "off";
    input.setAttribute("aria-describedby", `${id}-title ${id}-error`);
    number.append(element("span", "MATH"), input);
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
        const message = "Enter a four-digit course number, such as 4710.";
        input.setAttribute("aria-invalid", "true"); input.setCustomValidity(message);
        error.textContent = message; error.hidden = false; announce(message);
        return;
      }
      clearError();
      forgetTemplateUndo();
      terms[target.term][target.node] = code;
      if (pending?.source && nodeKey(pending.source) === nodeKey(target)) setPending(null);
      refreshNodes(); save();
      announce(code ? `MATH ${code} saved in ${nodeName(target)}.` : `${nodeName(target)} cleared.`);
    }
    input.addEventListener("input", clearError);
    input.addEventListener("change", commit);
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") { event.preventDefault(); commit(); }
      if (event.key === "Escape") { input.value = terms[target.term][target.node]; clearError(); }
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
        if (payload && typeof payload.code === "string" && /^\d{4}$/.test(payload.code)) place(target, payload);
      } catch { announce("Choose a course from the recommendations or type a course number."); }
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

  function courseList(courses) {
    const list = element("ul", "", "roadmap-course-list");
    courses.forEach(([number, reason]) => {
      const code = String(number);
      const item = element("li", "", "roadmap-suggestion");
      const pick = element("button", "", "roadmap-pick");
      pick.type = "button"; pick.draggable = true; pick.dataset.course = code;
      pick.setAttribute("aria-label", `Select MATH ${code}: ${titles[code]}`);
      pick.setAttribute("aria-pressed", "false");
      pick.append(element("strong", `MATH ${code}`), element("span", titles[code]), element("small", "Select or drag into a node"));
      pick.addEventListener("click", () => {
        setPending(pending?.code === code && !pending.source ? null : { code }); announce(selection.textContent);
      });
      pick.addEventListener("dragstart", event => startDrag(event, { code }));
      const details = element("a", "Course details");
      details.href = `math-${code}.html`; details.setAttribute("aria-label", `Course details for MATH ${code}`);
      item.append(pick, element("p", reason), details); list.append(item);
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
    bank.replaceChildren(element("h3", `${track.name} suggestions`), courseList(courses));
    const common = [[3610, "Suggested for students interested in competitions."],
      [4040, "Suggested for students interested in competitions."]];
    if (preparation === "foundations" || preparation === "calculus") common.unshift([3040, "Helps students learn to write mathematical proofs."]);
    const alreadyListed = new Set(courses.map(([code]) => code));
    bank.append(element("h3", "For any concentration"), courseList(common.filter(([code]) => !alreadyListed.has(code))));
    document.getElementById("roadmap-preparation-advice").textContent = preparation === "foundations" || preparation === "calculus"
      ? "Building proof experience? Consider MATH 3040; many 3000-level courses also introduce proofs."
      : preparation === "honors"
        ? "Freshman year: MATH 2230 in Fall and MATH 2240 in Spring. Other recommended courses begin in sophomore year."
        : "Proof experience selected. Use each course’s details to check its subject prerequisites.";
    refreshNodes();
  }

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
