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
 * @param {{ width?: number, height?: number, pixelRatio?: number }} [opts]
 */
export async function downloadElementPng(el, filename, opts = {}) {
  const width = opts.width ?? DESIGN_W;
  const height = opts.height ?? DESIGN_H;
  const scale = opts.pixelRatio ?? EXPORT_SCALE;

  await waitForImages(el);
  await waitForFonts();
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const dataUrl = await toPng(el, {
    width,
    height,
    pixelRatio: scale,
    cacheBust: true,
    skipAutoScale: true,
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
 * Build an offscreen 1280×720 canvas, paint it, download, then remove.
 * @param {(canvas: HTMLElement) => void} paint
 * @param {string} filename
 * @param {{ className?: string, width?: number, height?: number }} [opts]
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
    "overflow:hidden",
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
    await downloadElementPng(canvas, filename, { width, height });
  } finally {
    mount.remove();
  }
}
