import {
  renderBackground as renderFromCatalogs,
  renderBackgroundRecipe,
} from "./backgrounds-core.js?v=3";

/**
 * Background recipes (BG-01 … BG-12) — slide channel (16:9)
 * Grouped by base: nodot · dot1 · dot2
 * Dark Slides use the Dec 7 fill. DS-02 is DS-01. DS-07, DS-08, and DS-12 are DS-10.
 * Their base is bg_swirl-banner.svg, zoomed to a different crop on each recipe.
 * Banner base is 100%, except DS-03 which stays at 50%.
 * DS-05, DS-09, and DS-11 stack a second copy of that crop at 15%.
 * Dark Slides swap bg_glow1/3/4 for the Dec 7 glow PNGs and drop orange-glow-1/2, bg_dotglow.svg, and bg_dots1.svg. Glow 2 stays.
 * Fill overlays/bases: cover so W and H are ≥ slide size.
 * Swirl overlays: full slide width (100% auto).
 * dots.svg: positioned/contain — never fill.
 */
const SLIDE_BACKGROUNDS = {
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

/** Dec 7 base fill. Dark Slides paint this behind the banner base. */
export const DARK_SLIDE_FILL = "linear-gradient(145deg, #290039 0%, #050018 50%, #040937 100%)";

/** Glow PNGs imported for Dec 7. */
const DARK_GLOW_NAVY = { asset: "dec7/glow-navy.png", opacity: 0.4 };
const DARK_GLOW_PURPLE = { asset: "dec7/glow-purple.png", opacity: 0.5 };

const BANNER_BASE = "bg_swirl-banner.svg";
/** A second copy of the same crop. CSS opacity cannot exceed 100%. */
const BANNER_BOOST = new Set(["BG-05", "BG-09", "BG-11"]);

/** Each Dark Slide zooms to a different part of the banner. */
const BANNER_CROPS = [
  { baseSize: "165%", basePosition: "0% 0%" },
  { baseSize: "190%", basePosition: "50% 0%" },
  { baseSize: "220%", basePosition: "100% 0%" },
  { baseSize: "180%", basePosition: "0% 40%" },
  { baseSize: "250%", basePosition: "50% 35%" },
  { baseSize: "200%", basePosition: "100% 45%" },
  { baseSize: "200%", basePosition: "15% 70%" },
  { baseSize: "175%", basePosition: "50% 70%" },
  { baseSize: "210%", basePosition: "100% 80%" },
  { baseSize: "220%", basePosition: "30% 20%" },
  { baseSize: "200%", basePosition: "80% 70%" },
  { baseSize: "200%", basePosition: "10% 75%" },
];

function darkSlideOverlays(overlays = []) {
  const next = [];
  let usedNavy = false;
  let usedPurple = false;
  overlays.forEach((overlay) => {
    if (overlay.asset === "bg_glow1.svg" || overlay.asset === "bg_glow4.svg") {
      if (!usedNavy) {
        next.push({ ...DARK_GLOW_NAVY });
        usedNavy = true;
      }
      return;
    }
    if (overlay.asset === "bg_glow3.svg") {
      if (!usedPurple) {
        next.push({ ...DARK_GLOW_PURPLE });
        usedPurple = true;
      }
      return;
    }
    if (
      overlay.asset === "orange-glow-1.svg" ||
      overlay.asset === "orange-glow-2.svg" ||
      overlay.asset === "bg_dotglow.svg" ||
      overlay.asset === "bg_dots1.svg" ||
      overlay.asset === "bg_swirl-banner.svg"
    ) {
      return;
    }
    next.push({ ...overlay });
  });
  return next;
}

function darkSlideRecipe(id, recipe) {
  const overlays = darkSlideOverlays(recipe.overlays);
  const index = Number(id.replace(/^BG-/, "")) - 1;
  const crop = BANNER_CROPS[index] ?? BANNER_CROPS[0];
  if (BANNER_BOOST.has(id)) {
    overlays.push({
      asset: BANNER_BASE,
      opacity: 0.15,
      size: crop.baseSize,
      position: crop.basePosition,
    });
  }
  return {
    label: recipe.label,
    group: "dark-slides",
    channel: "slide",
    basedOn: id,
    fill: DARK_SLIDE_FILL,
    base: BANNER_BASE,
    baseOpacity: id === "BG-03" ? 0.5 : 1,
    baseSize: crop.baseSize,
    basePosition: crop.basePosition,
    overlays,
    dots: recipe.dots?.map((dot) => ({ ...dot })),
  };
}

const DARK_SLIDE_ALIAS = {
  "DS-02": "DS-01",
  "DS-07": "DS-10",
  "DS-08": "DS-10",
  "DS-12": "DS-10",
};

export const BACKGROUNDS = {
  ...SLIDE_BACKGROUNDS,
  ...Object.fromEntries(
    Object.entries(SLIDE_BACKGROUNDS)
      .map(([id, recipe]) => [
        `DS-${id.replace(/^BG-/, "")}`,
        darkSlideRecipe(id, recipe),
      ])
      .filter(([id]) => !DARK_SLIDE_ALIAS[id])
  ),
};

export function renderBackground(container, recipeId) {
  renderFromCatalogs(container, DARK_SLIDE_ALIAS[recipeId] || recipeId, BACKGROUNDS);
}

export function initSlideBackgrounds(root = document) {
  root.querySelectorAll("[data-bg]").forEach((slide) => {
    const layers = slide.querySelector(".slide-layers");
    if (layers) renderBackground(layers, slide.dataset.bg);
  });
}

export { renderBackgroundRecipe };
