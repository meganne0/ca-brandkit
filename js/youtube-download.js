/**
 * Export a YouTube thumbnail canvas as a high-res PNG download.
 * Design size stays 1280×720; raster output is 2× for crisp uploads.
 */
import { toPng } from "../vendor/html-to-image.esm.js";

const DESIGN_W = 1280;
const DESIGN_H = 720;
/** 2× export — sharp on retina / when YouTube downscales */
const EXPORT_SCALE = 2;

export async function waitForImages(root) {
  const imgs = [...root.querySelectorAll("img")];
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        }),
    ),
  );
}

/** blob: URLs often fail inside html-to-image clones — rewrite as data URLs. */
async function inlineBlobImages(root) {
  const imgs = [...root.querySelectorAll("img")].filter((img) =>
    (img.currentSrc || img.src || "").startsWith("blob:"),
  );
  await Promise.all(
    imgs.map(async (img) => {
      const src = img.currentSrc || img.src;
      try {
        const res = await fetch(src);
        const blob = await res.blob();
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        img.src = dataUrl;
      } catch {
        /* leave original src */
      }
    }),
  );
}

async function waitForFonts() {
  if (!document.fonts?.ready) return;
  try {
    await document.fonts.ready;
    await Promise.allSettled([
      document.fonts.load("700 28px 'Mozilla Text'"),
      document.fonts.load("600 16px 'Mozilla Text'"),
      document.fonts.load("700 96px 'Mozilla Headline'"),
      document.fonts.load("600 16px Inter"),
    ]);
  } catch {
    /* ignore */
  }
}

/** Flatten host chips in the clone so export can't double-paint text. */
function hardenHostForExport(clonedDoc) {
  clonedDoc.querySelectorAll(".yt-host__hl").forEach((span) => {
    const parent = span.parentElement;
    if (!parent) return;
    parent.textContent = span.textContent;
  });
  clonedDoc.querySelectorAll(".yt-host__name, .yt-host__role").forEach((el) => {
    el.style.boxDecorationBreak = "unset";
    el.style.webkitBoxDecorationBreak = "unset";
    el.style.textShadow = "none";
    el.style.webkitTextStroke = "0";
    el.style.filter = "none";
    el.style.transform = "none";
    el.style.whiteSpace = "nowrap";
  });
}

/**
 * @param {HTMLElement} el — unscaled .canvas at design size
 * @param {string} filename
 * @param {{ width?: number, height?: number, pixelRatio?: number, backgroundColor?: string | null, cropToContent?: boolean }} [opts]
 */
export async function downloadElementPng(el, filename, opts = {}) {
  const width = opts.width ?? DESIGN_W;
  const height = opts.height ?? DESIGN_H;
  const scale = opts.pixelRatio ?? EXPORT_SCALE;
  const hasBg = Object.prototype.hasOwnProperty.call(opts, "backgroundColor");

  await inlineBlobImages(el);
  await waitForImages(el);
  await waitForFonts();
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  let dataUrl = await toPng(el, {
    width,
    height,
    pixelRatio: scale,
    cacheBust: true,
    skipAutoScale: true,
    ...(hasBg ? { backgroundColor: opts.backgroundColor } : {}),
    style: {
      transform: "none",
      transformOrigin: "top left",
      margin: "0",
      left: "0",
      top: "0",
      right: "auto",
      bottom: "auto",
      width: `${width}px`,
      height: `${height}px`,
      opacity: "1",
      position: "relative",
    },
    onclone(clonedDoc) {
      hardenHostForExport(clonedDoc);
    },
  });

  if (opts.cropToContent) {
    dataUrl = await cropPngToOpaqueBounds(dataUrl);
  }

  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename.toLowerCase().endsWith(".png")
    ? filename
    : `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Trim fully transparent padding from a PNG data URL (keeps soft shadow/glow).
 * @param {string} dataUrl
 * @param {{ padding?: number, alphaThreshold?: number }} [opts]
 */
export async function cropPngToOpaqueBounds(dataUrl, opts = {}) {
  const padding = opts.padding ?? 12;
  const alphaThreshold = opts.alphaThreshold ?? 8;

  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });

  const src = document.createElement("canvas");
  src.width = img.naturalWidth || img.width;
  src.height = img.naturalHeight || img.height;
  const ctx = src.getContext("2d", { willReadFrequently: true });
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0);

  const { width, height } = src;
  const { data } = ctx.getImageData(0, 0, width, height);

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      if (data[(row + x) * 4 + 3] > alphaThreshold) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) return dataUrl;

  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width - 1, maxX + padding);
  maxY = Math.min(height - 1, maxY + padding);

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const out = document.createElement("canvas");
  out.width = cropW;
  out.height = cropH;
  const outCtx = out.getContext("2d");
  if (!outCtx) return dataUrl;
  outCtx.drawImage(src, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
  return out.toDataURL("image/png");
}

/**
 * Build an offscreen 1280×720 canvas, paint it, download, then remove.
 * @param {(canvas: HTMLElement) => void} paint
 * @param {string} filename
 * @param {{ className?: string, width?: number, height?: number, backgroundColor?: string | null, cropToContent?: boolean }} [opts]
 */
export async function downloadPaintedThumbnail(paint, filename, opts = {}) {
  const width = opts.width ?? DESIGN_W;
  const height = opts.height ?? DESIGN_H;
  const mount = document.createElement("div");
  mount.setAttribute("aria-hidden", "true");
  // Keep in normal paint path (no clip-path / opacity:0 — those cause text ghosts)
  mount.style.cssText = [
    "position:fixed",
    "left:-100vw",
    "top:0",
    `width:${width}px`,
    `height:${height}px`,
    opts.cropToContent ? "overflow:visible" : "overflow:hidden",
    "pointer-events:none",
    "z-index:0",
    "opacity:1",
  ].join(";");

  const canvas = document.createElement("div");
  canvas.className = opts.className ?? "canvas canvas--yt";
  canvas.style.cssText = [
    `width:${width}px`,
    `height:${height}px`,
    "transform:none",
    "transform-origin:top left",
    "margin:0",
    "position:relative",
    "opacity:1",
  ].join(";");
  mount.appendChild(canvas);
  document.body.appendChild(mount);

  try {
    paint(canvas);
    await downloadElementPng(canvas, filename, {
      width,
      height,
      ...(Object.prototype.hasOwnProperty.call(opts, "backgroundColor")
        ? { backgroundColor: opts.backgroundColor }
        : {}),
      ...(opts.cropToContent ? { cropToContent: true } : {}),
    });
  } finally {
    mount.remove();
  }
}
