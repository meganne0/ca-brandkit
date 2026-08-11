/**
 * Modal compositor — glass panels for square LinkedIn-style or transparent PNG export.
 */

export const MODAL_FORMAT = { w: 1080, h: 1080 };

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

  // Split on [[…]] markers (non-greedy; no nested markers).
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
    exportMode: "square", // square | transparent
    bg: "LI-BG-01",
    modalCount: 2,
    modals: [
      {
        title: "Acme Holdings",
        subtitle: "Investment & Securities",
        body: "acme-holdings.example",
        windowTitle: "Attack Timeline",
        windowBody:
          "Ransomware Attack\nDate · 12 Aug 2025\nInitiated by · Qilin\n\nEmployee Compromise\nDate · 19 Aug 2025\nSource · Telegram\nCredential · reused password",
        accent: "violet",
      },
      {
        title: "Jane Smith",
        subtitle: "",
        body: "Date · Aug 19, 2025 11:53:28\nSource · Telegram",
        windowTitle: "Message Extracted",
        windowBody:
          "The Courier Guy Card\nCard number: [[4532 1199 8842 4242]]\nName on card: [[Jane Smith]]\nExpiry date: [[08/27]]\nCCV: [[847]]\nCard Issuer: Visa\nPhone number: [[+1 555 014 2891]]\nIP: [[203.0.113.42]]",
        accent: "blue",
      },
    ],
  };
}

function modalMarkup(modal, index) {
  const title = modal.title?.trim();
  const subtitle = modal.subtitle?.trim();
  const body = modal.body?.trim();
  const windowTitle = modal.windowTitle?.trim();
  const windowBody = modal.windowBody?.trim();
  const accent = modal.accent === "blue" ? "blue" : "violet";
  const role = index === 0 ? "back" : "front";

  const hasWindow = windowTitle || windowBody;

  return `
    <article class="ca-modal ca-modal--${role} ca-modal--${accent}">
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

/**
 * Paint modal composition into a square canvas element.
 * @param {HTMLElement} canvas
 * @param {ReturnType<typeof defaultModalState>} state
 * @param {{ renderBackground?: (layers: HTMLElement, bgId: string) => void }} [deps]
 */
export function paintModals(canvas, state, deps = {}) {
  const count = state.modalCount === 1 ? 1 : 2;
  const exportTransparent = state.exportMode === "transparent";

  canvas.className = `canvas canvas--li-square ca-modals-canvas${
    exportTransparent ? " ca-modals-canvas--transparent" : ""
  }`;
  canvas.style.width = `${MODAL_FORMAT.w}px`;
  canvas.style.height = `${MODAL_FORMAT.h}px`;
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

  const stage = document.createElement("div");
  stage.className = `ca-modals-stage ca-modals-stage--n${count}`;
  const list = state.modals.slice(0, count);
  stage.innerHTML = list.map((m, i) => modalMarkup(m, i)).join("");
  canvas.appendChild(stage);
}
