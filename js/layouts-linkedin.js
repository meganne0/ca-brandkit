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
  "LI-LY-14": {
    label: "Three columns",
    description: "Title above three equal columns: number, orange title, body. Top-aligned. Landscape. Footer.",
    format: "landscape",
    footer: true,
    className: "li-layout-columns",
  },
  "LI-LY-15": {
    label: "Media · top",
    description: "Photo placeholder on top, headline + body below. Square. Footer.",
    format: "square",
    footer: true,
    className: "li-layout-media li-layout-media--top",
  },
  "LI-LY-16": {
    label: "Media · bottom",
    description: "Headline + body on top, photo placeholder below. Square. Footer.",
    format: "square",
    footer: true,
    className: "li-layout-media li-layout-media--bottom",
  },
  "LI-LY-17": {
    label: "Media · stacked insight",
    description: "Label + title + body above a photo placeholder. Square. Footer.",
    format: "square",
    footer: true,
    className: "li-layout-media li-layout-media--bottom",
  },
  "LI-LY-18": {
    label: "Four cards",
    description: "Label + title + subtitle above a 2×2 card grid. Square. Footer.",
    format: "square",
    footer: true,
    className: "li-layout-cards",
  },
  "LI-LY-19": {
    label: "Event",
    description: "Event logo, name, date, location, message, and 1–3 speakers. Square. Footer.",
    format: "square",
    footer: true,
    className: "li-layout-event",
  },
  "LI-LY-20": {
    label: "Event · landscape",
    description: "Event logo, name, date, location, message, and 1–3 speakers. Landscape. Footer.",
    format: "landscape",
    footer: true,
    className: "li-layout-event li-layout-event--landscape",
  },
};

function withBreaks(text) {
  return String(text ?? "").replace(/\r\n|\r|\n/g, "<br>");
}

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
    ${headline ? `<h2 class="type-h2">${withBreaks(accentHeadline(headline, accent))}</h2>` : ""}
    ${subtitle ? `<p class="type-h4">${withBreaks(subtitle)}</p>` : ""}
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
      ${quote ? `<p class="type-h3 li-layout-quote__text">${withBreaks(quote)}</p>` : ""}
      ${attribution ? `<p class="type-label li-layout-quote__attr">${withBreaks(attribution)}</p>` : ""}
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
      ${quote ? `<p class="type-h3 li-layout-quote__text">${withBreaks(quote)}</p>` : ""}
      ${attribution ? `<p class="type-label li-layout-quote__attr">${withBreaks(attribution)}</p>` : ""}
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
        ${quote ? `<p class="type-h3 li-layout-quote__text">${withBreaks(quote)}</p>` : ""}
        ${
          attribution
            ? `<p class="type-label li-layout-quote__attr">${withBreaks(attribution)}</p>`
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
    const fit = content.imageFit === "contain" ? "contain" : "cover";
    const hasAspect = fit === "contain" && content.imageAspect;
    const frameClass = hasAspect ? " li-layout-media__frame--contain" : "";
    const aspectStyle = hasAspect
      ? ` style="--li-media-aspect:${content.imageAspect}"`
      : "";
    const pos =
      fit === "cover"
        ? normalizeImagePosition(content.imagePosition)
        : "center";
    const posClass =
      fit === "cover" ? ` li-layout-media__img--pos-${pos}` : "";
    return `
      <div class="li-layout-media__media">
        <div class="li-layout-media__frame${frameClass}"${aspectStyle}>
          <img class="li-layout-media__img li-layout-media__img--${fit}${posClass}" src="${content.image}" alt="" />
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

const IMAGE_POSITIONS = new Set([
  "center",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "left-center",
  "right-center",
]);

function normalizeImagePosition(value) {
  if (value === "true-center") return "center";
  if (IMAGE_POSITIONS.has(value)) return value;
  return "center";
}

function renderMedia(content, side = "left") {
  const el = document.createElement("div");
  const natural =
    content.image && content.imageFit === "contain"
      ? " li-layout-media--natural"
      : "";
  el.className = `li-content li-layout-media li-layout-media--${side}${natural}`;
  const label = content.label ?? "";
  const title = content.title ?? content.headline ?? "";
  const body = content.body ?? content.subtitle ?? "";

  const copy = `
    <div class="li-layout-media__copy">
      ${label ? `<p class="type-label">${withBreaks(label)}</p>` : ""}
      ${title ? `<h2 class="type-h2">${withBreaks(title)}</h2>` : ""}
      ${body ? `<p class="type-body">${withBreaks(body)}</p>` : ""}
    </div>
  `;
  const media = mediaBlock(content);
  const mediaFirst = side === "left" || side === "top";

  el.innerHTML = mediaFirst ? `${media}${copy}` : `${copy}${media}`;
  return el;
}

function renderStat(content) {
  const el = document.createElement("div");
  el.className = "li-content li-layout-stat";
  const value = content.value ?? content.metric ?? "";
  const label = content.label ?? "";
  const context = content.context ?? content.subtitle ?? "";
  el.innerHTML = `
    ${label ? `<p class="type-label">${withBreaks(label)}</p>` : ""}
    ${value ? `<p class="type-metric">${withBreaks(value)}</p>` : ""}
    ${context ? `<p class="type-h4">${withBreaks(context)}</p>` : ""}
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
      ${title ? `<h2 class="type-h2">${withBreaks(title)}</h2>` : ""}
      ${body ? `<p class="type-body">${withBreaks(body)}</p>` : ""}
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
      ${headline ? `<h2 class="type-h2">${withBreaks(accentHeadline(headline, accent))}</h2>` : ""}
      ${subtitle ? `<p class="type-h4">${withBreaks(subtitle)}</p>` : ""}
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
      ${label ? `<p class="type-label">${withBreaks(label)}</p>` : ""}
      ${title ? `<h2 class="type-h2">${withBreaks(title)}</h2>` : ""}
    </div>
    <div class="li-layout-split__right">
      ${body ? `<p class="type-body">${withBreaks(body)}</p>` : ""}
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
      ${value ? `<p class="type-metric type-metric--lg">${withBreaks(value)}</p>` : ""}
      ${label ? `<p class="type-label">${withBreaks(label)}</p>` : ""}
    </div>
    <div class="li-layout-stat-strip__aside">
      ${context ? `<p class="type-h4">${withBreaks(context)}</p>` : ""}
    </div>
  `;
  return el;
}

function renderColumns(content) {
  const el = document.createElement("div");
  el.className = "li-content li-layout-columns";
  const heading = content.title ?? content.headline ?? "";
  const defaults = [
    { number: "1", title: "Collect", body: "Threat actors harvest credentials and session material at scale." },
    { number: "2", title: "Deliver", body: "Kits and lures move the payload into the victim’s environment." },
    { number: "3", title: "Exploit", body: "Stolen sessions bypass MFA and turn access into impact." },
  ];
  const columns = (content.columns ?? defaults).slice(0, 3);
  while (columns.length < 3) {
    const i = columns.length;
    columns.push({
      number: String(i + 1),
      title: defaults[i].title,
      body: defaults[i].body,
    });
  }

  const colsHtml = columns
    .map((col, index) => {
      const number = col.number ?? String(index + 1);
      const title = col.title ?? "";
      const body = col.body ?? "";
      return `
        <article class="li-layout-columns__col">
          <p class="type-numeral type-numeral--xl li-layout-columns__num">${number}</p>
          ${title ? `<h3 class="type-h5 li-layout-columns__title">${withBreaks(title)}</h3>` : ""}
          ${body ? `<p class="type-body li-layout-columns__body">${withBreaks(body)}</p>` : ""}
        </article>
      `;
    })
    .join("");

  el.innerHTML = `
    ${heading ? `<h2 class="type-h2 li-layout-columns__heading">${withBreaks(heading)}</h2>` : ""}
    <div class="li-layout-columns__grid">${colsHtml}</div>
  `;
  return el;
}

function renderFourCards(content) {
  const el = document.createElement("div");
  el.className = "li-content li-layout-cards";
  const label = content.label ?? "";
  const title = content.title ?? content.headline ?? "";
  const subtitle = content.subtitle ?? content.body ?? "";
  const cards = [
    {
      label: content.card1Label ?? "Attack",
      body: content.attack ?? content.card1 ?? content.cards?.attack ?? "",
    },
    {
      label: content.card2Label ?? "Result",
      body: content.result ?? content.card2 ?? content.cards?.result ?? "",
    },
    {
      label: content.card3Label ?? "Method",
      body: content.method ?? content.card3 ?? content.cards?.method ?? "",
    },
    {
      label: content.card4Label ?? "Financial Impact",
      body:
        content.financial ??
        content.financialImpact ??
        content.card4 ??
        content.cards?.financial ??
        "",
    },
  ];

  el.innerHTML = `
    <div class="li-layout-cards__copy">
      ${label ? `<p class="type-label">${withBreaks(label)}</p>` : ""}
      ${title ? `<h2 class="type-h2">${withBreaks(title)}</h2>` : ""}
      ${subtitle ? `<p class="type-h4">${withBreaks(subtitle)}</p>` : ""}
    </div>
    <div class="li-layout-cards__grid">
      ${cards
        .map(
          (card) => `
            <article class="li-layout-cards__card">
              ${card.label ? `<p class="type-label">${withBreaks(card.label)}</p>` : ""}
              ${card.body ? `<p class="type-body">${withBreaks(card.body)}</p>` : ""}
            </article>
          `,
        )
        .join("")}
    </div>
  `;
  return el;
}

function normalizeEventSpeakers(content) {
  const raw = Array.isArray(content.speakers) ? content.speakers : [];
  return raw
    .slice(0, 3)
    .map((s) => ({
      avatar: s?.avatar ?? "",
      name: (s?.name ?? "").trim(),
      title: (s?.title ?? s?.role ?? "").trim(),
    }))
    .filter((s) => s.name || s.avatar);
}

function renderEvent(content, { landscape = false } = {}) {
  const el = document.createElement("div");

  const eventLogo = (content.eventLogo ?? "").trim();
  const eventName = content.eventName ?? content.title ?? content.headline ?? "";
  const date = (content.date ?? "").trim();
  const location = (content.location ?? "").trim();
  const body = (content.body ?? content.subtitle ?? "").trim();
  const speakers = normalizeEventSpeakers(content);

  const metaParts = [date, location].filter(Boolean);
  const meta = metaParts.join(" · ");
  const hasMeta = Boolean(meta);
  const hasBody = Boolean(body);
  const room = !hasMeta && !hasBody ? "xl" : !hasMeta || !hasBody ? "lg" : "base";

  el.className = `li-content li-layout-event li-layout-event--room-${room}${
    landscape ? " li-layout-event--landscape" : ""
  }${speakers.length ? " li-layout-event--with-speakers" : ""}`;

  const speakersHtml = speakers.length
    ? `<div class="li-layout-event__speakers" data-count="${speakers.length}">
        ${speakers
          .map(
            (s) => `
              <div class="li-layout-event__speaker">
                ${
                  s.avatar
                    ? `<img class="li-layout-event__avatar" src="${s.avatar}" alt="${s.name || "Speaker"}" />`
                    : `<span class="li-layout-event__avatar li-layout-event__avatar--empty" aria-hidden="true"></span>`
                }
                <div class="li-layout-event__speaker-meta">
                  ${s.name ? `<p class="li-layout-event__speaker-name">${withBreaks(s.name)}</p>` : ""}
                  ${s.title ? `<p class="li-layout-event__speaker-title">${withBreaks(s.title)}</p>` : ""}
                </div>
              </div>
            `,
          )
          .join("")}
      </div>`
    : "";

  const hasCopy = Boolean(eventName || meta || body);

  el.innerHTML = `
    <div class="li-layout-event__edge" aria-hidden="true"></div>
    ${
      eventLogo
        ? `<div class="li-layout-event__logo-wrap">
            <img class="li-layout-event__logo" src="${eventLogo}" alt="" />
          </div>`
        : ""
    }
    ${
      hasCopy
        ? `<div class="li-layout-event__text-zone">
            <div class="li-layout-event__copy">
              ${eventName ? `<h2 class="type-h2 li-layout-event__name">${withBreaks(eventName)}</h2>` : ""}
              ${meta ? `<p class="type-label li-layout-event__meta">${withBreaks(meta)}</p>` : ""}
              ${body ? `<p class="type-body li-layout-event__body">${withBreaks(body)}</p>` : ""}
            </div>
          </div>`
        : `<div class="li-layout-event__text-zone li-layout-event__text-zone--empty" aria-hidden="true"></div>`
    }
    ${speakersHtml}
    <div class="li-layout-event__edge" aria-hidden="true"></div>
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
  "LI-LY-14": renderColumns,
  "LI-LY-15": (content) => renderMedia(content, "top"),
  "LI-LY-16": (content) => renderMedia(content, "bottom"),
  "LI-LY-17": (content) => renderMedia(content, "bottom"),
  "LI-LY-18": renderFourCards,
  "LI-LY-19": (content) => renderEvent(content, { landscape: false }),
  "LI-LY-20": (content) => renderEvent(content, { landscape: true }),
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
