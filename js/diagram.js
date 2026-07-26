/**
 * Diagram Remaker — brand restyle without changing information architecture.
 * Renders extracted structure in place: same relative positions, topology, and copy.
 */

import { extractDiagram } from "./diagram-extract.js?v=6";

const LOGO_SRC = "visual assets/logo/logo-horizontal-white-orange.svg";
const EXPORT_PAD = 48;
const FOOTER_H = 56;
const TITLE_H = 52;
const MAX_EXPORT_W = 1800;
const NODE_RADIUS = 12;
const GROUP_RADIUS = 18;

const fileInput = document.getElementById("diagram-file");
const drop = document.getElementById("diagram-drop");
const titleInput = document.getElementById("diagram-title");
const remakeBtn = document.getElementById("diagram-remake");
const downloadBtn = document.getElementById("diagram-download");
const clearBtn = document.getElementById("diagram-clear");
const originalFrame = document.getElementById("diagram-original");
const remadeFrame = document.getElementById("diagram-remade");
const statusEl = document.getElementById("diagram-status");

/** @type {HTMLImageElement | null} */
let sourceImage = null;
/** @type {HTMLCanvasElement | null} */
let remadeCanvas = null;
/** @type {HTMLImageElement | null} */
let logoImage = null;
/** @type {Awaited<ReturnType<typeof extractDiagram>> | null} */
let lastModel = null;
let busy = false;

function setStatus(msg, tone = "info") {
  if (!statusEl) return;
  statusEl.textContent = msg || "";
  statusEl.dataset.tone = tone;
  statusEl.hidden = !msg;
}

function setButtons({ remake = false, download = false, clear = false } = {}) {
  remakeBtn.disabled = busy || !remake;
  downloadBtn.disabled = busy || !download;
  clearBtn.disabled = busy || !clear;
  fileInput.disabled = busy;
}

function clearFrame(frame, emptyText) {
  frame.replaceChildren();
  const p = document.createElement("p");
  p.className = "diagram-stage__empty";
  p.textContent = emptyText;
  frame.appendChild(p);
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };
    img.src = url;
  });
}

function loadLogo() {
  if (logoImage?.complete && logoImage.naturalWidth > 0) {
    return Promise.resolve(logoImage);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      logoImage = img;
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = LOGO_SRC;
  });
}

async function handleFile(file) {
  if (!file || !file.type.startsWith("image/") || busy) return;
  try {
    sourceImage = await loadImageFromFile(file);
  } catch {
    clearFrame(originalFrame, "Could not load that file");
    setButtons();
    setStatus("Could not load that image.", "error");
    return;
  }

  originalFrame.replaceChildren();
  const preview = sourceImage.cloneNode();
  preview.alt = "Uploaded diagram";
  originalFrame.appendChild(preview);

  remadeCanvas = null;
  lastModel = null;
  clearFrame(remadeFrame, "Remaking…");
  setButtons({ remake: true, clear: true });
  await remake({ forceExtract: true });
}

function drawBrandBackground(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#0a061a");
  g.addColorStop(0.45, "#160054");
  g.addColorStop(1, "#1e0b36");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(
    w * 0.85,
    h * 0.1,
    0,
    w * 0.85,
    h * 0.1,
    w * 0.55,
  );
  glow.addColorStop(0, "rgba(242, 88, 53, 0.16)");
  glow.addColorStop(1, "rgba(242, 88, 53, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  const purpleGlow = ctx.createRadialGradient(
    w * 0.15,
    h * 0.9,
    0,
    w * 0.15,
    h * 0.9,
    w * 0.5,
  );
  purpleGlow.addColorStop(0, "rgba(77, 32, 140, 0.4)");
  purpleGlow.addColorStop(1, "rgba(77, 32, 140, 0)");
  ctx.fillStyle = purpleGlow;
  ctx.fillRect(0, 0, w, h);
}

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapLines(ctx, lines, maxWidth, font) {
  ctx.font = font;
  const out = [];
  for (const raw of lines) {
    const words = String(raw).split(/\s+/).filter(Boolean);
    if (!words.length) {
      out.push("");
      continue;
    }
    let current = words[0];
    for (let i = 1; i < words.length; i++) {
      const trial = `${current} ${words[i]}`;
      if (ctx.measureText(trial).width <= maxWidth) current = trial;
      else {
        out.push(current);
        current = words[i];
      }
    }
    out.push(current);
  }
  return out;
}

function drawArrowhead(ctx, from, to) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const size = 11;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - size * Math.cos(angle - Math.PI / 7),
    to.y - size * Math.sin(angle - Math.PI / 7),
  );
  ctx.lineTo(
    to.x - size * Math.cos(angle + Math.PI / 7),
    to.y - size * Math.sin(angle + Math.PI / 7),
  );
  ctx.closePath();
  ctx.fill();
}

function drawEdge(ctx, points) {
  if (!points || points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = "#f25835";
  ctx.fillStyle = "#f25835";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  drawArrowhead(ctx, points[points.length - 2], points[points.length - 1]);
  ctx.restore();
}

function drawGroup(ctx, node) {
  const { x, y, w, h } = node;
  ctx.save();
  roundRectPath(ctx, x, y, w, h, GROUP_RADIUS);
  ctx.fillStyle = "rgba(30, 11, 54, 0.35)";
  ctx.fill();
  const stroke = ctx.createLinearGradient(x, y, x + w, y + h);
  stroke.addColorStop(0, "rgba(236, 107, 21, 0.55)");
  stroke.addColorStop(0.85, "rgba(247, 46, 190, 0.45)");
  stroke.addColorStop(1, "rgba(44, 0, 165, 0.55)");
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.75;
  ctx.setLineDash([7, 6]);
  ctx.stroke();
  ctx.setLineDash([]);

  if (node.lines?.length) {
    // Group title: top-left inside container — exact OCR text only
    const fontSize = Math.max(12, Math.min(18, Math.round(h * 0.06)));
    ctx.font = `600 ${fontSize}px "Mozilla Text", system-ui, sans-serif`;
    ctx.fillStyle = "#ffbbb8";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(node.lines[0], x + 14, y + 12, w - 28);
  }
  ctx.restore();
}

function drawNode(ctx, node) {
  const { x, y, w, h } = node;
  ctx.save();
  roundRectPath(ctx, x, y, w, h, NODE_RADIUS);
  ctx.fillStyle = "rgba(18, 8, 40, 0.92)";
  ctx.fill();

  const stroke = ctx.createLinearGradient(x, y, x + w, y + h);
  stroke.addColorStop(0, "#ec6b15");
  stroke.addColorStop(0.85, "#f72ebe");
  stroke.addColorStop(1, "#2c00a5");
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.1;
  ctx.stroke();

  const lines = node.lines?.length ? node.lines : node.text ? node.text.split("\n") : [];
  if (!lines.length) {
    ctx.restore();
    return;
  }

  // Fit text inside the recovered box — never expand geometry
  const padX = Math.max(8, Math.min(16, w * 0.08));
  const padY = Math.max(6, Math.min(14, h * 0.1));
  const maxTextW = Math.max(20, w - padX * 2);
  const maxTextH = Math.max(16, h - padY * 2);

  let fontSize = Math.max(11, Math.min(20, Math.round(Math.min(h * 0.22, w * 0.08))));
  let wrapped = [];
  let lineH = fontSize * 1.25;
  for (let attempt = 0; attempt < 8; attempt++) {
    const font = `600 ${fontSize}px "Mozilla Text", system-ui, sans-serif`;
    wrapped = wrapLines(ctx, lines, maxTextW, font);
    lineH = fontSize * 1.25;
    if (wrapped.length * lineH <= maxTextH || fontSize <= 11) break;
    fontSize -= 1;
  }

  const textBlockH = wrapped.length * lineH;
  let ty = y + (h - textBlockH) / 2 + fontSize * 0.85;
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 ${fontSize}px "Mozilla Text", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const cx = x + w / 2;
  for (const line of wrapped) {
    ctx.fillText(line, cx, ty, maxTextW);
    ty += lineH;
  }
  ctx.restore();
}

function drawFreeLabel(ctx, label) {
  const fontSize = Math.max(11, Math.min(15, Math.round(label.h * 0.85) || 13));
  ctx.save();
  ctx.font = `500 ${fontSize}px "Mozilla Text", system-ui, sans-serif`;
  ctx.fillStyle = "#ffbbb8";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const lines = label.lines?.length ? label.lines : [label.text];
  let ty = label.y;
  for (const line of lines) {
    ctx.fillText(line, label.x, ty, Math.max(40, label.w + 20));
    ty += fontSize * 1.25;
  }
  ctx.restore();
}

async function renderBrandDiagram(model) {
  const overlayTitle = (titleInput.value || "").trim();
  await document.fonts?.ready;

  // Uniform scale — preserve relative IA / spatial relationships
  const scale = Math.min(1.2, MAX_EXPORT_W / model.width);
  const diagramW = Math.round(model.width * scale);
  const diagramH = Math.round(model.height * scale);

  const topPad = EXPORT_PAD + (overlayTitle ? TITLE_H : 0);
  const canvasW = diagramW + EXPORT_PAD * 2;
  const canvasH = diagramH + topPad + FOOTER_H + EXPORT_PAD;

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  drawBrandBackground(ctx, canvasW, canvasH);

  if (overlayTitle) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 28px 'Mozilla Text', system-ui, sans-serif";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(overlayTitle, EXPORT_PAD, EXPORT_PAD, canvasW - EXPORT_PAD * 2);
  }

  const ox = EXPORT_PAD;
  const oy = topPad;

  const mapNode = (n) => ({
    ...n,
    x: n.x * scale + ox,
    y: n.y * scale + oy,
    w: Math.max(8, n.w * scale),
    h: Math.max(8, n.h * scale),
  });

  // Groups under nodes
  for (const n of model.nodes) {
    if (n.role === "group") drawGroup(ctx, mapNode(n));
  }

  // Edges under leaf nodes
  for (const e of model.edges) {
    const mapped = (e.points || []).map((p) => ({
      x: p.x * scale + ox,
      y: p.y * scale + oy,
    }));
    drawEdge(ctx, mapped);
  }

  for (const n of model.nodes) {
    if (n.role === "group") continue;
    drawNode(ctx, mapNode(n));
  }

  for (const label of model.freeLabels || []) {
    drawFreeLabel(ctx, {
      ...label,
      x: label.x * scale + ox,
      y: label.y * scale + oy,
      w: label.w * scale,
      h: label.h * scale,
    });
  }

  const logo = await loadLogo();
  const footerY = canvasH - FOOTER_H;
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(0, footerY, canvasW, FOOTER_H);

  if (logo) {
    const logoH = 28;
    const logoW = (logo.naturalWidth / logo.naturalHeight) * logoH;
    ctx.drawImage(logo, EXPORT_PAD, footerY + (FOOTER_H - logoH) / 2, logoW, logoH);
  }

  ctx.fillStyle = "#ffbbb8";
  ctx.font = "500 13px Inter, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText("cyberarmor.tech", canvasW - EXPORT_PAD, footerY + FOOTER_H / 2);
  ctx.textAlign = "left";

  return canvas;
}

function statusFromValidation(v) {
  if (!v) return "Remade in brand style";
  const parts = [
    `${v.nodes} nodes`,
    v.groups ? `${v.groups} groups` : null,
    `${v.edges} connectors`,
    v.freeLabels ? `${v.freeLabels} labels` : null,
  ].filter(Boolean);
  let msg = `Fidelity remake · ${parts.join(" · ")}`;
  if (v.warnings?.length) msg += ` · ${v.warnings[0]}`;
  return msg;
}

async function remake({ forceExtract = false } = {}) {
  if (!sourceImage || busy) return;
  busy = true;
  setButtons({ remake: true, download: !!remadeCanvas, clear: true });
  remakeBtn.textContent = "Remaking…";

  try {
    if (forceExtract || !lastModel) {
      lastModel = await extractDiagram(sourceImage, {
        onProgress: (msg) => setStatus(msg, "info"),
      });
    }

    const leafNodes = lastModel.nodes.filter((n) => n.role !== "group");
    if (!leafNodes.length && !lastModel.nodes.length) {
      setStatus(
        "Couldn’t recover diagram structure. Try a sharper screenshot with clearer boxes.",
        "error",
      );
      clearFrame(remadeFrame, "Nothing recovered");
      remadeCanvas = null;
      return;
    }

    setStatus("Applying brand style (structure unchanged)…", "info");
    const canvas = await renderBrandDiagram(lastModel);
    remadeCanvas = canvas;
    remadeFrame.replaceChildren();
    remadeFrame.appendChild(canvas);
    setStatus(statusFromValidation(lastModel.validation), "ok");
  } catch (err) {
    console.error(err);
    setStatus(
      err?.message?.includes("Tesseract") || String(err).includes("fetch")
        ? "OCR failed to load. Check your network and try again."
        : "Remake failed. Try another image.",
      "error",
    );
    clearFrame(remadeFrame, "Remake failed");
  } finally {
    busy = false;
    remakeBtn.textContent = "Remake in brand style";
    setButtons({
      remake: !!sourceImage,
      download: !!remadeCanvas,
      clear: !!sourceImage,
    });
  }
}

function download() {
  if (!remadeCanvas) return;
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  const slug = (titleInput.value || "diagram")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  a.download = `ca-${slug || "diagram"}-${stamp}.png`;
  a.href = remadeCanvas.toDataURL("image/png");
  a.click();
}

function clearAll() {
  if (busy) return;
  sourceImage = null;
  remadeCanvas = null;
  lastModel = null;
  fileInput.value = "";
  titleInput.value = "";
  clearFrame(originalFrame, "No upload yet");
  clearFrame(remadeFrame, "Remake appears here");
  setStatus("");
  setButtons();
}

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (file) handleFile(file);
});

["dragenter", "dragover"].forEach((type) => {
  drop.addEventListener(type, (e) => {
    e.preventDefault();
    drop.classList.add("diagram-drop--active");
  });
});

["dragleave", "drop"].forEach((type) => {
  drop.addEventListener(type, (e) => {
    e.preventDefault();
    drop.classList.remove("diagram-drop--active");
  });
});

drop.addEventListener("drop", (e) => {
  const file = e.dataTransfer?.files?.[0];
  if (file) handleFile(file);
});

titleInput.addEventListener("change", () => {
  if (sourceImage && lastModel) remake({ forceExtract: false });
});

remakeBtn.addEventListener("click", () => remake({ forceExtract: true }));
downloadBtn.addEventListener("click", () => download());
clearBtn.addEventListener("click", () => clearAll());
