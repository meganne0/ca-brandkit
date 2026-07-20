/**
 * Inline text/image editing for a painted slide.
 * On blur (text) or replace (image), harvests content back into data-content shape.
 */

function parseContent(slide) {
  try {
    return JSON.parse(slide.dataset.content || "{}");
  } catch {
    return {};
  }
}

function readCorner(contentRoot, base) {
  const corner = contentRoot.querySelector(".section-title--corner");
  if (!corner) {
    return {
      number: base.number,
      sectionTitle: base.sectionTitle ?? base.section,
    };
  }
  const raw = corner.textContent.trim();
  const parts = raw.split(/\s{2,}/);
  if (parts.length >= 2) {
    return { number: parts[0], sectionTitle: parts.slice(1).join("  ") };
  }
  // Fallback: leading digits as number
  const m = raw.match(/^(\d+)\s+(.*)$/);
  if (m) return { number: m[1], sectionTitle: m[2] };
  return { number: base.number, sectionTitle: raw || base.sectionTitle };
}

function readTitleBlock(contentRoot, base) {
  const title =
    contentRoot.querySelector(".slide-header .type-h3, .layout-image-title__title .layout-image-title__chip")
      ?.textContent.trim() ?? base.title ?? "";
  const subtitle =
    contentRoot.querySelector(
      ".slide-header .type-h4, .layout-image-title__subtitle .layout-image-title__chip",
    )?.textContent.trim() ?? base.subtitle ?? "";
  return { title, subtitle };
}

function readAccented(el, baseText, baseAccent) {
  if (!el) return { text: baseText ?? "", accent: baseAccent };
  const accentEl = el.querySelector(".accent");
  const text = el.textContent;
  const accent = accentEl ? accentEl.textContent : baseAccent;
  return { text, accent };
}

export function harvestSlideContent(slide) {
  const layout = slide.dataset.layout;
  const root = slide.querySelector(".slide-content");
  const base = parseContent(slide);
  if (!root) return base;

  const corner = readCorner(root, base);
  const titles = readTitleBlock(root, base);

  if (root.classList.contains("layout-cover")) {
    const h = readAccented(root.querySelector("h1"), base.headline, base.accent);
    return {
      ...base,
      headline: h.text,
      accent: h.accent,
      subtitle: root.querySelector("p.type-body")?.textContent.trim() ?? base.subtitle,
    };
  }

  if (root.classList.contains("layout-quote")) {
    const h = readAccented(root.querySelector(".quote-panel .type-body"), base.text, base.accent);
    return { ...base, text: h.text, accent: h.accent };
  }

  if (root.classList.contains("layout-section")) {
    return {
      ...base,
      number: root.querySelector(".type-numeral")?.textContent.trim() ?? base.number,
      sectionTitle: root.querySelector("h1")?.textContent.trim() ?? base.sectionTitle,
      subtitle: root.querySelector("p.type-body")?.textContent.trim() ?? base.subtitle,
    };
  }

  if (root.classList.contains("layout-team")) {
    const people = [...root.querySelectorAll(".team-card")].map((card, i) => ({
      ...(base.people?.[i] ?? {}),
      name: card.querySelector(".team-card__name")?.textContent.trim() ?? "",
      role: card.querySelector(".team-card__role")?.textContent.trim() ?? "",
      avatar: card.querySelector(".team-card__avatar")?.getAttribute("src") ?? base.people?.[i]?.avatar,
    }));
    return { ...base, ...corner, ...titles, people };
  }

  if (root.classList.contains("layout-toc")) {
    const items = [...root.querySelectorAll(".toc-item")].map((item, i) => ({
      ...(base.items?.[i] ?? {}),
      number: item.querySelector(".toc-item__number")?.textContent.trim() ?? "",
      title: item.querySelector("h3")?.textContent.trim() ?? "",
      description: item.querySelector("p")?.textContent.trim() ?? "",
    }));
    return { ...base, ...corner, ...titles, items };
  }

  if (root.classList.contains("layout-split")) {
    const shots = [...root.querySelectorAll(".media-stack img")].map((img, i) => ({
      ...(base.shots?.[i] ?? {}),
      src: img.getAttribute("src") ?? "",
      alt: img.getAttribute("alt") ?? "",
    }));
    return {
      ...base,
      ...corner,
      ...titles,
      text: root.querySelector(".layout-split__copy > p.type-body")?.textContent.trim() ?? base.text,
      shots: shots.length ? shots : base.shots,
    };
  }

  if (root.classList.contains("layout-text-bullets")) {
    const bullets = [...root.querySelectorAll(".bullet-list li")].map((li) =>
      li.textContent.trim(),
    );
    return {
      ...base,
      ...corner,
      ...titles,
      text:
        root.querySelector(".text-bullets-grid__copy .type-body")?.textContent.trim() ??
        base.text ??
        base.body,
      bullets,
    };
  }

  if (root.classList.contains("layout-steps")) {
    const steps = [...root.querySelectorAll(".step-card")].map((card, i) => ({
      ...(base.steps?.[i] ?? {}),
      title: card.querySelector(".step-card__title")?.textContent.trim() ?? "",
      description: card.querySelector(".step-card__description")?.textContent.trim() ?? "",
      icon: base.steps?.[i]?.icon,
    }));
    return { ...base, ...corner, ...titles, steps };
  }

  if (root.classList.contains("layout-metric--1")) {
    const card = root.querySelector(".metric-card");
    const source = card?.querySelector(".metric-card__source")?.textContent.trim();
    const textEl = card?.querySelector(".metric-card__text");
    let text = textEl?.textContent.trim() ?? "";
    if (source && text.endsWith(source)) text = text.slice(0, -source.length).trim();
    return {
      ...base,
      ...corner,
      ...titles,
      metric: {
        ...(base.metric ?? {}),
        value: card?.querySelector(".metric-card__value")?.textContent.trim() ?? "",
        text,
        source: source ?? base.metric?.source,
      },
    };
  }

  if (root.classList.contains("layout-metric--row")) {
    const metrics = [...root.querySelectorAll(".metric-card")].map((card, i) => {
      const source = card.querySelector(".metric-card__source")?.textContent.trim();
      const textEl = card.querySelector(".metric-card__text");
      let text = textEl?.textContent.trim() ?? "";
      if (source && text.endsWith(source)) text = text.slice(0, -source.length).trim();
      return {
        ...(base.metrics?.[i] ?? {}),
        value: card.querySelector(".metric-card__value")?.textContent.trim() ?? "",
        text,
        source: source ?? base.metrics?.[i]?.source,
      };
    });
    return { ...base, ...corner, ...titles, metrics };
  }

  if (root.classList.contains("layout-question")) {
    return {
      ...base,
      ...corner,
      question: root.querySelector(".layout-question__q, h2.type-h2, .type-metric")?.textContent.trim() ?? base.question,
      subtitle: root.querySelector(".layout-question__aside, p.type-h4")?.textContent.trim() ?? base.subtitle,
    };
  }

  if (root.classList.contains("layout-image-title")) {
    const bullets = [...root.querySelectorAll(".layout-image-title__bullets li")].map((li) =>
      li.textContent.trim(),
    );
    const img = root.querySelector(".layout-image-title__media");
    return {
      ...base,
      ...corner,
      title: root.querySelector(".layout-image-title__title .layout-image-title__chip")?.textContent.trim() ?? base.title,
      subtitle:
        root.querySelector(".layout-image-title__subtitle .layout-image-title__chip")?.textContent.trim() ??
        base.subtitle,
      bullets: bullets.length ? bullets : base.bullets,
      image: img?.getAttribute?.("src") ?? base.image,
      alt: img?.getAttribute?.("alt") ?? base.alt,
    };
  }

  if (root.classList.contains("layout-timeline")) {
    const steps = [...root.querySelectorAll(".timeline-item")].map((item, i) => ({
      ...(base.steps?.[i] ?? {}),
      title: item.querySelector(".step-card__title")?.textContent.trim() ?? "",
      description: item.querySelector(".step-card__description")?.textContent.trim() ?? "",
    }));
    return {
      ...base,
      ...corner,
      title: root.querySelector(".layout-timeline__intro .type-h3, .slide-header .type-h3")?.textContent.trim() ?? base.title,
      subtitle:
        root.querySelector(".layout-timeline__intro .type-h4, .slide-header .type-h4")?.textContent.trim() ??
        base.subtitle,
      closing: root.querySelector(".layout-timeline__closing")?.textContent.trim() ?? base.closing,
      steps,
    };
  }

  // Generic fallback
  return { ...base, ...corner, ...titles };
}

function pickImageFile() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.hidden = true;
    document.body.appendChild(input);
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      input.remove();
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
    input.click();
  });
}

/**
 * @param {HTMLElement} slide
 * @param {{ onCommit: (content: object) => void }} opts
 */
export function enableInlineEditing(slide, { onCommit }) {
  const content = slide.querySelector(".slide-content");
  if (!content) return () => {};

  const cleanups = [];

  const commit = () => {
    const next = harvestSlideContent(slide);
    slide.dataset.content = JSON.stringify(next);
    onCommit(next);
  };

  const textTargets = content.querySelectorAll(
    "h1, h2, h3, h4, p, li, .type-metric, .type-numeral, .type-label, .type-caption, .type-body, .type-h1, .type-h3, .type-h4, .type-h5, .layout-image-title__chip",
  );

  textTargets.forEach((el) => {
    if (el.closest(".ca-footer")) return;
    if (el.classList.contains("metric-card__source")) return;
    if (el.querySelector(".layout-image-title__chip")) return; // edit chip, not wrapper
    el.contentEditable = "true";
    el.spellcheck = false;
    el.classList.add("is-editable");
    const onBlur = () => commit();
    const onKey = (e) => {
      if (e.key === "Enter" && !e.shiftKey && el.tagName !== "LI" && el.tagName !== "P") {
        e.preventDefault();
        el.blur();
      }
    };
    el.addEventListener("blur", onBlur);
    el.addEventListener("keydown", onKey);
    cleanups.push(() => {
      el.removeEventListener("blur", onBlur);
      el.removeEventListener("keydown", onKey);
      el.contentEditable = "false";
      el.classList.remove("is-editable");
    });
  });

  content.querySelectorAll("img:not(.logo)").forEach((img) => {
    img.classList.add("is-replaceable");
    img.title = "Click to replace image";
    const onClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dataUrl = await pickImageFile();
      if (!dataUrl) return;
      img.src = dataUrl;
      commit();
    };
    img.addEventListener("click", onClick);
    cleanups.push(() => {
      img.removeEventListener("click", onClick);
      img.classList.remove("is-replaceable");
      img.removeAttribute("title");
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
