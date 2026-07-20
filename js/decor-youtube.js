/**
 * YouTube decor recipes (YT-DX-01 …)
 * Transparent atmosphere layers — combine with any YT-BG behind a layout.
 */

const BIT_POOL = [
  "1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1",
  "0 1 0 0 1 1 0 1 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 0 1 1 0 0 1 1 0 1 0",
  "1 1 0 1 0 1 1 0 0 1 0 0 1 1 0 1 0 0 1 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1",
  "0 0 1 1 0 1 0 1 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0",
  "1 0 0 1 1 0 1 0 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1",
  "0 1 1 0 1 0 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 1 0 0 1 0",
  "1 0 1 0 0 1 1 0 1 1 0 0 1 0 1 1 0 0 1 0 1 0 1 1 0 1",
  "0 1 0 1 1 0 0 1 0 1 1 0 1 1 0 0 1 0 1 1 0 0 1 0 0 1 1 0 1 0 1",
];

const TONES = ["dim", "mid", "cool", "hot"];

function bitsOfLength(i, len) {
  const bitParts = BIT_POOL[i % BIT_POOL.length].split(" ");
  const out = [];
  for (let n = 0; n < len; n++) out.push(bitParts[n % bitParts.length]);
  return out.join(" ");
}

/**
 * YT-DX-01 — columns hang off top/bottom edges; longer toward the right.
 */
function buildEdgeMatrixCols() {
  const cols = [];
  const count = 40;
  for (let i = 0; i < count; i++) {
    const leftPct = 0.8 + i * (97.5 / (count - 1));
    const progress = i / (count - 1); // 0 left → 1 right
    // Longer on the right: ~8 bits left, ~36 bits right
    const len = Math.round(8 + progress * 28 + ((i * 5) % 7));
    const fromTop = i % 2 === 0;
    const top = fromTop
      ? -32 - ((i * 7) % 22)
      : 52 + ((i * 9) % 34);
    // Wide size variance: 6–34px, stronger toward the right
    const size = 6 + Math.round(((i * 17) % 29) * (0.55 + progress * 0.45));
    const opacity = 0.08 + ((i * 13) % 72) / 100;
    // Blur 0–6.5px
    const blur = ((i * 7) % 12) * 0.55;
    cols.push({
      bits: bitsOfLength(i, len),
      left: `${leftPct.toFixed(1)}%`,
      top: `${top}%`,
      size: Math.min(34, Math.max(6, size)),
      opacity: Math.min(0.85, opacity),
      blur: blur.toFixed(2),
      tone: TONES[(i * 3) % TONES.length],
    });
  }
  return cols;
}

/**
 * Dense / high-variance matrix rain (YT-DX-05).
 * Soften columns in the left text zone around vertical center.
 * Break up large hot/green bars through the middle of the frame.
 */
function buildDenseMatrixCols() {
  const cols = [];
  const count = 46;
  for (let i = 0; i < count; i++) {
    const t = (i * 17 + 11) % 100;
    let len = 5 + ((i * 7) % 24);
    let size = 7 + ((i * 13) % 36);
    let opacity = 0.06 + ((i * 19) % 85) / 100;
    let blur = ((i * 5) % 9) * 0.55;
    // Jitter left so columns don’t stack into one solid bar
    let leftPct = (i * 2.15 + (i % 5) * 0.55 + ((i * 3) % 7) * 0.15) % 98;
    let top = -12 + ((i * 11) % 48);
    let tone = TONES[(i + Math.floor(t / 25)) % TONES.length];

    // Text zone (left ~42%) + vertical mid band → blurrier / fainter
    const inTextZone = leftPct < 42;
    const inVertCenter = top > 2 && top < 48;
    if (inTextZone && inVertCenter) {
      opacity *= 0.28;
      blur = Math.max(blur, 2.5) + 2.8;
    } else if (inTextZone) {
      opacity *= 0.5;
      blur += 1.6;
    }

    // Break up large green/hot columns through the horizontal middle
    const inMidX = leftPct > 38 && leftPct < 62;
    if (inMidX && size > 18) {
      size = 8 + (size % 11); // shatter into smaller glyphs
      len = Math.min(len, 10 + (i % 6));
      opacity *= 0.4;
      blur = Math.max(blur, 1.8) + 1.2;
      tone = i % 2 === 0 ? "cool" : "dim";
      // Nudge off the exact center line
      leftPct += i % 2 === 0 ? -4.5 : 5.2;
      if (leftPct < 0) leftPct += 98;
      if (leftPct > 98) leftPct -= 98;
    } else if (inMidX && tone === "hot") {
      tone = "cool";
      opacity *= 0.55;
      blur += 1.4;
    }

    cols.push({
      bits: bitsOfLength(i, len),
      left: `${leftPct.toFixed(1)}%`,
      top: `${top}%`,
      size,
      opacity: Math.min(0.92, opacity),
      blur: blur.toFixed(2),
      tone,
    });
  }
  return cols;
}

const MATRIX_COLS = buildEdgeMatrixCols();
const MATRIX_COLS_DENSE = buildDenseMatrixCols();

export const YOUTUBE_DECORS = {
  "YT-DX-01": {
    label: "Matrix rain",
    description: "Edge-hung binary columns; longer toward the right.",
    kind: "matrix",
  },
  "YT-DX-05": {
    label: "Matrix rain · dense",
    description: "Many columns with wide size, opacity, and blur variance.",
    kind: "matrix",
  },
  "YT-DX-02": {
    label: "Code Elements",
    description: "Floating malware-analysis strings, hex, and chips — some large and blurred off-frame.",
    kind: "digital",
  },
  "YT-DX-03": {
    label: "Digital windows",
    description: "Translucent browser windows.",
    kind: "digital",
  },
  "YT-DX-04": {
    label: "Node mesh",
    description: "Fine ~20px nodes and connectors with soft fade into the BG.",
    kind: "digital",
  },
  "YT-DX-07": {
    label: "Tilted mesh",
    description: "Fine 15° tilted grid with gradient opacity.",
    kind: "digital",
  },
  "YT-DX-06": {
    label: "Fake browser",
    description: "Two browsers hanging off the right edge (upper + lower).",
    kind: "digital",
  },
};

function renderMatrixCols(cols) {
  return cols
    .map((col) => {
      const bits = col.bits.replace(/ /g, "<br>");
      const blur = col.blur != null ? `filter:blur(${col.blur}px);` : "";
      return `<span class="yt-decor__matrix-col yt-decor__matrix-col--${col.tone}" style="left:${col.left};top:${col.top};font-size:${col.size}px;opacity:${col.opacity};${blur}">${bits}</span>`;
    })
    .join("");
}

function buildMatrixRain() {
  return `
    <div class="yt-decor yt-decor--matrix-rain" aria-hidden="true">
      <span class="yt-decor__matrix-rain"></span>
      <span class="yt-decor__matrix-veil"></span>
      ${renderMatrixCols(MATRIX_COLS)}
    </div>
  `;
}

function buildMatrixRainDense() {
  return `
    <div class="yt-decor yt-decor--matrix-rain yt-decor--matrix-rain-dense" aria-hidden="true">
      <span class="yt-decor__matrix-rain"></span>
      <span class="yt-decor__matrix-veil"></span>
      ${renderMatrixCols(MATRIX_COLS_DENSE)}
    </div>
  `;
}

function buildMatrixBinary() {
  return `
    <div class="yt-decor yt-decor--matrix-binary" aria-hidden="true">
      <span class="yt-decor__scanlines"></span>
      <span class="yt-decor__vignette"></span>
      <span class="yt-decor__noise"></span>
      <span class="yt-decor__grid yt-decor__grid--dense"></span>
      <span class="yt-decor__rain"></span>
      <span class="yt-decor__binary yt-decor__binary--a">01001100 01001111 01000111</span>
      <span class="yt-decor__binary yt-decor__binary--b">0xF258 0xCA01 SESSION_REPLAY</span>
      <span class="yt-decor__binary yt-decor__binary--c">exfil → C2 · token_vault · mfa_bypass</span>
      <span class="yt-decor__binary yt-decor__binary--d">GET /oauth/token 401 · retry=3</span>
      <span class="yt-decor__binary yt-decor__binary--e">0b11010110 · kerberos_tgt · sideload</span>
      <span class="yt-decor__binary yt-decor__binary--f">pcap://eth0 drop=0.02 · SYN flood?</span>
      <span class="yt-decor__binary yt-decor__binary--g">SHA256:a7f3…c91e VERIFIED_FAIL</span>
      <span class="yt-decor__binary yt-decor__binary--h">mov eax, [ebp+shellcode] · call VirtualAlloc</span>
      <span class="yt-decor__binary yt-decor__binary--i">PE32+ · .text · .rdata · UPX0 · entry=0x00401000</span>
      <span class="yt-decor__binary yt-decor__binary--j">yara::malware/stealer · matches=3 · unpack_stage2</span>
      <span class="yt-decor__binary yt-decor__binary--k">IDA · Ghidra · x64dbg · strings.exe · pe_header</span>
      <span class="yt-decor__chip yt-decor__chip--a">AUTH_BYPASS</span>
      <span class="yt-decor__chip yt-decor__chip--b">0xDEAD</span>
      <span class="yt-decor__chip yt-decor__chip--c">LATERAL</span>
      <span class="yt-decor__chip yt-decor__chip--d">beacon.dll</span>
      <span class="yt-decor__chip yt-decor__chip--e">SHELLCODE</span>
      <span class="yt-decor__chip yt-decor__chip--f">UNPACK</span>
    </div>
  `;
}

function buildWindow(id) {
  return `
    <span class="yt-decor__window yt-decor__window--${id}">
      <span class="yt-decor__window-bar">
        <span class="yt-decor__window-dot"></span>
        <span class="yt-decor__window-dot"></span>
        <span class="yt-decor__window-dot"></span>
      </span>
      <span class="yt-decor__window-pane"></span>
    </span>
  `;
}

function buildDigitalGrid() {
  const windows = ["a", "b", "c", "d", "e", "f", "g", "h"]
    .map((id) => buildWindow(id))
    .join("");
  return `
    <div class="yt-decor yt-decor--digital-grid" aria-hidden="true">
      ${windows}
    </div>
  `;
}

function buildRippleMesh() {
  // Graph coordinates in a 100×100 space; CSS tilts the whole layer.
  const nodes = [
    [8, 18],
    [22, 12],
    [38, 22],
    [52, 10],
    [68, 18],
    [82, 8],
    [94, 24],
    [12, 42],
    [28, 38],
    [44, 48],
    [60, 36],
    [76, 44],
    [90, 52],
    [6, 68],
    [24, 62],
    [40, 72],
    [56, 64],
    [72, 78],
    [88, 70],
    [18, 88],
    [48, 92],
    [70, 96],
    [34, 28],
    [64, 56],
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [0, 7],
    [1, 8],
    [2, 8],
    [2, 9],
    [3, 10],
    [4, 10],
    [4, 11],
    [5, 11],
    [6, 12],
    [7, 8],
    [8, 9],
    [9, 10],
    [10, 11],
    [11, 12],
    [7, 13],
    [8, 14],
    [9, 15],
    [10, 16],
    [11, 17],
    [12, 18],
    [13, 14],
    [14, 15],
    [15, 16],
    [16, 17],
    [17, 18],
    [13, 19],
    [15, 20],
    [17, 21],
    [19, 20],
    [20, 21],
    [2, 22],
    [8, 22],
    [9, 22],
    [11, 23],
    [16, 23],
    [17, 23],
    [9, 23],
  ];
  const hubs = new Set([2, 8, 10, 15, 23]);

  // ~20×20px nodes on a 1280×720 canvas (SVG ~136% → ~17.4px/unit).
  const NODE_R = 0.58;
  const HUB_R = 0.62;
  const RING_R = 1.05;

  const fadeClass = (i) => {
    const n = i % 5;
    if (n === 0) return " yt-decor__net-fade--dim";
    if (n === 1) return " yt-decor__net-fade--mid";
    if (n === 3) return " yt-decor__net-fade--soft";
    return "";
  };

  const edgeMarkup = edges
    .map(([a, b], i) => {
      const [x1, y1] = nodes[a];
      const [x2, y2] = nodes[b];
      const tone = i % 3 === 0 ? "a" : i % 3 === 1 ? "b" : "c";
      const blur = i % 5 === 0 || i % 7 === 0 ? " yt-decor__net-edge--blur" : "";
      const soft = i % 4 === 2 ? " yt-decor__net-edge--soft" : "";
      return `<line class="yt-decor__net-edge yt-decor__net-edge--${tone}${blur}${soft}${fadeClass(i)}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
    })
    .join("");

  const nodeMarkup = nodes
    .map(([x, y], i) => {
      const hub = hubs.has(i);
      const tone = i % 3 === 0 ? "a" : i % 3 === 1 ? "b" : "c";
      const blurCls =
        i % 6 === 0 || i % 9 === 0 ? " yt-decor__net-blur" : "";
      const fade = fadeClass(i);
      if (hub) {
        return `
          <g class="yt-decor__net-hub${blurCls}${fade}">
            <circle class="yt-decor__net-ring yt-decor__net-ring--${tone}" cx="${x}" cy="${y}" r="${RING_R}" />
            <circle class="yt-decor__net-node yt-decor__net-node--hub yt-decor__net-node--${tone}" cx="${x}" cy="${y}" r="${HUB_R}" />
          </g>
        `;
      }
      return `<circle class="yt-decor__net-node yt-decor__net-node--${tone}${blurCls}${fade}" cx="${x}" cy="${y}" r="${NODE_R}" />`;
    })
    .join("");

  return `
    <div class="yt-decor yt-decor--node-mesh" aria-hidden="true">
      <svg class="yt-decor__net yt-decor__net--main" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        ${edgeMarkup}
        ${nodeMarkup}
      </svg>
      <svg class="yt-decor__net yt-decor__net--ghost" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        ${edgeMarkup}
        ${nodeMarkup}
      </svg>
    </div>
  `;
}

function buildTiltedMesh() {
  return `
    <div class="yt-decor yt-decor--tilted-mesh" aria-hidden="true">
      <span class="yt-decor__mesh yt-decor__mesh--a"></span>
      <span class="yt-decor__mesh yt-decor__mesh--b"></span>
      <span class="yt-decor__mesh yt-decor__mesh--c"></span>
      <span class="yt-decor__mesh-glow"></span>
    </div>
  `;
}

function buildBrowserWindow({ modifier, url, lines }) {
  const lineHtml = lines
    .map(
      (cls) =>
        `<span class="yt-decor__browser-line yt-decor__browser-line--${cls}"></span>`,
    )
    .join("");
  return `
    <div class="yt-decor__browser yt-decor__browser--${modifier}">
      <div class="yt-decor__browser-chrome">
        <span class="yt-decor__browser-dots">
          <span class="yt-decor__window-dot"></span>
          <span class="yt-decor__window-dot"></span>
          <span class="yt-decor__window-dot"></span>
        </span>
        <span class="yt-decor__browser-url">
          <span class="yt-decor__browser-lock"></span>
          ${url}
        </span>
      </div>
      <div class="yt-decor__browser-pane">
        ${lineHtml}
        <span class="yt-decor__browser-block"></span>
      </div>
    </div>
  `;
}

function buildFakeBrowser() {
  return `
    <div class="yt-decor yt-decor--fake-browser" aria-hidden="true">
      ${buildBrowserWindow({
        modifier: "upper",
        url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
        lines: ["a", "b", "c"],
      })}
      ${buildBrowserWindow({
        modifier: "lower",
        url: "https://secure-login.microsoftonline.com/common/oauth2",
        lines: ["b", "c", "d", "e"],
      })}
    </div>
  `;
}

const BUILDERS = {
  "YT-DX-01": buildMatrixRain,
  "YT-DX-05": buildMatrixRainDense,
  "YT-DX-02": buildMatrixBinary,
  "YT-DX-03": buildDigitalGrid,
  "YT-DX-04": buildRippleMesh,
  "YT-DX-06": buildFakeBrowser,
  "YT-DX-07": buildTiltedMesh,
};

/**
 * Render a decor recipe onto a canvas (between BG layers and layout content).
 * @param {HTMLElement} canvas
 * @param {string} decorId
 */
export function renderYouTubeDecor(canvas, decorId) {
  canvas.querySelector(".yt-decor")?.remove();
  if (!decorId) return;

  const recipe = YOUTUBE_DECORS[decorId];
  const builder = BUILDERS[decorId];
  if (!recipe || !builder) {
    console.warn(`Unknown YouTube decor: ${decorId}`);
    return;
  }

  const wrap = document.createElement("div");
  wrap.innerHTML = builder().trim();
  const node = wrap.firstElementChild;
  canvas.dataset.decor = decorId;

  const content = canvas.querySelector(".yt-content");
  if (content) canvas.insertBefore(node, content);
  else canvas.appendChild(node);
}

export function initYouTubeDecors(root = document) {
  root.querySelectorAll("[data-decor^='YT-DX']").forEach((el) => {
    renderYouTubeDecor(el, el.dataset.decor);
  });
}
