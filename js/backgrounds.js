import {
  renderBackground as renderFromCatalogs,
  renderBackgroundRecipe,
} from "./backgrounds-core.js";

/**
 * Background recipes (BG-01 … BG-12) — slide channel (16:9)
 * Grouped by base: nodot · dot1 · dot2
 * Fill overlays/bases: cover so W and H are ≥ slide size.
 * Swirl overlays: full slide width (100% auto).
 * dots.svg: positioned/contain — never fill.
 */
export const BACKGROUNDS = {
  /* ── base-nodot ── */
  "BG-01": {
    label: "Warm ember",
    group: "base-nodot",
    channel: "slide",
    base: "base-nodot.png",
    overlays: [
      { asset: "orange-glow-1.svg", opacity: 0.8, blend: "screen" },
      { asset: "bg_glow3.svg", opacity: 0.45 },
    ],
    dots: [
      { asset: "dots.svg", position: "bl" },
      { asset: "dots.svg", position: "tr", flip: true },
    ],
  },

  "BG-02": {
    label: "Cool depth",
    group: "base-nodot",
    channel: "slide",
    base: "base-nodot.png",
    overlays: [
      { asset: "bg_glow1.svg", opacity: 0.75 },
      { asset: "bg_glow4.svg", opacity: 0.4 },
    ],
    dots: [
      { asset: "dots.svg", position: "tl", width: "36%" },
      { asset: "dots.svg", position: "br", width: "36%" },
    ],
  },

  "BG-03": {
    label: "Orange rise + swirl",
    group: "base-nodot",
    channel: "slide",
    base: "base-nodot.png",
    overlays: [
      { asset: "bg-swirl.svg", opacity: 0.85 },
      { asset: "orange-glow-2.svg", opacity: 0.75, blend: "screen" },
      { asset: "orange-glow-1.svg", opacity: 0.55, blend: "screen" },
      { asset: "bg_glow3.svg", opacity: 0.5 },
      { asset: "bg_glow1.svg", opacity: 0.4 },
      { asset: "bg_glow4.svg", opacity: 0.35 },
    ],
    dots: [{ asset: "dots.svg", position: "bl", width: "38%" }],
  },

  "BG-04": {
    label: "Triple glow stack",
    group: "base-nodot",
    channel: "slide",
    base: "base-nodot.png",
    overlays: [
      { asset: "bg_glow4.svg", opacity: 0.5 },
      { asset: "orange-glow-1.svg", opacity: 0.42, blend: "screen" },
      { asset: "bg_glow3.svg", opacity: 0.35 },
    ],
    dots: [{ asset: "dots.svg", position: "bl", width: "34%" }],
  },

  /* ── base-dot1 ── */
  "BG-05": {
    label: "Cool + ember mix",
    group: "base-dot1",
    channel: "slide",
    base: "base-dot1.png",
    overlays: [
      { asset: "bg_glow4.svg", opacity: 0.6 },
      { asset: "orange-glow-1.svg", opacity: 0.45, blend: "screen" },
    ],
  },

  "BG-06": {
    label: "Swirl wash",
    group: "base-dot1",
    channel: "slide",
    base: "base-dot1.png",
    overlays: [
      { asset: "bg-swirl.svg", opacity: 0.9 },
      { asset: "bg_glow3.svg", opacity: 0.4 },
    ],
  },

  "BG-07": {
    label: "Warm floor",
    group: "base-dot1",
    channel: "slide",
    base: "base-dot1.png",
    overlays: [
      { asset: "orange-glow-2.svg", opacity: 0.72, blend: "screen" },
      { asset: "bg_glow1.svg", opacity: 0.4 },
    ],
  },

  "BG-08": {
    label: "Corner dual glow",
    group: "base-dot1",
    channel: "slide",
    base: "base-dot1.png",
    overlays: [
      { asset: "bg_glow2.svg", opacity: 0.7 },
      { asset: "orange-glow-1.svg", opacity: 0.35, blend: "screen" },
    ],
  },

  /* ── base-dot2 ── */
  "BG-09": {
    label: "Soft cool + ember",
    group: "base-dot2",
    channel: "slide",
    base: "base-dot2.png",
    overlays: [
      { asset: "bg_glow1.svg", opacity: 0.65 },
      { asset: "orange-glow-2.svg", opacity: 0.42, blend: "screen" },
    ],
  },

  "BG-10": {
    label: "Banner swirl",
    group: "base-dot2",
    channel: "slide",
    base: "base-dot2.png",
    overlays: [
      { asset: "bg_swirl-banner.svg", opacity: 0.88 },
      { asset: "bg_glow3.svg", opacity: 0.38 },
    ],
  },

  "BG-11": {
    label: "Dotglow wash",
    group: "base-dot2",
    channel: "slide",
    base: "base-dot2.png",
    overlays: [
      { asset: "bg_dotglow.svg", opacity: 0.7 },
      { asset: "orange-glow-2.svg", opacity: 0.4, blend: "screen" },
    ],
  },

  "BG-12": {
    label: "Full glow field",
    group: "base-dot2",
    channel: "slide",
    base: "base-dot2.png",
    overlays: [
      { asset: "bg_dots1.svg", opacity: 0.75 },
      { asset: "bg_glow2.svg", opacity: 0.5 },
      { asset: "orange-glow-1.svg", opacity: 0.3, blend: "screen" },
    ],
  },
};

export function renderBackground(container, recipeId) {
  renderFromCatalogs(container, recipeId, BACKGROUNDS);
}

export function initSlideBackgrounds(root = document) {
  root.querySelectorAll("[data-bg]").forEach((slide) => {
    const layers = slide.querySelector(".slide-layers");
    if (layers) renderBackground(layers, slide.dataset.bg);
  });
}

export { renderBackgroundRecipe };
