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

  "LY-21": {
    label: "Focus chips",
    description: "Grid of items that come into focus on click. Footer.",
    footer: true,
    className: "layout-focus-grid",
  },

  "LY-22": {
    label: "Demo URL list",
    description: "Title left, severity-tagged URL list right. Footer.",
    footer: true,
    className: "layout-demo-urls",
  },

  "LY-23": {
    label: "Flow funnel",
    description:
      "Source nodes feed a middle node, then an end node. Interactive-ready. Footer.",
    footer: true,
    className: "layout-flow-funnel",
  },

  "LY-24": {
    label: "Flow orbit",
    description:
      "Kill-chain orbit with phase blocks; optional focusPhase for detail slides. Footer.",
    footer: true,
    className: "layout-flow-orbit",
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
  const blurBullets = Boolean(content.blurBullets);
  el.innerHTML = `
    ${cornerSection(content)}
    ${titleBlock(content)}
    <div class="text-bullets-grid">
      <div class="text-bullets-grid__copy">
        <p class="type-body">${content.text ?? ""}</p>
      </div>
      <ul class="bullet-list${blurBullets ? " bullet-list--blur-reveal" : ""}">
        ${bullets
          .map((bullet) => {
            const text = escapeHtml(bullet);
            if (!blurBullets) return `<li class="type-body">${text}</li>`;
            return `<li class="type-body bullet-list__item is-blurred" data-blur-toggle tabindex="0" role="button" aria-pressed="false">${text}</li>`;
          })
          .join("")}
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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderFocusGrid(content) {
  const el = document.createElement("div");
  el.className = "slide-content layout-focus-grid";
  const items = (content.items ?? []).slice(0, 12);
  const hint = content.hint ?? "";
  el.innerHTML = `
    ${slideHeader(content)}
    <div class="focus-grid" role="list">
      ${items
        .map((item, index) => {
          const label =
            typeof item === "string" ? item : item.label ?? item.title ?? "";
          const description =
            typeof item === "string" ? "" : item.description ?? item.text ?? "";
          return `
            <button
              type="button"
              class="focus-chip${description ? " focus-chip--expandable" : ""}"
              role="listitem"
              data-focus-item
              data-index="${index}"
            >
              <span class="focus-chip__title">${escapeHtml(label)}</span>
              ${
                description
                  ? `<span class="focus-chip__desc">${escapeHtml(description)}</span>`
                  : ""
              }
            </button>
          `;
        })
        .join("")}
    </div>
    ${hint ? `<p class="type-caption layout-focus-grid__hint">${escapeHtml(hint)}</p>` : ""}
  `;
  return el;
}

function renderDemoUrls(content) {
  const el = document.createElement("div");
  el.className = "slide-content layout-demo-urls";
  const items = (content.items ?? []).slice(0, 40);
  const hint = content.hint ?? "";
  el.innerHTML = `
    ${cornerSection(content)}
    <div class="layout-demo-urls__copy">
      ${titleBlock(content)}
    </div>
    <div class="layout-demo-urls__urls">
      <ul class="demo-url-list" role="list">
        ${items
          .map((item, index) => {
            const url = typeof item === "string" ? item : item.url ?? item.label ?? "";
            const severity = String(
              typeof item === "string" ? "" : item.severity ?? item.label ?? "",
            ).toLowerCase();
            const severityClass =
              severity === "high"
                ? "demo-url-item__severity--high"
                : severity === "medium"
                  ? "demo-url-item__severity--medium"
                  : "";
            const severityLabel =
              severity === "high" || severity === "medium" ? severity : "";
            return `
              <li>
                <button
                  type="button"
                  class="demo-url-item"
                  data-focus-item
                  data-index="${index}"
                >
                  ${
                    severityLabel
                      ? `<span class="demo-url-item__severity ${severityClass}">${escapeHtml(severityLabel)}</span>`
                      : `<span class="demo-url-item__severity demo-url-item__severity--empty" aria-hidden="true"></span>`
                  }
                  <span class="demo-url-item__url">${escapeHtml(url)}</span>
                </button>
              </li>
            `;
          })
          .join("")}
      </ul>
      ${hint ? `<p class="type-caption layout-demo-urls__hint">${escapeHtml(hint)}</p>` : ""}
    </div>
  `;
  return el;
}

function flowNodeMarkup(label, tone, role) {
  return `
    <button
      type="button"
      class="flow-node flow-node--${escapeHtml(tone)}"
      data-flow-node="${escapeHtml(role)}"
    >
      <span class="flow-node__label">${escapeHtml(label)}</span>
    </button>
  `;
}

function renderFlowFunnel(content) {
  const el = document.createElement("div");
  el.className = "slide-content layout-flow-funnel";
  const sourceColor = content.sourceColor ?? "#1EADEC";
  const midColor = content.midColor ?? "#887DFF";
  const endColor = content.endColor ?? "#9977FF";
  const sources = (content.sources ?? []).slice(0, 8);
  const middle = content.middle ?? { label: "" };
  const end = content.end ?? { label: "" };

  el.style.setProperty("--flow-source", sourceColor);
  el.style.setProperty("--flow-mid", midColor);
  el.style.setProperty("--flow-end", endColor);

  el.innerHTML = `
    ${cornerSection(content)}
    ${titleBlock(content)}
    <div class="flow-funnel" data-flow-funnel>
      <svg class="flow-funnel__wires" aria-hidden="true"></svg>
      <div class="flow-funnel__sources">
        ${sources
          .map((source, index) => {
            const label =
              typeof source === "string" ? source : source.label ?? source.title ?? "";
            return flowNodeMarkup(label, "source", `source-${index}`);
          })
          .join("")}
      </div>
      <div class="flow-funnel__mid">
        ${flowNodeMarkup(
          typeof middle === "string" ? middle : middle.label ?? "",
          "mid",
          "mid",
        )}
      </div>
      <div class="flow-funnel__end">
        ${flowNodeMarkup(
          typeof end === "string" ? end : end.label ?? "",
          "end",
          "end",
        )}
      </div>
    </div>
  `;

  queueMicrotask(() => fitFlowFunnel(el));
  return el;
}

function fitFlowFunnel(root) {
  const host =
    root.matches?.("[data-flow-funnel]")
      ? root
      : root.querySelector?.("[data-flow-funnel]");
  if (!host) return;

  const svg = host.querySelector(".flow-funnel__wires");
  const sources = [...host.querySelectorAll(".flow-node--source")];
  if (!svg) return;

  const hostBox = host.getBoundingClientRect();
  if (hostBox.width < 8 || hostBox.height < 8) return;
  const scaleX = host.offsetWidth / hostBox.width || 1;
  const scaleY = host.offsetHeight / hostBox.height || 1;
  const layoutW = host.offsetWidth;
  const layoutH = host.offsetHeight;

  const styleRoot = host.closest(".layout-flow-funnel, .layout-flow-orbit") || host;
  const sourceColor =
    getComputedStyle(styleRoot).getPropertyValue("--flow-source").trim() || "#1EADEC";

  const toLocal = (el) => {
    const box = el.getBoundingClientRect();
    return {
      cx: (box.left - hostBox.left + box.width / 2) * scaleX,
      cy: (box.top - hostBox.top + box.height / 2) * scaleY,
      left: (box.left - hostBox.left) * scaleX,
      right: (box.right - hostBox.left) * scaleX,
      top: (box.top - hostBox.top) * scaleY,
      bottom: (box.bottom - hostBox.top) * scaleY,
    };
  };

  const uid = `flow-${Math.random().toString(36).slice(2, 9)}`;
  const grads = [];
  const pathEls = [];
  const dots = host.classList.contains("flow-orbit") || Boolean(host.querySelector(".flow-dot"));

  // Orbit: sources → stage chain. Funnel: sources → mid → end.
  const stageDots = [...host.querySelectorAll(".flow-node--stage")];
  const mid = host.querySelector(".flow-node--mid");
  const end = host.querySelector(".flow-node--end");

  const chain = stageDots.length
    ? stageDots
    : [mid, end].filter(Boolean);

  const outcomes = [...host.querySelectorAll(".flow-orbit__outcomes .flow-dot")];
  const impacts = [...host.querySelectorAll(".flow-orbit__impacts .flow-dot")];

  if (!chain.length && !outcomes.length && !impacts.length) return;

  if (chain.length) {
    const first = chain[0];
    const firstPt = toLocal(first);
    const firstColor =
      getComputedStyle(first).color ||
      getComputedStyle(styleRoot).getPropertyValue("--flow-mid").trim() ||
      "#887DFF";

    if (sources.length) {
      sources.forEach((source, index) => {
        const pt = toLocal(source);
        const startX = dots ? pt.cx : pt.right;
        const startY = pt.cy;
        const endX = dots ? firstPt.cx : firstPt.left;
        const endY = firstPt.cy;
        const dx = Math.max(dots ? 80 : 60, (endX - startX) * (dots ? 0.35 : 0.5));
        const d = dots
          ? `M ${startX} ${startY} L ${endX} ${endY}`
          : `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;
        const gid = `${uid}-s${index}`;
        grads.push(`
          <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}">
            <stop offset="0%" stop-color="${sourceColor}" />
            <stop offset="100%" stop-color="${firstColor}" />
          </linearGradient>
        `);
        pathEls.push(
          `<path d="${d}" stroke="url(#${gid})" fill="none" stroke-width="${dots ? 3.75 : 3}" stroke-linecap="round" />`,
        );
      });
    } else {
      // Focus slides without prior sources: draw in from the left edge
      const leadColor =
        host.dataset.flowLeadInColor?.trim() ||
        getComputedStyle(styleRoot).getPropertyValue("--flow-mid").trim() ||
        firstColor;
      const startX = -8;
      const startY = firstPt.cy;
      const endX = firstPt.cx;
      const endY = firstPt.cy;
      const gid = `${uid}-in`;
      grads.push(`
        <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}">
          <stop offset="0%" stop-color="${leadColor}" stop-opacity="0.4" />
          <stop offset="100%" stop-color="${firstColor}" />
        </linearGradient>
      `);
      pathEls.push(
        `<path d="M ${startX} ${startY} L ${endX} ${endY}" stroke="url(#${gid})" fill="none" stroke-width="3.75" stroke-linecap="round" />`,
      );
    }

    for (let i = 0; i < chain.length - 1; i += 1) {
      const a = toLocal(chain[i]);
      const b = toLocal(chain[i + 1]);
      const colorA = getComputedStyle(chain[i]).color || "#887DFF";
      const colorB = getComputedStyle(chain[i + 1]).color || "#9977FF";
      const startX = dots ? a.cx : a.right;
      const startY = a.cy;
      const endX = dots ? b.cx : b.left;
      const endY = b.cy;
      const dx = Math.max(48, (endX - startX) * 0.45);
      const d = dots
        ? `M ${startX} ${startY} L ${endX} ${endY}`
        : `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;
      const gid = `${uid}-c${i}`;
      grads.push(`
        <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${colorB}" />
        </linearGradient>
      `);
      pathEls.push(
        `<path d="${d}" stroke="url(#${gid})" fill="none" stroke-width="${dots ? 3.75 : 3.5}" stroke-linecap="round" />`,
      );
    }
  }

  const leftOriginFor = (nodes, fallbackColor) => {
    const pts = nodes.map(toLocal);
    const midY = pts.reduce((sum, pt) => sum + pt.cy, 0) / pts.length;
    const minX = Math.min(...pts.map((pt) => pt.cx));
    return {
      cx: Math.max(12, minX - 96),
      cy: midY,
      color: fallbackColor,
    };
  };

  // Fan into outcome nodes (from last stage, or from a left lead-in on focus slides)
  if (outcomes.length) {
    const origin = chain.length
      ? {
          ...toLocal(chain[chain.length - 1]),
          color: getComputedStyle(chain[chain.length - 1]).color || "#FF8045",
        }
      : leftOriginFor(outcomes, "#FF8045");
    outcomes.forEach((outcome, index) => {
      const pt = toLocal(outcome);
      const colorB = getComputedStyle(outcome).color || "#FF2828";
      const gid = `${uid}-o${index}`;
      grads.push(`
        <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${origin.cx}" y1="${origin.cy}" x2="${pt.cx}" y2="${pt.cy}">
          <stop offset="0%" stop-color="${origin.color}" />
          <stop offset="100%" stop-color="${colorB}" />
        </linearGradient>
      `);
      pathEls.push(
        `<path d="M ${origin.cx} ${origin.cy} L ${pt.cx} ${pt.cy}" stroke="url(#${gid})" fill="none" stroke-width="3.75" stroke-linecap="round" />`,
      );
    });
  }

  // Dashed fan into impact nodes (from outcomes, or from a left lead-in)
  if (impacts.length) {
    if (outcomes.length) {
      outcomes.forEach((outcome, oi) => {
        const from = toLocal(outcome);
        const colorA = getComputedStyle(outcome).color || "#FF2828";
        impacts.forEach((impact, ii) => {
          const to = toLocal(impact);
          const colorB = getComputedStyle(impact).color || colorA;
          const gid = `${uid}-i${oi}-${ii}`;
          grads.push(`
            <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${from.cx}" y1="${from.cy}" x2="${to.cx}" y2="${to.cy}">
              <stop offset="0%" stop-color="${colorA}" stop-opacity="0.3" />
              <stop offset="100%" stop-color="${colorB}" stop-opacity="1" />
            </linearGradient>
          `);
          pathEls.push(
            `<path d="M ${from.cx} ${from.cy} L ${to.cx} ${to.cy}" stroke="url(#${gid})" fill="none" stroke-width="3" stroke-linecap="round" stroke-dasharray="2.5 10" />`,
          );
        });
      });
    } else {
      const origin = leftOriginFor(impacts, "#FF2828");
      impacts.forEach((impact, index) => {
        const to = toLocal(impact);
        const colorB = getComputedStyle(impact).color || "#FF2828";
        const gid = `${uid}-i${index}`;
        grads.push(`
          <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${origin.cx}" y1="${origin.cy}" x2="${to.cx}" y2="${to.cy}">
            <stop offset="0%" stop-color="${origin.color}" stop-opacity="0.3" />
            <stop offset="100%" stop-color="${colorB}" stop-opacity="1" />
          </linearGradient>
        `);
        pathEls.push(
          `<path d="M ${origin.cx} ${origin.cy} L ${to.cx} ${to.cy}" stroke="url(#${gid})" fill="none" stroke-width="3" stroke-linecap="round" stroke-dasharray="2.5 10" />`,
        );
      });
    }
  }

  // Lead-out to the right edge when this view continues into a later phase
  const continueColor = host.dataset.flowContinueColor?.trim();
  if (continueColor) {
    const dashed = host.dataset.flowContinueDashed === "true";
    const fromMode = host.dataset.flowContinueFrom || "last-stage";
    let exitNodes = [];
    if (fromMode === "outcomes") exitNodes = outcomes;
    else if (fromMode === "impacts") exitNodes = impacts;
    else if (chain.length) exitNodes = [chain[chain.length - 1]];

    exitNodes.forEach((node, index) => {
      const pt = toLocal(node);
      const colorA = getComputedStyle(node).color || continueColor;
      const startX = pt.cx;
      const startY = pt.cy;
      const endX = layoutW + 8;
      const endY = startY;
      const gid = `${uid}-out${index}`;
      grads.push(`
        <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${continueColor}" stop-opacity="${dashed ? "0.35" : "0.55"}" />
        </linearGradient>
      `);
      pathEls.push(
        `<path d="M ${startX} ${startY} L ${endX} ${endY}" stroke="url(#${gid})" fill="none" stroke-width="${dashed ? 3 : 3.75}" stroke-linecap="round"${dashed ? ' stroke-dasharray="2.5 10"' : ""} />`,
      );
    });
  }

  svg.setAttribute("viewBox", `0 0 ${layoutW} ${layoutH}`);
  svg.setAttribute("width", String(layoutW));
  svg.setAttribute("height", String(layoutH));
  svg.innerHTML = `
    <defs>${grads.join("")}</defs>
    ${pathEls.join("")}
  `;
}

export function refreshFlowFunnels(root = document) {
  root.querySelectorAll(".layout-flow-funnel, .layout-flow-orbit").forEach((el) => {
    fitFlowFunnel(el);
  });
}

function flowDotMarkup(label, tone, role, color) {
  const display = String(label ?? "")
    .replace(/:\s*/g, ":\n")
    .replace(/,\s*/g, "\n");
  const colorStyle = color
    ? ` style="color:${escapeHtml(color)};--flow-dot:${escapeHtml(color)}"`
    : "";
  const labelEl = `<span class="flow-dot__label">${escapeHtml(display)}</span>`;
  const buttonEl = `
      <button
        type="button"
        class="flow-dot flow-node--${escapeHtml(tone)}"
        data-flow-node="${escapeHtml(role)}"
        aria-label="${escapeHtml(label)}"
      ></button>`;
  const body =
    tone === "outcome" || tone === "impact"
      ? `${buttonEl}${labelEl}`
      : `${labelEl}${buttonEl}`;
  return `
    <div class="flow-dot-row flow-dot-row--${escapeHtml(tone)}"${colorStyle}>
      ${body}
    </div>
  `;
}

function normalizeFlowStages(content) {
  if (Array.isArray(content.stages) && content.stages.length) {
    return content.stages
      .map((stage) => {
        if (typeof stage === "string") return { label: stage, color: "#887DFF" };
        return {
          label: stage.label ?? stage.title ?? "",
          color: stage.color ?? "#887DFF",
        };
      })
      .filter((stage) => stage.label);
  }

  const midColor = content.midColor ?? "#887DFF";
  const endColor = content.endColor ?? "#9977FF";
  const middle = content.middle ?? { label: "" };
  const end = content.end ?? { label: "" };
  const midLabel = typeof middle === "string" ? middle : middle.label ?? "";
  const endLabel = typeof end === "string" ? end : end.label ?? "";
  const stages = [];
  if (midLabel) stages.push({ label: midLabel, color: midColor });
  if (endLabel) stages.push({ label: endLabel, color: endColor });
  return stages;
}

function flowStepBadge(number, label, color) {
  const colorStyle = color
    ? ` style="color:${escapeHtml(color)}"`
    : "";
  return `
    <div class="flow-step__badge"${colorStyle}>
      <span class="flow-step__num">${escapeHtml(String(number))}</span>
      <span class="flow-step__name">${escapeHtml(label)}</span>
    </div>
  `;
}

function normalizeFlowLabeledNodes(items, fallbackColor) {
  return (items ?? [])
    .slice(0, 8)
    .map((item) => {
      if (typeof item === "string") return { label: item, color: fallbackColor };
      return {
        label: item.label ?? item.title ?? "",
        color: item.color ?? fallbackColor,
      };
    })
    .filter((item) => item.label);
}

function renderFlowOrbit(content) {
  const el = document.createElement("div");
  el.className = "slide-content layout-flow-orbit";
  const sourceColor = content.sourceColor ?? "#1EADEC";
  const outcomeColor = content.outcomeColor ?? "#FF2828";
  const impactColor = content.impactColor ?? outcomeColor;
  const sources = (content.sources ?? []).slice(0, 8);
  const stages = normalizeFlowStages(content).slice(0, 6);
  const outcomes = normalizeFlowLabeledNodes(content.outcomes, outcomeColor);
  const impacts = normalizeFlowLabeledNodes(content.impacts, impactColor);

  const focusRaw = content.focusPhase;
  const focusPhase =
    focusRaw === 0 || focusRaw === "0" || focusRaw === "prep" || focusRaw === "preparation"
      ? 0
      : focusRaw === 1 || focusRaw === "1" || focusRaw === "collection"
        ? 1
        : focusRaw === 2 || focusRaw === "2" || focusRaw === "breach"
          ? 2
          : focusRaw === 3 ||
              focusRaw === "3" ||
              focusRaw === "post-breach" ||
              focusRaw === "publication"
            ? 3
            : null;

  const phaseTitles = Array.isArray(content.phaseTitles)
    ? content.phaseTitles
    : ["Preparation", "Collection", "Breach", "Post-Breach"];
  const stepLabels = Array.isArray(content.stepLabels)
    ? content.stepLabels
    : [
        "Recon",
        "Weaponize",
        "Deliver",
        "Exploit",
        "Install",
        "Command and Control",
        "Action-on-Objective",
        "Publication",
      ];

  const weaponize = stages[0] ?? null;
  const collectionStages = stages.slice(1);
  const collectionStepMeta = [
    { number: 3, label: stepLabels[2] ?? "Deliver" },
    { number: 4, label: stepLabels[3] ?? "Exploit" },
    { number: 5, label: stepLabels[4] ?? "Install" },
    { number: 6, label: stepLabels[5] ?? "Command and Control" },
  ];

  el.style.setProperty("--flow-source", sourceColor);
  el.style.setProperty("--flow-outcome", outcomeColor);
  el.style.setProperty("--flow-impact", impactColor);
  if (stages[0]?.color) el.style.setProperty("--flow-mid", stages[0].color);
  if (stages[1]?.color) el.style.setProperty("--flow-end", stages[1].color);

  const showPrep = focusPhase == null || focusPhase === 0;
  const showCollection = focusPhase == null || focusPhase === 1;
  const showBreach = (focusPhase == null || focusPhase === 2) && outcomes.length > 0;
  const showPostBreach = (focusPhase == null || focusPhase === 3) && impacts.length > 0;

  const focusKeys = ["prep", "collection", "breach", "post-breach"];
  const orbitMods = [
    "flow-orbit--phased",
    focusPhase == null && outcomes.length ? "flow-orbit--with-outcomes" : "",
    focusPhase == null && impacts.length ? "flow-orbit--with-impacts" : "",
    focusPhase != null ? `flow-orbit--focus flow-orbit--focus-${focusKeys[focusPhase]}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const continueAttrs = (() => {
    if (focusPhase === 0 && stages[1]?.color) {
      // Prep → Phish (3rd kill-chain stage)
      return ` data-flow-continue-color="${escapeHtml(stages[1].color)}"`;
    }
    if (focusPhase === 1) {
      const lead = stages[0]?.color ? ` data-flow-lead-in-color="${escapeHtml(stages[0].color)}"` : "";
      return `${lead} data-flow-continue-color="${escapeHtml(outcomeColor)}"`;
    }
    if (focusPhase === 2 && impacts.length) {
      return ` data-flow-continue-color="${escapeHtml(impactColor)}" data-flow-continue-dashed="true" data-flow-continue-from="outcomes"`;
    }
    return "";
  })();

  const sourcesBlock = `
    <div class="flow-step flow-step--sources">
      ${flowStepBadge(1, stepLabels[0] ?? "Recon", sourceColor)}
      <div class="flow-orbit__sources">
        ${sources
          .map((source, index) => {
            const label =
              typeof source === "string" ? source : source.label ?? source.title ?? "";
            return flowDotMarkup(label, "source", `source-${index}`, sourceColor);
          })
          .join("")}
      </div>
    </div>
  `;

  const weaponizeBlock = weaponize
    ? `
      <div class="flow-step flow-step--stage">
        ${flowStepBadge(2, stepLabels[1] ?? "Weaponize", weaponize.color)}
        ${flowDotMarkup(weaponize.label, "stage", "stage-0", weaponize.color)}
      </div>
    `
    : "";

  const collectionBlocks = collectionStages
    .map((stage, index) => {
      const meta = collectionStepMeta[index] ?? {
        number: index + 3,
        label: stage.label,
      };
      return `
        <div class="flow-step flow-step--stage">
          ${flowStepBadge(meta.number, meta.label, stage.color)}
          ${flowDotMarkup(stage.label, "stage", `stage-${index + 1}`, stage.color)}
        </div>
      `;
    })
    .join("");

  const overviewPhaseAttrs = (label) =>
    focusPhase == null
      ? ` role="button" tabindex="0" aria-pressed="false" aria-label="Toggle ${escapeHtml(label)} highlight"`
      : "";

  const prepPhase = showPrep
    ? `<section class="flow-phase flow-phase--prep"${overviewPhaseAttrs(phaseTitles[0] ?? "Preparation")}>
        <h3 class="flow-phase__title">${escapeHtml(phaseTitles[0] ?? "Preparation")}</h3>
        <div class="flow-phase__body">
          <div class="flow-phase__grid flow-phase__grid--prep">
            ${sourcesBlock}
            ${weaponizeBlock}
          </div>
        </div>
      </section>`
    : "";

  const collectionPhase = showCollection
    ? `<section class="flow-phase flow-phase--collection"${overviewPhaseAttrs(phaseTitles[1] ?? "Collection")}>
        <h3 class="flow-phase__title">${escapeHtml(phaseTitles[1] ?? "Collection")}</h3>
        <div class="flow-phase__body">
          <div class="flow-phase__grid flow-phase__grid--collection" style="--flow-collection-count:${Math.max(collectionStages.length, 1)}">
            ${collectionBlocks}
          </div>
        </div>
      </section>`
    : "";

  const breachPhase = showBreach
    ? `<section class="flow-phase flow-phase--breach"${overviewPhaseAttrs(phaseTitles[2] ?? "Breach")}>
        <h3 class="flow-phase__title">${escapeHtml(phaseTitles[2] ?? "Breach")}</h3>
        <div class="flow-phase__body">
          <div class="flow-step flow-step--outcomes">
            ${flowStepBadge(7, stepLabels[6] ?? "Action-on-Objective", outcomeColor)}
            <div class="flow-orbit__outcomes">
              ${outcomes
                .map((outcome, index) =>
                  flowDotMarkup(
                    outcome.label,
                    "outcome",
                    `outcome-${index}`,
                    outcome.color,
                  ),
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>`
    : "";

  const postBreachPhase = showPostBreach
    ? `<section class="flow-phase flow-phase--post-breach"${overviewPhaseAttrs(phaseTitles[3] ?? "Post-Breach")}>
        <h3 class="flow-phase__title">${escapeHtml(phaseTitles[3] ?? "Post-Breach")}</h3>
        <div class="flow-phase__body">
          <div class="flow-step flow-step--impacts">
            ${flowStepBadge(8, stepLabels[7] ?? "Publication", impactColor)}
            <div class="flow-orbit__impacts">
              ${impacts
                .map((impact, index) =>
                  flowDotMarkup(
                    impact.label,
                    "impact",
                    `impact-${index}`,
                    impact.color,
                  ),
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>`
    : "";

  el.innerHTML = `
    ${focusPhase == null ? cornerSection(content) : ""}
    ${focusPhase == null ? titleBlock(content) : ""}
    <div class="flow-orbit ${orbitMods}" data-flow-funnel${continueAttrs}>
      <svg class="flow-funnel__wires" aria-hidden="true"></svg>
      ${prepPhase}
      ${collectionPhase}
      ${breachPhase}
      ${postBreachPhase}
    </div>
  `;

  queueMicrotask(() => fitFlowFunnel(el));
  return el;
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
  "LY-21": renderFocusGrid,
  "LY-22": renderDemoUrls,
  "LY-23": renderFlowFunnel,
  "LY-24": renderFlowOrbit,
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

/** Click-to-focus for LY-21 / LY-22 (works on board tiles and lightbox clones). */
let focusInteractionsBound = false;
export function ensureFocusInteractions() {
  if (focusInteractionsBound) return;
  focusInteractionsBound = true;

  document.addEventListener("click", (event) => {
    const blurItem = event.target.closest("[data-blur-toggle]");
    if (blurItem) {
      const blurred = blurItem.classList.toggle("is-blurred");
      blurItem.setAttribute("aria-pressed", blurred ? "false" : "true");
      return;
    }

    const item = event.target.closest("[data-focus-item]");
    if (!item) return;
    const host = item.closest(".layout-focus-grid, .layout-demo-urls");
    if (!host) return;

    if (item.classList.contains("demo-url-item")) {
      const url = item.querySelector(".demo-url-item__url")?.textContent?.trim();
      if (url && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          item.classList.add("is-copied");
          window.clearTimeout(item._copiedTimer);
          item._copiedTimer = window.setTimeout(() => {
            item.classList.remove("is-copied");
          }, 1200);
        }).catch(() => {});
      }
    }

    const items = [...host.querySelectorAll("[data-focus-item]")];
    const already = item.classList.contains("is-focused") && host.classList.contains("has-focus");
    if (already) {
      host.classList.remove("has-focus");
      items.forEach((el) => el.classList.remove("is-focused"));
      return;
    }

    host.classList.add("has-focus");
    items.forEach((el) => el.classList.toggle("is-focused", el === item));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const blurItem = event.target.closest("[data-blur-toggle]");
    if (!blurItem) return;
    event.preventDefault();
    blurItem.click();
  });
}

ensureFocusInteractions();

/** Overview LY-24: exclusive phase stroke toggle (one phase at a time). */
let flowOrbitInteractionsBound = false;
export function ensureFlowOrbitInteractions() {
  if (flowOrbitInteractionsBound) return;
  flowOrbitInteractionsBound = true;

  const PHASE_SEL =
    ".flow-orbit:not(.flow-orbit--focus) .flow-phase--prep, .flow-orbit:not(.flow-orbit--focus) .flow-phase--collection, .flow-orbit:not(.flow-orbit--focus) .flow-phase--breach, .flow-orbit:not(.flow-orbit--focus) .flow-phase--post-breach";

  const selectPhaseStroke = (phase) => {
    if (!phase || phase.closest(".flow-orbit--focus")) return;
    const orbit = phase.closest(".flow-orbit");
    if (!orbit) return;
    const alreadyOn = phase.classList.contains("is-stroke-on");
    orbit.querySelectorAll(".flow-phase.is-stroke-on").forEach((el) => {
      el.classList.remove("is-stroke-on");
      el.setAttribute("aria-pressed", "false");
    });
    if (!alreadyOn) {
      phase.classList.add("is-stroke-on");
      phase.setAttribute("aria-pressed", "true");
    }
  };

  document.addEventListener("click", (event) => {
    if (event.target.closest(".deck-form, .slide-tile-menu, .deck-toolbar, a, input, textarea, select")) {
      return;
    }
    const phase = event.target.closest(PHASE_SEL);
    if (!phase) return;
    selectPhaseStroke(phase);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const phase = event.target.closest(PHASE_SEL);
    if (!phase || event.target !== phase) return;
    event.preventDefault();
    selectPhaseStroke(phase);
  });
}

ensureFlowOrbitInteractions();
