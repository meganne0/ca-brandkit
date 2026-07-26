/**
 * Diagram Remaker — fidelity-first structure extraction.
 *
 * Source diagram is the source of truth. We recover geometry + text + topology
 * for a brand redraw. We do NOT reinterpret, merge, split, invent, or simplify.
 *
 * When uncertain (OCR / connectors), prefer omission or empty text over guessing.
 */

const MAX_PROCESS_W = 1600;

/**
 * @typedef {{ x:number, y:number, w:number, h:number, text:string, lines:string[], role:'node'|'group'|'label'|'decision', conf:number }} DiagramNode
 * @typedef {{ from:number, to:number, points:{x:number,y:number}[], conf:number, label?:string }} DiagramEdge
 * @typedef {{ width:number, height:number, nodes:DiagramNode[], edges:DiagramEdge[], freeLabels:{x:number,y:number,w:number,h:number,text:string,lines:string[]}[], validation:object }} DiagramModel
 */

export async function extractDiagram(img, { onProgress } = {}) {
  const progress = (msg) => onProgress?.(msg);
  progress("Preparing image…");

  const { canvas, w, h, imageData } = rasterize(img, MAX_PROCESS_W);
  const ink = buildInkMask(imageData, w, h);

  progress("Reading text (OCR)…");
  const words = await runOcr(canvas, progress);

  progress("Detecting shapes & groups…");
  const frames = detectClosedFrames(ink, w, h);
  const filled = detectFilledBlobs(ink, w, h, frames);

  progress("Binding labels to shapes…");
  const { nodes, freeLabels, unusedWords } = bindTextToShapes(
    [...frames, ...filled],
    words,
    w,
    h,
  );

  // Remaining text clusters become nodes only when they look like discrete labels
  // that were not inside a detected frame (never invent copy — OCR text only).
  const textNodes = textClustersAsNodes(unusedWords, nodes, w, h);
  let allNodes = [...nodes, ...textNodes];

  progress("Snapping nodes to real boxes…");
  allNodes = refineNodeGeometry(ink, allNodes, w, h);

  progress("Tracing connectors…");
  const edges = traceConnectors(ink, allNodes, w, h);

  const validation = buildValidation(allNodes, edges, freeLabels, words);

  progress("Structure recovered");
  return {
    width: w,
    height: h,
    nodes: allNodes,
    edges,
    freeLabels,
    validation,
  };
}

function rasterize(img, maxW) {
  const scale = Math.min(1, maxW / img.naturalWidth);
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return { canvas, ctx, w, h, imageData: ctx.getImageData(0, 0, w, h) };
}

function buildInkMask(imageData, w, h) {
  const d = imageData.data;
  const lum = new Float32Array(w * h);
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    lum[p] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  }

  let bgSum = 0;
  let bgN = 0;
  const border = Math.max(2, Math.floor(Math.min(w, h) * 0.015));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x < border || y < border || x >= w - border || y >= h - border) {
        bgSum += lum[y * w + x];
        bgN++;
      }
    }
  }
  const bg = bgN ? bgSum / bgN : 245;
  const darkThresh = Math.min(bg - 24, otsuThreshold(lum));

  const ink = new Uint8Array(w * h);
  for (let p = 0, i = 0; p < lum.length; p++, i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const L = lum[p];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    ink[p] = L < darkThresh || (sat > 0.16 && L < bg - 12 && L > 20) ? 1 : 0;
  }
  return ink;
}

function otsuThreshold(lum) {
  const hist = new Array(256).fill(0);
  for (let i = 0; i < lum.length; i++) hist[Math.max(0, Math.min(255, lum[i] | 0))]++;
  const total = lum.length;
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0;
  let wB = 0;
  let maxVar = 0;
  let threshold = 128;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (!wB) continue;
    const wF = total - wB;
    if (!wF) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const v = wB * wF * (mB - mF) ** 2;
    if (v > maxVar) {
      maxVar = v;
      threshold = t;
    }
  }
  return threshold;
}

async function runOcr(canvas, progress) {
  const Tesseract = await import(
    "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/+esm"
  );
  const createWorker = Tesseract.createWorker || Tesseract.default?.createWorker;
  if (!createWorker) throw new Error("Tesseract failed to load");

  const worker = await createWorker("eng", 1, {
    logger: (m) => {
      if (m.status === "recognizing text" && typeof m.progress === "number") {
        progress(`Reading text… ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  try {
    await worker.setParameters({
      tessedit_pageseg_mode: "11", // sparse text — better for diagrams
      preserve_interword_spaces: "1",
    });
    const {
      data: { words },
    } = await worker.recognize(canvas);

    return (words || [])
      .map((w) => ({
        text: (w.text || "").trim(),
        conf: w.confidence ?? 0,
        x: w.bbox.x0,
        y: w.bbox.y0,
        w: Math.max(1, w.bbox.x1 - w.bbox.x0),
        h: Math.max(1, w.bbox.y1 - w.bbox.y0),
      }))
      .filter((w) => w.text.length > 0 && w.conf >= 40 && !/^[\W_|]+$/.test(w.text));
  } finally {
    await worker.terminate();
  }
}

/**
 * Closed frames via hole detection: flood exterior from borders through non-ink;
 * remaining non-ink pockets are interiors of closed shapes.
 */
function detectClosedFrames(ink, w, h) {
  const exterior = floodExterior(ink, w, h);
  const holeMask = new Uint8Array(w * h);
  for (let i = 0; i < holeMask.length; i++) {
    if (!ink[i] && !exterior[i]) holeMask[i] = 1;
  }

  const holes = connectedComponents(holeMask, w, h, 40);
  const frames = [];

  for (const hole of holes) {
    const pad = 3;
    let x0 = Math.max(0, hole.minX - pad);
    let y0 = Math.max(0, hole.minY - pad);
    let x1 = Math.min(w - 1, hole.maxX + pad);
    let y1 = Math.min(h - 1, hole.maxY + pad);

    // Expand to include border ink around the hole
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        if (!ink[y * w + x]) continue;
        // near hole?
        if (
          x >= hole.minX - 2 &&
          x <= hole.maxX + 2 &&
          y >= hole.minY - 2 &&
          y <= hole.maxY + 2
        ) {
          /* keep */
        }
      }
    }

    // Tighten to ink bbox that encloses the hole
    let minX = w;
    let minY = h;
    let maxX = 0;
    let maxY = 0;
    let borderHits = 0;
    const scanPad = 8;
    const sx0 = Math.max(0, hole.minX - scanPad);
    const sy0 = Math.max(0, hole.minY - scanPad);
    const sx1 = Math.min(w - 1, hole.maxX + scanPad);
    const sy1 = Math.min(h - 1, hole.maxY + scanPad);
    for (let y = sy0; y <= sy1; y++) {
      for (let x = sx0; x <= sx1; x++) {
        if (!ink[y * w + x]) continue;
        // only count ink that is outside the hole (border ring)
        if (
          x >= hole.minX &&
          x <= hole.maxX &&
          y >= hole.minY &&
          y <= hole.maxY
        ) {
          continue;
        }
        borderHits++;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }

    if (borderHits < 20 || maxX <= minX || maxY <= minY) {
      // Fallback: hole bbox + small pad
      minX = Math.max(0, hole.minX - 2);
      minY = Math.max(0, hole.minY - 2);
      maxX = Math.min(w - 1, hole.maxX + 2);
      maxY = Math.min(h - 1, hole.maxY + 2);
    }

    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    if (bw < 28 || bh < 18) continue;
    if (bw > w * 0.95 && bh > h * 0.9) continue; // whole canvas

    const area = bw * bh;
    const holeArea = (hole.maxX - hole.minX + 1) * (hole.maxY - hole.minY + 1);
    const hollow = holeArea / area > 0.25;

    // Reject arrow-enclosed white space: require ink along all four sides
    const border = rectBorderScore(ink, minX, minY, bw, bh, w, h);
    if (border.minSide < 0.18 || border.mean < 0.28) continue;

    frames.push({
      x: minX,
      y: minY,
      w: bw,
      h: bh,
      role: "node",
      hollow,
      area,
      conf: hollow ? 0.9 : 0.7,
    });
  }

  // Nesting: large frames that contain others become groups
  frames.sort((a, b) => b.area - a.area);
  for (let i = 0; i < frames.length; i++) {
    let childCount = 0;
    for (let j = 0; j < frames.length; j++) {
      if (i === j) continue;
      if (containsRect(frames[i], frames[j], 4)) childCount++;
    }
    if (childCount >= 1) frames[i].role = "group";
  }

  return dedupeRects(frames);
}

/** Ink density along each side of a candidate rectangle (0–1). */
function rectBorderScore(ink, x, y, bw, bh, w, h) {
  const sampleSide = (points) => {
    let hits = 0;
    let n = 0;
    for (const [px, py] of points) {
      if (px < 0 || py < 0 || px >= w || py >= h) continue;
      n++;
      if (ink[py * w + px]) hits++;
    }
    return n ? hits / n : 0;
  };

  const top = [];
  const bottom = [];
  const left = [];
  const right = [];
  for (let i = 0; i < bw; i++) {
    top.push([x + i, y]);
    bottom.push([x + i, y + bh - 1]);
    if (bh > 2) {
      top.push([x + i, y + 1]);
      bottom.push([x + i, y + bh - 2]);
    }
  }
  for (let i = 0; i < bh; i++) {
    left.push([x, y + i]);
    right.push([x + bw - 1, y + i]);
    if (bw > 2) {
      left.push([x + 1, y + i]);
      right.push([x + bw - 2, y + i]);
    }
  }

  const sides = [
    sampleSide(top),
    sampleSide(bottom),
    sampleSide(left),
    sampleSide(right),
  ];
  return {
    sides,
    minSide: Math.min(...sides),
    mean: sides.reduce((a, b) => a + b, 0) / sides.length,
  };
}

function floodExterior(ink, w, h) {
  const exterior = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    if (ink[i] || exterior[i]) return;
    exterior[i] = 1;
    stack.push(i);
  };

  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }

  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    const y = (i / w) | 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }
  return exterior;
}

function detectFilledBlobs(ink, w, h, existing) {
  // Close lightly so filled shapes coalesce; exclude thin connectors via aspect/fill
  const closed = morphClose(ink, w, h, 1);
  const comps = connectedComponents(closed, w, h, 120);
  const area = w * h;
  const blobs = [];

  for (const c of comps) {
    const bw = c.maxX - c.minX + 1;
    const bh = c.maxY - c.minY + 1;
    const fill = c.count / (bw * bh);
    const thin = Math.min(bw, bh) / Math.max(bw, bh) < 0.14;
    if (thin) continue;
    if (fill < 0.35) continue; // likely a line network, not a filled node
    if (c.count < area * 0.0015 || c.count > area * 0.25) continue;
    if (bw < 24 || bh < 16) continue;

    const rect = {
      x: c.minX,
      y: c.minY,
      w: bw,
      h: bh,
      role: "node",
      hollow: false,
      area: bw * bh,
      conf: 0.65,
    };

    // Skip if largely overlapping an existing frame
    const overlapExisting = existing.some(
      (f) => iou(f, rect) > 0.45 || containsRect(f, rect, 2) || containsRect(rect, f, 2),
    );
    if (overlapExisting) continue;
    blobs.push(rect);
  }
  return blobs;
}

function containsRect(outer, inner, pad = 0) {
  return (
    inner.x >= outer.x - pad &&
    inner.y >= outer.y - pad &&
    inner.x + inner.w <= outer.x + outer.w + pad &&
    inner.y + inner.h <= outer.y + outer.h + pad
  );
}

function iou(a, b) {
  const x0 = Math.max(a.x, b.x);
  const y0 = Math.max(a.y, b.y);
  const x1 = Math.min(a.x + a.w, b.x + b.w);
  const y1 = Math.min(a.y + a.h, b.y + b.h);
  const iw = Math.max(0, x1 - x0);
  const ih = Math.max(0, y1 - y0);
  const inter = iw * ih;
  if (!inter) return 0;
  return inter / (a.w * a.h + b.w * b.h - inter);
}

function dedupeRects(rects) {
  const out = [];
  const sorted = [...rects].sort((a, b) => a.area - b.area);
  for (const r of sorted) {
    const dup = out.find((o) => iou(o, r) > 0.72);
    if (dup) {
      // Prefer higher confidence / group role
      if ((r.conf ?? 0) > (dup.conf ?? 0) || r.role === "group") {
        Object.assign(dup, r);
      }
      continue;
    }
    out.push({ ...r });
  }
  return out;
}

function bindTextToShapes(shapes, words, w, h) {
  const used = new Set();
  const nodes = shapes.map((s) => ({
    x: s.x,
    y: s.y,
    w: s.w,
    h: s.h,
    text: "",
    lines: [],
    role: s.role || "node",
    conf: s.conf ?? 0.7,
  }));

  // Assign each word to the smallest containing shape
  const byShape = nodes.map(() => []);
  for (let wi = 0; wi < words.length; wi++) {
    const word = words[wi];
    const cx = word.x + word.w / 2;
    const cy = word.y + word.h / 2;
    let best = -1;
    let bestArea = Infinity;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (
        cx >= n.x - 2 &&
        cy >= n.y - 2 &&
        cx <= n.x + n.w + 2 &&
        cy <= n.y + n.h + 2
      ) {
        const area = n.w * n.h;
        if (area < bestArea) {
          bestArea = area;
          best = i;
        }
      }
    }
    if (best >= 0) {
      byShape[best].push(word);
      used.add(wi);
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const lines = wordsToLines(byShape[i]);
    nodes[i].lines = lines;
    nodes[i].text = lines.join("\n");
  }

  const unusedWords = words.filter((_, i) => !used.has(i));
  const freeLabels = [];
  // Edge / connector labels: small short text only — never invent; OCR only
  const labelClusters = clusterWords(unusedWords, { maxGapX: 14, maxGapY: 10 });
  const stillUnused = [];
  for (const cluster of labelClusters) {
    const lines = wordsToLines(cluster.words);
    const text = lines.join("\n");
    // Tiny connector annotations only (yes/no, 1–2 char tags) — not box titles
    if (
      (text.split(/\s+/).length === 1 && text.length <= 12 && cluster.h < 28) ||
      (text.length <= 6 && cluster.w < 72 && cluster.h < 28)
    ) {
      freeLabels.push({
        x: cluster.x,
        y: cluster.y,
        w: cluster.w,
        h: cluster.h,
        text,
        lines,
      });
    } else {
      stillUnused.push(...cluster.words);
    }
  }

  return { nodes, freeLabels, unusedWords: stillUnused };
}

function wordsToLines(words) {
  if (!words.length) return [];
  const sorted = [...words].sort((a, b) => a.y - b.y || a.x - b.x);
  const medianH =
    [...sorted].sort((a, b) => a.h - b.h)[Math.floor(sorted.length / 2)]?.h || 12;
  const lineGap = Math.max(8, medianH * 0.65);
  const bands = [];
  for (const word of sorted) {
    let band = bands.find((b) => Math.abs(word.y + word.h / 2 - b.cy) < lineGap);
    if (!band) {
      band = { words: [], cy: word.y + word.h / 2 };
      bands.push(band);
    }
    band.words.push(word);
    band.cy = band.words.reduce((s, w) => s + w.y + w.h / 2, 0) / band.words.length;
  }
  bands.sort((a, b) => a.cy - b.cy);
  const gapSplit = Math.max(18, medianH * 2.5);
  const lines = [];
  for (const band of bands) {
    band.words.sort((a, b) => a.x - b.x);
    let seg = [band.words[0]];
    for (let i = 1; i < band.words.length; i++) {
      const prev = band.words[i - 1];
      const cur = band.words[i];
      if (cur.x - (prev.x + prev.w) > gapSplit) {
        lines.push(seg.map((w) => w.text).join(" "));
        seg = [cur];
      } else {
        seg.push(cur);
      }
    }
    lines.push(seg.map((w) => w.text).join(" "));
  }
  return lines.filter(Boolean);
}

function clusterWords(words, { maxGapX, maxGapY }) {
  if (!words.length) return [];
  const remaining = words.map((w, i) => ({ ...w, _i: i }));
  const clusters = [];
  while (remaining.length) {
    const seed = remaining.shift();
    const group = [seed];
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = remaining.length - 1; i >= 0; i--) {
        const w = remaining[i];
        const hit = group.some(
          (g) =>
            Math.abs(w.y + w.h / 2 - (g.y + g.h / 2)) < maxGapY &&
            !(w.x > g.x + g.w + maxGapX || g.x > w.x + w.w + maxGapX),
        );
        if (hit) {
          group.push(w);
          remaining.splice(i, 1);
          changed = true;
        }
      }
    }
    const x = Math.min(...group.map((g) => g.x));
    const y = Math.min(...group.map((g) => g.y));
    const r = Math.max(...group.map((g) => g.x + g.w));
    const b = Math.max(...group.map((g) => g.y + g.h));
    clusters.push({ words: group, x, y, w: r - x, h: b - y });
  }
  return clusters;
}

function textClustersAsNodes(words, existingNodes, w, h) {
  const clusters = clusterWords(words, { maxGapX: 16, maxGapY: 12 });
  const nodes = [];
  for (const c of clusters) {
    if (c.w < 10 || c.h < 8) continue;
    const cx = c.x + c.w / 2;
    const cy = c.y + c.h / 2;
    if (
      existingNodes.some(
        (n) =>
          cx >= n.x &&
          cy >= n.y &&
          cx <= n.x + n.w &&
          cy <= n.y + n.h,
      )
    ) {
      continue;
    }
    const lines = wordsToLines(c.words);
    nodes.push({
      x: c.x,
      y: c.y,
      w: c.w,
      h: c.h,
      text: lines.join("\n"),
      lines,
      role: "node",
      conf: 0.55,
    });
  }
  return nodes;
}

/**
 * Tiny OCR text boxes make remakes look broken. Expand each node to the
 * enclosing diagram rectangle when a 4-sided border is found; otherwise
 * pad to a readable card without inventing new structure.
 */
function refineNodeGeometry(ink, nodes, w, h) {
  const refined = nodes.map((n) => {
    if (n.role === "group") return n;
    // Already a real frame — don't shrink/warp it
    if (n.w >= 70 && n.h >= 42 && (n.conf ?? 0) >= 0.7) return n;
    const snapped = snapToEnclosingRect(ink, n, w, h);
    return {
      ...n,
      x: snapped.x,
      y: snapped.y,
      w: snapped.w,
      h: snapped.h,
      conf: Math.max(n.conf ?? 0, snapped.conf ?? 0),
    };
  });

  // Merge nodes that snapped onto essentially the same box
  const out = [];
  for (const n of refined) {
    const dup = out.find((o) => iou(o, n) > 0.55);
    if (!dup) {
      out.push(n);
      continue;
    }
    // Keep larger box; merge OCR text if complementary
    if (n.w * n.h > dup.w * dup.h) {
      dup.x = n.x;
      dup.y = n.y;
      dup.w = n.w;
      dup.h = n.h;
    }
    if (!dup.text && n.text) {
      dup.text = n.text;
      dup.lines = n.lines;
    } else if (n.text && dup.text && n.text !== dup.text) {
      const merged = Array.from(new Set([...(dup.lines || []), ...(n.lines || [])]));
      dup.lines = merged;
      dup.text = merged.join("\n");
    }
    dup.conf = Math.max(dup.conf ?? 0, n.conf ?? 0);
  }
  return out;
}

function snapToEnclosingRect(ink, box, w, h) {
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const maxReach = Math.min(
    Math.max(w, h),
    Math.max(120, Math.max(box.w, box.h) * 5 + 100),
  );

  const left = rayToBorder(ink, box.x, cy, -1, 0, maxReach, w, h);
  const right = rayToBorder(ink, box.x + box.w, cy, 1, 0, maxReach, w, h);
  const top = rayToBorder(ink, cx, box.y, 0, -1, maxReach, w, h);
  const bottom = rayToBorder(ink, cx, box.y + box.h, 0, 1, maxReach, w, h);

  if (left && right && top && bottom) {
    const x = left.pos;
    const y = top.pos;
    const rw = right.pos - left.pos + 1;
    const rh = bottom.pos - top.pos + 1;
    if (rw >= box.w && rh >= box.h && rw < w * 0.9 && rh < h * 0.9) {
      const score = rectBorderScore(ink, x, y, rw, rh, w, h);
      if (score.minSide >= 0.22 && score.mean >= 0.32) {
        return { x, y, w: rw, h: rh, conf: 0.88 };
      }
    }
  }

  // Readable card padding — still centered on the recovered text
  const padX = Math.max(18, Math.min(36, box.w * 0.2));
  const padY = Math.max(14, Math.min(28, Math.max(box.h * 0.55, 16)));
  const x = Math.max(0, box.x - padX);
  const y = Math.max(0, box.y - padY);
  return {
    x,
    y,
    w: Math.min(w - x, box.w + padX * 2),
    h: Math.min(h - y, box.h + padY * 2),
    conf: 0.5,
  };
}

function rayToBorder(ink, x0, y0, dx, dy, maxReach, w, h) {
  let x = x0;
  let y = y0;
  let run = 0;
  for (let i = 0; i < maxReach; i++) {
    x += dx;
    y += dy;
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix < 0 || iy < 0 || ix >= w || iy >= h) return null;
    if (ink[iy * w + ix]) {
      run++;
      // Require a short stroke run so single noise pixels don't win
      if (run >= 2) {
        return { pos: dx !== 0 ? ix : iy, dist: i };
      }
    } else {
      run = 0;
    }
  }
  return null;
}

/**
 * Trace connectors from ink after masking node interiors.
 * Only keep high-confidence links — never invent topology.
 */
function traceConnectors(ink, nodes, w, h) {
  if (nodes.length < 2) return [];

  const lineInk = new Uint8Array(ink);
  for (const n of nodes) {
    // Clear interiors; keep a thin border ring so connectors still touch
    const inset = Math.max(4, Math.min(12, Math.floor(Math.min(n.w, n.h) * 0.15)));
    const x0 = Math.floor(n.x + inset);
    const y0 = Math.floor(n.y + inset);
    const x1 = Math.ceil(n.x + n.w - inset);
    const y1 = Math.ceil(n.y + n.h - inset);
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        if (x >= 0 && y >= 0 && x < w && y < h) lineInk[y * w + x] = 0;
      }
    }
  }

  const fat = dilate(lineInk, w, h, 1);
  const comps = connectedComponents(fat, w, h, 16);
  const edges = [];
  const seen = new Set();

  for (const c of comps) {
    const bw = c.maxX - c.minX + 1;
    const bh = c.maxY - c.minY + 1;
    const fill = c.count / (bw * bh);
    const elongated =
      Math.min(bw, bh) / Math.max(bw, bh) < 0.55 || fill < 0.42;
    // Skip blob leftovers that look like nodes
    if (!elongated && fill > 0.5 && bw > 40 && bh > 40) continue;

    const touches = [];
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].role === "group") continue; // don't attach to containers
      if (componentTouchesNode(c, nodes[i], 16)) touches.push(i);
    }

    if (touches.length === 2) {
      const score = corridorScore(lineInk, nodes[touches[0]], nodes[touches[1]], w, h, nodes);
      if (score >= 0.18) {
        addEdge(edges, seen, touches[0], touches[1], nodes, c, score);
      }
    } else if (touches.length > 2) {
      // Pair only high-confidence corridors among touched nodes
      for (let a = 0; a < touches.length; a++) {
        for (let b = a + 1; b < touches.length; b++) {
          const ia = touches[a];
          const ib = touches[b];
          if (seen.has(pairKey(ia, ib))) continue;
          const score = corridorScore(lineInk, nodes[ia], nodes[ib], w, h, nodes);
          if (score >= 0.24) addEdge(edges, seen, ia, ib, nodes, c, score);
        }
      }
    }
  }

  // High-confidence pairwise — prefer missing an edge over inventing one
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].role === "group") continue;
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[j].role === "group") continue;
      if (seen.has(pairKey(i, j))) continue;
      if (segmentBlockedByNode(nodes[i], nodes[j], nodes, i, j)) continue;
      const score = corridorScore(lineInk, nodes[i], nodes[j], w, h, nodes);
      if (score >= 0.32) addEdge(edges, seen, i, j, nodes, null, score);
    }
  }

  for (const e of edges) {
    const dir = inferDirection(lineInk, nodes[e.from], nodes[e.to], w, h);
    if (dir === "swap") {
      const t = e.from;
      e.from = e.to;
      e.to = t;
      e.points = [...e.points].reverse();
    }
  }

  return edges;
}

function addEdge(edges, seen, i, j, nodes, comp, conf) {
  const key = pairKey(i, j);
  if (seen.has(key) || i === j) return;
  seen.add(key);
  edges.push({
    from: i,
    to: j,
    points: routePoints(nodes[i], nodes[j], comp),
    conf: conf ?? 0.5,
  });
}

function pairKey(i, j) {
  return i < j ? `${i}:${j}` : `${j}:${i}`;
}

function componentTouchesNode(c, n, pad) {
  const x0 = n.x - pad;
  const y0 = n.y - pad;
  const x1 = n.x + n.w + pad;
  const y1 = n.y + n.h + pad;
  if (c.maxX < x0 || c.minX > x1 || c.maxY < y0 || c.minY > y1) return false;

  const cx = (c.minX + c.maxX) / 2;
  const cy = (c.minY + c.maxY) / 2;
  let hits = 0;
  for (const [ex, ey] of [
    [c.minX, c.minY],
    [c.maxX, c.minY],
    [c.minX, c.maxY],
    [c.maxX, c.maxY],
    [cx, c.minY],
    [cx, c.maxY],
    [c.minX, cy],
    [c.maxX, cy],
  ]) {
    if (ex >= x0 && ex <= x1 && ey >= y0 && ey <= y1) hits++;
  }
  return (
    hits > 0 ||
    (cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1) ||
    rectsOverlapPad(
      { x: c.minX, y: c.minY, r: c.maxX, b: c.maxY },
      { x: n.x, y: n.y, r: n.x + n.w, b: n.y + n.h },
      pad,
    )
  );
}

function rectsOverlapPad(a, b, pad) {
  return !(
    a.r + pad < b.x ||
    b.r + pad < a.x ||
    a.b + pad < b.y ||
    b.b + pad < a.y
  );
}

function routePoints(a, b, comp) {
  const aC = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
  const bC = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
  const start = borderPoint(a, bC);
  const end = borderPoint(b, aC);

  // Prefer straight connectors (cleaner, closer to source).
  // Use an elbow only when the ink component clearly spans both axes.
  if (comp) {
    const bw = comp.maxX - comp.minX + 1;
    const bh = comp.maxY - comp.minY + 1;
    const spansBoth = bw > 50 && bh > 50;
    const notBlob = Math.min(bw, bh) / Math.max(bw, bh) < 0.65;
    if (spansBoth && notBlob) {
      const mx = (comp.minX + comp.maxX) / 2;
      const my = (comp.minY + comp.maxY) / 2;
      // Pick the elbow orientation closer to the component mass
      const viaH = [
        start,
        { x: end.x, y: start.y },
        end,
      ];
      const viaV = [
        start,
        { x: start.x, y: end.y },
        end,
      ];
      const distH = Math.hypot(mx - end.x, my - start.y);
      const distV = Math.hypot(mx - start.x, my - end.y);
      return distH <= distV ? viaH : viaV;
    }
  }
  return [start, end];
}

function borderPoint(node, toward) {
  const cx = node.x + node.w / 2;
  const cy = node.y + node.h / 2;
  const dx = toward.x - cx;
  const dy = toward.y - cy;
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return { x: cx, y: node.y + node.h };
  }
  if (Math.abs(dx) / (node.w / 2) > Math.abs(dy) / (node.h / 2)) {
    const x = dx > 0 ? node.x + node.w : node.x;
    const t = (x - cx) / dx;
    return { x, y: cy + dy * t };
  }
  const y = dy > 0 ? node.y + node.h : node.y;
  const t = (y - cy) / dy;
  return { x: cx + dx * t, y };
}

function corridorScore(ink, a, b, w, h, nodes = null) {
  const start = borderPoint(a, { x: b.x + b.w / 2, y: b.y + b.h / 2 });
  const end = borderPoint(b, { x: a.x + a.w / 2, y: a.y + a.h / 2 });
  const dist = Math.hypot(end.x - start.x, end.y - start.y);
  if (dist < 12) return 0;
  const steps = Math.max(16, Math.min(180, (dist / 2) | 0));
  const px = -(end.y - start.y) / dist;
  const py = (end.x - start.x) / dist;
  let stepsHit = 0;
  let stepsTotal = 0;
  let run = 0;
  let bestRun = 0;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const x = start.x + (end.x - start.x) * t;
    const y = start.y + (end.y - start.y) * t;
    if (nodes && pointInAnyNode(x, y, nodes, a, b, 3)) {
      run = 0;
      continue;
    }
    stepsTotal++;
    let hit = false;
    for (const off of [-6, -3, 0, 3, 6]) {
      const sx = Math.round(x + px * off);
      const sy = Math.round(y + py * off);
      if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue;
      if (ink[sy * w + sx]) {
        hit = true;
        break;
      }
    }
    if (hit) {
      stepsHit++;
      run++;
      if (run > bestRun) bestRun = run;
    } else run = 0;
  }
  if (!stepsTotal) return 0;
  return (stepsHit / stepsTotal) * 0.55 + (bestRun / stepsTotal) * 0.45;
}

function pointInAnyNode(x, y, nodes, a, b, pad) {
  for (const n of nodes) {
    if (n === a || n === b) continue;
    if (
      x >= n.x - pad &&
      x <= n.x + n.w + pad &&
      y >= n.y - pad &&
      y <= n.y + n.h + pad
    ) {
      return true;
    }
  }
  return false;
}

function segmentBlockedByNode(a, b, nodes, ai, bi) {
  const start = borderPoint(a, { x: b.x + b.w / 2, y: b.y + b.h / 2 });
  const end = borderPoint(b, { x: a.x + a.w / 2, y: a.y + a.h / 2 });
  for (let i = 0; i < nodes.length; i++) {
    if (i === ai || i === bi) continue;
    if (nodes[i].role === "group") continue;
    const n = nodes[i];
    for (let s = 1; s < 24; s++) {
      const t = s / 24;
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;
      if (x >= n.x && x <= n.x + n.w && y >= n.y && y <= n.y + n.h) return true;
    }
  }
  return false;
}

function inferDirection(ink, a, b, w, h) {
  const start = borderPoint(a, { x: b.x + b.w / 2, y: b.y + b.h / 2 });
  const end = borderPoint(b, { x: a.x + a.w / 2, y: a.y + a.h / 2 });
  const densA = endpointArrowScore(ink, start, end, a, w, h);
  const densB = endpointArrowScore(ink, end, start, b, w, h);
  if (densB > densA * 1.15) return "ok";
  if (densA > densB * 1.15) return "swap";
  const acx = a.x + a.w / 2;
  const bcx = b.x + b.w / 2;
  if (Math.abs(bcx - acx) > 40) return bcx >= acx ? "ok" : "swap";
  return b.y + b.h / 2 >= a.y + a.h / 2 ? "ok" : "swap";
}

function endpointArrowScore(ink, tip, other, node, w, h) {
  const dist = Math.hypot(other.x - tip.x, other.y - tip.y) || 1;
  const ux = (other.x - tip.x) / dist;
  const uy = (other.y - tip.y) / dist;
  const px = -uy;
  const py = ux;
  let score = 0;
  for (const along of [4, 8, 12, 16]) {
    const cx = tip.x + ux * along;
    const cy = tip.y + uy * along;
    if (cx >= node.x && cx <= node.x + node.w && cy >= node.y && cy <= node.y + node.h) {
      continue;
    }
    let span = 0;
    for (let off = -10; off <= 10; off++) {
      const sx = Math.round(cx + px * off);
      const sy = Math.round(cy + py * off);
      if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue;
      if (ink[sy * w + sx]) span++;
    }
    score += span;
  }
  return score;
}

function morphClose(ink, w, h, r) {
  return erode(dilate(ink, w, h, r), w, h, r);
}

function dilate(src, w, h, r) {
  const out = new Uint8Array(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0;
      for (let dy = -r; dy <= r && !v; dy++) {
        for (let dx = -r; dx <= r && !v; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < w && ny < h && src[ny * w + nx]) v = 1;
        }
      }
      out[y * w + x] = v;
    }
  }
  return out;
}

function erode(src, w, h, r) {
  const out = new Uint8Array(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 1;
      for (let dy = -r; dy <= r && v; dy++) {
        for (let dx = -r; dx <= r && v; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h || !src[ny * w + nx]) v = 0;
        }
      }
      out[y * w + x] = v;
    }
  }
  return out;
}

function connectedComponents(ink, w, h, minCount = 20) {
  const seen = new Uint8Array(ink.length);
  const comps = [];
  const stack = [];
  for (let i = 0; i < ink.length; i++) {
    if (!ink[i] || seen[i]) continue;
    let count = 0;
    let minX = w;
    let minY = h;
    let maxX = 0;
    let maxY = 0;
    const pixels = [];
    stack.push(i);
    seen[i] = 1;
    while (stack.length) {
      const p = stack.pop();
      const x = p % w;
      const y = (p / w) | 0;
      count++;
      pixels.push(p);
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const ni = ny * w + nx;
        if (ink[ni] && !seen[ni]) {
          seen[ni] = 1;
          stack.push(ni);
        }
      }
    }
    if (count >= minCount) comps.push({ count, minX, minY, maxX, maxY, pixels });
  }
  return comps;
}

function buildValidation(nodes, edges, freeLabels, words) {
  const emptyNodes = nodes.filter((n) => n.role !== "group" && !n.text).length;
  const groups = nodes.filter((n) => n.role === "group").length;
  const lowConfEdges = edges.filter((e) => e.conf < 0.35).length;
  const warnings = [];
  if (emptyNodes) {
    warnings.push(
      `${emptyNodes} shape(s) had unclear OCR — left blank rather than inventing labels`,
    );
  }
  if (lowConfEdges) {
    warnings.push(`${lowConfEdges} connector(s) kept at lower confidence`);
  }
  return {
    nodes: nodes.filter((n) => n.role !== "group").length,
    groups,
    edges: edges.length,
    freeLabels: freeLabels.length,
    ocrWords: words.length,
    emptyNodes,
    warnings,
    checklist: {
      nodesRecovered: nodes.length > 0,
      textBound: nodes.some((n) => n.text) || freeLabels.length > 0,
      connectorsTraced: edges.length > 0 || nodes.length < 2,
      noInventedCopy: true,
    },
  };
}
