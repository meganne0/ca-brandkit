/**
 * Fullscreen presentation mode for draft decks.
 * Same-page overlay with ← → / Space navigation (like preview, larger).
 * Also supports ?present=1 for a dedicated present URL.
 */

import { refreshImageTitleLayouts, refreshFlowFunnels } from "./layouts.js?v=75";

const AUTH_KEY = "ca-brandkit-auth-v3";

export function isPresentMode() {
  return new URLSearchParams(location.search).get("present") === "1";
}

/**
 * Open present URL in a new tab (no disk save / download).
 * Prefer startPresentMode() in-page for Present button.
 * @param {{ onBlocked?: () => void }} [opts]
 */
export function openPresentTab(opts = {}) {
  const url = new URL(location.href);
  url.search = "";
  url.searchParams.set("present", "1");

  const win = window.open(url.toString(), "_blank");
  if (!win) {
    opts.onBlocked?.();
    return null;
  }

  try {
    const auth = sessionStorage.getItem(AUTH_KEY);
    if (auth) win.sessionStorage.setItem(AUTH_KEY, auth);
  } catch {
    /* ignore */
  }

  return win;
}

/**
 * @param {object} opts
 * @param {HTMLElement[]} opts.slides
 * @param {(slide: HTMLElement) => void} opts.paintSlide
 * @param {(slide: HTMLElement, stage: HTMLElement) => void} opts.fitSlide
 * @param {(slide: HTMLElement) => void} [opts.playSlideReveal]
 * @param {number} [opts.startIndex]
 * @param {boolean} [opts.enterFullscreen]
 * @param {() => void} [opts.onExit]
 * @returns {() => void} dispose / exit
 */
export function startPresentMode({
  slides,
  paintSlide,
  fitSlide,
  playSlideReveal,
  startIndex = 0,
  enterFullscreen = false,
  onExit,
}) {
  document.body.classList.add("is-presenting");

  const root = document.createElement("div");
  root.className = "present-deck";
  root.innerHTML = `
    <div class="present-deck__stage" id="present-stage"></div>
    <div class="present-deck__chrome">
      <strong class="present-deck__label" id="present-label"></strong>
      <span class="present-deck__hint">← → · Space next · F fullscreen · Esc exit</span>
    </div>
  `;
  document.body.appendChild(root);

  const stage = root.querySelector("#present-stage");
  const labelEl = root.querySelector("#present-label");
  let index = Math.max(0, Math.min(slides.length - 1, startIndex));
  let live = null;
  let disposed = false;

  function refreshExtras(slide) {
    refreshImageTitleLayouts(slide);
    refreshFlowFunnels(slide);
  }

  function show(i) {
    if (!slides.length) return;
    index = Math.max(0, Math.min(slides.length - 1, i));
    const source = slides[index];
    labelEl.textContent = `${index + 1} / ${slides.length} · ${source.dataset.title || ""}`;

    const slide = document.createElement("section");
    slide.className = "slide";
    slide.dataset.title = source.dataset.title || "";
    slide.dataset.layout = source.dataset.layout || "";
    slide.dataset.bg = source.dataset.bg || "";
    slide.dataset.content = source.dataset.content || "{}";
    const layers = document.createElement("div");
    layers.className = "slide-layers";
    layers.setAttribute("aria-hidden", "true");
    slide.appendChild(layers);

    stage.replaceChildren(slide);
    live = slide;
    paintSlide(slide);
    fitSlide(slide, stage);
    refreshExtras(slide);
    playSlideReveal?.(slide);
  }

  function fitCurrent() {
    if (live) {
      fitSlide(live, stage);
      refreshExtras(live);
    }
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await (root.requestFullscreen?.() || document.documentElement.requestFullscreen());
      }
    } catch {
      /* browser may block FS */
    }
  }

  function exitPresent() {
    if (disposed) return;
    disposed = true;

    window.removeEventListener("resize", onResize);
    window.removeEventListener("keydown", onKeydown);
    root.removeEventListener("click", onClick);
    fitObserver?.disconnect();

    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }

    root.remove();
    document.body.classList.remove("is-presenting");

    if (isPresentMode()) {
      if (window.opener && !window.opener.closed) {
        window.close();
        return;
      }
      const url = new URL(location.href);
      url.searchParams.delete("present");
      location.href = url.toString();
      return;
    }

    onExit?.();
  }

  show(index);
  requestAnimationFrame(() => fitCurrent());

  if (enterFullscreen) {
    toggleFullscreen();
  }

  const onResize = () => fitCurrent();
  window.addEventListener("resize", onResize);
  const fitObserver = new ResizeObserver(onResize);
  fitObserver.observe(stage);

  const INTERACTIVE_SEL = [
    "a",
    "button",
    "input",
    "textarea",
    "select",
    "label",
    "[role='button']",
    "[data-focus-item]",
    "[data-blur-toggle]",
    "[data-flow-phase]",
    ".focus-chip",
    ".demo-url-item",
    ".flow-phase",
    ".flow-dot",
    ".flow-node",
    ".flow-step",
    ".bullet-list__item",
    ".metric-card__source",
    ".layout-image-title__chip",
  ].join(", ");

  function isInteractiveTarget(target) {
    return Boolean(target?.closest?.(INTERACTIVE_SEL));
  }

  const onClick = (event) => {
    if (event.target.closest(".present-deck__chrome")) return;
    // Keep slide interactions (blur reveal, phases, focus chips, links, etc.)
    if (isInteractiveTarget(event.target)) return;

    const mid = stage.getBoundingClientRect().left + stage.getBoundingClientRect().width / 2;
    if (event.clientX >= mid) {
      if (index < slides.length - 1) show(index + 1);
    } else if (index > 0) {
      show(index - 1);
    }
  };
  root.addEventListener("click", onClick);

  const onKeydown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      exitPresent();
      return;
    }
    if (event.key === "f" || event.key === "F") {
      event.preventDefault();
      toggleFullscreen();
      return;
    }
    // Don't steal Space/Enter from in-slide controls
    if (
      isInteractiveTarget(event.target) &&
      (event.key === " " || event.key === "Enter")
    ) {
      return;
    }
    if (event.key === "ArrowRight" || event.key === " " || event.key === "PageDown") {
      event.preventDefault();
      if (index < slides.length - 1) show(index + 1);
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      if (index > 0) show(index - 1);
    }
  };
  window.addEventListener("keydown", onKeydown);

  return exitPresent;
}
