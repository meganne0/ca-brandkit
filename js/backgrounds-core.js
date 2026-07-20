/**
 * Shared background layer renderer.
 * Used by slide (BG-*) and LinkedIn (LI-BG-*) recipe catalogs.
 */

/* Root-absolute so drafts under /drafts/ resolve assets correctly. */
export const ASSET_ROOT = "/visual%20assets/background_assets";

export function layerUrl(asset) {
  return `${ASSET_ROOT}/${encodeURIComponent(asset).replace(/%2F/g, "/")}`;
}

function isSwirlAsset(asset) {
  return /swirl/i.test(asset);
}

/**
 * Fill sizing: rendered W and H must be ≥ canvas W and H (CSS cover).
 * Swirl: lock to full canvas width.
 * dots.svg: positioned/contain — never fill.
 */
function fillSizeFor(asset) {
  if (isSwirlAsset(asset)) return "100% auto";
  return "cover";
}

function createOverlayLayer(overlay) {
  const el = document.createElement("div");
  el.className = "slide-layer slide-layer--overlay";
  if (isSwirlAsset(overlay.asset)) {
    el.classList.add("slide-layer--swirl");
  }
  el.style.backgroundImage = `url('${layerUrl(overlay.asset)}')`;
  el.style.opacity = overlay.opacity ?? 1;
  el.style.backgroundSize = overlay.size ?? fillSizeFor(overlay.asset);
  el.style.backgroundPosition =
    overlay.position ?? overlay.focus ?? "center";
  el.style.backgroundRepeat = "no-repeat";
  if (overlay.blend) el.style.mixBlendMode = overlay.blend;
  return el;
}

function createDotsLayer(dot) {
  const el = document.createElement("div");
  el.className = `slide-layer slide-layer--dots ${dot.position}`;
  el.style.backgroundImage = `url('${layerUrl(dot.asset)}')`;
  el.style.backgroundSize = "contain";
  el.style.backgroundRepeat = "no-repeat";
  if (dot.width) el.style.width = dot.width;
  if (dot.flip) el.style.transform = "scaleX(-1)";
  return el;
}

/**
 * Render a recipe object into a layers container.
 * @param {HTMLElement} container
 * @param {object} recipe
 */
export function renderBackgroundRecipe(container, recipe) {
  if (!recipe) return;

  container.replaceChildren();

  const focus = recipe.focus ?? "center";

  const base = document.createElement("div");
  base.className = "slide-layer slide-layer--base";
  base.style.backgroundImage = `url('${layerUrl(recipe.base)}')`;
  base.style.backgroundSize = "cover";
  base.style.backgroundPosition = focus;
  base.style.backgroundRepeat = "no-repeat";
  container.appendChild(base);

  (recipe.overlays ?? []).forEach((overlay) => {
    container.appendChild(createOverlayLayer(overlay));
  });

  (recipe.dots ?? []).forEach((dot) => {
    container.appendChild(createDotsLayer(dot));
  });
}

/**
 * Look up a recipe id in one or more catalogs and render it.
 * @param {HTMLElement} container
 * @param {string} recipeId
 * @param {...Record<string, object>} catalogs
 */
export function renderBackground(container, recipeId, ...catalogs) {
  let recipe = null;
  for (const catalog of catalogs) {
    if (catalog && catalog[recipeId]) {
      recipe = catalog[recipeId];
      break;
    }
  }
  if (!recipe) {
    console.warn(`Unknown background recipe: ${recipeId}`);
    return;
  }
  renderBackgroundRecipe(container, recipe);
}
