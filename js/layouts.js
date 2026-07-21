import { mountSlideFooter } from "./components/footer.js?v=29";
import { initImageLightbox } from "./components/lightbox.js?v=28";

const LOGO_COVER_SRC = "/visual%20assets/logo/logo-vertical-white-orange.svg";

/**
 * Layout recipes (LY-01 …)
 * Independent of background — apply with data-layout="LY-01"
 * Content is passed separately; any BG can pair with any LY.
 */
export const LAYOUTS = {
  "LY-01": {
    label: "Cover",
    description: "Vertical logo + large headline + subtitle. No footer.",
    footer: false,
    className: "layout-cover",
  },

  "LY-02": {
    label: "Team",
    description: "1–3 avatars with name and title. Footer.",
    footer: true,
    className: "layout-team",
  },

  "LY-03": {
    label: "Table of contents",
    description: "Deck roadmap with numbered sections. Footer.",
    footer: true,
    className: "layout-toc",
  },

  "LY-04": {
    label: "Section",
    description: "Number + large orange section name + subtitle. Footer.",
    footer: true,
    className: "layout-section",
  },

  "LY-05": {
    label: "Quote panel",
    description: "Statement card only — no section/title header. Footer.",
    footer: true,
    className: "layout-quote",
  },

  "LY-06": {
    label: "Insight + evidence",
    description: "Copy left, screenshots right. Footer.",
    footer: true,
    className: "layout-split",
  },

  "LY-07": {
    label: "Evidence + insight",
    description: "Screenshots left, copy right — mirror of LY-06. Footer.",
    footer: true,
    className: "layout-split layout-split--media-left",
  },

  "LY-08": {
    label: "Text + bullets",
    description: "Main text in one column, bullet points in the other. Footer.",
    footer: true,
    className: "layout-text-bullets",
  },

  "LY-09": {
    label: "Three steps",
    description: "Three Phosphor icons with titles and descriptions. Footer.",
    footer: true,
    className: "layout-steps layout-steps--3",
  },

  "LY-10": {
    label: "Four steps",
    description: "Four Phosphor icons with titles and descriptions. Footer.",
    footer: true,
    className: "layout-steps layout-steps--4",
  },

  "LY-11": {
    label: "Metric spotlight",
    description: "One large bold metric with body and source. Footer.",
    footer: true,
    className: "layout-metric layout-metric--1",
  },

  "LY-12": {
    label: "Metrics row",
    description: "2–3 large metrics with body and source. Footer.",
    footer: true,
    className: "layout-metric layout-metric--row",
  },

  "LY-13": {
    label: "Single Line",
    description: "Large orange single-line statement (metric 80px style). Footer.",
    footer: true,
    className: "layout-question",
  },

  "LY-14": {
    label: "Single Line with Sub-line",
    description: "Large orange single line with H4 subtitle. Footer.",
    footer: true,
    className: "layout-question layout-question--aside",
  },

  "LY-15": {
    label: "Image title · center",
    description: "Full-bleed image with frosted title/subtitle, left + vertically centered. Footer.",
    footer: true,
    className: "layout-image-title layout-image-title--center",
  },

  "LY-16": {
    label: "Image title · top",
    description:
      "Full-bleed image with frosted title/subtitle/bullets, left + 15% from top. Footer.",
    footer: true,
    className: "layout-image-title layout-image-title--top",
  },

  "LY-17": {
    label: "Image title · bottom",
    description: "Full-bleed image with frosted title/subtitle, left + 20% from bottom. Footer.",
    footer: true,
    className: "layout-image-title layout-image-title--bottom",
  },

  "LY-18": {
    label: "Timeline · start",
    description:
      "Title/subtitle left + first timeline step(s) right. Rail begins and continues off-slide. Footer.",
    footer: true,
    className: "layout-timeline layout-timeline--start",
  },

  "LY-19": {
    label: "Timeline · full",
    description: "Full-width timeline steps. Rail continues edge to edge. Footer.",
    footer: true,
    className: "layout-timeline layout-timeline--full",
  },

  "LY-20": {
    label: "Timeline · end",
    description: "Timeline steps with matching LY-19 spacing; closing text on the right. Rail ends at last item. Footer.",
    footer: true,
    className: "layout-timeline layout-timeline--end",
  },
};

function accentize(text, accent) {
  if (!accent) return text;
  const idx = text.indexOf(accent);
  if (idx === -1) return text;
  return (
    text.slice(0, idx) +
    `<span class="accent">${accent}</span>` +
    text.slice(idx + accent.length)
  );
}

function formatSectionLabel(content) {
  const number = content.number ?? "";
  const section = content.sectionTitle ?? content.section ?? "";
  if (number && section) return `${number}  ${section}`;
  return number || section;
}

function cornerSection(content) {
  const sectionLabel = formatSectionLabel(content);
  if (!sectionLabel) return "";
  return `<p class="type-label section-title--corner">${sectionLabel}</p>`;
}

function titleBlock(content) {
  const title = content.title ?? "";
  const subtitle = content.subtitle ?? "";
  if (!title && !subtitle) return "";
  return `
    <header class="slide-header">
      ${title ? `<h2 class="type-h3">${title}</h2>` : ""}
      ${subtitle ? `<p class="type-h4">${subtitle}</p>` : ""}
    </header>
  `;
}

function slideHeader(content) {
  return `${cornerSection(content)}${titleBlock(content)}`;
}

function renderCover(content) {
  const el = document.createElement("div");
  el.className = "slide-content layout-cover";
  const headline = accentize(content.headline ?? "", content.accent);
  const subtitle = content.subtitle ?? content.body ?? "";
  el.innerHTML = `
    <img class="logo logo--cover" src="${LOGO_COVER_SRC}" alt="CyberArmor" />
    <h1 class="type-h1">${headline}</h1>
    ${subtitle ? `<p class="type-body">${subtitle}</p>` : ""}
  `;
  return el;
}

function renderTeam(content) {
  const el = document.createElement("div");
  el.className = "slide-content layout-team";
  const people = (content.people ?? []).slice(0, 3);
  const count = Math.max(people.length, 1);
  el.dataset.count = String(count);

  el.innerHTML = `
    ${slideHeader(content)}
    <div class="team-grid team-grid--${count}">
      ${people
        .map(
          (person) => `
            <article class="team-card">
              <div class="team-card__avatar-ring">
                <img
                  class="team-card__avatar"
                  src="${person.avatar ?? ""}"
                  alt="${person.name ?? ""}"
                />
              </div>
              <div class="team-card__meta">
                <h3 class="type-h5 team-card__name">${person.name ?? ""}</h3>
                <p class="type-caption team-card__role">${person.role ?? ""}</p>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
  return el;
}

function renderToc(content) {
  const el = document.createElement("div");
  el.className = "slide-content layout-toc";
  const items = content.items ?? [];
  el.innerHTML = `
    ${slideHeader(content)}
    <div class="toc-list">
      ${items
        .map(
          (item) => `
            <article class="toc-item">
              <span class="type-numeral toc-item__number">${item.number ?? ""}</span>
              <div class="toc-item__content">
                <h3 class="type-h5">${item.title ?? ""}</h3>
                ${item.description ? `<p class="type-label type-label--plain">${item.description}</p>` : ""}
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
  return el;
}

function renderQuote(content) {
  const el = document.createElement("div");
  el.className = "slide-content layout-quote";
  const text = accentize(content.text ?? "", content.accent);
  el.innerHTML = `
    <div class="quote-panel">
      <p class="type-body">${text}</p>
    </div>
  `;
  return el;
}

function renderSplit(content, { mediaLeft = false } = {}) {
  const el = document.createElement("div");
  el.className = mediaLeft
    ? "slide-content layout-split layout-split--media-left"
    : "slide-content layout-split";
  const shots = (content.shots ?? [])
    .map((shot, i) => {
      const cls = i === 0 ? "shot-back" : "shot-front";
      return `<img class="${cls}" src="${shot.src}" alt="${shot.alt ?? ""}" />`;
    })
    .join("");
  const copy = `
    <div class="layout-split__copy">
      ${titleBlock(content)}
      <p class="type-body">${content.text ?? ""}</p>
    </div>
  `;
  const media = `
    <div class="layout-split__media">
      <div class="media-stack">${shots}</div>
    </div>
  `;
  el.innerHTML = `
    ${cornerSection(content)}
    ${mediaLeft ? `${media}${copy}` : `${copy}${media}`}
  `;
  return el;
}

function renderSplitMediaLeft(content) {
  return renderSplit(content, { mediaLeft: true });
}

function renderTextBullets(content) {
  const el = document.createElement("div");
  el.className = "slide-content layout-text-bullets";
  const bullets = content.bullets ?? [];
  el.innerHTML = `
    ${cornerSection(content)}
    ${titleBlock(content)}
    <div class="text-bullets-grid">
      <div class="text-bullets-grid__copy">
        <p class="type-body">${content.text ?? ""}</p>
      </div>
      <ul class="bullet-list">
        ${bullets.map((bullet) => `<li class="type-body">${bullet}</li>`).join("")}
      </ul>
    </div>
  `;
  return el;
}

function stepIcon(name) {
  const icon = name || "ph-circle";
  return `<i class="ph-light ${icon} step-card__icon" aria-hidden="true"></i>`;
}

function renderSteps(content, count) {
  const el = document.createElement("div");
  el.className = `slide-content layout-steps layout-steps--${count}`;
  const steps = (content.steps ?? []).slice(0, count);
  const defaults =
    count === 3
      ? ["ph-eye", "ph-graph", "ph-shield-check"]
      : ["ph-download-simple", "ph-circles-three-plus", "ph-ranking", "ph-lightning"];

  el.innerHTML = `
    ${slideHeader(content)}
    <div class="steps-grid steps-grid--${count}">
      ${steps
        .map(
          (step, index) => `
            <article class="step-card">
              ${stepIcon(step.icon || defaults[index])}
              <div class="step-card__panel">
                <p class="type-numeral type-numeral--sm step-card__number">${String(index + 1).padStart(2, "0")}</p>
                <h3 class="type-h5 step-card__title">${step.title ?? ""}</h3>
                <p class="type-body step-card__description">${step.description ?? ""}</p>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
  return el;
}

function renderThreeSteps(content) {
  return renderSteps(content, 3);
}

function renderFourSteps(content) {
  return renderSteps(content, 4);
}

function renderMetricCard(metric, metricClass = "type-metric") {
  const value = metric.value ?? "";
  const text = metric.text ?? "";
  const source = metric.source ?? "";
  return `
    <article class="metric-card">
      <p class="${metricClass} metric-card__value">${value}</p>
      <p class="type-body metric-card__text">
        ${text}${source ? ` <span class="metric-card__source">${source}</span>` : ""}
      </p>
    </article>
  `;
}

function renderMetricSpotlight(content) {
  const el = document.createElement("div");
  el.className = "slide-content layout-metric layout-metric--1";
  const metric = content.metric ?? (content.metrics?.[0] ?? {});
  el.innerHTML = `
    ${slideHeader(content)}
    <div class="metrics-grid metrics-grid--1">
      ${renderMetricCard(metric, "type-metric")}
    </div>
  `;
  return el;
}

function renderMetricsRow(content) {
  const el = document.createElement("div");
  const metrics = (content.metrics ?? []).slice(0, 3);
  const count = Math.max(metrics.length, 2);
  const metricClass = count >= 3 ? "type-metric type-metric--md" : "type-metric type-metric--lg";
  el.className = `slide-content layout-metric layout-metric--row layout-metric--${count}`;
  el.innerHTML = `
    ${slideHeader(content)}
    <div class="metrics-grid metrics-grid--${count}">
      ${metrics.map((metric) => renderMetricCard(metric, metricClass)).join("")}
    </div>
  `;
  return el;
}

function renderSection(content) {
  const el = document.createElement("div");
  el.className = "slide-content layout-section";
  const number = content.number ?? "";
  const section = content.sectionTitle ?? content.section ?? "";
  const subtitle = content.subtitle ?? content.title ?? "";
  el.innerHTML = `
    ${number ? `<p class="type-numeral type-numeral--xl">${number}</p>` : ""}
    ${section ? `<h1 class="type-metric type-metric--md layout-section__title">${section}</h1>` : ""}
    ${subtitle ? `<p class="type-body">${subtitle}</p>` : ""}
  `;
  return el;
}

function renderQuestion(content, { aside = false } = {}) {
  const el = document.createElement("div");
  el.className = aside
    ? "slide-content layout-question layout-question--aside"
    : "slide-content layout-question";
  const question = content.question ?? content.title ?? "";
  const subtitle = content.subtitle ?? "";
  el.innerHTML = `
    ${cornerSection(content)}
    <div class="layout-question__main">
      ${question ? `<h2 class="type-metric type-metric--md layout-question__text">${question}</h2>` : ""}
      ${aside && subtitle ? `<p class="type-h4 layout-question__aside">${subtitle}</p>` : ""}
    </div>
  `;
  return el;
}

function renderQuestionAside(content) {
  return renderQuestion(content, { aside: true });
}

function fitImageTitleMedia(root) {
  const stage = root.querySelector(".layout-image-title__stage");
  const media = root.querySelector("img.layout-image-title__media");
  if (!stage || !media) return;

  const apply = () => {
    const maxW = (stage.clientWidth || 1920) * 0.95;
    const maxH = (stage.clientHeight || 952) * 0.95;
    if (!media.naturalWidth || !media.naturalHeight) return;

    const ratio = media.naturalWidth / media.naturalHeight;
    let width = maxW;
    let height = width / ratio;
    if (height > maxH) {
      height = maxH;
      width = height * ratio;
    }

    media.style.width = `${Math.round(width)}px`;
    media.style.height = `${Math.round(height)}px`;
  };

  const run = () => {
    apply();
    requestAnimationFrame(apply);
  };

  if (media.complete && media.naturalWidth) run();
  else media.addEventListener("load", run, { once: true });

  if (typeof ResizeObserver === "function") {
    const ro = new ResizeObserver(run);
    ro.observe(stage);
  }
}

function renderImageTitle(content, position = "center") {
  const el = document.createElement("div");
  el.className = `slide-content layout-image-title layout-image-title--${position}`;
  const title = content.title ?? "";
  const subtitle = content.subtitle ?? "";
  const image = content.image ?? content.src ?? "";
  const alt = content.alt ?? "";
  const bullets = content.bullets ?? [];
  el.innerHTML = `
    ${cornerSection(content)}
    <div class="layout-image-title__stage">
      ${
        image
          ? `<img class="layout-image-title__media" src="${image}" alt="${alt}" />`
          : `<div class="layout-image-title__media layout-image-title__media--empty" aria-hidden="true"></div>`
      }
      <div class="layout-image-title__copy">
        ${
          title
            ? `<h2 class="type-h3 layout-image-title__title"><span class="layout-image-title__chip">${title}</span></h2>`
            : ""
        }
        ${
          subtitle
            ? `<p class="type-h4 layout-image-title__subtitle"><span class="layout-image-title__chip">${subtitle}</span></p>`
            : ""
        }
        ${
          bullets.length
            ? `<ul class="layout-image-title__bullets">
                ${bullets
                  .map((bullet) => `<li class="type-body">${bullet}</li>`)
                  .join("")}
              </ul>`
            : ""
        }
      </div>
    </div>
  `;
  queueMicrotask(() => fitImageTitleMedia(el));
  return el;
}

export function refreshImageTitleLayouts(root = document) {
  root.querySelectorAll(".layout-image-title").forEach((el) => {
    fitImageTitleMedia(el);
  });
}

function renderImageTitleCenter(content) {
  return renderImageTitle(content, "center");
}

function renderImageTitleTop(content) {
  return renderImageTitle(content, "top");
}

function renderImageTitleBottom(content) {
  return renderImageTitle(content, "bottom");
}

function renderTimelineItem(step, index, startNumber = 1) {
  const number = step.number ?? String(startNumber + index).padStart(2, "0");
  return `
    <article class="timeline-item">
      <div class="timeline-item__marker" aria-hidden="true">
        <span class="timeline-item__dot"></span>
      </div>
      <div class="step-card__panel timeline-item__panel">
        <p class="type-numeral type-numeral--sm step-card__number">${number}</p>
        <h3 class="type-h5 step-card__title">${step.title ?? ""}</h3>
        <p class="type-body step-card__description">${step.description ?? ""}</p>
      </div>
    </article>
  `;
}

function renderTimeline(content, variant = "full") {
  const el = document.createElement("div");
  el.className = `slide-content layout-timeline layout-timeline--${variant}`;
  const steps = content.steps ?? [];
  const startNumber = Number(content.startNumber ?? 1);
  const title = content.title ?? "";
  const subtitle = content.subtitle ?? "";
  const closing = content.closing ?? (variant === "end" ? subtitle : "");

  const track = `
    <div class="timeline-track" aria-hidden="true">
      <div class="timeline-track__line"></div>
    </div>
  `;

  const items = `
    <div class="timeline-items timeline-items--${Math.max(steps.length, 1)}">
      ${track}
      ${steps.map((step, index) => renderTimelineItem(step, index, startNumber)).join("")}
      ${
        variant === "end" && closing
          ? `<p class="layout-timeline__closing type-h4">${closing}</p>`
          : ""
      }
    </div>
  `;

  if (variant === "start") {
    el.innerHTML = `
      ${cornerSection(content)}
      <div class="layout-timeline__start">
        <header class="layout-timeline__intro">
          ${title ? `<h2 class="type-h3">${title}</h2>` : ""}
          ${subtitle ? `<p class="type-h4">${subtitle}</p>` : ""}
        </header>
        <div class="layout-timeline__body">
          ${items}
        </div>
      </div>
    `;
  } else {
    el.innerHTML = `
      ${cornerSection(content)}
      <div class="layout-timeline__body">
        ${items}
      </div>
    `;
  }

  return el;
}

function renderTimelineStart(content) {
  return renderTimeline(content, "start");
}

function renderTimelineFull(content) {
  return renderTimeline(content, "full");
}

function renderTimelineEnd(content) {
  return renderTimeline(content, "end");
}

const RENDERERS = {
  "LY-01": renderCover,
  "LY-02": renderTeam,
  "LY-03": renderToc,
  "LY-04": renderSection,
  "LY-05": renderQuote,
  "LY-06": renderSplit,
  "LY-07": renderSplitMediaLeft,
  "LY-08": renderTextBullets,
  "LY-09": renderThreeSteps,
  "LY-10": renderFourSteps,
  "LY-11": renderMetricSpotlight,
  "LY-12": renderMetricsRow,
  "LY-13": renderQuestion,
  "LY-14": renderQuestionAside,
  "LY-15": renderImageTitleCenter,
  "LY-16": renderImageTitleTop,
  "LY-17": renderImageTitleBottom,
  "LY-18": renderTimelineStart,
  "LY-19": renderTimelineFull,
  "LY-20": renderTimelineEnd,
};

export function renderLayout(slide, layoutId, content = {}) {
  const layout = LAYOUTS[layoutId];
  if (!layout) {
    console.warn(`Unknown layout recipe: ${layoutId}`);
    return;
  }

  const renderer = RENDERERS[layoutId];
  if (!renderer) return;

  slide.querySelector(".slide-content")?.remove();
  slide.querySelector('[data-component="SlideFooter"]')?.remove();
  slide.classList.remove("slide--with-footer");

  slide.appendChild(renderer(content));

  if (layout.footer) {
    mountSlideFooter(slide);
  }
}

export function initSlideLayouts(root = document) {
  root.querySelectorAll("[data-layout]").forEach((slide) => {
    let content = {};
    try {
      content = JSON.parse(slide.dataset.content || "{}");
    } catch (e) {
      console.warn("Invalid data-content JSON", slide, e);
    }
    renderLayout(slide, slide.dataset.layout, content);
  });
  initImageLightbox(root);
}
