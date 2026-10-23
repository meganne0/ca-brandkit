/**
 * Unique component layers used by the slide, LinkedIn, and YouTube recipes.
 * File details (hex, blur) are read from the SVG when a layer is opened.
 */

const KIND_ORDER = ["Bases", "Swirls", "Glows", "Dots"];

/** Color under the plates. Dec 7 paints this in CSS; it is not an image file. */
export const BASE_FILL = {
  asset: "#290039 → #050018 → #040937",
  kind: "Base fill",
  summary: "Dark Slides · Dec 7",
  gradient: "linear-gradient(145deg, #290039 0%, #050018 50%, #040937 100%)",
  path: "js/backgrounds.js · DARK_SLIDE_FILL",
  sizing: "Full canvas, behind the PNG plate. Opacity is 1.",
  note: "Dark Slides paint this fill behind a cropped bg_swirl-banner.svg at 100%, except DS-03 which stays at 50%. DS-05, DS-09, and DS-11 add a second copy of that same crop at 15%. DS-02 uses DS-01. DS-07, DS-08, and DS-12 use DS-10. The middle stop is #050018. Other decks use the canvas color --ca-purple-deep, #0a061a, in the same place.",
  stops: [
    { offset: "0%", hex: "#290039", opacity: "100%" },
    { offset: "50%", hex: "#050018", opacity: "100%" },
    { offset: "100%", hex: "#040937", opacity: "100%" },
  ],
  uses: [
    {
      id: "Dec 7",
      label: "Every slide",
      channel: "slide",
      opacity: 1,
      blend: null,
      placement: "behind the plate",
    },
  ],
};

const CHANNEL_LABEL = {
  slide: "Slide",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export function layerAssetUrl(asset) {
  return `/visual%20assets/background_assets/${encodeURIComponent(asset).replace(/%2F/g, "/")}`;
}

/**
 * Dark field at the center of each plate. Glows and swirls are painted on top of this.
 * The plate is a PNG, so this is a sampled color, not a flat fill written in the file.
 */
export const BASE_FIELD = {
  "base-nodot.png": { hex: "#180A39", cluster: "#180840" },
  "base-dot1.png": { hex: "#170633", cluster: "#180038" },
  "base-dot2.png": { hex: "#0D082A", cluster: "#080028" },
};

function kindFor(asset, slot) {
  if (slot === "base") return "Bases";
  if (/swirl/i.test(asset)) return "Swirls";
  if (/glow/i.test(asset)) return "Glows";
  if (/dot/i.test(asset)) return "Dots";
  return "Other";
}

function sizingFor(kind) {
  if (kind === "Bases") {
    return "Cover. The plate fills the canvas in every recipe.";
  }
  if (kind === "Swirls") {
    return "Full width. Height follows the artwork (100% auto).";
  }
  if (kind === "Dots") {
    return "Contained, never stretched to fill. CSS opacity is 0.95. Position and width are set on each recipe.";
  }
  return "Cover. Opacity and blend are set on each recipe, not inside the file.";
}

function placementFor(kind, extra) {
  if (kind === "Swirls") return "full width";
  if (kind === "Dots") return extra || "contain";
  return "cover";
}

/**
 * @param {{ channel: string, catalog: Record<string, object> }[]} groups
 */
export function buildLayerCatalog(groups, { includeBaseFill = false } = {}) {
  const layers = new Map();

  function touch(asset, kind) {
    if (!layers.has(asset)) {
      layers.set(asset, {
        asset,
        kind,
        sizing: sizingFor(kind),
        uses: [],
      });
    }
    return layers.get(asset);
  }

  groups.forEach((group) => {
    Object.entries(group.catalog).forEach(([id, recipe]) => {
      const channel = recipe.channel || group.channel;
      if (recipe.base) {
        touch(recipe.base, "Bases").uses.push({
          id,
          label: recipe.label,
          channel,
          opacity: recipe.baseOpacity ?? 1,
          blend: null,
          placement: recipe.baseSize
            ? `${recipe.baseSize} · ${recipe.basePosition || "center"}`
            : "cover",
          base: recipe.base,
        });
      }
      (recipe.overlays ?? []).forEach((overlay) => {
        const kind = kindFor(overlay.asset, "overlay");
        touch(overlay.asset, kind).uses.push({
          id,
          label: recipe.label,
          channel,
          opacity: overlay.opacity ?? 1,
          blend: overlay.blend || null,
          placement: placementFor(kind),
          base: recipe.base,
        });
      });
      (recipe.dots ?? []).forEach((dot) => {
        const kind = kindFor(dot.asset, "dots");
        const bits = [
          dot.position,
          dot.width ? `width ${dot.width}` : null,
          dot.flip ? "flipped" : null,
        ].filter(Boolean);
        touch(dot.asset, kind).uses.push({
          id,
          label: recipe.label,
          channel,
          opacity: null,
          blend: null,
          placement: bits.join(" · "),
          base: recipe.base,
        });
      });
    });
  });

  const sections = KIND_ORDER.map((kind) => ({
    kind,
    layers: [...layers.values()].filter((layer) => layer.kind === kind),
  })).filter((section) => section.layers.length);

  if (includeBaseFill) sections.unshift({ kind: "Base fill", layers: [BASE_FILL] });
  return sections;
}

export function channelLabel(channel) {
  return CHANNEL_LABEL[channel] || channel;
}

function formatAmount(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  const pct = n <= 1 ? n * 100 : n;
  const rounded = Math.round(pct * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded}%`;
}

function formatPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  const pct = n <= 1 ? n * 100 : n;
  const rounded = Math.round(pct * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded}%`;
}

export function formatOpacity(value) {
  if (value == null || value === "") return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return String(n);
}

function uniquePaints(paints) {
  const seen = new Set();
  return paints.filter((paint) => {
    const key = JSON.stringify(paint);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function parseSvgDetails(text) {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const svg = doc.querySelector("svg");
  const gradients = new Map();
  doc.querySelectorAll("linearGradient, radialGradient").forEach((gradient) => {
    const stops = [...gradient.querySelectorAll("stop")].map((stop) => ({
      offset: formatAmount(stop.getAttribute("offset") || "0"),
      hex: (stop.getAttribute("stop-color") || "").toUpperCase(),
      opacity: formatPercent(stop.getAttribute("stop-opacity") || "1"),
    }));
    gradients.set(gradient.id, stops);
  });

  const paints = [];
  function readPaint(el, attr) {
    const paint = el.getAttribute(attr);
    if (!paint || paint === "none" || paint === "transparent") return;
    if (attr === "fill" && el.localName === "rect" && /^#fff(?:fff)?$|^white$/i.test(paint)) return;
    const opacityAttr = attr === "stroke" ? "stroke-opacity" : "fill-opacity";
    const opacity = formatPercent(el.getAttribute(opacityAttr) || "1");
    const url = paint.match(/^url\(#(.+)\)$/);
    if (url) {
      paints.push({
        type: "gradient",
        channel: attr,
        fillOpacity: opacity,
        stops: gradients.get(url[1]) || [],
      });
      return;
    }
    if (paint.startsWith("#") || paint.startsWith("rgb")) {
      paints.push({
        type: "solid",
        channel: attr,
        hex: paint.toUpperCase(),
        fillOpacity: opacity,
      });
    }
  }
  doc.querySelectorAll("[fill], [stroke]").forEach((el) => {
    readPaint(el, "fill");
    readPaint(el, "stroke");
  });

  const blurs = [
    ...new Set(
      [...doc.querySelectorAll("feGaussianBlur")]
        .map((node) => node.getAttribute("stdDeviation"))
        .filter(Boolean)
    ),
  ];

  return {
    kind: "svg",
    width: svg?.getAttribute("width") || "",
    height: svg?.getAttribute("height") || "",
    paints: uniquePaints(paints),
    blurs,
  };
}

const detailCache = new Map();

export function loadLayerDetails(asset) {
  if (detailCache.has(asset)) return detailCache.get(asset);
  const url = layerAssetUrl(asset);
  const pending = asset.toLowerCase().endsWith(".svg")
    ? fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .then(parseSvgDetails)
    : new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () =>
          resolve({
            kind: "raster",
            width: img.naturalWidth,
            height: img.naturalHeight,
            paints: [],
            blurs: [],
          });
        img.onerror = () => reject(new Error("Could not read image"));
        img.src = url;
      });
  const guarded = pending.catch((error) => {
    detailCache.delete(asset);
    throw error;
  });
  detailCache.set(asset, guarded);
  return guarded;
}
