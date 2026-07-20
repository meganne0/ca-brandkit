/**
 * Export a YouTube thumbnail canvas (1280×720) as a PNG download.
 */
import { toPng } from "../vendor/html-to-image.esm.js";

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

/**
 * @param {HTMLElement} el — unscaled .canvas at design size
 * @param {string} filename
 * @param {{ width?: number, height?: number, pixelRatio?: number }} [opts]
 */
export async function downloadElementPng(el, filename, opts = {}) {
  const width = opts.width ?? 1280;
  const height = opts.height ?? 720;
  await waitForImages(el);
  if (document.fonts?.ready) await document.fonts.ready;

  const dataUrl = await toPng(el, {
    width,
    height,
    canvasWidth: width,
    canvasHeight: height,
    pixelRatio: opts.pixelRatio ?? 1,
    cacheBust: true,
    style: {
      transform: "none",
      margin: "0",
      left: "0",
      top: "0",
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
  const width = opts.width ?? 1280;
  const height = opts.height ?? 720;
  const mount = document.createElement("div");
  mount.setAttribute("aria-hidden", "true");
  mount.style.cssText = [
    "position:fixed",
    "left:-10000px",
    "top:0",
    `width:${width}px`,
    `height:${height}px`,
    "overflow:hidden",
    "pointer-events:none",
    "opacity:0",
  ].join(";");

  const canvas = document.createElement("div");
  canvas.className = opts.className ?? "canvas canvas--yt";
  canvas.style.cssText = `width:${width}px;height:${height}px;transform:none;`;
  mount.appendChild(canvas);
  document.body.appendChild(mount);

  try {
    paint(canvas);
    await downloadElementPng(canvas, filename, { width, height });
  } finally {
    mount.remove();
  }
}
