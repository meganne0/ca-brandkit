/**
 * Modal compositor — glass panels or overlapping images for
 * square / landscape / portrait export (background or transparent PNG).
 */

import { mountSlideFooter } from "./components/footer.js?v=9";

export const MODAL_FORMATS = {
  square: { id: "square", w: 1080, h: 1080, label: "Square", className: "canvas--li-square" },
  landscape: {
    id: "landscape",
    w: 1200,
    h: 627,
    label: "Landscape",
    className: "canvas--li-landscape",
  },
  portrait: {
    id: "portrait",
    w: 1080,
    h: 1350,
    label: "Portrait",
    className: "canvas--li-portrait",
  },
};

/** @deprecated use MODAL_FORMATS.square — kept for older imports */
export const MODAL_FORMAT = MODAL_FORMATS.square;

/** Solid + gradient stroke accents for modal borders. */
export const MODAL_ACCENTS = {
  violet: { label: "Violet", kind: "solid" },
  blue: { label: "Blue", kind: "solid" },
  brand: { label: "Brand gradient", kind: "grad" },
  ember: { label: "Ember gradient", kind: "grad" },
  aurora: { label: "Aurora gradient", kind: "grad" },
  cool: { label: "Cool gradient", kind: "grad" },
};

export const STORAGE_KEY = "ca-modals-editor-v1";

/**
 * Escape HTML, turn newlines into <br>, and wrap [[redacted]] spans.
 * Example: Card number: [[4532 1199 8842 4242]]
 */
export function withBreaks(text) {
  const escaped = String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const parts = escaped.split(/(\[\[[\s\S]*?\]\])/g);
  return parts
    .map((part) => {
      const match = part.match(/^\[\[([\s\S]*?)\]\]$/);
      if (match) {
        const inner = match[1].replace(/\r\n|\r|\n/g, "<br>");
        return `<span class="ca-modal__redact" aria-label="Redacted">${inner}</span>`;
      }
      return part.replace(/\r\n|\r|\n/g, "<br>");
    })
    .join("");
}

export function defaultModalState() {
  return {
    canvasFormat: "square", // square | landscape | portrait
    exportMode: "background", // background | transparent
    bg: "LI-BG-01",
    decor: "YT-DX-02",
    showFooter: true,
    contentMode: "modals", // modals | images
    modalCount: 2,
    imageCount: 2,
    images: [
      { src: "", fit: "cover", aspect: null },
      { src: "", fit: "cover", aspect: null },
    ],
    eyebrow: "EVENT",
    title: "Stop identity threats before the breach",
    subtitle: "Live demos and threat briefings with the CyberArmor team.",
    textPlacement: "above", // above | below | left | right
    modals: [
      {
        title: "Acme Holdings",
        subtitle: "Investment & Securities",
        body: "acme-holdings.example",
        windowTitle: "Attack Timeline",
        windowBody:
          "Ransomware Attack\nDate · 12 Aug 2025\nInitiated by · Qilin\n\nEmployee Compromise\nDate · 19 Aug 2025\nSource · Telegram\nCredential · reused password",
        accent: "brand",
      },
      {
        title: "Jane Smith",
        subtitle: "",
        body: "Date · Aug 19, 2025 11:53:28\nSource · Telegram",
        windowTitle: "Message Extracted",
        windowBody:
          "The Courier Guy Card\nCard number: [[4532 1199 8842 4242]]\nName on card: [[Jane Smith]]\nExpiry date: [[08/27]]\nCCV: [[847]]\nCard Issuer: Visa\nPhone number: [[+1 555 014 2891]]\nIP: [[203.0.113.42]]",
        accent: "aurora",
      },
    ],
  };
}

export function formatForState(state) {
  return MODAL_FORMATS[state.canvasFormat] ?? MODAL_FORMATS.square;
}

export function normalizeState(raw) {
  const base = defaultModalState();
  if (!raw || typeof raw !== "object") return base;

  const next = {
    ...base,
    ...raw,
    modals: Array.isArray(raw.modals)
      ? base.modals.map((m, i) => ({ ...m, ...(raw.modals[i] || {}) }))
      : base.modals,
    images: Array.isArray(raw.images)
      ? [0, 1].map((i) => {
          const img = raw.images[i] || {};
          const legacyFit = raw.imageFit === "contain" ? "contain" : "cover";
          const fit =
            img.fit === "contain"
              ? "contain"
              : img.fit === "cover"
                ? "cover"
                : legacyFit;
          return {
            src: typeof img.src === "string" ? img.src : "",
            fit,
            aspect:
              typeof img.aspect === "number" && img.aspect > 0
                ? img.aspect
                : null,
          };
        })
      : base.images,
  };

  // Migrate older exportMode values
  if (next.exportMode === "square") next.exportMode = "background";
  if (!["background", "transparent"].includes(next.exportMode)) {
    next.exportMode = "background";
  }
  if (!MODAL_FORMATS[next.canvasFormat]) next.canvasFormat = "square";
  if (!["modals", "images"].includes(next.contentMode)) next.contentMode = "modals";
  if (![1, 2].includes(Number(next.modalCount))) next.modalCount = 2;
  if (![1, 2].includes(Number(next.imageCount))) next.imageCount = 2;
  next.modalCount = Number(next.modalCount);
  next.imageCount = Number(next.imageCount);
  next.showFooter = Boolean(next.showFooter);

  if (next.canvasFormat === "square") {
    // square has no side text placement
    if (!["above", "below"].includes(next.textPlacement)) next.textPlacement = "above";
  } else if (next.canvasFormat === "portrait") {
    if (!["above", "below"].includes(next.textPlacement)) next.textPlacement = "above";
  } else if (!["left", "right"].includes(next.textPlacement)) {
    next.textPlacement = "left";
  }

  return next;
}

/** Persist editor settings (skip bulky data: URLs for images). */
export function serializeStateForStorage(state) {
  const copy = JSON.parse(JSON.stringify(state));
  if (Array.isArray(copy.images)) {
    copy.images = copy.images.map((img) => ({
      src:
        img?.src && !String(img.src).startsWith("data:")
          ? img.src
          : "",
      fit: img?.fit === "contain" ? "contain" : "cover",
      aspect:
        typeof img?.aspect === "number" && img.aspect > 0 ? img.aspect : null,
    }));
  }
  return copy;
}

export function loadStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeState(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveStoredState(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(serializeStateForStorage(state)),
    );
  } catch {
    /* quota / private mode */
  }
}

export function measureImageAspect(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        resolve(img.naturalWidth / img.naturalHeight);
      } else {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/** Measure aspect ratios for contain-mode images missing stored aspect. */
export async function ensureImageAspects(state) {
  if (!Array.isArray(state.images)) return false;
  let changed = false;
  await Promise.all(
    state.images.map(async (img) => {
      if (!img || img.fit !== "contain" || !img.src || img.aspect) return;
      const aspect = await measureImageAspect(img.src);
      if (aspect) {
        img.aspect = aspect;
        changed = true;
      }
    }),
  );
  return changed;
}

function accentClass(accent) {
  const id = MODAL_ACCENTS[accent] ? accent : "violet";
  const kind = MODAL_ACCENTS[id].kind;
  return kind === "grad"
    ? `ca-modal--grad ca-modal--stroke-${id}`
    : `ca-modal--${id}`;
}

function modalMarkup(modal, index) {
  const title = modal.title?.trim();
  const subtitle = modal.subtitle?.trim();
  const body = modal.body?.trim();
  const windowTitle = modal.windowTitle?.trim();
  const windowBody = modal.windowBody?.trim();
  const role = index === 0 ? "back" : "front";
  const hasWindow = windowTitle || windowBody;

  return `
    <article class="ca-modal ca-modal--${role} ${accentClass(modal.accent)}">
      <div class="ca-modal__header">
        ${title ? `<h2 class="ca-modal__title">${withBreaks(title)}</h2>` : ""}
        ${subtitle ? `<p class="ca-modal__subtitle">${withBreaks(subtitle)}</p>` : ""}
        ${body ? `<p class="ca-modal__body">${withBreaks(body)}</p>` : ""}
      </div>
      ${
        hasWindow
          ? `<div class="ca-modal__window">
              ${windowTitle ? `<p class="ca-modal__window-title">${withBreaks(windowTitle)}</p>` : ""}
              ${windowBody ? `<div class="ca-modal__window-body">${withBreaks(windowBody)}</div>` : ""}
            </div>`
          : ""
      }
    </article>
  `;
}

function textBlockMarkup(state) {
  if (state.canvasFormat === "square") return "";
  const eyebrow = state.eyebrow?.trim();
  const title = state.title?.trim();
  const subtitle = state.subtitle?.trim();
  if (!eyebrow && !title && !subtitle) return "";

  return `
    <div class="ca-modals-copy">
      ${eyebrow ? `<p class="type-label ca-modals-copy__eyebrow">${withBreaks(eyebrow)}</p>` : ""}
      ${title ? `<h2 class="type-h2 ca-modals-copy__title">${withBreaks(title)}</h2>` : ""}
      ${subtitle ? `<p class="type-h4 ca-modals-copy__subtitle">${withBreaks(subtitle)}</p>` : ""}
    </div>
  `;
}

function imageElement(img, role, extraClass = "") {
  const fitContain = img?.fit === "contain";
  const fitClass = fitContain
    ? "ca-modals-images__img--contain"
    : "ca-modals-images__img--cover";
  const aspect = fitContain && img?.aspect ? img.aspect : null;
  const ratioClass = aspect ? " ca-modals-images__img--ratio" : "";
  const aspectStyle = aspect ? ` style="--ca-modals-img-aspect:${aspect}"` : "";
  const extra = extraClass ? ` ${extraClass}` : "";
  const src = img?.src?.trim();
  if (src) {
    return `<img class="ca-modals-images__img ca-modals-images__img--${role} ${fitClass}${ratioClass}${extra}" src="${src}" alt=""${aspectStyle} />`;
  }
  return `<div class="ca-modals-images__img ca-modals-images__img--${role} ${fitClass}${ratioClass}${extra} ca-modals-images__img--empty" aria-hidden="true"${aspectStyle}></div>`;
}

function imagesMarkup(state) {
  const count = state.imageCount === 1 ? 1 : 2;
  const list = (state.images || []).slice(0, count);
  const useAxisLayout =
    state.canvasFormat === "landscape" || state.canvasFormat === "portrait";

  if (count === 2 && useAxisLayout) {
    return `
      <div class="ca-modals-images ca-modals-images--n2">
        ${list.map((img, i) => imageElement(img, i === 0 ? "back" : "front")).join("")}
      </div>
    `;
  }

  if (count === 2) {
    return `
      <div class="ca-modals-images ca-modals-images--n2">
        <div class="ca-modals-images__stack">
          ${list.map((img, i) => imageElement(img, i === 0 ? "back" : "front")).join("")}
        </div>
      </div>
    `;
  }

  return `
    <div class="ca-modals-images ca-modals-images--n${count}">
      ${imageElement(list[0], "back")}
    </div>
  `;
}

function visualMarkup(state) {
  if (state.contentMode === "images") return imagesMarkup(state);

  const count = state.modalCount === 1 ? 1 : 2;
  const list = state.modals.slice(0, count);
  return `
    <div class="ca-modals-stage ca-modals-stage--n${count}">
      ${list.map((m, i) => modalMarkup(m, i)).join("")}
    </div>
  `;
}

function placementClass(state) {
  if (state.canvasFormat === "square") return "ca-modals-compose--square";
  const place = state.textPlacement || "above";
  return `ca-modals-compose--${state.canvasFormat} ca-modals-compose--${place}`;
}

/**
 * Paint composition into a canvas element.
 * @param {HTMLElement} canvas
 * @param {ReturnType<typeof defaultModalState>} state
 * @param {{
 *   renderBackground?: (layers: HTMLElement, bgId: string) => void,
 *   renderDecor?: (canvas: HTMLElement, decorId: string) => void,
 * }} [deps]
 */
export function paintModals(canvas, state, deps = {}) {
  const format = formatForState(state);
  const exportTransparent = state.exportMode === "transparent";
  const withFooter = Boolean(state.showFooter) && !exportTransparent;

  canvas.className = [
    "canvas",
    format.className,
    "ca-modals-canvas",
    exportTransparent ? "ca-modals-canvas--transparent" : "",
    withFooter ? "canvas--with-footer slide--with-footer" : "",
  ]
    .filter(Boolean)
    .join(" ");
  canvas.style.width = `${format.w}px`;
  canvas.style.height = `${format.h}px`;
  canvas.replaceChildren();

  if (!exportTransparent && deps.renderBackground) {
    canvas.dataset.bg = state.bg;
    const layers = document.createElement("div");
    layers.className = "slide-layers";
    canvas.appendChild(layers);
    deps.renderBackground(layers, state.bg);
  } else {
    delete canvas.dataset.bg;
  }

  const compose = document.createElement("div");
  const copy = textBlockMarkup(state);
  const visual = visualMarkup(state);
  const hasCopy = Boolean(copy);
  compose.className = [
    "ca-modals-compose",
    placementClass(state),
    hasCopy ? "ca-modals-compose--has-copy" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (state.canvasFormat === "square" || !copy) {
    compose.innerHTML = `<div class="ca-modals-compose__visual">${visual}</div>`;
  } else if (
    state.textPlacement === "below" ||
    state.textPlacement === "right"
  ) {
    compose.innerHTML = `
      <div class="ca-modals-compose__visual">${visual}</div>
      ${copy}
    `;
  } else {
    compose.innerHTML = `
      ${copy}
      <div class="ca-modals-compose__visual">${visual}</div>
    `;
  }
  canvas.appendChild(compose);

  if (state.decor && deps.renderDecor) {
    deps.renderDecor(canvas, state.decor);
  } else {
    delete canvas.dataset.decor;
  }

  canvas.querySelector('[data-component="SlideFooter"]')?.remove();
  if (withFooter) {
    mountSlideFooter(canvas);
  } else {
    canvas.classList.remove("canvas--with-footer", "slide--with-footer");
  }
}
