/**
 * YouTube thumbnail layout recipes (YT-01 … YT-06, YT-08 … YT-10)
 * Format: 1280×720. Thumbnail-native — not slide/LinkedIn chrome.
 * Decor (matrix / digital) lives in decor-youtube.js — not baked into layouts.
 */

const DEFAULT_HOST_AVATAR =
  "/visual%20assets/avatars/avatar-nguyen-circle.png";

export const YOUTUBE_LAYOUTS = {
  "YT-01": {
    label: "Hook + evidence",
    description: "Huge outlined hook + stacked evidence cards. No footer.",
    format: "thumbnail",
    footer: false,
    className: "yt-layout-evidence",
  },
  "YT-02": {
    label: "Hook + flow",
    description: "Huge outlined hook + vertical matrix step cards (optional host). No footer.",
    format: "thumbnail",
    footer: false,
    className: "yt-layout-flow",
  },
  "YT-03": {
    label: "Hook + contrast",
    description: "Huge outlined hook + tilted vs panels. No footer.",
    format: "thumbnail",
    footer: false,
    className: "yt-layout-contrast",
  },
  "YT-04": {
    label: "Hook + metric",
    description: "Huge outlined hook + glowing metric blast. No footer.",
    format: "thumbnail",
    footer: false,
    className: "yt-layout-metric",
  },
  "YT-05": {
    label: "Hook + host",
    description: "Huge outlined hook + ringed host portrait. No footer.",
    format: "thumbnail",
    footer: false,
    className: "yt-layout-host",
  },
  "YT-06": {
    label: "Hook + host + evidence",
    description: "Huge outlined hook + host badge + evidence card. No footer.",
    format: "thumbnail",
    footer: false,
    className: "yt-layout-host-evidence",
  },
  "YT-08": {
    label: "Hook + single shot",
    description: "Huge hook + one large evidence frame. No footer.",
    format: "thumbnail",
    footer: false,
    className: "yt-layout-single-shot",
  },
  "YT-09": {
    label: "Hook + bullets",
    description: "Huge hook + numbered bullet stack. No footer.",
    format: "thumbnail",
    footer: false,
    className: "yt-layout-bullets",
  },
  "YT-10": {
    label: "Hook + metrics",
    description: "Huge hook + metric tiles in a 2-column grid (wraps to new rows). No footer.",
    format: "thumbnail",
    footer: false,
    className: "yt-layout-dual-metric",
  },
};

function accentize(text, accent) {
  if (!accent || !text.includes(accent)) return text;
  return text.replace(accent, `<span class="accent">${accent}</span>`);
}

function hookBlock(content) {
  const hookRaw = content.hook ?? content.headline ?? content.title ?? "";
  const subline = content.subline ?? content.subtitle ?? "";
  const accentRaw = content.accent ?? "";
  const badge = content.badge ?? "BREAKDOWN";
  const hook = String(hookRaw).toUpperCase();
  const accent = String(accentRaw).toUpperCase();
  const showBadge = content.showBadge !== false;
  return `
    <div class="yt-hook">
      ${
        showBadge && badge
          ? `<span class="yt-hook__badge">${badge}</span>`
          : ""
      }
      ${hook ? `<h1 class="yt-hook__text">${accentize(hook, accent)}</h1>` : ""}
      ${
        subline
          ? `<p class="yt-hook__sub"><span class="yt-hook__sub-inner">${subline}</span></p>`
          : ""
      }
    </div>
  `;
}

function hostCard(content, variant = "stack") {
  const avatar = content.avatar ?? DEFAULT_HOST_AVATAR;
  const name = content.host ?? content.speaker ?? content.name ?? "Nguyen Nguyen";
  const role = content.role ?? "CEO, CyberArmor";
  const mod =
    variant === "row"
      ? " yt-host--row"
      : variant === "overlay"
        ? " yt-host--overlay"
        : "";
  // Plain text nodes only — nested highlight spans double-paint in html-to-image.
  return `
    <div class="yt-host${mod}">
      <div class="yt-host__ring">
        <img class="yt-host__avatar" src="${avatar}" alt="${name}" />
        <span class="yt-host__spark" aria-hidden="true"></span>
      </div>
      <div class="yt-host__meta">
        <p class="yt-host__name">${name}</p>
        ${role ? `<p class="yt-host__role">${role}</p>` : ""}
      </div>
    </div>
  `;
}

function hasHost(content) {
  return !!(content.host || content.avatar || content.speaker || content.name);
}

const SHOT_TAG_DEFAULTS = ["EVIDENCE", "ZOOM", "CAPTURE"];
const SHOT_TAG_TONES = ["a", "b", "c"];

function shotTagLabel(shot, index = 0) {
  return shot?.tag ?? SHOT_TAG_DEFAULTS[index] ?? "EVIDENCE";
}

function shotTagMarkup(shot, index = 0) {
  const tone = shot?.tone ?? SHOT_TAG_TONES[index % SHOT_TAG_TONES.length];
  return `<span class="yt-evidence__tag yt-evidence__tag--${tone}">${shotTagLabel(shot, index)}</span>`;
}

function renderEvidence(content) {
  const el = document.createElement("div");
  const withHost = hasHost(content);
  el.className = `yt-content yt-layout-evidence${withHost ? " yt-layout-evidence--with-host" : ""}`;
  const shots = (content.shots ?? []).slice(0, 2);
  el.innerHTML = `
    <div class="yt-layout-evidence__grid">
      ${hookBlock(content)}
      <div class="yt-evidence">
        ${shots
          .map(
            (shot, i) => `
              <figure class="yt-evidence__shot yt-evidence__shot--${i === 0 ? "primary" : "secondary"}">
                ${shotTagMarkup(shot, i)}
                <div class="yt-evidence__media">
                  <img src="${shot.src}" alt="${shot.alt ?? ""}" />
                </div>
              </figure>
            `,
          )
          .join("")}
        ${withHost ? hostCard(content, "overlay") : ""}
      </div>
    </div>
  `;
  return el;
}

function renderFlow(content) {
  const el = document.createElement("div");
  const withHost = hasHost(content);
  el.className = `yt-content yt-layout-flow${withHost ? " yt-layout-flow--with-host" : ""}`;
  const steps = (content.steps ?? []).slice(0, 8);
  const count = Math.max(steps.length, 1);
  const flowList = `
    <ol class="yt-flow yt-flow--n${count}">
      ${steps
        .map(
          (step, i) => `
            <li class="yt-flow__step">
              <span class="yt-flow__num">${String(i + 1).padStart(2, "0")}</span>
              <span class="yt-flow__label">${step.label ?? step.title ?? ""}</span>
            </li>
          `,
        )
        .join("")}
    </ol>
  `;
  el.innerHTML = withHost
    ? `
      <div class="yt-layout-flow__top">
        ${hookBlock({ ...content, badge: content.badge ?? "KILL CHAIN" })}
        ${hostCard(content, "row")}
      </div>
      ${flowList}
    `
    : `
      ${hookBlock({ ...content, badge: content.badge ?? "KILL CHAIN" })}
      ${flowList}
    `;
  return el;
}

function renderContrast(content) {
  const el = document.createElement("div");
  el.className = "yt-content yt-layout-contrast";
  const left = content.left ?? {};
  const right = content.right ?? {};
  el.innerHTML = `
    ${hookBlock({ ...content, badge: content.badge ?? "COMPARE" })}
    <div class="yt-contrast">
      <div class="yt-contrast__panel yt-contrast__panel--left">
        <span class="yt-contrast__stamp">SAFE?</span>
        ${left.image ? `<img src="${left.image}" alt="${left.alt ?? ""}" />` : ""}
        <p class="yt-contrast__label">${left.label ?? ""}</p>
      </div>
      <div class="yt-contrast__vs" aria-hidden="true"><span>VS</span></div>
      <div class="yt-contrast__panel yt-contrast__panel--right">
        <span class="yt-contrast__stamp yt-contrast__stamp--hot">THREAT</span>
        ${right.image ? `<img src="${right.image}" alt="${right.alt ?? ""}" />` : ""}
        <p class="yt-contrast__label">${right.label ?? ""}</p>
      </div>
    </div>
  `;
  return el;
}

function renderMetric(content) {
  const el = document.createElement("div");
  el.className = "yt-content yt-layout-metric";
  const metric = content.metric ?? {};
  el.innerHTML = `
    <div class="yt-layout-metric__grid">
      ${hookBlock({ ...content, badge: content.badge ?? "SIGNAL" })}
      <div class="yt-metric">
        <div class="yt-metric__burst" aria-hidden="true"></div>
        <p class="yt-metric__value">${metric.value ?? ""}</p>
        <p class="yt-metric__label">${metric.label ?? ""}</p>
      </div>
    </div>
  `;
  return el;
}

function renderHost(content) {
  const el = document.createElement("div");
  el.className = "yt-content yt-layout-host";
  el.innerHTML = `
    <div class="yt-layout-host__grid">
      ${hookBlock({ ...content, badge: content.badge ?? "LIVE TAKE" })}
      ${hostCard(content)}
    </div>
  `;
  return el;
}

function renderHostEvidence(content) {
  const el = document.createElement("div");
  el.className = "yt-content yt-layout-host-evidence";
  const shot = (content.shots ?? [])[0] ?? content.shot ?? null;
  el.innerHTML = `
    <div class="yt-layout-host-evidence__grid">
      <div class="yt-layout-host-evidence__copy">
        ${hookBlock({ ...content, badge: content.badge ?? "FIELD NOTE" })}
        ${hostCard(content, "row")}
      </div>
      ${
        shot
          ? `<div class="yt-layout-host-evidence__media">
              <figure class="yt-host-evidence__shot">
                ${shotTagMarkup(shot, 2)}
                <div class="yt-evidence__media">
                  <img src="${shot.src}" alt="${shot.alt ?? ""}" />
                </div>
              </figure>
            </div>`
          : ""
      }
    </div>
  `;
  return el;
}

function renderSingleShot(content) {
  const el = document.createElement("div");
  const withHost = hasHost(content);
  el.className = `yt-content yt-layout-single-shot${withHost ? " yt-layout-single-shot--with-host" : ""}`;
  const shot = (content.shots ?? [])[0] ?? content.shot ?? null;
  el.innerHTML = `
    <div class="yt-layout-single-shot__grid">
      ${hookBlock({ ...content, badge: content.badge ?? "CAPTURE" })}
      ${
        shot
          ? `<div class="yt-single-shot-wrap">
              <figure class="yt-single-shot">
                ${shotTagMarkup(shot, 0)}
                <div class="yt-evidence__media">
                  <img src="${shot.src}" alt="${shot.alt ?? ""}" />
                </div>
              </figure>
              ${withHost ? hostCard(content, "overlay") : ""}
            </div>`
          : withHost
            ? hostCard(content, "row")
            : ""
      }
    </div>
  `;
  return el;
}

function renderBullets(content) {
  const el = document.createElement("div");
  const withHost = hasHost(content);
  el.className = `yt-content yt-layout-bullets${withHost ? " yt-layout-bullets--with-host" : ""}`;
  const bullets = (content.bullets ?? content.steps ?? []).slice(0, 6);
  el.innerHTML = `
    <div class="yt-layout-bullets__grid">
      <div class="yt-layout-bullets__copy">
        ${hookBlock({ ...content, badge: content.badge ?? "KEY POINTS" })}
        ${withHost ? hostCard(content, "row") : ""}
      </div>
      <ul class="yt-bullets">
        ${bullets
          .map(
            (item, i) => `
              <li class="yt-bullets__item">
                <span class="yt-bullets__num">${String(i + 1).padStart(2, "0")}</span>
                <span class="yt-bullets__text">${item.label ?? item.title ?? item}</span>
              </li>
            `,
          )
          .join("")}
      </ul>
    </div>
  `;
  return el;
}

function renderDualMetric(content) {
  const el = document.createElement("div");
  const withHost = hasHost(content);
  el.className = `yt-content yt-layout-dual-metric${withHost ? " yt-layout-dual-metric--with-host" : ""}`;
  const metrics = (content.metrics ?? []).slice(0, 8);
  const fallback = [
    content.metric ?? { value: "+160%", label: "Primary signal" },
    { value: "0 DET", label: "Secondary signal" },
  ];
  const list = metrics.length >= 1 ? metrics : fallback;
  const count = list.length;
  const density =
    count >= 5 ? " yt-dual-metrics--dense" : count >= 3 ? " yt-dual-metrics--compact" : "";
  const tones = ["a", "b", "c"];
  el.innerHTML = `
    <div class="yt-layout-dual-metric__grid">
      <div class="yt-layout-dual-metric__copy">
        ${hookBlock({ ...content, badge: content.badge ?? "SIGNALS" })}
        ${withHost ? hostCard(content, "row") : ""}
      </div>
      <div class="yt-dual-metrics yt-dual-metrics--n${count}${density}">
        ${list
          .map(
            (m, i) => `
              <div class="yt-dual-metrics__tile yt-dual-metrics__tile--${tones[i % 3]}">
                <p class="yt-dual-metrics__value">${m.value ?? ""}</p>
                <p class="yt-dual-metrics__label">${m.label ?? ""}</p>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
  return el;
}

const RENDERERS = {
  "YT-01": renderEvidence,
  "YT-02": renderFlow,
  "YT-03": renderContrast,
  "YT-04": renderMetric,
  "YT-05": renderHost,
  "YT-06": renderHostEvidence,
  "YT-08": renderSingleShot,
  "YT-09": renderBullets,
  "YT-10": renderDualMetric,
};

export function renderYouTubeLayout(canvas, layoutId, content = {}) {
  const layout = YOUTUBE_LAYOUTS[layoutId];
  if (!layout) {
    console.warn(`Unknown YouTube layout: ${layoutId}`);
    return;
  }
  const renderer = RENDERERS[layoutId];
  if (!renderer) return;

  canvas.querySelector(".yt-content")?.remove();
  canvas.appendChild(renderer(content));
}

export function initYouTubeLayouts(root = document) {
  root.querySelectorAll("[data-layout^='YT-']").forEach((el) => {
    let content = {};
    try {
      content = JSON.parse(el.dataset.content || "{}");
    } catch (e) {
      console.warn("Invalid data-content JSON", el, e);
    }
    renderYouTubeLayout(el, el.dataset.layout, content);
  });
}
