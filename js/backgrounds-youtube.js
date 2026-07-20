import {
  renderBackground as renderFromCatalogs,
  renderBackgroundRecipe,
} from "./backgrounds-core.js";

/**
 * YouTube thumbnail format (design px) — 1280×720.
 */
export const YOUTUBE_FORMATS = {
  thumbnail: {
    id: "thumbnail",
    w: 1280,
    h: 720,
    label: "YouTube thumbnail",
    className: "canvas--yt",
  },
};

/**
 * YouTube background recipes (YT-BG-01 …)
 * Tuned for 16:9 thumbnail crop; punchier glows for small-size readability.
 * Pair with optional YT-DX decor layers (see decor-youtube.js).
 */
export const YOUTUBE_BACKGROUNDS = {
  "YT-BG-01": {
    label: "Warm ember",
    group: "thumbnail",
    channel: "youtube",
    format: "thumbnail",
    focus: "center",
    base: "base-nodot.png",
    overlays: [
      { asset: "orange-glow-1.svg", opacity: 0.95, blend: "screen" },
      { asset: "orange-glow-2.svg", opacity: 0.55, blend: "screen" },
      { asset: "bg_glow3.svg", opacity: 0.55 },
      { asset: "bg_glow4.svg", opacity: 0.4 },
    ],
    dots: [
      { asset: "dots.svg", position: "bl", width: "36%" },
      { asset: "dots.svg", position: "tr", flip: true, width: "30%" },
    ],
  },

  "YT-BG-02": {
    label: "Orange rise + swirl",
    group: "thumbnail",
    channel: "youtube",
    format: "thumbnail",
    focus: "center",
    base: "base-nodot.png",
    overlays: [
      { asset: "bg-swirl.svg", opacity: 0.9 },
      { asset: "orange-glow-2.svg", opacity: 0.78, blend: "screen" },
      { asset: "orange-glow-1.svg", opacity: 0.45, blend: "screen" },
      { asset: "bg_glow3.svg", opacity: 0.4 },
    ],
    dots: [{ asset: "dots.svg", position: "bl", width: "34%" }],
  },

  "YT-BG-03": {
    label: "Cool depth + ember",
    group: "thumbnail",
    channel: "youtube",
    format: "thumbnail",
    focus: "center",
    base: "base-dot1.png",
    overlays: [
      { asset: "bg_glow1.svg", opacity: 0.7 },
      { asset: "orange-glow-2.svg", opacity: 0.5, blend: "screen" },
      { asset: "bg_glow4.svg", opacity: 0.4 },
    ],
  },

  "YT-BG-04": {
    label: "Full glow field",
    group: "thumbnail",
    channel: "youtube",
    format: "thumbnail",
    focus: "center top",
    base: "base-dot2.png",
    overlays: [
      { asset: "bg_dots1.svg", opacity: 0.7 },
      { asset: "bg_glow2.svg", opacity: 0.55 },
      { asset: "orange-glow-1.svg", opacity: 0.4, blend: "screen" },
    ],
  },
};

export function renderYouTubeBackground(container, recipeId) {
  renderFromCatalogs(container, recipeId, YOUTUBE_BACKGROUNDS);
}

export function initYouTubeBackgrounds(root = document) {
  root.querySelectorAll("[data-bg^='YT-BG']").forEach((el) => {
    const layers = el.querySelector(".slide-layers");
    if (layers) renderYouTubeBackground(layers, el.dataset.bg);
  });
}

export { renderBackgroundRecipe };
