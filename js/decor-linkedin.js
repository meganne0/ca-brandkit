/**
 * LinkedIn decor recipes (LI-DX-01 …)
 * Transparent atmosphere layers — combine with any LI-BG behind a layout.
 */

export const LINKEDIN_DECORS = {
  "LI-DX-01": {
    label: "Shield outlines",
    description: "Angular Gundam-style shield wireframes — hairline strokes, layered.",
    kind: "outline",
  },
};

/** Gundam / mecha shield silhouettes — outline only, viewBox 0 0 100 120 */
function shieldPaths() {
  const a = `
    <path d="M50 4 L86 18 L86 28 L78 34 L78 72 L50 112 L22 72 L22 34 L14 28 L14 18 Z" />
    <path d="M50 14 L74 24 L74 30 L68 34 L68 68 L50 96 L32 68 L32 34 L26 30 L26 24 Z" />
    <path d="M36 40 L64 40 L64 58 L50 78 L36 58 Z" />
    <line x1="50" y1="14" x2="50" y2="96" />
    <line x1="36" y1="40" x2="50" y2="28" />
    <line x1="64" y1="40" x2="50" y2="28" />
    <circle cx="50" cy="52" r="3.2" />
    <circle cx="42" cy="46" r="1.1" />
    <circle cx="58" cy="46" r="1.1" />
  `;
  const b = `
    <path d="M50 6 L92 22 L84 38 L84 70 L62 108 L50 116 L38 108 L16 70 L16 38 L8 22 Z" />
    <path d="M50 18 L78 30 L72 40 L72 66 L50 98 L28 66 L28 40 L22 30 Z" />
    <path d="M34 44 H66 V62 L50 82 L34 62 Z" />
    <line x1="22" y1="30" x2="28" y2="40" />
    <line x1="78" y1="30" x2="72" y2="40" />
    <line x1="50" y1="18" x2="50" y2="98" />
    <polyline points="40,48 50,42 60,48" />
    <circle cx="50" cy="56" r="2.6" />
    <circle cx="30" cy="52" r="1" />
    <circle cx="70" cy="52" r="1" />
  `;
  const c = `
    <path d="M50 2 L78 16 L72 28 L72 64 L50 114 L28 64 L28 28 L22 16 Z" />
    <path d="M50 12 L66 22 L62 30 L62 60 L50 94 L38 60 L38 30 L34 22 Z" />
    <rect x="44" y="36" width="12" height="22" rx="0.5" />
    <line x1="50" y1="12" x2="50" y2="94" />
    <line x1="38" y1="48" x2="62" y2="48" />
    <circle cx="50" cy="46" r="2.2" />
    <circle cx="50" cy="68" r="1.2" />
  `;
  return { a, b, c };
}

function buildShieldOutlines() {
  const { a, b, c } = shieldPaths();
  const mk = (mod, paths) => `
    <svg class="li-decor__shield li-decor__shield--${mod}" viewBox="0 0 100 120" aria-hidden="true">
      <g class="li-decor__shield-lines" fill="none" stroke-linejoin="miter" stroke-linecap="square">
        ${paths}
      </g>
    </svg>
  `;
  return `
    <div class="li-decor li-decor--shields" aria-hidden="true">
      ${mk("hero", b)}
      ${mk("mid", a)}
      ${mk("tall", c)}
      ${mk("ghost-a", a)}
      ${mk("ghost-b", b)}
      ${mk("chip", c)}
    </div>
  `;
}

const BUILDERS = {
  "LI-DX-01": buildShieldOutlines,
};

/**
 * Render a decor recipe onto a canvas (between BG layers and layout content).
 * @param {HTMLElement} canvas
 * @param {string} decorId
 */
export function renderLinkedInDecor(canvas, decorId) {
  canvas.querySelector(".li-decor")?.remove();
  if (!decorId) return;

  const recipe = LINKEDIN_DECORS[decorId];
  const builder = BUILDERS[decorId];
  if (!recipe || !builder) {
    console.warn(`Unknown LinkedIn decor: ${decorId}`);
    return;
  }

  const wrap = document.createElement("div");
  wrap.innerHTML = builder().trim();
  const node = wrap.firstElementChild;
  canvas.dataset.decor = decorId;

  const content = canvas.querySelector(".li-content");
  if (content) canvas.insertBefore(node, content);
  else canvas.appendChild(node);
}
