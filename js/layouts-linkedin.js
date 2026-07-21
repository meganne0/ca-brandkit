/**
 * LinkedIn layout recipes (LI-LY-01 …)
 * Independent of LI-BG — pair with data-layout + data-bg.
 * Same type role classes as slides; sizes come from type-linkedin.css.
 * format: "square" (1080×1080) | "landscape" (1200×627)
 * footer: same SlideFooter as LY kits (except LI-LY-01 + LI-LY-04)
 */

import { mountSlideFooter } from "./components/footer.js?v=9";

const LOGO_SRC = "/visual%20assets/logo/logo-horizontal-white-orange.svg";
const LOGO_MARK_SRC = "/visual%20assets/logo/logo-vertical-white-orange.svg";
const DEFAULT_SPEAKER_AVATAR =
  "/visual%20assets/avatars/avatar-nguyen-circle.png";

export const LINKEDIN_LAYOUTS = {
  "LI-LY-01": {
    label: "Hook",
    description: "Brand mark + bold headline + short supporting line. Square. No footer.",
    format: "square",
    footer: false,
    className: "li-layout-hook",
  },
  "LI-LY-02": {
    label: "Quote",
    description: "Gradient-stroke quote panel with attribution. Square. Footer.",
    format: "square",
    footer: true,
    className: "li-layout-quote",
  },
  "LI-LY-03": {
    label: "Stat",
    description: "Large metric + label + one-line context. Square. Footer.",
    format: "square",
    footer: true,
    className: "li-layout-stat",
  },
  "LI-LY-04": {
    label: "CTA",
    description: "Headline + body + logo + pill CTA. Square. No footer.",
    format: "square",
    footer: false,
    className: "li-layout-cta",
  },
  "LI-LY-05": {
    label: "Banner hook",
    description: "Headline + subtitle across a wide frame. Landscape. Footer.",
    format: "landscape",
    footer: true,
    className: "li-layout-banner",
  },
  "LI-LY-06": {
    label: "Split insight",
    description: "Headline left, supporting body right. Landscape. Footer.",
    format: "landscape",
    footer: true,
    className: "li-layout-split",
  },
  "LI-LY-07": {
    label: "Stat strip",
    description: "Metric + label on the left, context on the right. Landscape. Footer.",
    format: "landscape",
    footer: true,
    className: "li-layout-stat-strip",
  },
  "LI-LY-08": {
    label: "Media · left",
    description: "Image placeholder left, headline + body right. Landscape. Footer.",
    format: "landscape",
    footer: true,
    className: "li-layout-media li-layout-media--left",
  },
  "LI-LY-09": {
    label: "Media · right",
    description: "Headline + body left, image placeholder right. Landscape. Footer.",
    format: "landscape",
    footer: true,
    className: "li-layout-media li-layout-media--right",
  },
  "LI-LY-10": {
    label: "Media · left insight",
    description: "Image placeholder left, label + title + body right. Landscape. Footer.",
    format: "landscape",
    footer: true,
    className: "li-layout-media li-layout-media--left",
  },
  "LI-LY-11": {
    label: "Quote · landscape",
    description: "Wide rectangular quote panel with attribution. Landscape. Footer.",
    format: "landscape",
    footer: true,
    className: "li-layout-quote li-layout-quote--landscape",
  },
  "LI-LY-12": {
    label: "Quote · portrait",
    description: "Quote panel with speaker photo + orange outline marks. Square. Footer.",
    format: "square",
    footer: true,
    className: "li-layout-quote li-layout-quote--portrait",
  },
  "LI-LY-13": {
    label: "Quote · landscape portrait",
    description: "Landscape quote with speaker photo + orange outline marks. Footer.",
    format: "landscape",
    footer: true,
    className: "li-layout-quote li-layout-quote--landscape li-layout-quote--portrait",
  },
};

function accentHeadline(text, accent) {
  if (!accent || !text.includes(accent)) return text;
  return text.replace(accent, `<span class="accent">${accent}</span>`);
}

function renderHook(content) {
  const el = document.createElement("div");
  el.className = "li-content li-layout-hook";
  const headline = content.headline ?? content.title ?? "";
  const accent = content.accent ?? "";
  const subtitle = content.subtitle ?? "";
  el.innerHTML = `
    <img class="li-layout-hook__brand" src="${LOGO_SRC}" alt="CyberArmor" />
    ${headline ? `<h2 class="type-h2">${accentHeadline(headline, accent)}</h2>` : ""}
    ${subtitle ? `<p class="type-h4">${subtitle}</p>` : ""}
  `;
  return el;
}

function renderQuote(content) {
  const el = document.createElement("div");
  el.className = "li-content li-layout-quote";
  const quote = content.quote ?? content.text ?? "";
  const attribution = content.attribution ?? content.source ?? "";
  el.innerHTML = `
    <div class="li-layout-quote__panel">
      ${quote ? `<p class="type-h3 li-layout-quote__text">${quote}</p>` : ""}
      ${attribution ? `<p class="type-label li-layout-quote__attr">${attribution}</p>` : ""}
    </div>
  `;
  return el;
}

function renderQuoteLandscape(content) {
  const el = document.createElement("div");
  el.className = "li-content li-layout-quote li-layout-quote--landscape";
  const quote = content.quote ?? content.text ?? "";
  const attribution = content.attribution ?? content.source ?? "";
  el.innerHTML = `
    <div class="li-layout-quote__panel">
      ${quote ? `<p class="type-h3 li-layout-quote__text">${quote}</p>` : ""}
      ${attribution ? `<p class="type-label li-layout-quote__attr">${attribution}</p>` : ""}
    </div>
  `;
  return el;
}

function renderQuotePortrait(content, { landscape = false } = {}) {
  const el = document.createElement("div");
  el.className = `li-content li-layout-quote li-layout-quote--portrait${
    landscape ? " li-layout-quote--landscape" : ""
  }`;
  const quote = content.quote ?? content.text ?? "";
  const attribution = content.attribution ?? content.source ?? "";
  const avatar = content.avatar ?? DEFAULT_SPEAKER_AVATAR;
  const speaker = content.speaker ?? content.name ?? "";
  el.innerHTML = `
    <div class="li-layout-quote__shell">
      <img
        class="li-layout-quote__avatar"
        src="${avatar}"
        alt="${speaker || "Speaker"}"
      />
      <span class="li-layout-quote__mark li-layout-quote__mark--open" aria-hidden="true">“</span>
      <span class="li-layout-quote__mark li-layout-quote__mark--close" aria-hidden="true">”</span>
      <div class="li-layout-quote__panel">
        ${quote ? `<p class="type-h3 li-layout-quote__text">${quote}</p>` : ""}
        ${
          attribution
            ? `<p class="type-label li-layout-quote__attr">${attribution}</p>`
            : ""
        }
      </div>
    </div>
  `;
  return el;
}

function mediaBlock(content) {
  const placeholder = content.placeholder ?? "Image";
  if (content.image) {
    return `
      <div class="li-layout-media__media">
        <div class="li-layout-media__frame">
          <img class="li-layout-media__img" src="${content.image}" alt="" />
        </div>
      </div>
    `;
  }
  return `
    <div class="li-layout-media__media" aria-hidden="true">
      <div class="li-layout-media__frame">
        <span class="li-layout-media__hint">${placeholder}</span>
      </div>
    </div>
  `;
}

function renderMedia(content, side = "left") {
  const el = document.createElement("div");
  el.className = `li-content li-layout-media li-layout-media--${side}`;
  const label = content.label ?? "";
  const title = content.title ?? content.headline ?? "";
  const body = content.body ?? content.subtitle ?? "";

  const copy = `
    <div class="li-layout-media__copy">
      ${label ? `<p class="type-label">${label}</p>` : ""}
      ${title ? `<h2 class="type-h2">${title}</h2>` : ""}
      ${body ? `<p class="type-body">${body}</p>` : ""}
    </div>
  `;
  const media = mediaBlock(content);

  el.innerHTML = side === "right" ? `${copy}${media}` : `${media}${copy}`;
  return el;
}

function renderStat(content) {
  const el = document.createElement("div");
  el.className = "li-content li-layout-stat";
  const value = content.value ?? content.metric ?? "";
  const label = content.label ?? "";
  const context = content.context ?? content.subtitle ?? "";
  el.innerHTML = `
    ${label ? `<p class="type-label">${label}</p>` : ""}
    ${value ? `<p class="type-metric">${value}</p>` : ""}
    ${context ? `<p class="type-h4">${context}</p>` : ""}
  `;
  return el;
}

function renderCta(content) {
  const el = document.createElement("div");
  el.className = "li-content li-layout-cta";
  const title = content.title ?? content.headline ?? "";
  const body = content.body ?? content.subtitle ?? "";
  const cta = content.cta ?? "Learn more";
  el.innerHTML = `
    <img class="li-layout-cta__logo" src="${LOGO_MARK_SRC}" alt="CyberArmor" />
    <div class="li-layout-cta__copy">
      ${title ? `<h2 class="type-h2">${title}</h2>` : ""}
      ${body ? `<p class="type-body">${body}</p>` : ""}
      <span class="li-layout-cta__pill">${cta}</span>
    </div>
  `;
  return el;
}

function renderBanner(content) {
  const el = document.createElement("div");
  el.className = "li-content li-layout-banner";
  const headline = content.headline ?? content.title ?? "";
  const accent = content.accent ?? "";
  const subtitle = content.subtitle ?? "";
  el.innerHTML = `
    <div class="li-layout-banner__copy">
      ${headline ? `<h2 class="type-h2">${accentHeadline(headline, accent)}</h2>` : ""}
      ${subtitle ? `<p class="type-h4">${subtitle}</p>` : ""}
    </div>
  `;
  return el;
}

function renderSplit(content) {
  const el = document.createElement("div");
  el.className = "li-content li-layout-split";
  const title = content.title ?? content.headline ?? "";
  const body = content.body ?? content.subtitle ?? "";
  const label = content.label ?? "";
  el.innerHTML = `
    <div class="li-layout-split__left">
      ${label ? `<p class="type-label">${label}</p>` : ""}
      ${title ? `<h2 class="type-h2">${title}</h2>` : ""}
    </div>
    <div class="li-layout-split__right">
      ${body ? `<p class="type-body">${body}</p>` : ""}
    </div>
  `;
  return el;
}

function renderStatStrip(content) {
  const el = document.createElement("div");
  el.className = "li-content li-layout-stat-strip";
  const value = content.value ?? content.metric ?? "";
  const label = content.label ?? "";
  const context = content.context ?? content.subtitle ?? "";
  el.innerHTML = `
    <div class="li-layout-stat-strip__metric">
      ${value ? `<p class="type-metric type-metric--lg">${value}</p>` : ""}
      ${label ? `<p class="type-label">${label}</p>` : ""}
    </div>
    <div class="li-layout-stat-strip__aside">
      ${context ? `<p class="type-h4">${context}</p>` : ""}
    </div>
  `;
  return el;
}

const RENDERERS = {
  "LI-LY-01": renderHook,
  "LI-LY-02": renderQuote,
  "LI-LY-03": renderStat,
  "LI-LY-04": renderCta,
  "LI-LY-05": renderBanner,
  "LI-LY-06": renderSplit,
  "LI-LY-07": renderStatStrip,
  "LI-LY-08": (content) => renderMedia(content, "left"),
  "LI-LY-09": (content) => renderMedia(content, "right"),
  "LI-LY-10": (content) => renderMedia(content, "left"),
  "LI-LY-11": renderQuoteLandscape,
  "LI-LY-12": (content) => renderQuotePortrait(content, { landscape: false }),
  "LI-LY-13": (content) => renderQuotePortrait(content, { landscape: true }),
};

export function renderLinkedInLayout(canvas, layoutId, content = {}) {
  const layout = LINKEDIN_LAYOUTS[layoutId];
  const renderer = RENDERERS[layoutId];
  if (!layout || !renderer) {
    console.warn(`Unknown LinkedIn layout: ${layoutId}`);
    return;
  }

  canvas.querySelectorAll(".li-content").forEach((n) => n.remove());
  canvas.querySelector('[data-component="SlideFooter"]')?.remove();
  canvas.classList.remove("canvas--with-footer", "slide--with-footer");

  canvas.appendChild(renderer(content));

  if (layout.footer) {
    // slide--with-footer unlocks shared footer padding hooks
    canvas.classList.add("canvas--with-footer", "slide--with-footer");
    mountSlideFooter(canvas);
  }
}

export function initLinkedInLayouts(root = document) {
  root.querySelectorAll("[data-layout^='LI-LY']").forEach((el) => {
    let content = {};
    try {
      content = JSON.parse(el.dataset.content || "{}");
    } catch {
      content = {};
    }
    renderLinkedInLayout(el, el.dataset.layout, content);
  });
}
