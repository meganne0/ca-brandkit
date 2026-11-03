import { mountSlideFooter } from "./components/footer.js?v=31";
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
      "Kill-chain orbit with phase blocks; optional focusPhase detail slides or revealThroughPhase progressive reveal. Footer.",
    footer: true,
    className: "layout-flow-orbit",
  },

  "LY-25": {
    label: "Campaign symbols",
    description:
      "Campaign symbols (dots in outlined circles) around center text, or wired into a hub. Footer.",
    footer: true,
    className: "layout-campaign",
  },

  "LY-26": {
    label: "Data table",
    description:
      "Title plus a dense breach/sample data table (columns + rows). Footer.",
    footer: true,
    className: "layout-data-table",
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
  const size = ["sm", "md", "lg", "xl"].includes(content.textSize) ? content.textSize : "md";
  const plain = content.panel === false || content.panel === "off";
  const author = String(content.author ?? "").trim();
  el.innerHTML = `
    <div class="quote-panel${plain ? " quote-panel--plain" : ""}">
      <p class="type-body layout-quote__text layout-quote__text--${size}">${text}</p>
      ${author ? `<p class="type-label layout-quote__author">${escapeHtml(author)}</p>` : ""}
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

function safeExternalHref(url) {
  const raw = String(url ?? "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^\/\//.test(raw)) return `https:${raw}`;
  // Block javascript:/data:/etc — treat bare hosts as https
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return "";
  return `https://${raw}`;
}

function renderMetricSource(metric) {
  const source = String(metric.source ?? "").trim();
  if (!source) return "";
  const href = safeExternalHref(metric.sourceUrl ?? metric.url ?? "");
  const label = escapeHtml(source);
  if (href) {
    return ` <a class="metric-card__source" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  }
  return ` <span class="metric-card__source">${label}</span>`;
}

function renderMetricCard(metric, metricClass = "type-metric") {
  const value = metric.value ?? "";
  const text = metric.text ?? "";
  return `
    <article class="metric-card">
      <p class="${metricClass} metric-card__value">${value}</p>
      <p class="type-body metric-card__text">
        ${text}${renderMetricSource(metric)}
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

function escapeQuestionText(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** [[orange]] and {{white}}. Unmarked words stay the default orange. */
function colorizeQuestion(text) {
  return escapeQuestionText(text)
    .replace(/\[\[([\s\S]*?)\]\]/g, '<span class="q-orange">$1</span>')
    .replace(/\{\{([\s\S]*?)\}\}/g, '<span class="q-white">$1</span>');
}

function renderQuestion(content, { aside = false } = {}) {
  const el = document.createElement("div");
  el.className = aside
    ? "slide-content layout-question layout-question--aside"
    : "slide-content layout-question";
  const question = content.question ?? content.title ?? "";
  const subtitle = content.subtitle ?? "";
  const size = ["sm", "md", "lg"].includes(content.textSize) ? content.textSize : "";
  const sizeClass = size ? ` layout-question__text--${size}` : "";
  el.innerHTML = `
    ${cornerSection(content)}
    <div class="layout-question__main">
      ${question ? `<h2 class="type-metric type-metric--md layout-question__text${sizeClass}">${colorizeQuestion(question)}</h2>` : ""}
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

  const outcomeHub = host.querySelector(".flow-orbit__outcome-hub .flow-dot");
  const outcomes = [...host.querySelectorAll(".flow-orbit__outcomes .flow-dot")];
  const impacts = [...host.querySelectorAll(".flow-orbit__impacts .flow-dot")];
  const hasBreachFanNodes = Boolean(
    host.querySelector(".flow-orbit__breach-fan-branch .flow-dot"),
  );

  const phaseOf = (el) => el?.dataset?.flowPhase?.trim() || "";
  const wirePhaseAttrs = (fromEl, toEl) => {
    const from = typeof fromEl === "string" ? fromEl : phaseOf(fromEl);
    const to = typeof toEl === "string" ? toEl : phaseOf(toEl);
    return ` data-from-phase="${from}" data-to-phase="${to}"`;
  };

  // Hub-only breach fans (e.g. text+breach notes) have no stage/outcome chain
  if (
    !chain.length &&
    !outcomes.length &&
    !impacts.length &&
    !outcomeHub &&
    !hasBreachFanNodes
  ) {
    return;
  }

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
          `<path d="${d}" stroke="url(#${gid})" fill="none" stroke-width="${dots ? 3.75 : 3}" stroke-linecap="round"${wirePhaseAttrs(source, first)} />`,
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
        `<path d="M ${startX} ${startY} L ${endX} ${endY}" stroke="url(#${gid})" fill="none" stroke-width="3.75" stroke-linecap="round"${wirePhaseAttrs("", first)} />`,
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
        `<path d="${d}" stroke="url(#${gid})" fill="none" stroke-width="${dots ? 3.75 : 3.5}" stroke-linecap="round"${wirePhaseAttrs(chain[i], chain[i + 1])} />`,
      );
    }
  }

  // Parallel side branches → red prep·collection exit
  // Orange feeders converge on each main branch’s orange node (before the red hub)
  const prepSideBranches = [
    ...host.querySelectorAll(".flow-orbit__prep-side-branch"),
  ];
  const prepExitNode = host.querySelector('[data-flow-node="stage-exit"]');
  prepSideBranches.forEach((branchEl, branchIndex) => {
    const nodes = [...branchEl.querySelectorAll(".flow-dot")];
    if (!nodes.length) return;
    const weightAttr = Number(branchEl.dataset.weight);
    const weight = Number.isFinite(weightAttr) ? weightAttr : branchIndex % 3;
    const strokeW = weight === 0 ? 3.25 : weight === 1 ? 2.1 : 1.45;
    const strokeOpacity = weight === 0 ? "1" : weight === 1 ? "0.55" : "0.32";
    const wirePair = (fromEl, toEl, key) => {
      const a = toLocal(fromEl);
      const b = toLocal(toEl);
      const colorA = getComputedStyle(fromEl).color || "#1EADEC";
      const colorB = getComputedStyle(toEl).color || "#887DFF";
      const gid = `${uid}-side${branchIndex}-${key}`;
      grads.push(`
        <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${a.cx}" y1="${a.cy}" x2="${b.cx}" y2="${b.cy}">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${colorB}" />
        </linearGradient>
      `);
      pathEls.push(
        `<path d="M ${a.cx} ${a.cy} L ${b.cx} ${b.cy}" stroke="url(#${gid})" fill="none" stroke-width="${strokeW}" stroke-linecap="round" stroke-opacity="${strokeOpacity}"${wirePhaseAttrs(fromEl, toEl)} />`,
      );
    };
    for (let i = 0; i < nodes.length - 1; i += 1) {
      wirePair(nodes[i], nodes[i + 1], i);
    }
    const last = nodes[nodes.length - 1];
    const isOrangeFeeder = branchEl.hasAttribute("data-feeder");
    if (isOrangeFeeder) {
      const parentId = branchEl.dataset.parent;
      const parentBranch = host.querySelector(
        `.flow-orbit__prep-side-branch[data-branch="${parentId}"]:not([data-feeder])`,
      );
      const parentNodes = parentBranch
        ? [...parentBranch.querySelectorAll(".flow-dot")]
        : [];
      const orangeNode = parentNodes[parentNodes.length - 1];
      if (orangeNode) wirePair(last, orangeNode, "orange");
      return;
    }
    if (prepExitNode) {
      wirePair(last, prepExitNode, "exit");
    }
  });

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

  // Breach hub: dotted handoff from the prep·collection exit (or last stage),
  // then solid red wires through fan branches (or classic outcome spokes).
  // Runs whenever the hub is present — even if outcome dots were omitted for fans.
  if (outcomeHub) {
    const hubPt = toLocal(outcomeHub);
    const hubColor = getComputedStyle(outcomeHub).color || "#FF2828";
    // Prefer the large red prep-exit hub when present so the two hubs connect
    const stageOrigin =
      prepExitNode || (chain.length ? chain[chain.length - 1] : null);
    const hubInDashed = Boolean(prepExitNode) ||
      host.classList.contains("flow-orbit--prep-exit");
    const hubInDashAttr = hubInDashed ? ' stroke-dasharray="2.5 10"' : "";
    const hubInWidth = hubInDashed ? 3 : 3.75;
    if (stageOrigin) {
      const from = toLocal(stageOrigin);
      const colorA = getComputedStyle(stageOrigin).color || "#FF8045";
      const gid = `${uid}-hub-in`;
      grads.push(`
        <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${from.cx}" y1="${from.cy}" x2="${hubPt.cx}" y2="${hubPt.cy}">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${hubColor}" />
        </linearGradient>
      `);
      pathEls.push(
        `<path d="M ${from.cx} ${from.cy} L ${hubPt.cx} ${hubPt.cy}" stroke="url(#${gid})" fill="none" stroke-width="${hubInWidth}" stroke-linecap="round"${hubInDashAttr}${wirePhaseAttrs(stageOrigin, outcomeHub)} />`,
      );
    } else {
      const lead = leftOriginFor([outcomeHub, ...outcomes], "#FF8045");
      const gid = `${uid}-hub-in`;
      grads.push(`
        <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${lead.cx}" y1="${lead.cy}" x2="${hubPt.cx}" y2="${hubPt.cy}">
          <stop offset="0%" stop-color="${lead.color}" />
          <stop offset="100%" stop-color="${hubColor}" />
        </linearGradient>
      `);
      pathEls.push(
        `<path d="M ${lead.cx} ${lead.cy} L ${hubPt.cx} ${hubPt.cy}" stroke="url(#${gid})" fill="none" stroke-width="${hubInWidth}" stroke-linecap="round"${hubInDashAttr}${wirePhaseAttrs("", outcomeHub)} />`,
      );
    }

    const breachFanBranches = [
      ...host.querySelectorAll(".flow-orbit__breach-fan-branch"),
    ];
    // When multi-node fan branches are present, skip single-spoke outcome wires
    if (!breachFanBranches.length) {
      outcomes.forEach((outcome, index) => {
        const pt = toLocal(outcome);
        const colorB = getComputedStyle(outcome).color || hubColor;
        const gid = `${uid}-o${index}`;
        grads.push(`
          <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${hubPt.cx}" y1="${hubPt.cy}" x2="${pt.cx}" y2="${pt.cy}">
            <stop offset="0%" stop-color="${hubColor}" />
            <stop offset="100%" stop-color="${colorB}" />
          </linearGradient>
        `);
        pathEls.push(
          `<path d="M ${hubPt.cx} ${hubPt.cy} L ${pt.cx} ${pt.cy}" stroke="url(#${gid})" fill="none" stroke-width="3.75" stroke-linecap="round"${wirePhaseAttrs(outcomeHub, outcome)} />`,
        );
      });
    }

    // Solid red lines through every fan branch: hub → n0 → n1 → …
    breachFanBranches.forEach((branchEl, branchIndex) => {
      const nodes = [...branchEl.querySelectorAll(".flow-dot")];
      if (!nodes.length) return;
      const weightAttr = Number(branchEl.dataset.weight);
      const weight = Number.isFinite(weightAttr) ? weightAttr : branchIndex % 3;
      const strokeW = weight === 0 ? 3.1 : weight === 1 ? 2 : 1.4;
      const strokeOpacity = weight === 0 ? "0.9" : weight === 1 ? "0.5" : "0.28";
      const wirePair = (fromEl, toEl, key) => {
        const a = fromEl === outcomeHub ? hubPt : toLocal(fromEl);
        const b = toLocal(toEl);
        const colorA =
          fromEl === outcomeHub
            ? hubColor
            : getComputedStyle(fromEl).color || hubColor;
        const colorB = getComputedStyle(toEl).color || hubColor;
        const gid = `${uid}-bf${branchIndex}-${key}`;
        grads.push(`
          <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${a.cx}" y1="${a.cy}" x2="${b.cx}" y2="${b.cy}">
            <stop offset="0%" stop-color="${colorA}" />
            <stop offset="100%" stop-color="${colorB}" />
          </linearGradient>
        `);
        pathEls.push(
          `<path d="M ${a.cx} ${a.cy} L ${b.cx} ${b.cy}" stroke="url(#${gid})" fill="none" stroke-width="${strokeW}" stroke-linecap="round" stroke-opacity="${strokeOpacity}"${wirePhaseAttrs(fromEl, toEl)} />`,
        );
      };
      wirePair(outcomeHub, nodes[0], "hub");
      for (let i = 0; i < nodes.length - 1; i += 1) {
        wirePair(nodes[i], nodes[i + 1], i);
      }
    });
  } else if (outcomes.length) {
    const originNode = chain.length ? chain[chain.length - 1] : null;
    const origin = originNode
      ? {
          ...toLocal(originNode),
          color: getComputedStyle(originNode).color || "#FF8045",
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
        `<path d="M ${origin.cx} ${origin.cy} L ${pt.cx} ${pt.cy}" stroke="url(#${gid})" fill="none" stroke-width="3.75" stroke-linecap="round"${wirePhaseAttrs(originNode || "", outcome)} />`,
      );
    });
  }

  // Dashed fan into impact nodes (from outcomes, or from a left lead-in).
  // Skip on merged breach·post slides — those use solid red fan branches instead.
  if (impacts.length && !host.classList.contains("flow-orbit--merge-breach-post")) {
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
            `<path d="M ${from.cx} ${from.cy} L ${to.cx} ${to.cy}" stroke="url(#${gid})" fill="none" stroke-width="3" stroke-linecap="round" stroke-dasharray="2.5 10"${wirePhaseAttrs(outcome, impact)} />`,
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
          `<path d="M ${origin.cx} ${origin.cy} L ${to.cx} ${to.cy}" stroke="url(#${gid})" fill="none" stroke-width="3" stroke-linecap="round" stroke-dasharray="2.5 10"${wirePhaseAttrs("", impact)} />`,
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
        `<path d="M ${startX} ${startY} L ${endX} ${endY}" stroke="url(#${gid})" fill="none" stroke-width="${dashed ? 3 : 3.75}" stroke-linecap="round"${dashed ? ' stroke-dasharray="2.5 10"' : ""}${wirePhaseAttrs(node, "")} />`,
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

function flowDotMarkup(label, tone, role, color, phase = "", extraStyle = "") {
  const display = String(label ?? "")
    .replace(/:\s*/g, ":\n")
    .replace(/,\s*/g, "\n");
  const ariaLabel = String(
    label ||
      (tone === "hub" ? "Breach hub" : tone === "side" ? "Side path" : ""),
  ).trim();
  const mergedStyle = [
    color ? `color:${escapeHtml(color)};--flow-dot:${escapeHtml(color)}` : "",
    extraStyle,
  ]
    .filter(Boolean)
    .join(";");
  const colorStyle = mergedStyle ? ` style="${mergedStyle}"` : "";
  const phaseAttr = phase ? ` data-flow-phase="${escapeHtml(phase)}"` : "";
  const labelEl =
    tone === "hub" || tone === "side"
      ? ""
      : `<span class="flow-dot__label">${escapeHtml(display)}</span>`;
  const buttonEl = `
      <button
        type="button"
        class="flow-dot flow-node--${escapeHtml(tone)}"
        data-flow-node="${escapeHtml(role)}"${phaseAttr}
        aria-label="${escapeHtml(ariaLabel)}"
      ></button>`;
  const body =
    tone === "outcome" || tone === "impact"
      ? `${buttonEl}${labelEl}`
      : tone === "hub" || tone === "side"
        ? buttonEl
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

  const parsePhaseIndex = (raw) => {
    if (raw === 0 || raw === "0" || raw === "prep" || raw === "preparation") return 0;
    if (raw === 1 || raw === "1" || raw === "collection") return 1;
    if (raw === 2 || raw === "2" || raw === "breach") return 2;
    if (
      raw === 3 ||
      raw === "3" ||
      raw === "post-breach" ||
      raw === "publication"
    ) {
      return 3;
    }
    return null;
  };

  const focusPhase = parsePhaseIndex(content.focusPhase);
  /** Progressive overview: show phases 0..N with stroke on N (prep stays visible).
   *  Special values: "none" / "all" → both sides clear with no stroke highlight. */
  const revealRaw = content.revealThroughPhase ?? content.revealThrough;
  const phaseStrokeOff =
    revealRaw === "none" ||
    revealRaw === "all" ||
    content.phaseHighlight === false;
  const revealThrough = phaseStrokeOff ? 3 : parsePhaseIndex(revealRaw);
  const progressive = revealThrough != null;

  const orbitPanel =
    content.orbitPanel && typeof content.orbitPanel === "object"
      ? content.orbitPanel
      : null;
  const orbitPanelSide =
    orbitPanel?.side === "left" || orbitPanel?.side === "right"
      ? orbitPanel.side
      : null;

  // Static SVG illustrations (Custom slides 20–24) — skip live node/wire DOM
  const DEFAULT_PREP_ILLUSTRATION = "../assets/attack-path/prep-collection.svg?v=2";
  const DEFAULT_BREACH_ILLUSTRATION = "../assets/attack-path/breach-post.svg?v=3";
  const useOrbitIllustration =
    content.orbitIllustration === true ||
    Boolean(content.orbitIllustrationPrep) ||
    Boolean(content.orbitIllustrationBreach);
  const prepIllustrationSrc =
    typeof content.orbitIllustrationPrep === "string" &&
    content.orbitIllustrationPrep.trim()
      ? content.orbitIllustrationPrep.trim()
      : useOrbitIllustration
        ? DEFAULT_PREP_ILLUSTRATION
        : "";
  const breachIllustrationSrc =
    typeof content.orbitIllustrationBreach === "string" &&
    content.orbitIllustrationBreach.trim()
      ? content.orbitIllustrationBreach.trim()
      : useOrbitIllustration
        ? DEFAULT_BREACH_ILLUSTRATION
        : "";
  const prepIllustrationMarkup = prepIllustrationSrc
    ? `<div class="flow-phase__body flow-phase__body--illustration">
        <img class="flow-orbit-illustration" src="${escapeHtml(prepIllustrationSrc)}" alt="" draggable="false" />
      </div>`
    : "";
  const breachIllustrationMarkup = breachIllustrationSrc
    ? `<div class="flow-phase__body flow-phase__body--illustration">
        <img class="flow-orbit-illustration" src="${escapeHtml(breachIllustrationSrc)}" alt="" draggable="false" />
      </div>`
    : "";

  const phased = content.phased !== false;
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

  // Progressive deck beats: keep all phases mounted; unblur through revealThrough
  // and stroke the current phase (same look as clicking that section).
  const showPrep = progressive || focusPhase == null || focusPhase === 0;
  const showCollection = progressive || focusPhase == null || focusPhase === 1;
  const showBreach =
    (progressive || focusPhase == null || focusPhase === 2) &&
    outcomes.length > 0;
  const showPostBreach =
    (progressive || focusPhase == null || focusPhase === 3) &&
    impacts.length > 0;

  const mergePrepCollection = content.mergePrepCollection === true;
  const mergeBreachPostBreach = content.mergeBreachPostBreach === true;
  const hideNodeLabels = content.hideNodeLabels === true;
  const hideStepBadges = content.hideStepBadges === true;
  const outcomeHub =
    !useOrbitIllustration && content.outcomeHub === true && outcomes.length > 0;
  const prepExitDot =
    !useOrbitIllustration &&
    content.prepExitDot === true &&
    mergePrepCollection &&
    (showPrep || showCollection) &&
    orbitPanelSide !== "left";
  const breachFanCount = (() => {
    if (useOrbitIllustration || orbitPanelSide === "right") return 0;
    const raw = Number(content.breachFanCount);
    if (!outcomeHub) return 0;
    if (Number.isFinite(raw) && raw > 0) return Math.floor(raw);
    return 0;
  })();
  const breachFanLongCount = (() => {
    if (useOrbitIllustration || orbitPanelSide === "right") return 0;
    const raw = Number(content.breachFanLongCount);
    if (!outcomeHub) return 0;
    if (Number.isFinite(raw) && raw > 0) return Math.floor(raw);
    return 0;
  })();
  const hasBreachFans = breachFanCount > 0 || breachFanLongCount > 0;
  const clampPct = (value, min, max) => Math.min(max, Math.max(min, value));
  // Mirror OG colors across many fluid branches that all meet the red exit.
  // Orange (#FF8045) is the last color before the red prep-exit hub.
  const prepSideColors = [sourceColor, ...stages.map((stage) => stage.color)];
  const buildPrepSideBranch = (branchIndex, branchCount) => {
    const colorCount = prepSideColors.length;
    const slot = branchCount <= 1 ? 0.5 : branchIndex / (branchCount - 1);
    // Keep OG center path clear: pack branches into upper + lower bands
    const startY =
      slot < 0.5
        ? 6 + slot * 2 * 36
        : 58 + (slot - 0.5) * 2 * 36;
    const startX = 5 + ((branchIndex * 7) % 11);
    const endX = 76 + ((branchIndex * 3) % 5);
    const endY = 46 + (slot - 0.5) * 18;
    return prepSideColors.map((color, index) => {
      const t = colorCount <= 1 ? 0 : index / (colorCount - 1);
      const ease = t * t;
      const wobble =
        Math.sin((branchIndex + 1) * 1.73 + index * 1.1) * (5 - ease * 4);
      return {
        x: Math.round(clampPct(startX + (endX - startX) * t + wobble, 4, 88)),
        y: Math.round(
          clampPct(startY + (endY - startY) * ease + wobble * 0.45, 5, 95),
        ),
        color,
      };
    });
  };
  // Feeders per main branch that converge on that branch’s orange node
  const prepOrangeFeederCount = (() => {
    const raw = Number(content.prepOrangeFeederCount);
    if (Number.isFinite(raw) && raw >= 0) return Math.floor(raw);
    return 0;
  })();
  const buildPrepOrangeFeeder = (
    parentIndex,
    feederIndex,
    parentNodes,
    feederTotal,
  ) => {
    const orange = parentNodes[parentNodes.length - 1];
    const feederColors = prepSideColors.slice(0, -1); // stop short of orange
    if (!orange || !feederColors.length) return [];
    const parentStart = parentNodes[0] || { x: 8, y: 50 };
    const total = Math.max(1, feederTotal);
    const spread = feederIndex - (total - 1) / 2;
    const band = total > 4 ? 6.2 : 11;
    const startX = clampPct(
      parentStart.x - 10 + feederIndex * 1.8 + Math.sin((parentIndex + 1) * 2.1) * 3,
      3,
      36,
    );
    const startY = clampPct(
      parentStart.y +
        spread * band +
        Math.cos((parentIndex + 1) * 1.4 + feederIndex) * 2.5,
      4,
      96,
    );
    // Approach the orange node without landing on it (wire finishes the join)
    return feederColors.map((color, index) => {
      const t = (index + 1) / (feederColors.length + 1);
      const ease = t * t;
      const wobble =
        Math.sin((parentIndex + 1) * 2.2 + feederIndex * 1.7 + index) *
        (3.2 - ease * 2.2);
      return {
        x: Math.round(
          clampPct(startX + (orange.x - startX) * t + wobble, 3, 86),
        ),
        y: Math.round(
          clampPct(
            startY + (orange.y - startY) * ease + wobble * 0.55,
            4,
            96,
          ),
        ),
        color,
      };
    });
  };
  const prepSideBranches = (() => {
    if (!prepExitDot) return [];
    if (content.prepSideChain === false) return [];
    const extra = Number(content.prepSideBranchExtra ?? 0);
    const explicitCount = Number(content.prepSideBranchCount);
    let branchCount = 0;
    if (Number.isFinite(explicitCount) && explicitCount > 0) {
      branchCount = Math.floor(explicitCount);
    } else if (content.prepSideChain === true || extra > 0) {
      branchCount = 1 + (Number.isFinite(extra) ? Math.max(0, Math.floor(extra)) : 0);
    }
    if (!branchCount && Array.isArray(content.prepSideChain)) {
      // Legacy single-chain array → one branch
      return [
        {
          id: "0",
          weight: 0,
          feeder: false,
          parent: null,
          nodes: content.prepSideChain,
        },
      ];
    }
    if (!branchCount) return [];
    const specs = [];
    for (let index = 0; index < branchCount; index += 1) {
      const nodes = buildPrepSideBranch(index, branchCount);
      specs.push({
        id: String(index),
        weight: index % 3,
        feeder: false,
        parent: null,
        nodes,
      });
      for (let f = 0; f < prepOrangeFeederCount; f += 1) {
        specs.push({
          id: `${index}-f${f}`,
          weight: (index + f + 1) % 3,
          feeder: true,
          parent: String(index),
          feederIndex: f,
          nodes: buildPrepOrangeFeeder(
            index,
            f,
            nodes,
            prepOrangeFeederCount,
          ),
        });
      }
    }
    return specs;
  })();
  const focusKeys = ["prep", "collection", "breach", "post-breach"];
  const orbitMods = [
    phased ? "flow-orbit--phased" : "",
    (progressive || focusPhase == null) && outcomes.length
      ? "flow-orbit--with-outcomes"
      : "",
    (progressive || focusPhase == null) && impacts.length
      ? "flow-orbit--with-impacts"
      : "",
    progressive ? "flow-orbit--reveal flow-orbit--tall" : "",
    !progressive && focusPhase != null
      ? `flow-orbit--focus flow-orbit--focus-${focusKeys[focusPhase]}`
      : "",
    mergePrepCollection ? "flow-orbit--merge-prep-collection" : "",
    mergeBreachPostBreach ? "flow-orbit--merge-breach-post" : "",
    hideNodeLabels ? "flow-orbit--no-node-labels" : "",
    hideStepBadges ? "flow-orbit--no-step-badges" : "",
    outcomeHub ? "flow-orbit--outcome-hub" : "",
    prepExitDot ? "flow-orbit--prep-exit" : "",
    prepSideBranches.length ? "flow-orbit--prep-side-chain" : "",
    hasBreachFans ? "flow-orbit--breach-fan" : "",
    useOrbitIllustration ? "flow-orbit--illustration" : "",
    orbitPanelSide ? "flow-orbit--orbit-panel" : "",
    orbitPanelSide ? `flow-orbit--orbit-panel-${orbitPanelSide}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const continueAttrs = (() => {
    if (progressive) return "";
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

  const stepBadge = (number, label, color) =>
    phased && !hideStepBadges ? flowStepBadge(number, label, color) : "";

  const sourcesBlock = `
    <div class="flow-step flow-step--sources">
      ${stepBadge(1, stepLabels[0] ?? "Recon", sourceColor)}
      <div class="flow-orbit__sources">
        ${sources
          .map((source, index) => {
            const label =
              typeof source === "string" ? source : source.label ?? source.title ?? "";
            return flowDotMarkup(label, "source", `source-${index}`, sourceColor, "prep");
          })
          .join("")}
      </div>
    </div>
  `;

  const weaponizeBlock = weaponize
    ? `
      <div class="flow-step flow-step--stage">
        ${stepBadge(2, stepLabels[1] ?? "Weaponize", weaponize.color)}
        ${flowDotMarkup(weaponize.label, "stage", "stage-0", weaponize.color, "prep")}
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
          ${stepBadge(meta.number, meta.label, stage.color)}
          ${flowDotMarkup(stage.label, "stage", `stage-${index + 1}`, stage.color, "collection")}
        </div>
      `;
    })
    .join("");

  // Red terminal node inside prep·collection (becomes last stage in the wire chain)
  const prepExitBlock = prepExitDot
    ? `
      <div class="flow-step flow-step--stage flow-step--prep-exit">
        ${flowDotMarkup("", "stage", "stage-exit", outcomeColor, "collection")}
      </div>
    `
    : "";

  const prepSideChainLayer = prepSideBranches.length
    ? `<div class="flow-orbit__prep-side-chain" aria-hidden="true">
        ${prepSideBranches
          .map(
            (branch) => `
          <div class="flow-orbit__prep-side-branch" data-branch="${escapeHtml(branch.id)}" data-weight="${branch.weight}"${
              branch.feeder
                ? ` data-feeder="${branch.feederIndex}" data-parent="${escapeHtml(branch.parent)}"`
                : ""
            }>
            ${(branch.nodes || [])
              .map((node, index) => {
                const isOrange =
                  !branch.feeder && index === (branch.nodes.length - 1);
                return flowDotMarkup(
                  "",
                  "side",
                  isOrange
                    ? `prep-orange-${branch.id}`
                    : `prep-side-${branch.id}-${index}`,
                  node.color,
                  index === 0 ? "prep" : "collection",
                  `--fx:${node.x}%;--fy:${node.y}%`,
                );
              })
              .join("")}
          </div>`,
          )
          .join("")}
      </div>`
    : "";

  const overviewInteractive = focusPhase == null && !progressive;
  const overviewPhaseAttrs = (label, { selected = false } = {}) =>
    overviewInteractive
      ? ` role="button" tabindex="0" aria-pressed="${selected ? "true" : "false"}" aria-label="Select ${escapeHtml(label)} phase"`
      : "";

  const outcomeHubMarkup = outcomeHub
    ? `<div class="flow-orbit__outcome-hub">
        ${flowDotMarkup("", "hub", "outcome-hub", outcomeColor, "breach")}
      </div>`
    : "";

  // Fan rays from the hub: every regular branch has 4–6 clearly separated red nodes.
  // Reach the right edge of the section; thinner weights get smaller nodes.
  const buildRegularBreachFan = (index, total) => {
    const slot = total <= 1 ? 0.5 : index / (total - 1);
    const angle = -0.95 + slot * 1.9;
    const nodeCount = 4 + (index % 3); // 4, 5, or 6
    const weight = index % 3;
    const tipRadius = 72 + (index % 7) * 4.5;
    const startRadius = 16 + (index % 4) * 1.2;
    const originX = 12;
    const originY = 50;
    return {
      weight,
      long: false,
      nodes: Array.from({ length: nodeCount }, (_, nodeIndex) => {
        const t = nodeCount <= 1 ? 1 : nodeIndex / (nodeCount - 1);
        const radius = startRadius + t * (tipRadius - startRadius);
        const wobble =
          Math.sin((index + 1) * 1.37 + nodeIndex * 0.9) * (1.1 - t * 0.55);
        return {
          x: Math.round(
            clampPct(originX + Math.cos(angle) * radius + wobble, 10, 99),
          ),
          y: Math.round(
            clampPct(
              originY + Math.sin(angle) * radius + wobble * 0.5,
              6,
              94,
            ),
          ),
          color: outcomeColor,
        };
      }),
    };
  };
  // Extra long branches (12 nodes): weave fluidly into gaps between regular fans
  const buildLongBreachFan = (index, total) => {
    const nodeCount = 12;
    // Sit in the angular gaps / quieter bands of the regular fan
    const slot = total <= 1 ? 0.5 : (index + 0.37) / total;
    const baseAngle = -0.9 + slot * 1.8;
    const weight = (index + 1) % 3;
    const tipRadius = 70 + (index % 6) * 5;
    const startRadius = 12 + (index % 5) * 1.4;
    const originX = 11 + (index % 3);
    const originY = 48 + ((index % 5) - 2) * 2.5;
    const spacingBias = 0.72 + (index % 4) * 0.09; // uneven radial pacing
    return {
      weight,
      long: true,
      nodes: Array.from({ length: nodeCount }, (_, nodeIndex) => {
        const u = nodeCount <= 1 ? 1 : nodeIndex / (nodeCount - 1);
        const t = Math.pow(u, spacingBias);
        const radius = startRadius + t * (tipRadius - startRadius);
        // Lateral weave so the path snakes into open pockets
        const weave =
          Math.sin(u * Math.PI * (1.55 + index * 0.19) + index * 1.1) *
          (7.5 + (index % 4) * 1.6);
        const weave2 =
          Math.cos(u * Math.PI * (2.05 + index * 0.13) + index) *
          (2.8 + (index % 3));
        const angle =
          baseAngle +
          weave * 0.014 +
          Math.sin(index * 0.7 + u * 3.2) * 0.07;
        return {
          x: Math.round(
            clampPct(
              originX + Math.cos(angle) * radius + weave * 0.35 + weave2 * 0.2,
              8,
              99,
            ),
          ),
          y: Math.round(
            clampPct(
              originY + Math.sin(angle) * radius + weave * 0.55 + weave2 * 0.35,
              4,
              96,
            ),
          ),
          color: outcomeColor,
        };
      }),
    };
  };
  const breachFanBranches = [
    ...Array.from({ length: breachFanCount }, (_, index) =>
      buildRegularBreachFan(index, breachFanCount),
    ),
    ...Array.from({ length: breachFanLongCount }, (_, index) =>
      buildLongBreachFan(index, breachFanLongCount),
    ),
  ];

  const breachFanLayer = breachFanBranches.length
    ? `<div class="flow-orbit__breach-fan" aria-hidden="true">
        ${breachFanBranches
          .map(
            (branch, branchIndex) => `
          <div class="flow-orbit__breach-fan-branch" data-branch="${branchIndex}" data-weight="${branch.weight}"${
              branch.long ? ' data-long="true"' : ""
            }>
            ${branch.nodes
              .map((node, index) =>
                flowDotMarkup(
                  "",
                  "side",
                  `breach-fan-${branchIndex}-${index}`,
                  node.color,
                  "breach",
                  `--fx:${node.x}%;--fy:${node.y}%`,
                ),
              )
              .join("")}
          </div>`,
          )
          .join("")}
      </div>`
    : "";

  const outcomesInner = `
    <div class="flow-step flow-step--outcomes">
      ${stepBadge(7, stepLabels[6] ?? "Action-on-Objective", outcomeColor)}
      <div class="flow-orbit__outcomes-cluster${outcomeHub ? " flow-orbit__outcomes-cluster--hub" : ""}">
        ${outcomeHubMarkup}
        <div class="flow-orbit__outcomes">
          ${outcomes
            .map((outcome, index) =>
              flowDotMarkup(
                outcome.label,
                "outcome",
                `outcome-${index}`,
                outcome.color,
                "breach",
              ),
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  const impactsInner = `
    <div class="flow-step flow-step--impacts">
      ${stepBadge(8, stepLabels[7] ?? "Publication", impactColor)}
      <div class="flow-orbit__impacts">
        ${impacts
          .map((impact, index) =>
            flowDotMarkup(
              impact.label,
              "impact",
              `impact-${index}`,
              impact.color,
              "post-breach",
            ),
          )
          .join("")}
      </div>
    </div>
  `;

  let orbitInner = "";
  if (!phased) {
    const stageCount = Math.max(1 + collectionStages.length, 1);
    orbitInner = `
      ${sourcesBlock}
      <div class="flow-orbit__stages" style="--flow-stage-count:${stageCount}">
        ${weaponizeBlock}
        ${collectionBlocks}
      </div>
      ${outcomes.length ? outcomesInner : ""}
      ${impacts.length ? impactsInner : ""}
    `;
  } else {
    const strokeClass = (phaseIndex) => {
      if (phaseStrokeOff || orbitPanelSide) return "";
      if (progressive) return revealThrough === phaseIndex ? " is-stroke-on" : "";
      if (focusPhase == null && phaseIndex === 0) return " is-stroke-on";
      return "";
    };
    const blurClass = (phaseIndex) => {
      if (focusPhase != null || phaseStrokeOff || orbitPanelSide) return "";
      if (progressive) return phaseIndex > revealThrough ? " is-phase-blurred" : "";
      return phaseIndex > 0 ? " is-phase-blurred" : "";
    };

    const orbitPanelSection = orbitPanelSide
      ? (() => {
          const panelTitle = String(orbitPanel.title ?? "").trim();
          const panelSubtitle = String(orbitPanel.subtitle ?? "").trim();
          const panelBody = String(
            orbitPanel.body ?? orbitPanel.text ?? "",
          ).trim();
          const panelBullets = Array.isArray(orbitPanel.bullets)
            ? orbitPanel.bullets
            : [];
          return `<section class="flow-phase flow-phase--orbit-panel">
            <div class="flow-phase__body flow-orbit-panel">
              ${
                panelTitle || panelSubtitle
                  ? `<header class="slide-header flow-orbit-panel__header">
                      ${
                        panelTitle
                          ? `<h2 class="type-h3">${escapeHtml(panelTitle)}</h2>`
                          : ""
                      }
                      ${
                        panelSubtitle
                          ? `<p class="type-h4">${escapeHtml(panelSubtitle)}</p>`
                          : ""
                      }
                    </header>`
                  : ""
              }
              ${
                panelBody
                  ? `<p class="type-body flow-orbit-panel__body">${escapeHtml(panelBody)}</p>`
                  : ""
              }
              ${
                panelBullets.length
                  ? `<ul class="bullet-list flow-orbit-panel__bullets">
                      ${panelBullets
                        .map((item) => {
                          const label =
                            typeof item === "string"
                              ? item
                              : item?.label ?? item?.text ?? "";
                          return `<li class="type-body">${escapeHtml(String(label))}</li>`;
                        })
                        .join("")}
                    </ul>`
                  : ""
              }
            </div>
          </section>`;
        })()
      : "";

    const prepPhase = showPrep
      ? `<section class="flow-phase flow-phase--prep${strokeClass(0)}${blurClass(0)}"${overviewPhaseAttrs(phaseTitles[0] ?? "Preparation", { selected: overviewInteractive && revealThrough == null })}>
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
      ? `<section class="flow-phase flow-phase--collection${strokeClass(1)}${blurClass(1)}"${overviewPhaseAttrs(phaseTitles[1] ?? "Collection")}>
          <h3 class="flow-phase__title">${escapeHtml(phaseTitles[1] ?? "Collection")}</h3>
          <div class="flow-phase__body">
            <div class="flow-phase__grid flow-phase__grid--collection" style="--flow-collection-count:${Math.max(collectionStages.length, 1)}">
              ${collectionBlocks}
            </div>
          </div>
        </section>`
      : "";

    const mergedEarlyStroke =
      phaseStrokeOff || orbitPanelSide
        ? ""
        : progressive && (revealThrough === 0 || revealThrough === 1)
          ? " is-stroke-on"
          : strokeClass(0);
    const mergedEarlyBlur =
      phaseStrokeOff || orbitPanelSide
        ? ""
        : progressive && revealThrough != null && revealThrough < 0
          ? " is-phase-blurred"
          : progressive
            ? ""
            : blurClass(0);
    const mergedEarlyTitle = [
      phaseTitles[0] ?? "Preparation",
      phaseTitles[1] ?? "Collection",
    ].join(" · ");
    const prepCollectionCount =
      Math.max(collectionStages.length, 1) + (prepExitDot ? 1 : 0);
    const prepCollectionPhase =
      mergePrepCollection && (showPrep || showCollection)
        ? `<section class="flow-phase flow-phase--prep-collection${mergedEarlyStroke}${mergedEarlyBlur}"${overviewPhaseAttrs(mergedEarlyTitle)}>
          <h3 class="flow-phase__title">${escapeHtml(mergedEarlyTitle)}</h3>
          ${
            prepIllustrationMarkup ||
            `<div class="flow-phase__body">
            ${prepSideChainLayer}
            <div class="flow-phase__grid flow-phase__grid--prep-collection" style="--flow-collection-count:${prepCollectionCount}">
              ${sourcesBlock}
              ${weaponizeBlock}
              ${collectionBlocks}
              ${prepExitBlock}
            </div>
          </div>`
          }
        </section>`
        : "";

    const breachPhase = showBreach
      ? `<section class="flow-phase flow-phase--breach${strokeClass(2)}${blurClass(2)}"${overviewPhaseAttrs(phaseTitles[2] ?? "Breach")}>
          <h3 class="flow-phase__title">${escapeHtml(phaseTitles[2] ?? "Breach")}</h3>
          <div class="flow-phase__body">
            ${outcomesInner}
          </div>
        </section>`
      : "";

    const postBreachPhase = showPostBreach
      ? `<section class="flow-phase flow-phase--post-breach${strokeClass(3)}${blurClass(3)}"${overviewPhaseAttrs(phaseTitles[3] ?? "Post-Breach")}>
          <h3 class="flow-phase__title">${escapeHtml(phaseTitles[3] ?? "Post-Breach")}</h3>
          <div class="flow-phase__body">
            ${impactsInner}
          </div>
        </section>`
      : "";

    const mergedLateStroke =
      phaseStrokeOff || orbitPanelSide
        ? ""
        : progressive && (revealThrough === 2 || revealThrough === 3)
          ? " is-stroke-on"
          : strokeClass(2);
    const mergedLateBlur =
      phaseStrokeOff || orbitPanelSide
        ? ""
        : progressive && revealThrough != null && revealThrough < 2
          ? " is-phase-blurred"
          : progressive
            ? ""
            : blurClass(2);
    const mergedLateTitle = [
      phaseTitles[2] ?? "Breach",
      phaseTitles[3] ?? "Post-Breach",
    ].join(" · ");
    const breachPostHubOnly =
      hasBreachFans
        ? `<div class="flow-orbit__outcomes-cluster flow-orbit__outcomes-cluster--hub flow-orbit__outcomes-cluster--hub-only">
            ${outcomeHubMarkup}
          </div>`
        : "";
    const breachPostPhase =
      mergeBreachPostBreach && (showBreach || showPostBreach)
        ? `<section class="flow-phase flow-phase--breach-post${mergedLateStroke}${mergedLateBlur}"${overviewPhaseAttrs(mergedLateTitle)}>
          <h3 class="flow-phase__title">${escapeHtml(mergedLateTitle)}</h3>
          ${
            breachIllustrationMarkup ||
            `<div class="flow-phase__body">
            ${breachFanLayer}
            <div class="flow-phase__grid flow-phase__grid--breach-post${hasBreachFans ? " flow-phase__grid--breach-post-fan" : ""}">
              ${
                hasBreachFans
                  ? breachPostHubOnly
                  : `${showBreach ? outcomesInner : ""}${showPostBreach ? impactsInner : ""}`
              }
            </div>
          </div>`
          }
        </section>`
        : "";

    const earlyPhases =
      orbitPanelSide === "left"
        ? orbitPanelSection
        : mergePrepCollection
          ? prepCollectionPhase
          : `${prepPhase}${collectionPhase}`;
    const latePhases =
      orbitPanelSide === "right"
        ? orbitPanelSection
        : mergeBreachPostBreach
          ? breachPostPhase
          : `${breachPhase}${postBreachPhase}`;
    orbitInner = `
      ${earlyPhases}
      ${latePhases}
    `;
  }

  el.innerHTML = `
    ${focusPhase == null ? cornerSection(content) : ""}
    ${focusPhase == null ? titleBlock(content) : ""}
    <div class="flow-orbit ${orbitMods}" data-flow-funnel${continueAttrs}>
      ${useOrbitIllustration ? "" : `<svg class="flow-funnel__wires" aria-hidden="true"></svg>`}
      ${orbitInner}
    </div>
  `;

  if (!useOrbitIllustration) {
    queueMicrotask(() => fitFlowFunnel(el));
  }
  return el;
}

/* ---- LY-25 Campaign symbols ---- */

const CAMPAIGN_COLOR = "#A182FF";
/** Matches the LY-24 Collection phase stroke (135deg orange → pink). */
const CAMPAIGN_GRADIENT = ["#EC6B15", "#F72EBE"];
/** LY-24 Deliver, Exploit, Install label colors. */
const CAMPAIGN_DOT_COLORS = ["#9977FF", "#BF66FF", "#F17AFF"];
let campaignGradientSeq = 0;
// Content area above the footer (1080 - 128px footer padding).
const CAMPAIGN_STAGE_W = 1920;
const CAMPAIGN_STAGE_H = 952;
const CAMPAIGN_DOT = 16;
const CAMPAIGN_SPACING = 24;
const CAMPAIGN_PAD = 12;
const CAMPAIGN_BORDER = 4;
const CAMPAIGN_HUB_SIZE = 300;
const CAMPAIGN_MAX_DOTS = 40;

/** Default symbols: count + center position in % of the stage. */
const CAMPAIGN_SYMBOL_DEFAULTS = [
  { count: 6, x: 13, y: 24 },
  { count: 30, x: 34, y: 16 },
  { count: 14, x: 74, y: 20 },
  { count: 5, x: 90, y: 52 },
  { count: 22, x: 18, y: 72 },
  { count: 9, x: 63, y: 83 },
];

function campaignRingCapacity(ring) {
  return Math.floor(Math.PI / Math.asin(1 / (2 * ring)));
}

/** Concentric-ring dot positions (relative to symbol center). */
function campaignDotLayout(count) {
  const n = Math.max(1, Math.min(CAMPAIGN_MAX_DOTS, Math.round(Number(count) || 1)));
  if (n === 1) return { dots: [{ x: 0, y: 0 }], ringRadius: 0 };

  const caps = [1];
  const sum = (list) => list.reduce((a, b) => a + b, 0);
  while (sum(caps) < n) caps.push(campaignRingCapacity(caps.length));

  // Outer rings take their share first; at most one dot is left for the center.
  const counts = new Array(caps.length).fill(0);
  let remaining = n;
  for (let ring = caps.length - 1; ring >= 1; ring -= 1) {
    const capLeft = sum(caps.slice(0, ring + 1));
    counts[ring] = Math.min(caps[ring], Math.ceil((remaining * caps[ring]) / capLeft));
    remaining -= counts[ring];
  }
  counts[0] = remaining;

  const dots = counts[0] ? [{ x: 0, y: 0 }] : [];
  let prevRadius = counts[0] ? 0 : -Infinity;
  let ringRadius = 0;
  for (let ring = 1; ring < counts.length; ring += 1) {
    const c = counts[ring];
    if (!c) continue;
    const chordRadius = c === 1 ? 0 : CAMPAIGN_SPACING / (2 * Math.sin(Math.PI / c));
    const radius = Math.max(chordRadius, prevRadius + CAMPAIGN_SPACING);
    const offset = ring * 0.7 - Math.PI / 2;
    for (let j = 0; j < c; j += 1) {
      const angle = offset + (j * 2 * Math.PI) / c;
      dots.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
    }
    prevRadius = radius;
    ringRadius = radius;
  }
  return { dots, ringRadius };
}

/** Stable pseudo-random 0–1 so dot colors don't change between renders. */
function campaignNoise(a, b) {
  const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

function campaignPercent(value, fallback) {
  if (value === null || value === undefined || value === "") return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeCampaignSymbols(content) {
  const list =
    Array.isArray(content.symbols) && content.symbols.length
      ? content.symbols
      : CAMPAIGN_SYMBOL_DEFAULTS;
  return list.slice(0, CAMPAIGN_SYMBOL_DEFAULTS.length).map((symbol, index) => {
    const fallback = CAMPAIGN_SYMBOL_DEFAULTS[index];
    const raw = typeof symbol === "number" ? { count: symbol } : symbol ?? {};
    const x = campaignPercent(raw.x, fallback.x);
    const y = campaignPercent(raw.y, fallback.y);
    const { dots, ringRadius } = campaignDotLayout(raw.count ?? fallback.count);
    return {
      cx: (x / 100) * CAMPAIGN_STAGE_W,
      cy: (y / 100) * CAMPAIGN_STAGE_H,
      radius: ringRadius + CAMPAIGN_DOT / 2 + CAMPAIGN_PAD + CAMPAIGN_BORDER,
      dots,
    };
  });
}

function renderCampaign(content) {
  const el = document.createElement("div");
  el.className = "slide-content layout-campaign";
  const color = content.color || CAMPAIGN_COLOR;
  const hub = content.hub === true || content.hub === "true";
  const text = content.text ?? "";
  const hubLabel = content.hubLabel ?? "PreBreach Intelligence";
  const symbols = normalizeCampaignSymbols(content);
  const round = (n) => Math.round(n * 10) / 10;
  const [gradFrom, gradTo] =
    Array.isArray(content.gradient) && content.gradient.length === 2
      ? content.gradient
      : CAMPAIGN_GRADIENT;
  const dotColors =
    Array.isArray(content.dotColors) && content.dotColors.length
      ? content.dotColors
      : CAMPAIGN_DOT_COLORS;
  // Unique per render: several copies of a slide (tiles, lightbox) share the page.
  const gradientId = `campaign-grad-${(campaignGradientSeq += 1)}`;

  const symbolsSvg = symbols
    .map(
      (symbol, symbolIndex) => `
        <g class="campaign-symbol" transform="translate(${round(symbol.cx)} ${round(symbol.cy)})">
          <circle class="campaign-symbol__ring" r="${round(symbol.radius - CAMPAIGN_BORDER / 2)}" stroke="url(#${gradientId})" stroke-width="${CAMPAIGN_BORDER}" />
          ${symbol.dots
            .map(
              (dot, dotIndex) =>
                `<circle class="campaign-symbol__dot" cx="${round(dot.x)}" cy="${round(dot.y)}" r="${CAMPAIGN_DOT / 2}" fill="${escapeHtml(dotColors[Math.floor(campaignNoise(symbolIndex + 1, dotIndex + 1) * dotColors.length)])}" />`,
            )
            .join("")}
        </g>`,
    )
    .join("");

  const hubX = CAMPAIGN_STAGE_W / 2;
  const hubY = CAMPAIGN_STAGE_H / 2;
  const hubR = CAMPAIGN_HUB_SIZE / 2;
  const wiresSvg = hub
    ? symbols
        .map((symbol, index) => {
          const dx = hubX - symbol.cx;
          const dy = hubY - symbol.cy;
          const dist = Math.hypot(dx, dy);
          if (dist <= symbol.radius + hubR) return "";
          const ux = dx / dist;
          const uy = dy / dist;
          const x1 = symbol.cx + ux * symbol.radius;
          const y1 = symbol.cy + uy * symbol.radius;
          const x2 = hubX - ux * hubR;
          const y2 = hubY - uy * hubR;
          return `<path class="campaign-wire" d="M ${round(x1)} ${round(y1)} L ${round(x2)} ${round(y2)}" pathLength="1" style="--wire-i:${index}" />`;
        })
        .join("")
    : "";

  el.innerHTML = `
    <div class="campaign-stage${hub ? " campaign-stage--hub" : ""}" style="--campaign-color:${escapeHtml(color)}">
      <svg class="campaign-stage__svg" viewBox="0 0 ${CAMPAIGN_STAGE_W} ${CAMPAIGN_STAGE_H}" width="${CAMPAIGN_STAGE_W}" height="${CAMPAIGN_STAGE_H}" aria-hidden="true">
        <defs>
          <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${escapeHtml(gradFrom)}" />
            <stop offset="1" stop-color="${escapeHtml(gradTo)}" />
          </linearGradient>
        </defs>
        ${hub ? `<g class="campaign-wires">${wiresSvg}</g>` : ""}
        <g class="campaign-symbols">${symbolsSvg}</g>
      </svg>
      ${
        hub
          ? `<div class="campaign-hub"><span class="campaign-hub__label">${colorizeQuestion(hubLabel)}</span></div>`
          : text
            ? `<div class="layout-campaign__center"><p class="type-h3 layout-campaign__text">${colorizeQuestion(text)}</p></div>`
            : ""
      }
    </div>
  `;
  return el;
}

/* ---- LY-26 Data table ---- */

function renderDataTableCell(raw, { hug = false } = {}) {
  const text = String(raw ?? "");
  const isFile = /\.(pdf|docx?|txt)$/i.test(text);
  const isMultiline = text.includes("\n");
  const credentialMatch =
    text.includes("@") && text.includes(":")
      ? text.match(/^([^:\s]+@[^:\s]+)\s*:\s*(.+)$/)
      : null;
  const isCredential = Boolean(credentialMatch);
  const classes = [
    hug ? "layout-data-table__hug" : "",
    isFile ? "layout-data-table__file" : "",
    isMultiline ? "layout-data-table__multiline" : "",
    isCredential ? "layout-data-table__credential" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const cls = classes ? ` class="${classes}"` : "";
  let html;
  if (credentialMatch) {
    const [, email, password] = credentialMatch;
    html = `${escapeHtml(email)} : <strong class="layout-data-table__password">${escapeHtml(password)}</strong>`;
  } else {
    html = escapeHtml(text).replace(/\n/g, "<br>");
  }
  return `<td${cls}>${html}</td>`;
}

function renderCredentialPanel(panel) {
  const rows = Array.isArray(panel.rows) ? panel.rows : [];
  const body = rows
    .map((row) => {
      const cell = Array.isArray(row) ? row[0] : row;
      return `<tr>${renderDataTableCell(cell ?? "")}</tr>`;
    })
    .join("");
  const heading = panel.title?.trim()
    ? `<p class="layout-data-table__panel-title">${escapeHtml(panel.title)}</p>`
    : "";
  return `<div class="layout-data-table__frame layout-data-table__frame--credentials">
    ${heading}
    <table class="layout-data-table__table">
      <tbody>${body}</tbody>
    </table>
  </div>`;
}

function renderProfileField(field) {
  if (!field || typeof field !== "object") return "";
  if (field.type === "divider") {
    return `<div class="breach-profile__divider" role="separator"></div>`;
  }
  const label = String(field.label ?? "").trim();
  const raw = String(field.value ?? "");
  const text = raw.trim();
  if (!label) return "";
  if (!text && !field.showEmpty) return "";
  const valueClass = field.emphasize
    ? "breach-profile__value breach-profile__value--password"
    : "breach-profile__value";
  const display = text || "\u00a0";
  const valueHtml = field.emphasize
    ? `<strong class="layout-data-table__password">${escapeHtml(display)}</strong>`
    : escapeHtml(display);
  return `<div class="breach-profile__field">
    <dt>${escapeHtml(label)}</dt>
    <dd class="${valueClass}">${valueHtml}</dd>
  </div>`;
}

function normalizeProfileFields(profile) {
  if (Array.isArray(profile.fields) && profile.fields.length) {
    return profile.fields;
  }
  // Legacy flat profile shape
  const fields = [];
  if (profile.email) fields.push({ label: "Email", value: profile.email });
  if (profile.password) {
    fields.push({ label: "Password", value: profile.password, emphasize: true });
  }
  if (profile.passwordHash) {
    fields.push({ label: "Password hash", value: profile.passwordHash });
  }
  const hasLower = profile.username || profile.phone || profile.last4 || profile.address;
  if (fields.length && hasLower) fields.push({ type: "divider" });
  if (profile.username) fields.push({ label: "Username", value: profile.username });
  if (profile.phone) fields.push({ label: "Phone", value: profile.phone });
  if (profile.last4) fields.push({ label: "Last 4 digits", value: profile.last4 });
  if (profile.address) fields.push({ label: "Address", value: profile.address });
  return fields;
}

function renderProfilesPanel(panel) {
  const profiles = Array.isArray(panel.profiles) ? panel.profiles : [];
  const heading = panel.title?.trim()
    ? `<p class="layout-data-table__panel-title">${escapeHtml(panel.title)}</p>`
    : "";
  const cards = profiles
    .map((profile) => {
      const name = profile.name?.trim() || profile.username?.trim() || "Unknown";
      const fields = normalizeProfileFields(profile);
      return `<article class="breach-profile">
        <header class="breach-profile__head">
          <h3 class="breach-profile__name">${escapeHtml(name)}</h3>
        </header>
        <dl class="breach-profile__fields">
          ${fields.map((field) => renderProfileField(field)).join("")}
        </dl>
      </article>`;
    })
    .join("");
  return `<div class="layout-data-table__frame layout-data-table__frame--profiles">
    ${heading}
    <div class="breach-profile-list">${cards}</div>
  </div>`;
}

function renderDataPanel(panel) {
  if (!panel || typeof panel !== "object") return "";
  if (panel.type === "profiles") return renderProfilesPanel(panel);
  return renderCredentialPanel(panel);
}

function renderDataTable(content) {
  const el = document.createElement("div");
  const rowPadding = String(content.rowPadding ?? "").trim();
  const textSize = String(content.textSize ?? "").trim();
  const hugFirstCols = content.hugFirstCols !== false;
  const panels = Array.isArray(content.panels) ? content.panels : null;
  const splitColumns = content.splitColumns === true || Boolean(panels?.length);
  const columns = Array.isArray(content.columns)
    ? content.columns.map((c) => String(c ?? ""))
    : [];
  const rows = Array.isArray(content.rows) ? content.rows : [];
  const note = content.note?.trim() ?? "";
  const colCount = panels?.length
    ? panels.length
    : columns.length ||
      rows.reduce(
        (max, row) =>
          Math.max(max, Array.isArray(row) ? row.length : 0),
        0,
      );
  const showHeader =
    content.showHeader !== false &&
    columns.some((col) => String(col).trim());

  el.className = [
    "slide-content",
    "layout-data-table",
    rowPadding === "lg" ? "layout-data-table--row-lg" : "",
    textSize === "lg" ? "layout-data-table--text-lg" : "",
    !showHeader && !panels ? "layout-data-table--no-header" : "",
    splitColumns ? "layout-data-table--split" : "",
    panels ? "layout-data-table--panels" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const normalizedRows = rows.map((row) =>
    Array.isArray(row)
      ? row
      : columns.map((col) =>
          row && typeof row === "object" ? (row[col] ?? "") : "",
        ),
  );

  let tablesHtml = "";
  if (panels?.length) {
    tablesHtml = `<div class="layout-data-table__split" style="--layout-data-table-split-count:${panels.length}">
      ${panels.map((panel) => renderDataPanel(panel)).join("")}
    </div>`;
  } else if (splitColumns && colCount > 0) {
    tablesHtml = `<div class="layout-data-table__split" style="--layout-data-table-split-count:${colCount}">
      ${Array.from({ length: colCount }, (_, colIndex) => {
        const head =
          showHeader && columns[colIndex]
            ? `<thead><tr><th scope="col">${escapeHtml(columns[colIndex])}</th></tr></thead>`
            : "";
        const body = normalizedRows
          .map(
            (cells) =>
              `<tr>${renderDataTableCell(cells[colIndex] ?? "")}</tr>`,
          )
          .join("");
        return `<div class="layout-data-table__frame">
          <table class="layout-data-table__table">
            ${head}
            <tbody>${body}</tbody>
          </table>
        </div>`;
      }).join("")}
    </div>`;
  } else {
    const colClass = (i) =>
      hugFirstCols && i < 3 ? ' class="layout-data-table__hug"' : "";
    const head = showHeader
      ? `<thead><tr>${columns
          .map(
            (col, i) =>
              `<th scope="col"${colClass(i)}>${escapeHtml(col)}</th>`,
          )
          .join("")}</tr></thead>`
      : "";
    const body = normalizedRows
      .map(
        (cells) =>
          `<tr>${Array.from({ length: colCount }, (_, i) =>
            renderDataTableCell(cells[i] ?? "", {
              hug: hugFirstCols && i < 3,
            }),
          ).join("")}</tr>`,
      )
      .join("");
    tablesHtml = `<div class="layout-data-table__frame">
      <table class="layout-data-table__table">
        ${head}
        <tbody>${body}</tbody>
      </table>
    </div>`;
  }

  el.innerHTML = `
    ${cornerSection(content)}
    ${titleBlock(content)}
    ${tablesHtml}
    ${note ? `<p class="layout-data-table__note type-label">${escapeHtml(note)}</p>` : ""}
  `;
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
  "LY-25": renderCampaign,
  "LY-26": renderDataTable,
};

export function renderLayout(slide, layoutId, content = {}, opts = {}) {
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

  const wantFooter = opts.footer !== false && layout.footer;
  if (wantFooter) {
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
  // Guard across duplicate module instances (different ?v= query strings).
  if (focusInteractionsBound || globalThis.__caFocusInteractionsBound) return;
  focusInteractionsBound = true;
  globalThis.__caFocusInteractionsBound = true;

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
  if (flowOrbitInteractionsBound || globalThis.__caFlowOrbitInteractionsBound) return;
  flowOrbitInteractionsBound = true;
  globalThis.__caFlowOrbitInteractionsBound = true;

  const PHASE_SEL =
    ".flow-orbit:not(.flow-orbit--focus) .flow-phase--prep, .flow-orbit:not(.flow-orbit--focus) .flow-phase--collection, .flow-orbit:not(.flow-orbit--focus) .flow-phase--prep-collection, .flow-orbit:not(.flow-orbit--focus) .flow-phase--breach, .flow-orbit:not(.flow-orbit--focus) .flow-phase--post-breach, .flow-orbit:not(.flow-orbit--focus) .flow-phase--breach-post";

  const selectPhaseStroke = (phase) => {
    if (!phase || phase.closest(".flow-orbit--focus")) return;
    const orbit = phase.closest(".flow-orbit");
    if (!orbit || orbit.classList.contains("flow-orbit--reveal")) return;

    // First press on a later phase: permanently reveal its content
    if (phase.classList.contains("is-phase-blurred")) {
      phase.classList.remove("is-phase-blurred");
    }

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
