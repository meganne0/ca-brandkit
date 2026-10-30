/**
 * Freeform LinkedIn composer — stackable components, live preview, assets.
 */
import { mountSlideFooter } from "./components/footer.js?v=9";
import {
  MODAL_ACCENTS,
  withBreaks as modalWithBreaks,
} from "./modals.js?v=24";
import {
  renderLayout,
  refreshFlowFunnels,
  refreshImageTitleLayouts,
} from "./layouts.js?v=88";
import { toPng } from "../vendor/html-to-image.esm.js";
import { cropPngToOpaqueBounds } from "./youtube-download.js?v=8";

const LOGO_SRC = "/visual%20assets/logo/logo-horizontal-white-orange.svg";
const PIECE_SLIDE_W = 1920;
const PIECE_SLIDE_H = 1080;

export { MODAL_ACCENTS };

export const COMPOSER_COMPONENT_TYPES = [
  { type: "copy", label: "Text" },
  { type: "quote-panel", label: "Quote panel" },
  { type: "split-image", label: "Text + image" },
  { type: "split-modal", label: "Text + modal" },
  { type: "image", label: "Image" },
  { type: "cards-2x2", label: "2×2 cards" },
  { type: "columns-3", label: "3 columns" },
  { type: "metric", label: "Statistic" },
  { type: "person", label: "Avatar / person" },
];

/** Catalog pieces (not shown in the manual “Add” row). */
export const COMPOSER_ASSET_PIECE_TYPE = {
  type: "layout-piece",
  label: "Asset piece",
};

const DEFAULT_SPLIT_MODAL = {
  title: "Acme Holdings",
  subtitle: "Investment & Securities",
  body: "acme-holdings.example",
  windowTitle: "Attack Timeline",
  windowBody:
    "Ransomware Attack\nDate · 12 Aug 2025\nInitiated by · Qilin\n\nEmployee Compromise\nDate · 19 Aug 2025\nSource · Telegram\nCredential · reused password",
  accent: "brand",
};

let uidSeq = 0;
function uid(prefix = "c") {
  uidSeq += 1;
  return `${prefix}-${Date.now().toString(36)}-${uidSeq}`;
}

function withBreaks(text) {
  return String(text ?? "").replace(/\r\n|\r|\n/g, "<br>");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function defaultBgForFormat(formatId, backgrounds) {
  const match = Object.entries(backgrounds).find(
    ([, recipe]) => recipe.format === formatId,
  );
  return match?.[0] ?? Object.keys(backgrounds)[0] ?? "";
}

export function backgroundsForFormat(formatId, backgrounds, { all = false } = {}) {
  return Object.entries(backgrounds)
    .filter(([, recipe]) => all || !recipe.format || recipe.format === formatId)
    .map(([id, recipe]) => ({
      id,
      label: recipe.label || id,
      format: recipe.format || "",
      group: recipe.group || "",
    }));
}

/**
 * Clone a background recipe so it can fill any LinkedIn canvas.
 * Photo plates and cross-format / Dark Slide recipes use cover crop.
 */
export function adaptBackgroundRecipe(recipe, formatId) {
  if (!recipe) return recipe;
  const next = {
    ...recipe,
    overlays: (recipe.overlays ?? []).map((overlay) => ({ ...overlay })),
    dots: (recipe.dots ?? []).map((dot) => ({ ...dot })),
  };
  const base = typeof next.base === "string" ? next.base : "";
  const isPhotoPlate = /linkedin\//i.test(base) || /\.(png|jpe?g|webp)$/i.test(base);
  const formatMismatch = Boolean(next.format && formatId && next.format !== formatId);
  const isDarkSlide =
    next.group === "dark-slides" || next.channel === "slide";

  if (isPhotoPlate || formatMismatch || isDarkSlide) {
    next.baseSize = "cover";
    next.basePosition = next.basePosition || next.focus || "center";
  }
  return next;
}

/** Grouped options for the composer background select (all formats + Dark Slides). */
export function composerBackgroundGroups({
  linkedIn = {},
  darkSlides = {},
} = {}) {
  const stripFormat = (label) =>
    String(label || "").replace(/\s*[·•]\s*(square|landscape|portrait)\s*$/i, "");

  const byFormat = (formatId, groupLabel) => ({
    label: groupLabel,
    options: Object.entries(linkedIn)
      .filter(([, recipe]) => recipe.format === formatId)
      .map(([id, recipe]) => ({
        id,
        label: stripFormat(recipe.label) || id,
      })),
  });

  const dsOptions = Object.entries(darkSlides)
    .filter(([id, recipe]) => id.startsWith("DS-") && recipe.group === "dark-slides")
    .map(([id, recipe]) => ({
      id,
      label: recipe.label || id,
    }));

  return [
    byFormat("square", "LinkedIn · square styles"),
    byFormat("landscape", "LinkedIn · landscape styles"),
    byFormat("portrait", "LinkedIn · portrait plates"),
    { label: "Dark Slides", options: dsOptions },
  ].filter((group) => group.options.length > 0);
}

export function createComponent(type, seed = {}) {
  const id = seed.id || uid(type);
  switch (type) {
    case "copy":
      return {
        id,
        type,
        eyebrow: seed.eyebrow ?? "PreBreach Intelligence",
        title: seed.title ?? "See the compromise before the breach.",
        titleSize: seed.titleSize ?? seed.size ?? "lg",
        body:
          seed.body ??
          "Credentials are collected in the open, long before they show up on the dark web.",
        eyebrowEnd: seed.eyebrowEnd ?? "",
      };
    case "eyebrow":
      return { id, type, text: seed.text ?? "PreBreach Intelligence" };
    case "title":
      return {
        id,
        type,
        text: seed.text ?? "See the compromise before the breach.",
        size: seed.size ?? "lg",
      };
    case "body":
      return {
        id,
        type,
        text:
          seed.text ??
          "Credentials are collected in the open, long before they show up on the dark web.",
      };
    case "quote-panel":
      return {
        id,
        type,
        text:
          seed.text ??
          "Session theft turns MFA into a speed bump — not a barrier.",
        attribution: seed.attribution ?? "CyberArmor Threat Research",
        avatar: seed.avatar ?? "",
        speaker: seed.speaker ?? "",
      };
    case "image":
      return {
        id,
        type,
        src: seed.src ?? "",
        alt: seed.alt ?? "",
        fit: seed.fit ?? "cover",
      };
    case "split-image":
      return {
        id,
        type,
        eyebrow: seed.eyebrow ?? "PreBreach Intelligence",
        title: seed.title ?? "See the compromise before the breach.",
        body:
          seed.body ??
          "Credentials are collected in the open, long before they show up on the dark web.",
        imageSrc: seed.imageSrc ?? "",
        imageAlt: seed.imageAlt ?? "",
        imageFit: seed.imageFit ?? "cover",
        imagePosition: seed.imagePosition ?? "center",
        imageBorder: ["blue", "purple"].includes(seed.imageBorder)
          ? seed.imageBorder
          : "purple",
        imageSize: ["sm", "md", "lg"].includes(seed.imageSize)
          ? seed.imageSize
          : "md",
        mediaSide: seed.mediaSide ?? "right",
        stackOrder: seed.stackOrder ?? "media-below",
      };
    case "split-modal":
      return {
        id,
        type,
        eyebrow: seed.eyebrow ?? "PreBreach Intelligence",
        title: seed.title ?? "See the compromise before the breach.",
        body:
          seed.body ??
          "Credentials are collected in the open, long before they show up on the dark web.",
        mediaSide: seed.mediaSide ?? "right",
        stackOrder: seed.stackOrder ?? "media-below",
        modal: { ...DEFAULT_SPLIT_MODAL, ...(seed.modal || {}) },
      };
    case "cards-2x2":
      return {
        id,
        type,
        cards: seed.cards ?? [
          { label: "Attack", body: "Describe the attack." },
          { label: "Result", body: "Describe the result." },
          { label: "Method", body: "Describe the method." },
          { label: "Impact", body: "Describe the impact." },
        ],
      };
    case "columns-3":
      return {
        id,
        type,
        heading: seed.heading ?? "",
        columns: seed.columns ?? [
          { number: "01", title: "Monitor", body: "Get alerted when your data is found in an active campaign." },
          { number: "02", title: "Hunt", body: "Full data platform access for hunting and investigating." },
          { number: "03", title: "Features", body: "Monitoring vs full hunt and investigation." },
        ],
      };
    case "metric":
      return {
        id,
        type,
        value: seed.value ?? "30%",
        text: seed.text ?? "of attacks involved abuse of user identities as the initial entry point",
        source: seed.source ?? "IBM",
        sourceUrl: seed.sourceUrl ?? "",
      };
    case "person":
      return {
        id,
        type,
        name: seed.name ?? "Name",
        role: seed.role ?? "Role",
        avatar: seed.avatar ?? "",
      };
    case "layout-piece":
      return {
        id,
        type,
        label: seed.label ?? "Asset piece",
        pieceId: seed.pieceId ?? "",
        layout: seed.layout ?? "",
        content: seed.content ?? {},
        options: seed.options ?? {},
        bg: seed.bg ?? "",
        preview: seed.preview ?? "",
      };
    default:
      return { id, type: "body", text: "" };
  }
}

/** Apply catalog piece options after renderLayout (phases, static). */
export function applyPieceOptions(root, options = {}) {
  if (options.unlockPhases || options.highlightPhase) {
    root.querySelectorAll(".is-phase-blurred").forEach((el) => {
      el.classList.remove("is-phase-blurred");
    });
    root.querySelectorAll(".flow-phase.is-stroke-on").forEach((el) => {
      el.classList.remove("is-stroke-on");
    });
    if (options.highlightPhase) {
      const target = root.querySelector(
        `.flow-phase--${options.highlightPhase}`,
      );
      if (target) target.classList.add("is-stroke-on");
    }
  }
  if (options.static) {
    root.querySelectorAll('[role="button"]').forEach((el) => {
      el.removeAttribute("role");
      el.removeAttribute("tabindex");
      el.removeAttribute("aria-pressed");
      el.removeAttribute("aria-label");
    });
  }
}

function fitPieceSlide(stage, slide) {
  if (!stage || !slide) return;
  const width = stage.clientWidth || PIECE_SLIDE_W;
  const height = stage.clientHeight || width * (PIECE_SLIDE_H / PIECE_SLIDE_W);
  const scale = Math.min(width / PIECE_SLIDE_W, height / PIECE_SLIDE_H);
  slide.style.transform = `scale(${scale})`;
}

/**
 * Mount a catalog piece (LY-*) into a host element — used by composer + asset modal thumbs.
 */
export function mountLayoutPiece(host, {
  layout,
  content = {},
  options = {},
  bg = "",
  label = "",
  fit = true,
} = {}) {
  if (!host || !layout) return null;
  host.replaceChildren();
  host.classList.add("li-piece-mount");

  const stage = document.createElement("div");
  stage.className = "li-piece-mount__stage";
  if (options.noBackground) stage.classList.add("li-piece-mount__stage--plain");

  const slide = document.createElement("div");
  slide.className = "slide";
  if (options.noBackground) slide.classList.add("slide--plain");
  if (options.static) slide.classList.add("assets-piece--static");
  slide.dataset.layout = layout;
  if (label) slide.dataset.title = label;
  if (bg && !options.noBackground) slide.dataset.bg = bg;

  const layers = document.createElement("div");
  layers.className = "slide-layers";
  layers.setAttribute("aria-hidden", "true");
  slide.appendChild(layers);
  stage.appendChild(slide);
  host.appendChild(stage);

  if (bg && !options.noBackground) {
    // Background recipes are injected by the page when needed; default transparent.
  } else {
    layers.replaceChildren();
    layers.style.background = "transparent";
    slide.style.background = "transparent";
  }

  renderLayout(slide, layout, content, {
    footer: options.noFooter ? false : undefined,
  });
  refreshImageTitleLayouts(slide);
  refreshFlowFunnels(slide);
  applyPieceOptions(slide, options);

  if (fit) {
    const doFit = () => fitPieceSlide(stage, slide);
    requestAnimationFrame(doFit);
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(doFit);
      ro.observe(stage);
    }
  }
  return slide;
}

/**
 * Rasterize a catalog piece to a transparent PNG data URL for LinkedIn image embeds.
 */
export async function rasterizeLayoutPiece(piece, {
  width = PIECE_SLIDE_W,
  height = PIECE_SLIDE_H,
  pixelRatio = 1,
} = {}) {
  if (!piece?.layout) {
    throw new Error("Piece has no layout to rasterize");
  }

  const host = document.createElement("div");
  host.style.cssText = `
    position: fixed;
    left: -10000px;
    top: 0;
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;
    pointer-events: none;
    opacity: 1;
    z-index: -1;
  `;
  document.body.appendChild(host);

  try {
    const slide = mountLayoutPiece(host, {
      layout: piece.layout,
      content: piece.content || {},
      options: {
        ...(piece.options || {}),
        noBackground: true,
        noFooter: true,
        static: true,
      },
      bg: "",
      label: piece.label || "",
      fit: false,
    });
    if (!slide) throw new Error("Could not mount piece");

    const stage = host.querySelector(".li-piece-mount__stage");
    if (stage) {
      stage.style.width = `${width}px`;
      stage.style.height = `${height}px`;
      stage.style.aspectRatio = "auto";
    }
    slide.style.transform = "none";
    slide.style.width = `${width}px`;
    slide.style.height = `${height}px`;
    slide.style.position = "relative";
    slide.style.inset = "auto";
    slide.style.background = "transparent";

    refreshFlowFunnels(slide);
    slide.classList.add("assets-piece--static");
    // Force campaign wires/hub to painted final state before capture.
    slide.querySelectorAll(".campaign-wire").forEach((el) => {
      el.style.animation = "none";
      el.style.strokeDashoffset = "0";
    });
    slide.querySelectorAll(".campaign-hub").forEach((el) => {
      el.style.animation = "none";
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    const raw = await toPng(slide, {
      width,
      height,
      pixelRatio,
      cacheBust: true,
      skipAutoScale: true,
      backgroundColor: null,
      style: {
        transform: "none",
        transformOrigin: "top left",
        margin: "0",
        left: "0",
        top: "0",
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
        background: "transparent",
      },
    });
    // Tight crop — no empty transparent margin around the graphic.
    return cropPngToOpaqueBounds(raw, { padding: 4, alphaThreshold: 4 });
  } finally {
    host.remove();
  }
}

export function createComposerState({
  format = "square",
  backgrounds = {},
} = {}) {
  return {
    format,
    bg: defaultBgForFormat(format, backgrounds),
    decor: "",
    footer: true,
    logo: false,
    components: [createComponent("copy")],
  };
}

function accentClass(accent) {
  const id = MODAL_ACCENTS[accent] ? accent : "violet";
  const kind = MODAL_ACCENTS[id].kind;
  return kind === "grad"
    ? `ca-modal--grad ca-modal--stroke-${id}`
    : `ca-modal--${id}`;
}

function splitCopyMarkup(component) {
  return `
    <div class="li-composer-split__copy">
      ${component.eyebrow ? `<p class="type-label">${withBreaks(component.eyebrow)}</p>` : ""}
      ${component.title ? `<h2 class="type-h2 li-composer-block__title li-composer-block__title--md">${withBreaks(component.title)}</h2>` : ""}
      ${component.body ? `<p class="type-body">${withBreaks(component.body)}</p>` : ""}
    </div>
  `;
}

function splitImageMarkup(component) {
  const fit = component.imageFit === "contain" ? "contain" : "cover";
  const position = escapeHtml(component.imagePosition || "center");
  const border = component.imageBorder === "blue" ? "blue" : "purple";
  const size = ["sm", "md", "lg"].includes(component.imageSize)
    ? component.imageSize
    : "md";
  if (!component.imageSrc) {
    return `<div class="li-composer-split__media li-composer-split__media--empty">Add an image</div>`;
  }
  return `
    <div class="li-composer-split__media li-composer-split__media--${fit} li-composer-split__media--frame-${border} li-composer-split__media--size-${size}">
      <div class="li-composer-split__frame">
        <img
          class="li-composer-split__img"
          src="${escapeHtml(component.imageSrc)}"
          alt="${escapeHtml(component.imageAlt)}"
          style="object-fit:${fit};object-position:${position}"
        />
      </div>
    </div>
  `;
}

function splitModalMarkup(component) {
  const modal = component.modal || DEFAULT_SPLIT_MODAL;
  const title = modal.title?.trim();
  const subtitle = modal.subtitle?.trim();
  const body = modal.body?.trim();
  const windowTitle = modal.windowTitle?.trim();
  const windowBody = modal.windowBody?.trim();
  const hasWindow = windowTitle || windowBody;
  return `
    <div class="li-composer-split__media li-composer-split__media--modal">
      <article class="ca-modal ca-modal--embedded ${accentClass(modal.accent)}">
        <div class="ca-modal__header">
          ${title ? `<h2 class="ca-modal__title">${modalWithBreaks(title)}</h2>` : ""}
          ${subtitle ? `<p class="ca-modal__subtitle">${modalWithBreaks(subtitle)}</p>` : ""}
          ${body ? `<p class="ca-modal__body">${modalWithBreaks(body)}</p>` : ""}
        </div>
        ${
          hasWindow
            ? `<div class="ca-modal__window">
                ${windowTitle ? `<p class="ca-modal__window-title">${modalWithBreaks(windowTitle)}</p>` : ""}
                ${windowBody ? `<div class="ca-modal__window-body">${modalWithBreaks(windowBody)}</div>` : ""}
              </div>`
            : ""
        }
      </article>
    </div>
  `;
}

function splitUsesColumns(formatId) {
  return (
    formatId === "landscape" ||
    formatId === "presentation" ||
    formatId === "portrait" ||
    formatId === "letter"
  );
}

function splitIsPortraitFamily(formatId) {
  return formatId === "portrait" || formatId === "letter";
}

function renderSplit(component, formatId, mediaHtml) {
  const columns = splitUsesColumns(formatId);
  const mediaSide = component.mediaSide === "left" ? "left" : "right";
  const stackOrder =
    component.stackOrder === "media-above" ? "media-above" : "media-below";
  const preserveRatio =
    component.type === "split-image" && component.imageFit === "contain";
  const imageSize =
    component.type === "split-image" &&
    ["sm", "md", "lg"].includes(component.imageSize)
      ? component.imageSize
      : "";
  const classes = [
    "li-composer-split",
    columns ? "li-composer-split--columns" : "li-composer-split--stack",
    columns
      ? `li-composer-split--media-${mediaSide}`
      : `li-composer-split--${stackOrder}`,
    splitIsPortraitFamily(formatId) ? "li-composer-split--portrait" : "",
    preserveRatio ? "li-composer-split--preserve-ratio" : "",
    imageSize ? `li-composer-split--size-${imageSize}` : "",
  ].filter(Boolean);
  const copy = splitCopyMarkup(component);
  const ordered =
    (columns && mediaSide === "left") ||
    (!columns && stackOrder === "media-above")
      ? `${mediaHtml}${copy}`
      : `${copy}${mediaHtml}`;
  return `<div class="${classes.join(" ")}">${ordered}</div>`;
}

function renderComponent(component, formatId = "square") {
  const wrap = document.createElement("div");
  wrap.className = `li-composer-block li-composer-block--${component.type}`;
  wrap.dataset.componentId = component.id;

  if (component.type === "copy") {
    const size = ["sm", "md", "lg", "xl"].includes(component.titleSize)
      ? component.titleSize
      : "lg";
    wrap.innerHTML = `
      <div class="li-composer-copy">
        ${component.eyebrow ? `<p class="type-label">${withBreaks(component.eyebrow)}</p>` : ""}
        ${component.title ? `<h2 class="type-h2 li-composer-block__title li-composer-block__title--${size}">${withBreaks(component.title)}</h2>` : ""}
        ${component.body ? `<p class="type-body">${withBreaks(component.body)}</p>` : ""}
        ${component.eyebrowEnd ? `<p class="type-label li-composer-copy__eyebrow-end">${withBreaks(component.eyebrowEnd)}</p>` : ""}
      </div>
    `;
  } else if (component.type === "eyebrow") {
    wrap.innerHTML = `<p class="type-label">${withBreaks(component.text)}</p>`;
  } else if (component.type === "title") {
    const size = ["sm", "md", "lg", "xl"].includes(component.size)
      ? component.size
      : "lg";
    wrap.innerHTML = `<h2 class="type-h2 li-composer-block__title li-composer-block__title--${size}">${withBreaks(component.text)}</h2>`;
  } else if (component.type === "body") {
    wrap.innerHTML = `<p class="type-body">${withBreaks(component.text)}</p>`;
  } else if (component.type === "quote-panel") {
    const hasAvatar = Boolean(component.avatar);
    const panel = `
      <div class="li-layout-quote__panel">
        ${component.text ? `<p class="type-h3 li-layout-quote__text">${withBreaks(component.text)}</p>` : ""}
        ${
          component.attribution
            ? `<p class="type-label li-layout-quote__attr">${withBreaks(component.attribution)}</p>`
            : ""
        }
      </div>
    `;
    if (hasAvatar) {
      wrap.innerHTML = `
        <div class="li-layout-quote li-layout-quote--portrait li-composer-block__quote">
          <div class="li-layout-quote__shell">
            <img
              class="li-layout-quote__avatar"
              src="${escapeHtml(component.avatar)}"
              alt="${escapeHtml(component.speaker || "Speaker")}"
            />
            <span class="li-layout-quote__mark li-layout-quote__mark--open" aria-hidden="true">“</span>
            <span class="li-layout-quote__mark li-layout-quote__mark--close" aria-hidden="true">”</span>
            ${panel}
          </div>
        </div>
      `;
    } else {
      wrap.innerHTML = `
        <div class="li-layout-quote li-composer-block__quote">
          ${panel}
        </div>
      `;
    }
  } else if (component.type === "image") {
    if (component.src) {
      const fit = component.fit === "contain" ? "contain" : "cover";
      wrap.innerHTML = `<img class="li-composer-block__image${fit === "contain" ? " is-contain" : ""}" src="${escapeHtml(component.src)}" alt="${escapeHtml(component.alt)}" style="object-fit:${fit}" />`;
    } else {
      wrap.innerHTML = `<div class="li-composer-block__image-empty">Add an image</div>`;
    }
  } else if (component.type === "split-image") {
    wrap.innerHTML = renderSplit(component, formatId, splitImageMarkup(component));
  } else if (component.type === "split-modal") {
    wrap.innerHTML = renderSplit(component, formatId, splitModalMarkup(component));
  } else if (component.type === "cards-2x2") {
    const cards = (component.cards ?? []).slice(0, 4);
    wrap.innerHTML = `
      <div class="li-layout-cards__grid li-composer-block__cards">
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
  } else if (component.type === "columns-3") {
    const columns = (component.columns ?? []).slice(0, 3);
    wrap.innerHTML = `
      ${component.heading ? `<h2 class="type-h2 li-layout-columns__heading">${withBreaks(component.heading)}</h2>` : ""}
      <div class="li-layout-columns__grid">
        ${columns
          .map(
            (col) => `
              <article class="li-layout-columns__col">
                <p class="type-numeral type-numeral--xl li-layout-columns__num">${withBreaks(col.number ?? "")}</p>
                ${col.title ? `<h3 class="type-h5 li-layout-columns__title">${withBreaks(col.title)}</h3>` : ""}
                ${col.body ? `<p class="type-body li-layout-columns__body">${withBreaks(col.body)}</p>` : ""}
              </article>
            `,
          )
          .join("")}
      </div>
    `;
  } else if (component.type === "metric") {
    wrap.innerHTML = `
      <article class="li-composer-block__metric">
        <p class="type-metric li-composer-block__metric-value">${withBreaks(component.value)}</p>
        <p class="type-body">${withBreaks(component.text)}</p>
        ${component.source ? `<p class="type-label">${withBreaks(component.source)}</p>` : ""}
      </article>
    `;
  } else if (component.type === "person") {
    wrap.innerHTML = `
      <article class="li-composer-block__person">
        ${component.avatar ? `<img class="li-composer-block__avatar" src="${escapeHtml(component.avatar)}" alt="" />` : `<div class="li-composer-block__avatar li-composer-block__avatar--empty"></div>`}
        <div>
          <p class="type-h5">${withBreaks(component.name)}</p>
          <p class="type-label">${withBreaks(component.role)}</p>
        </div>
      </article>
    `;
  } else if (component.type === "layout-piece") {
    if (component.preview) {
      wrap.innerHTML = `<img class="li-composer-block__image li-composer-block__piece-image" src="${escapeHtml(component.preview)}" alt="${escapeHtml(component.label || "")}" />`;
    } else {
      const mount = document.createElement("div");
      mount.className = "li-composer-block__piece";
      wrap.appendChild(mount);
      mountLayoutPiece(mount, {
        layout: component.layout,
        content: component.content,
        options: component.options,
        bg: component.bg,
        label: component.label,
      });
    }
  }
  return wrap;
}

/**
 * Paint a freeform composer state onto a LinkedIn canvas element.
 */
export function paintComposerCanvas(canvas, state, {
  formats,
  renderBackground,
  renderDecor,
  includeBackground = true,
} = {}) {
  const format = formats[state.format] ?? formats.square;
  canvas.replaceChildren();
  canvas.className = `canvas ${format.className}`;
  const typeScale = (format.w || 1080) / 1080;
  canvas.style.setProperty("--li-scale", String(typeScale));
  canvas.style.setProperty("--canvas-w", String(format.w));
  canvas.style.setProperty("--canvas-h", String(format.h));
  if (state.footer) canvas.classList.add("canvas--with-footer", "slide--with-footer");
  else canvas.classList.remove("canvas--with-footer", "slide--with-footer");

  if (includeBackground) {
    const layers = document.createElement("div");
    layers.className = "slide-layers";
    layers.setAttribute("aria-hidden", "true");
    canvas.appendChild(layers);
    renderBackground?.(layers, state.bg);
  } else {
    canvas.style.background = "transparent";
  }

  if (state.decor && renderDecor) {
    // Decor inserts before .li-content; create a placeholder first
    const placeholder = document.createElement("div");
    placeholder.className = "li-content";
    canvas.appendChild(placeholder);
    renderDecor(canvas, state.decor);
    placeholder.remove();
  }

  const content = document.createElement("div");
  content.className = "li-content li-layout-composer";
  if (state.logo) content.classList.add("li-layout-composer--with-logo");
  (state.components ?? []).forEach((component) => {
    content.appendChild(renderComponent(component, state.format));
  });
  canvas.appendChild(content);

  if (state.logo) {
    const logo = document.createElement("img");
    logo.className = "li-composer-logo";
    logo.src = LOGO_SRC;
    logo.alt = "CyberArmor";
    canvas.appendChild(logo);
  }

  if (state.footer) mountSlideFooter(canvas);
}

export function moveComponent(components, id, dir) {
  const list = [...components];
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) return list;
  const next = index + dir;
  if (next < 0 || next >= list.length) return list;
  const [item] = list.splice(index, 1);
  list.splice(next, 0, item);
  return list;
}

export function removeComponent(components, id) {
  return components.filter((item) => item.id !== id);
}

export function updateComponent(components, id, patch) {
  return components.map((item) =>
    item.id === id ? { ...item, ...patch } : item,
  );
}

export function updateModalField(components, id, field, value) {
  return components.map((item) => {
    if (item.id !== id || item.type !== "split-modal") return item;
    return {
      ...item,
      modal: { ...(item.modal || DEFAULT_SPLIT_MODAL), [field]: value },
    };
  });
}

export function componentFromAsset(asset, kind) {
  if (kind === "person" || (asset.name && !asset.layout)) {
    return createComponent("person", {
      name: asset.name,
      role: asset.role,
      avatar: asset.avatar,
    });
  }
  if (kind === "metric" || (asset.value && !asset.layout)) {
    return createComponent("metric", {
      value: asset.value,
      text: asset.text,
      source: asset.source,
      sourceUrl: asset.sourceUrl,
    });
  }
  if (kind === "image" || (asset.src && !asset.layout)) {
    return createComponent("image", {
      src: asset.src,
      alt: asset.label || "",
    });
  }
  // Catalog pieces — prefer a raster preview image; otherwise live layout embed.
  if (asset.layout) {
    const preview = asset.preview || asset.thumb || "";
    if (preview) {
      return createComponent("image", {
        src: preview,
        alt: asset.label || asset.id || "Asset piece",
        fit: "contain",
      });
    }
    return createComponent("layout-piece", {
      label: asset.label || asset.id || "Asset piece",
      pieceId: asset.id || "",
      layout: asset.layout,
      content: asset.content || {},
      options: asset.options || {},
      bg: asset.bg || "",
      preview: "",
    });
  }
  return createComponent("body", { text: asset.label || asset.description || "" });
}
