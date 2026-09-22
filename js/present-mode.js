/**
 * Full-tab presentation mode for draft decks.
 * Open with ?present=1 after saving slides to localStorage.
 */

import { refreshImageTitleLayouts, refreshFlowFunnels } from "./layouts.js?v=71";

const AUTH_KEY = "ca-brandkit-auth-v3";

export function isPresentMode() {
  return new URLSearchParams(location.search).get("present") === "1";
}

/**
 * Save auth into a new tab, then navigate to present URL.
 * @param {{ save?: () => void, onBlocked?: () => void }} [opts]
 */
export function openPresentTab(opts = {}) {
  opts.save?.();

  const url = new URL(location.href);
  url.search = "";
  url.searchParams.set("present", "1");

  const win = window.open("about:blank", "_blank");
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

  win.location.href = url.toString();
  return win;
}

/**
 * @param {object} opts
 * @param {HTMLElement[]} opts.slides
 * @param {(slide: HTMLElement) => void} opts.paintSlide
 * @param {(slide: HTMLElement, stage: HTMLElement) => void} opts.fitSlide
 * @param {(slide: HTMLElement) => void} [opts.playSlideReveal]
 * @param {number} [opts.startIndex]
 */
export function startPresentMode({
  slides,
  paintSlide,
  fitSlide,
  playSlideReveal,
  startIndex = 0,
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

  function exitPresent() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    if (window.opener && !window.opener.closed) {
      window.close();
      return;
    }
    const url = new URL(location.href);
    url.searchParams.delete("present");
    location.href = url.toString();
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      /* browser may require gesture / block FS */
    }
  }

  show(index);
  requestAnimationFrame(() => fitCurrent());

  let triedFs = false;
  const ensureFullscreen = () => {
    if (triedFs || document.fullscreenElement) return;
    triedFs = true;
    toggleFullscreen();
  };

  const onResize = () => fitCurrent();
  window.addEventListener("resize", onResize);
  new ResizeObserver(onResize).observe(stage);

  root.addEventListener("click", (event) => {
    ensureFullscreen();
    if (event.target.closest(".present-deck__chrome")) return;
    const mid = stage.getBoundingClientRect().left + stage.getBoundingClientRect().width / 2;
    if (event.clientX >= mid) {
      if (index < slides.length - 1) show(index + 1);
    } else if (index > 0) {
      show(index - 1);
    }
  });

  window.addEventListener("keydown", (event) => {
    ensureFullscreen();
    if (event.key === "Escape") {
      event.preventDefault();
      exitPresent();
      return;
    }
    if (event.key === "f" || event.key === "F") {
      event.preventDefault();
      triedFs = true;
      toggleFullscreen();
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
  });
}
