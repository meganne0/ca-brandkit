/**
 * Structured content form for draft slide editing.
 * Layout-aware fields → content JSON (Modal Maker / LinkedIn style).
 */

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function field(name, label, value, { type = "text", rows = 3 } = {}) {
  const id = `deck-field-${name}`;
  if (type === "textarea") {
    return `
      <label class="deck-form__field">
        <span class="deck-form__label">${esc(label)}</span>
        <textarea class="deck-form__input" id="${id}" name="${esc(name)}" rows="${rows}">${esc(value)}</textarea>
      </label>
    `;
  }
  return `
    <label class="deck-form__field">
      <span class="deck-form__label">${esc(label)}</span>
      <input class="deck-form__input" id="${id}" name="${esc(name)}" type="${esc(type)}" value="${esc(value)}" />
    </label>
  `;
}

function severitySelect(name, value) {
  const v = String(value ?? "").toLowerCase();
  return `
    <select class="deck-form__input" name="${esc(name)}">
      <option value="" ${v !== "high" && v !== "medium" ? "selected" : ""}>None</option>
      <option value="medium" ${v === "medium" ? "selected" : ""}>Medium</option>
      <option value="high" ${v === "high" ? "selected" : ""}>High</option>
    </select>
  `;
}

function listHeader(title, addLabel, addAction) {
  return `
    <div class="deck-form__list-head">
      <h3 class="deck-form__list-title">${esc(title)}</h3>
      <button type="button" class="deck-form__btn" data-action="${esc(addAction)}">${esc(addLabel)}</button>
    </div>
  `;
}

function buildFormHtml(layout, content) {
  const c = content || {};
  const bits = [];

  bits.push(`<p class="deck-form__layout">${esc(layout)}</p>`);

  if (layout === "LY-01") {
    bits.push(field("headline", "Headline", c.headline ?? ""));
    bits.push(field("accent", "Accent phrase", c.accent ?? ""));
    bits.push(field("subtitle", "Subtitle", c.subtitle ?? "", { type: "textarea", rows: 2 }));
    return bits.join("");
  }

  if (layout === "LY-05") {
    bits.push(field("text", "Quote", c.text ?? "", { type: "textarea", rows: 4 }));
    bits.push(field("accent", "Accent phrase", c.accent ?? ""));
    return bits.join("");
  }

  if (layout === "LY-04") {
    bits.push(field("number", "Number", c.number ?? ""));
    bits.push(field("sectionTitle", "Section title", c.sectionTitle ?? ""));
    bits.push(field("subtitle", "Subtitle", c.subtitle ?? "", { type: "textarea", rows: 2 }));
    return bits.join("");
  }

  if (layout === "LY-13" || layout === "LY-14") {
    bits.push(field("number", "Number", c.number ?? ""));
    bits.push(field("sectionTitle", "Section label", c.sectionTitle ?? ""));
    bits.push(field("question", "Line", c.question ?? c.title ?? "", { type: "textarea", rows: 2 }));
    if (layout === "LY-14") {
      bits.push(field("subtitle", "Sub-line", c.subtitle ?? "", { type: "textarea", rows: 2 }));
    }
    return bits.join("");
  }

  // Shared header fields for most layouts
  const needsCorner = ![
    "LY-01",
    "LY-05",
  ].includes(layout);
  if (needsCorner) {
    bits.push(field("number", "Number", c.number ?? ""));
    bits.push(field("sectionTitle", "Section label", c.sectionTitle ?? ""));
  }
  bits.push(field("title", "Title", c.title ?? ""));
  bits.push(field("subtitle", "Subtitle", c.subtitle ?? "", { type: "textarea", rows: 2 }));

  if (layout === "LY-08") {
    bits.push(field("text", "Body", c.text ?? "", { type: "textarea", rows: 3 }));
    const bullets = Array.isArray(c.bullets) ? c.bullets : [];
    bits.push(listHeader("Bullets", "Add bullet", "add-bullet"));
    bits.push(`<div class="deck-form__list" data-list="bullets">`);
    bullets.forEach((bullet, i) => {
      bits.push(`
        <div class="deck-form__row" data-index="${i}">
          <input class="deck-form__input" name="bullet-${i}" value="${esc(bullet)}" placeholder="Bullet text" />
          <button type="button" class="deck-form__btn deck-form__btn--ghost" data-action="remove-bullet" data-index="${i}" aria-label="Remove">✕</button>
        </div>
      `);
    });
    bits.push(`</div>`);
    return bits.join("");
  }

  if (layout === "LY-02") {
    const people = Array.isArray(c.people) ? c.people : [];
    bits.push(listHeader("People", "Add person", "add-person"));
    bits.push(`<div class="deck-form__list" data-list="people">`);
    people.forEach((person, i) => {
      bits.push(`
        <div class="deck-form__card" data-index="${i}">
          <div class="deck-form__row">
            <input class="deck-form__input" name="person-name-${i}" value="${esc(person.name ?? "")}" placeholder="Name" />
            <button type="button" class="deck-form__btn deck-form__btn--ghost" data-action="remove-person" data-index="${i}" aria-label="Remove">✕</button>
          </div>
          <input class="deck-form__input" name="person-role-${i}" value="${esc(person.role ?? "")}" placeholder="Role" />
        </div>
      `);
    });
    bits.push(`</div>`);
    return bits.join("");
  }

  if (layout === "LY-09" || layout === "LY-10" || layout === "LY-18" || layout === "LY-19" || layout === "LY-20") {
    const steps = Array.isArray(c.steps) ? c.steps : [];
    const max = layout === "LY-09" ? 3 : layout === "LY-10" ? 4 : 8;
    bits.push(listHeader("Steps", "Add step", "add-step"));
    bits.push(`<input type="hidden" name="steps-max" value="${max}" />`);
    bits.push(`<div class="deck-form__list" data-list="steps">`);
    steps.forEach((step, i) => {
      bits.push(`
        <div class="deck-form__card" data-index="${i}">
          <div class="deck-form__row">
            <input class="deck-form__input" name="step-title-${i}" value="${esc(step.title ?? "")}" placeholder="Step title" />
            <button type="button" class="deck-form__btn deck-form__btn--ghost" data-action="remove-step" data-index="${i}" aria-label="Remove">✕</button>
          </div>
          <textarea class="deck-form__input" name="step-desc-${i}" rows="2" placeholder="Description">${esc(step.description ?? "")}</textarea>
        </div>
      `);
    });
    bits.push(`</div>`);
    return bits.join("");
  }

  if (layout === "LY-11") {
    const metric = c.metric ?? {};
    bits.push(field("metric-value", "Metric value", metric.value ?? ""));
    bits.push(field("metric-text", "Metric text", metric.text ?? "", { type: "textarea", rows: 2 }));
    bits.push(field("metric-source", "Source", metric.source ?? ""));
    return bits.join("");
  }

  if (layout === "LY-12") {
    const metrics = Array.isArray(c.metrics) ? c.metrics : [];
    bits.push(listHeader("Metrics", "Add metric", "add-metric"));
    bits.push(`<div class="deck-form__list" data-list="metrics">`);
    metrics.forEach((metric, i) => {
      bits.push(`
        <div class="deck-form__card" data-index="${i}">
          <div class="deck-form__row">
            <input class="deck-form__input" name="metric-value-${i}" value="${esc(metric.value ?? "")}" placeholder="Value" />
            <button type="button" class="deck-form__btn deck-form__btn--ghost" data-action="remove-metric" data-index="${i}" aria-label="Remove">✕</button>
          </div>
          <textarea class="deck-form__input" name="metric-text-${i}" rows="2" placeholder="Text">${esc(metric.text ?? "")}</textarea>
          <input class="deck-form__input" name="metric-source-${i}" value="${esc(metric.source ?? "")}" placeholder="Source" />
        </div>
      `);
    });
    bits.push(`</div>`);
    return bits.join("");
  }

  if (layout === "LY-21") {
    const items = Array.isArray(c.items) ? c.items : [];
    bits.push(listHeader("Data types", "Add item", "add-chip"));
    bits.push(`<div class="deck-form__list" data-list="chips">`);
    items.forEach((item, i) => {
      const label = typeof item === "string" ? item : item.label ?? item.title ?? "";
      const description =
        typeof item === "string" ? "" : item.description ?? item.text ?? "";
      bits.push(`
        <div class="deck-form__card" data-index="${i}">
          <div class="deck-form__row">
            <input class="deck-form__input" name="chip-label-${i}" value="${esc(label)}" placeholder="Type label" />
            <button type="button" class="deck-form__btn deck-form__btn--ghost" data-action="remove-chip" data-index="${i}" aria-label="Remove">✕</button>
          </div>
          <textarea class="deck-form__input" name="chip-desc-${i}" rows="2" placeholder="Description (shown on click)">${esc(description)}</textarea>
        </div>
      `);
    });
    bits.push(`</div>`);
    return bits.join("");
  }

  if (layout === "LY-22") {
    const items = Array.isArray(c.items) ? c.items : [];
    bits.push(field("hint", "Hint", c.hint ?? ""));
    bits.push(listHeader("Demo URLs", "Add URL", "add-url"));
    bits.push(`<div class="deck-form__list" data-list="urls">`);
    items.forEach((item, i) => {
      const url = typeof item === "string" ? item : item.url ?? "";
      const severity = typeof item === "string" ? "" : item.severity ?? "";
      bits.push(`
        <div class="deck-form__card" data-index="${i}">
          <div class="deck-form__row">
            <input class="deck-form__input" name="url-${i}" value="${esc(url)}" placeholder="https://…" />
            <button type="button" class="deck-form__btn deck-form__btn--ghost" data-action="remove-url" data-index="${i}" aria-label="Remove">✕</button>
          </div>
          <label class="deck-form__field deck-form__field--inline">
            <span class="deck-form__label">Severity</span>
            ${severitySelect(`severity-${i}`, severity)}
          </label>
        </div>
      `);
    });
    bits.push(`</div>`);
    bits.push(`<p class="deck-form__note">Up to 15 URLs. High = orange, Medium = deep yellow.</p>`);
    return bits.join("");
  }

  if (layout === "LY-03") {
    const items = Array.isArray(c.items) ? c.items : [];
    bits.push(listHeader("TOC items", "Add item", "add-toc"));
    bits.push(`<div class="deck-form__list" data-list="toc">`);
    items.forEach((item, i) => {
      bits.push(`
        <div class="deck-form__card" data-index="${i}">
          <div class="deck-form__row">
            <input class="deck-form__input" name="toc-number-${i}" value="${esc(item.number ?? "")}" placeholder="01" style="max-width:72px" />
            <input class="deck-form__input" name="toc-title-${i}" value="${esc(item.title ?? "")}" placeholder="Title" />
            <button type="button" class="deck-form__btn deck-form__btn--ghost" data-action="remove-toc" data-index="${i}" aria-label="Remove">✕</button>
          </div>
          <input class="deck-form__input" name="toc-desc-${i}" value="${esc(item.description ?? "")}" placeholder="Description" />
        </div>
      `);
    });
    bits.push(`</div>`);
    return bits.join("");
  }

  // Generic text layouts (split, etc.)
  bits.push(field("text", "Body", c.text ?? "", { type: "textarea", rows: 3 }));
  return bits.join("");
}

function val(form, name) {
  const el = form.elements.namedItem(name);
  if (!el) return "";
  return String(el.value ?? "").trim();
}

function readContentFromForm(form, layout, base = {}) {
  const next = { ...base };

  if (layout === "LY-01") {
    next.headline = val(form, "headline");
    next.accent = val(form, "accent");
    next.subtitle = val(form, "subtitle");
    return next;
  }

  if (layout === "LY-05") {
    next.text = val(form, "text");
    next.accent = val(form, "accent");
    return next;
  }

  if (layout === "LY-04") {
    next.number = val(form, "number");
    next.sectionTitle = val(form, "sectionTitle");
    next.subtitle = val(form, "subtitle");
    return next;
  }

  if (layout === "LY-13" || layout === "LY-14") {
    next.number = val(form, "number");
    next.sectionTitle = val(form, "sectionTitle");
    next.question = val(form, "question");
    if (layout === "LY-14") next.subtitle = val(form, "subtitle");
    return next;
  }

  if (form.elements.namedItem("number")) next.number = val(form, "number");
  if (form.elements.namedItem("sectionTitle")) next.sectionTitle = val(form, "sectionTitle");
  if (form.elements.namedItem("title")) next.title = val(form, "title");
  if (form.elements.namedItem("subtitle")) next.subtitle = val(form, "subtitle");
  if (form.elements.namedItem("hint")) next.hint = val(form, "hint");
  if (form.elements.namedItem("text")) next.text = val(form, "text");

  if (layout === "LY-08") {
    const bullets = [];
    for (const el of form.elements) {
      if (el.name?.startsWith("bullet-")) bullets.push(el.value.trim());
    }
    next.bullets = bullets.filter(Boolean);
    return next;
  }

  if (layout === "LY-02") {
    const people = [];
    let i = 0;
    while (form.elements.namedItem(`person-name-${i}`)) {
      people.push({
        ...(base.people?.[i] ?? {}),
        name: val(form, `person-name-${i}`),
        role: val(form, `person-role-${i}`),
        avatar: base.people?.[i]?.avatar ?? "",
      });
      i += 1;
    }
    next.people = people;
    return next;
  }

  if (layout === "LY-09" || layout === "LY-10" || layout === "LY-18" || layout === "LY-19" || layout === "LY-20") {
    const steps = [];
    let i = 0;
    while (form.elements.namedItem(`step-title-${i}`)) {
      steps.push({
        ...(base.steps?.[i] ?? {}),
        title: val(form, `step-title-${i}`),
        description: val(form, `step-desc-${i}`),
        icon: base.steps?.[i]?.icon,
      });
      i += 1;
    }
    next.steps = steps;
    return next;
  }

  if (layout === "LY-11") {
    next.metric = {
      ...(base.metric ?? {}),
      value: val(form, "metric-value"),
      text: val(form, "metric-text"),
      source: val(form, "metric-source"),
    };
    return next;
  }

  if (layout === "LY-12") {
    const metrics = [];
    let i = 0;
    while (form.elements.namedItem(`metric-value-${i}`)) {
      metrics.push({
        ...(base.metrics?.[i] ?? {}),
        value: val(form, `metric-value-${i}`),
        text: val(form, `metric-text-${i}`),
        source: val(form, `metric-source-${i}`),
      });
      i += 1;
    }
    next.metrics = metrics;
    return next;
  }

  if (layout === "LY-21") {
    const items = [];
    let i = 0;
    while (form.elements.namedItem(`chip-label-${i}`) || form.elements.namedItem(`chip-${i}`)) {
      const label = val(form, `chip-label-${i}`) || val(form, `chip-${i}`);
      const description = val(form, `chip-desc-${i}`);
      if (label) {
        items.push(description ? { label, description } : label);
      }
      i += 1;
    }
    next.items = items.slice(0, 12);
    delete next.hint;
    delete next.subtitle;
    return next;
  }

  if (layout === "LY-22") {
    const items = [];
    let i = 0;
    while (form.elements.namedItem(`url-${i}`)) {
      const url = val(form, `url-${i}`);
      const severity = val(form, `severity-${i}`).toLowerCase();
      if (url) {
        items.push({
          url,
          severity: severity === "high" || severity === "medium" ? severity : "",
        });
      }
      i += 1;
    }
    next.items = items.slice(0, 15);
    return next;
  }

  if (layout === "LY-03") {
    const items = [];
    let i = 0;
    while (form.elements.namedItem(`toc-title-${i}`)) {
      items.push({
        ...(base.items?.[i] ?? {}),
        number: val(form, `toc-number-${i}`),
        title: val(form, `toc-title-${i}`),
        description: val(form, `toc-desc-${i}`),
      });
      i += 1;
    }
    next.items = items;
    return next;
  }

  return next;
}

function mutateList(layout, content, action) {
  const next = structuredClone(content || {});

  if (action === "add-bullet") {
    next.bullets = [...(next.bullets ?? []), "New bullet"];
  } else if (action === "remove-bullet") {
    /* handled with index */
  } else if (action === "add-url") {
    const items = [...(next.items ?? [])];
    if (items.length < 15) items.push({ url: "https://", severity: "medium" });
    next.items = items;
  } else if (action === "add-chip") {
    const items = [...(next.items ?? [])];
    if (items.length < 12) {
      items.push({ label: "New type", description: "" });
    }
    next.items = items;
  } else if (action === "add-person") {
    next.people = [...(next.people ?? []), { name: "Name", role: "Role", avatar: "" }];
  } else if (action === "add-step") {
    const max = layout === "LY-09" ? 3 : layout === "LY-10" ? 4 : 8;
    const steps = [...(next.steps ?? [])];
    if (steps.length < max) steps.push({ title: "New step", description: "" });
    next.steps = steps;
  } else if (action === "add-metric") {
    const metrics = [...(next.metrics ?? [])];
    if (metrics.length < 3) metrics.push({ value: "0", text: "", source: "" });
    next.metrics = metrics;
  } else if (action === "add-toc") {
    next.items = [...(next.items ?? []), { number: "0", title: "New item", description: "" }];
  }

  return next;
}

function removeAt(list, index) {
  return (list ?? []).filter((_, i) => i !== index);
}

/**
 * Mount a live content form into `container`.
 * @returns {() => void} dispose
 */
export function mountSlideContentForm(container, { layout, content, onChange }) {
  let current = structuredClone(content || {});
  let form;

  function emit() {
    current = readContentFromForm(form, layout, current);
    onChange?.(structuredClone(current));
  }

  function render() {
    container.innerHTML = `
      <form class="deck-form" id="deck-content-form" novalidate>
        ${buildFormHtml(layout, current)}
      </form>
    `;
    form = container.querySelector("#deck-content-form");

    form.addEventListener("input", emit);
    form.addEventListener("change", emit);

    form.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-action]");
      if (!btn) return;
      event.preventDefault();
      const action = btn.dataset.action;
      const index = Number(btn.dataset.index);

      // Capture typed values before structural rebuild
      current = readContentFromForm(form, layout, current);

      if (action === "remove-bullet") current.bullets = removeAt(current.bullets, index);
      else if (action === "remove-url") current.items = removeAt(current.items, index);
      else if (action === "remove-chip") current.items = removeAt(current.items, index);
      else if (action === "remove-person") current.people = removeAt(current.people, index);
      else if (action === "remove-step") current.steps = removeAt(current.steps, index);
      else if (action === "remove-metric") current.metrics = removeAt(current.metrics, index);
      else if (action === "remove-toc") current.items = removeAt(current.items, index);
      else current = mutateList(layout, current, action);

      onChange?.(structuredClone(current));
      render();
    });
  }

  render();

  return () => {
    container.replaceChildren();
  };
}
