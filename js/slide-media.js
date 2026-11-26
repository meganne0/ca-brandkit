/**
 * Image slots on presentation slides: upload, saved screenshots, or a
 * hugging-screenshot modal. Shared by the slide and the edit panel.
 */

import { loadAssetsCatalog } from "./assets-catalog.js?v=6";
import { defaultModalState, withBreaks } from "./modals.js?v=26";

const SCREENSHOT_LABELS = [
  ["cra phish", "CRA phish · remote monitoring installer"],
  ["eviltokens", "Eviltokens · salary adjustment DocuSign"],
  ["acces token", "Access token · CyberArmor capture"],
  ["phaas-kali365", "Kali365 · Microsoft phish with PDF"],
  ["remotepc", "SSA phish · RemotePC"],
  ["expired, clean domains", "Expired domain purchase"],
  ["bitcoin", "Bitcoin payment for domains"],
  ["youtube channel", "YouTube · KMS activator"],
  ["pricing tiers", "Kali365 · pricing tiers"],
  ["report_2026", "Kali365 · report bait"],
  ["supported azure", "Kali365 · Azure login"],
  ["top of the page", "Kali365 · top of page"],
  ["license killer", "License Killer · KMS tool"],
];

let library = [];

function imageKey(src) {
  if (!src || String(src).startsWith("data:")) return String(src || "");
  let path = String(src).split("?")[0];
  try {
    path = decodeURIComponent(path);
  } catch {
    /* keep the encoded path */
  }
  return path.replace(/^(\.\.\/)+/, "").replace(/^\//, "").toLowerCase();
}

function screenshotLabel(image) {
  const file = imageKey(image.path || image.src || image.label || "");
  const hit = SCREENSHOT_LABELS.find(([needle]) => file.includes(needle));
  if (hit) return hit[1];
  const bare = file.split("/").pop()?.replace(/\.png$/i, "") || "Screenshot";
  return bare.length > 64 ? `${bare.slice(0, 62).trim()}…` : bare;
}

export const screenshotLibraryReady = loadAssetsCatalog()
  .then((catalog) => {
    library = (catalog.images || [])
      .filter((image) => image.group === "screenshots" && (image.src || image.path))
      .map((image) => ({
        src: image.src || image.path,
        label: screenshotLabel(image),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    return library;
  })
  .catch(() => {
    library = [];
    return library;
  });

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function slideMediaKind(record) {
  if (!record || typeof record !== "object") return "";
  if (record.kind === "modal" || record.mediaKind === "modal") return "modal";
  if (record.kind === "image" || record.mediaKind === "image") return "image";
  const src = record.src || record.image || "";
  if (src) return "image";
  if (record.modal) return "modal";
  return "";
}

export function mediaTriggerLabel(record) {
  const kind = slideMediaKind(record);
  if (kind === "modal") return "Hugging screenshot";
  if (kind === "image") {
    const src = record.src || record.image || "";
    return String(src).startsWith("data:") ? "Custom upload" : "Selected image";
  }
  return "Add image";
}

export const MODAL_SPACES = [
  ["hug", "Hug content"],
  ["520", "520px"],
  ["600", "600px"],
  ["680", "680px"],
  ["750", "750px"],
  ["800", "800px"],
  ["fill", "Fill available space"],
];

export const MODAL_BODY_SIZES = [
  ["sm", "Small — 16px", "16px"],
  ["md", "Medium — 24px", "24px"],
  ["lg", "Large — 32px", "32px"],
  ["xl", "Extra large — 40px", "40px"],
];

export function normalizeModalSpace(modal) {
  const raw = String(modal?.space || "");
  return MODAL_SPACES.some(([id]) => id === raw) ? raw : "hug";
}

export function normalizeModalBodySize(modal) {
  const raw = String(modal?.bodySize || "");
  return MODAL_BODY_SIZES.some(([id]) => id === raw) ? raw : "sm";
}

export function freshHugModal() {
  const hug = defaultModalState().hugModal;
  return {
    title: "Message Details",
    subtitle: "",
    body: "",
    windowTitle: "",
    windowBody: hug.windowBody || "",
    space: "hug",
    bodySize: "sm",
    width: "520",
  };
}

function clearButton() {
  return `<button type="button" class="slide-media__clear" aria-label="Remove image">
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9z"/>
    </svg>
  </button>`;
}

function modalMetrics(modal) {
  const space = normalizeModalSpace(modal);
  const bodySize = normalizeModalBodySize(modal);
  const widthPx = /^\d+$/.test(space) ? space : "520";
  const bodyPx = MODAL_BODY_SIZES.find(([id]) => id === bodySize)?.[2] || "16px";
  return { space, bodySize, widthPx, bodyPx };
}

function hugMarkup(modal = {}) {
  const data = { ...freshHugModal(), ...(modal || {}) };
  const { space, bodySize, widthPx, bodyPx } = modalMetrics(data);
  const field = (tag, name, className, text) => {
    if (!String(text ?? "").trim()) return "";
    return `<${tag} class="${className}" data-modal-field="${name}">${withBreaks(text)}</${tag}>`;
  };
  const title = field("h2", "title", "ca-modal__title", data.title);
  const subtitle = field("p", "subtitle", "ca-modal__subtitle", data.subtitle);
  const body = field("p", "body", "ca-modal__body", data.body);
  const windowTitle = field("p", "windowTitle", "ca-modal__window-title", data.windowTitle);
  const windowBody = field("div", "windowBody", "ca-modal__window-body", data.windowBody);
  const header = title || subtitle || body ? `<div class="ca-modal__header">${title}${subtitle}${body}</div>` : "";
  const window = windowTitle || windowBody ? `<div class="ca-modal__window">${windowTitle}${windowBody}</div>` : "";
  return `<div class="slide-media__modal">
    <article class="ca-modal ca-modal--hug ca-modal--violet ca-modal--plate" data-modal-space="${space}" data-modal-body-size="${bodySize}" style="--hug-panel-width:${widthPx}px;--modal-body-size:${bodyPx}">
      <span class="ca-modal__close" aria-hidden="true">×</span>
      ${header}
      ${window}
    </article>
  </div>`;
}

/**
 * HTML for one image / modal / empty hotspot.
 * `frameClass` is applied to the image itself (image-title sizing).
 * `className` is applied to the slot (shot-back, shot-front, shot-single).
 */
export function renderSlideMedia({ slot, index = null, className = "", frameClass = "", emptyClass = "", record = {} }) {
  const kind = slideMediaKind(record);
  const src = record.src || record.image || "";
  const alt = record.alt || "";
  const indexAttr = index == null ? "" : ` data-shot-index="${index}"`;
  const attrs = `data-media-slot="${esc(slot)}" data-media-kind="${kind}"${indexAttr}`;
  if (kind === "modal") {
    const { space, bodySize, widthPx, bodyPx } = modalMetrics(record.modal);
    return `<div class="slide-media slide-media--modal ${className}" ${attrs} data-modal-space="${space}" data-modal-body-size="${bodySize}" style="--hug-panel-width:${widthPx}px;--modal-body-size:${bodyPx}">${hugMarkup(record.modal)}${clearButton()}</div>`;
  }
  if (kind === "image" && src) {
    return `<div class="slide-media slide-media--image ${className}" ${attrs}>
      <img class="${frameClass} is-replaceable" src="${esc(src)}" alt="${esc(alt)}" />
      ${clearButton()}
    </div>`;
  }
  return `<div class="slide-media slide-media--empty ${className} ${emptyClass}" ${attrs}>
    <span class="slide-media__hotspot">Add image</span>
  </div>`;
}

export function readModalFrom(root) {
  const fields = {};
  root.querySelectorAll("[data-modal-field]").forEach((el) => {
    fields[el.dataset.modalField] = el.innerText.replace(/\u00a0/g, " ").replace(/\s+$/g, "").replace(/^\s+/g, "");
  });
  const plate = root.querySelector(".ca-modal") || root;
  const space = normalizeModalSpace({ space: plate.dataset.modalSpace });
  const bodySize = normalizeModalBodySize({ bodySize: plate.dataset.modalBodySize });
  return {
    title: fields.title || "",
    subtitle: fields.subtitle || "",
    body: fields.body || "",
    windowTitle: fields.windowTitle || "",
    windowBody: fields.windowBody || "",
    space,
    bodySize,
    width: /^\d+$/.test(space) ? space : "520",
  };
}

export function applyMediaChoice(content, target, choice) {
  const next = content;
  if (target.slot === "image") {
    if (!choice) {
      next.mediaKind = "";
      next.image = "";
      next.alt = "";
      next.modal = null;
      return next;
    }
    if (choice.kind === "modal") {
      next.mediaKind = "modal";
      next.image = "";
      next.alt = "";
      next.modal = choice.modal;
      return next;
    }
    next.mediaKind = "image";
    next.image = choice.src || "";
    next.alt = choice.alt || "";
    next.modal = null;
    return next;
  }

  const index = Number(target.index) || 0;
  const shots = Array.isArray(next.shots) ? next.shots.map((shot) => ({ ...shot })) : [];
  while (shots.length <= index) shots.push({ src: "", alt: "" });
  if (!choice) {
    shots[index] = { kind: "", src: "", alt: "" };
  } else if (choice.kind === "modal") {
    shots[index] = { kind: "modal", src: "", alt: "", modal: choice.modal };
  } else {
    shots[index] = {
      kind: "image",
      src: choice.src || "",
      alt: choice.alt || "",
      modal: null,
    };
  }
  next.shots = shots;
  return next;
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
      reader.onload = () => resolve({ src: String(reader.result || ""), alt: file.name || "" });
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
    input.addEventListener("cancel", () => {
      input.remove();
      resolve(null);
    });
    input.click();
  });
}

let menuEl = null;
let menuCleanups = [];

export function closeSlideMediaMenu() {
  menuCleanups.forEach((fn) => fn());
  menuCleanups = [];
  menuEl?.remove();
  menuEl = null;
}

function placeMenu(x, y) {
  if (!menuEl) return;
  const pad = 8;
  const rect = menuEl.getBoundingClientRect();
  const left = Math.min(x, window.innerWidth - rect.width - pad);
  const top = Math.min(y, window.innerHeight - rect.height - pad);
  menuEl.style.left = `${Math.max(pad, left)}px`;
  menuEl.style.top = `${Math.max(pad, top)}px`;
}

function showMainMenu(onChoose) {
  if (!menuEl) return;
  menuEl.innerHTML = `
    <button type="button" class="slide-media-menu__item" data-choice="upload">Upload an image</button>
    <button type="button" class="slide-media-menu__item" data-choice="library">Choose from my selection</button>
    <button type="button" class="slide-media-menu__item" data-choice="modal">Add a modal</button>
  `;
  menuEl.querySelector('[data-choice="upload"]').onclick = async () => {
    closeSlideMediaMenu();
    const file = await pickImageFile();
    if (!file?.src) return;
    onChoose({ kind: "image", src: file.src, alt: file.alt });
  };
  menuEl.querySelector('[data-choice="library"]').onclick = () => showLibrary(onChoose);
  menuEl.querySelector('[data-choice="modal"]').onclick = () => {
    closeSlideMediaMenu();
    onChoose({ kind: "modal", modal: freshHugModal() });
  };
}

function showLibrary(onChoose) {
  if (!menuEl) return;
  const items = library
    .map(
      (image) =>
        `<button type="button" class="slide-media-menu__item" data-src="${esc(image.src)}">${esc(image.label)}</button>`,
    )
    .join("");
  menuEl.innerHTML = `
    <button type="button" class="slide-media-menu__item slide-media-menu__back" data-choice="back">Back</button>
    <div class="slide-media-menu__list">
      ${items || `<p class="slide-media-menu__empty">No saved screenshots yet.</p>`}
    </div>
  `;
  menuEl.querySelector('[data-choice="back"]').onclick = () => showMainMenu(onChoose);
  menuEl.querySelectorAll("[data-src]").forEach((button) => {
    button.onclick = () => {
      const src = button.dataset.src || "";
      const alt = button.textContent.trim();
      closeSlideMediaMenu();
      onChoose({ kind: "image", src, alt });
    };
  });
  placeMenu(
    Number.parseFloat(menuEl.style.left) || 8,
    Number.parseFloat(menuEl.style.top) || 8,
  );
}

/**
 * @param {{ x?: number, y?: number, anchor?: HTMLElement, onChoose: (choice: object) => void }} opts
 */
export function openSlideMediaMenu({ x, y, anchor, onChoose }) {
  closeSlideMediaMenu();
  const rect = anchor?.getBoundingClientRect();
  const left = x ?? rect?.left ?? 16;
  const top = y ?? (rect ? rect.bottom + 6 : 16);
  menuEl = document.createElement("div");
  menuEl.className = "slide-media-menu";
  menuEl.setAttribute("role", "menu");
  menuEl.style.left = `${left}px`;
  menuEl.style.top = `${top}px`;
  document.body.appendChild(menuEl);
  showMainMenu(onChoose);
  placeMenu(left, top);

  const onPointer = (event) => {
    if (menuEl && !menuEl.contains(event.target)) closeSlideMediaMenu();
  };
  const onKey = (event) => {
    if (event.key === "Escape") closeSlideMediaMenu();
  };
  setTimeout(() => {
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
  }, 0);
  menuCleanups.push(() => document.removeEventListener("pointerdown", onPointer));
  menuCleanups.push(() => document.removeEventListener("keydown", onKey));
}
