import {
  renderBackground as renderFromCatalogs,
  renderBackgroundRecipe,
} from "./backgrounds-core.js";

/**
 * LinkedIn formats (design px).
 * Square first; landscape reserved for later recipes.
 */
export const LINKEDIN_FORMATS = {
  square: { id: "square", w: 1080, h: 1080, label: "Square post", className: "canvas--li-square" },
  landscape: {
    id: "landscape",
    w: 1200,
    h: 627,
    label: "Landscape / link preview",
    className: "canvas--li-landscape",
  },
};

/**
 * LinkedIn background recipes (LI-BG-01 …)
 * Same brand assets as slides; crop/focus tuned for square (and later landscape).
 */
export const LINKEDIN_BACKGROUNDS = {
  "LI-BG-01": {
    label: "Warm ember · square",
    group: "square",
    channel: "linkedin",
    format: "square",
    focus: "center",
    base: "base-nodot.png",
    overlays: [
      { asset: "orange-glow-1.svg", opacity: 0.8, blend: "screen" },
      { asset: "bg_glow3.svg", opacity: 0.45 },
    ],
    dots: [
      { asset: "dots.svg", position: "bl", width: "48%" },
      { asset: "dots.svg", position: "tr", flip: true, width: "42%" },
    ],
  },

  "LI-BG-02": {
    label: "Soft cool + ember · square",
    group: "square",
    channel: "linkedin",
    format: "square",
    focus: "center",
    base: "base-dot2.png",
    overlays: [
      { asset: "bg_glow1.svg", opacity: 0.65 },
      { asset: "orange-glow-2.svg", opacity: 0.42, blend: "screen" },
    ],
  },

  "LI-BG-03": {
    label: "Full glow field · square",
    group: "square",
    channel: "linkedin",
    format: "square",
    focus: "center top",
    base: "base-dot2.png",
    overlays: [
      { asset: "bg_dots1.svg", opacity: 0.75 },
      { asset: "bg_glow2.svg", opacity: 0.5 },
      { asset: "orange-glow-1.svg", opacity: 0.3, blend: "screen" },
    ],
  },

  "LI-BG-04": {
    label: "Orange rise + swirl · square",
    group: "square",
    channel: "linkedin",
    format: "square",
    focus: "center",
    base: "base-nodot.png",
    overlays: [
      { asset: "bg-swirl.svg", opacity: 0.85 },
      { asset: "orange-glow-2.svg", opacity: 0.7, blend: "screen" },
    ],
    dots: [{ asset: "dots.svg", position: "bl", width: "44%" }],
  },

  /* ── landscape (1200×627) ── */
  "LI-BG-05": {
    label: "Warm ember · landscape",
    group: "landscape",
    channel: "linkedin",
    format: "landscape",
    focus: "center",
    base: "base-nodot.png",
    overlays: [
      { asset: "orange-glow-1.svg", opacity: 0.75, blend: "screen" },
      { asset: "bg_glow3.svg", opacity: 0.4 },
    ],
    dots: [
      { asset: "dots.svg", position: "bl", width: "32%" },
      { asset: "dots.svg", position: "tr", flip: true, width: "28%" },
    ],
  },

  "LI-BG-06": {
    label: "Soft cool + ember · landscape",
    group: "landscape",
    channel: "linkedin",
    format: "landscape",
    focus: "center",
    base: "base-dot1.png",
    overlays: [
      { asset: "bg_glow1.svg", opacity: 0.6 },
      { asset: "orange-glow-2.svg", opacity: 0.4, blend: "screen" },
    ],
    dots: [
      { asset: "dots.svg", position: "tr", flip: true, width: "30%" },
      { asset: "dots.svg", position: "br", width: "26%" },
    ],
  },

  "LI-BG-07": {
    label: "Banner swirl · landscape",
    group: "landscape",
    channel: "linkedin",
    format: "landscape",
    focus: "right center",
    base: "base-dot2.png",
    overlays: [
      { asset: "bg_swirl-banner.svg", opacity: 0.88 },
      { asset: "bg_glow3.svg", opacity: 0.35 },
    ],
    dots: [
      { asset: "dots.svg", position: "tr", flip: true, width: "28%" },
      { asset: "dots.svg", position: "br", width: "24%" },
    ],
  },
};

export function renderLinkedInBackground(container, recipeId) {
  renderFromCatalogs(container, recipeId, LINKEDIN_BACKGROUNDS);
}

export function initLinkedInBackgrounds(root = document) {
  root.querySelectorAll("[data-bg^='LI-BG']").forEach((el) => {
    const layers = el.querySelector(".slide-layers");
    if (layers) renderLinkedInBackground(layers, el.dataset.bg);
  });
}

export { renderBackgroundRecipe };
