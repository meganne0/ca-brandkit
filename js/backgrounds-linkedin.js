import {
  renderBackground as renderFromCatalogs,
  renderBackgroundRecipe,
} from "./backgrounds-core.js?v=3";
import { DARK_SLIDE_FILL } from "./backgrounds.js?v=58";

/**
 * LinkedIn formats (design px).
 * Square, landscape, and portrait (4:5).
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
  portrait: {
    id: "portrait",
    w: 1080,
    h: 1350,
    label: "Portrait post",
    className: "canvas--li-portrait",
  },
};

/** Same banner plate Dark Slides use as their base. */
const DARK_BANNER = "bg_swirl-banner.svg";

function darkBase(size, position) {
  return {
    fill: DARK_SLIDE_FILL,
    base: DARK_BANNER,
    baseOpacity: 1,
    baseSize: size,
    basePosition: position,
  };
}

/**
 * LinkedIn background recipes (LI-BG-01 …)
 * Square and landscape use the Dark Slide banner base on the Dec 7 fill.
 * Portrait uses the dedicated portrait plates.
 */
export const LINKEDIN_BACKGROUNDS = {
  "LI-BG-01": {
    label: "Warm ember · square",
    group: "square",
    channel: "linkedin",
    format: "square",
    focus: "center",
    ...darkBase("165%", "0% 0%"),
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
    ...darkBase("190%", "50% 0%"),
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
    ...darkBase("220%", "100% 0%"),
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
    ...darkBase("180%", "0% 40%"),
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
    ...darkBase("250%", "50% 35%"),
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
    ...darkBase("200%", "100% 45%"),
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
    ...darkBase("220%", "30% 20%"),
    overlays: [
      { asset: "bg_swirl-banner.svg", opacity: 0.88 },
      { asset: "bg_glow3.svg", opacity: 0.35 },
    ],
    dots: [
      { asset: "dots.svg", position: "tr", flip: true, width: "28%" },
      { asset: "dots.svg", position: "br", width: "24%" },
    ],
  },

  /* ── portrait (1080×1350) ── */
  "LI-BG-08": {
    label: "Halfsphere · portrait",
    group: "portrait",
    channel: "linkedin",
    format: "portrait",
    focus: "center",
    fill: DARK_SLIDE_FILL,
    base: "linkedin/portrait-halfsphere-3.png",
    baseOpacity: 1,
    baseSize: "cover",
    basePosition: "center",
  },

  "LI-BG-09": {
    label: "Zoomy · portrait",
    group: "portrait",
    channel: "linkedin",
    format: "portrait",
    focus: "center",
    fill: DARK_SLIDE_FILL,
    base: "linkedin/portrait-zoomy-3.png",
    baseOpacity: 1,
    baseSize: "cover",
    basePosition: "center",
  },

  "LI-BG-10": {
    label: "Wavy · portrait",
    group: "portrait",
    channel: "linkedin",
    format: "portrait",
    focus: "center",
    fill: DARK_SLIDE_FILL,
    base: "linkedin/portrait-wavy-2.png",
    baseOpacity: 1,
    baseSize: "cover",
    basePosition: "center",
  },

  "LI-BG-11": {
    label: "Spheres · portrait",
    group: "portrait",
    channel: "linkedin",
    format: "portrait",
    focus: "center",
    fill: DARK_SLIDE_FILL,
    base: "linkedin/portrait-spheres-2.png",
    baseOpacity: 1,
    baseSize: "cover",
    basePosition: "center",
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
