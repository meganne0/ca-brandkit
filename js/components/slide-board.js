/**
 * Editable tiled slide board — click to open, right-click to
 * duplicate/delete, drag to reorder, add via layout picker.
 */

import { renderBackground } from "../backgrounds.js?v=37";
import {
  LAYOUTS,
  renderLayout,
  refreshImageTitleLayouts,
} from "../layouts.js?v=39";
import { LAYOUT_SAMPLES } from "../layout-samples.js?v=2";
import { initImageLightbox } from "./lightbox.js?v=28";

function fitSlide(slide, stage) {
  if (!stage) return;
  slide.style.transform = `scale(${stage.clientWidth / 1920})`;
}

function paintSlide(slide) {
  const layers = slide.querySelector(".slide-layers");
  if (layers && slide.dataset.bg) {
    layers.replaceChildren();
    renderBackground(layers, slide.dataset.bg);
  }

  let content = {};
  try {
    content = JSON.parse(slide.dataset.content || "{}");
  } catch (e) {
    console.warn("Invalid data-content JSON", slide, e);
  }
  if (slide.dataset.layout) {
    renderLayout(slide, slide.dataset.layout, content);
  }
  initImageLightbox(slide);
}

function ensureMenu() {
  let menu = document.getElementById("slide-tile-menu");
  if (menu) return menu;

  menu = document.createElement("div");
  menu.id = "slide-tile-menu";
  menu.className = "slide-tile-menu";
  menu.hidden = true;
  menu.setAttribute("role", "menu");
  menu.innerHTML = `
    <button type="button" class="slide-tile-menu__item" role="menuitem" data-action="duplicate">
      Duplicate
    </button>
    <button type="button" class="slide-tile-menu__item slide-tile-menu__item--danger" role="menuitem" data-action="delete">
      Delete
    </button>
  `;
  document.body.appendChild(menu);
  return menu;
}

function ensurePicker() {
  let picker = document.getElementById("slide-layout-picker");
  if (picker) return picker;

  picker = document.createElement("div");
  picker.id = "slide-layout-picker";
  picker.className = "slide-layout-picker";
  picker.hidden = true;
  picker.innerHTML = `
    <button type="button" class="slide-layout-picker__backdrop" aria-label="Close"></button>
    <div class="slide-layout-picker__dialog" role="dialog" aria-modal="true" aria-labelledby="slide-layout-picker-title">
      <header class="slide-layout-picker__header">
        <div>
          <h2 id="slide-layout-picker-title">Add a slide</h2>
          <p>Choose a layout format — sample content is filled in for you.</p>
        </div>
        <button type="button" class="slide-layout-picker__close" aria-label="Close">✕</button>
      </header>
      <div class="slide-layout-picker__grid" id="slide-layout-picker-grid"></div>
    </div>
  `;
  document.body.appendChild(picker);
  return picker;
}

/**
 * @param {object} opts
 * @param {HTMLElement} opts.board
 * @param {HTMLElement[]} opts.slides
 * @param {(index: number) => void} opts.onOpen
 * @param {(count: number) => void} [opts.onChange]
 * @param {boolean} [opts.showBgInMeta]
 * @param {string} [opts.desc]
 * @param {boolean} [opts.enableAdd=true]
 */
export function initEditableSlideBoard({
  board,
  slides,
  onOpen,
  onChange,
  showBgInMeta = false,
  desc = "Click to enlarge · right-click to edit · drag to reorder",
  enableAdd = true,
}) {
  /** @type {{ tile: HTMLElement, slide: HTMLElement, stage: HTMLElement }[]} */
  const entries = [];
  let dragTile = null;
  let suppressClick = false;
  let menuTarget = null;
  let pickerBuilt = false;
  let openHandler = onOpen;
  let selectedIndex = -1;

  const menu = ensureMenu();
  const picker = enableAdd ? ensurePicker() : null;
  const pickerGrid = picker?.querySelector("#slide-layout-picker-grid");

  function tileNodes() {
    return [...board.querySelectorAll(".slide-tile:not(.slide-tile--add)")];
  }

  function syncFromDom() {
    entries.length = 0;
    slides.length = 0;
    tileNodes().forEach((tile) => {
      const stage = tile.querySelector(".slide-tile__stage");
      const slide = stage?.querySelector(".slide");
      if (!stage || !slide) return;
      entries.push({ tile, slide, stage });
      slides.push(slide);
    });
  }

  function refreshLabels() {
    entries.forEach(({ tile, slide }, i) => {
      const idEl = tile.querySelector(".slide-tile__id");
      const labelEl = tile.querySelector(".slide-tile__label");
      const title = slide.dataset.title || slide.dataset.layout || "Slide";
      if (idEl) {
        idEl.textContent = showBgInMeta
          ? `${slide.dataset.layout} · ${slide.dataset.bg}`
          : slide.dataset.layout;
      }
      if (labelEl) labelEl.textContent = `${i + 1}. ${title}`;
      tile.dataset.index = String(i);
      tile.setAttribute("aria-label", `Preview slide ${i + 1}: ${title}`);
    });
    onChange?.(entries.length);
    placeAddTile();
  }

  function closeMenu() {
    menu.hidden = true;
    menuTarget = null;
  }

  function openMenu(tile, x, y) {
    menuTarget = tile;
    menu.hidden = false;
    const pad = 8;
    const { width, height } = menu.getBoundingClientRect();
    const left = Math.min(x, window.innerWidth - width - pad);
    const top = Math.min(y, window.innerHeight - height - pad);
    menu.style.left = `${Math.max(pad, left)}px`;
    menu.style.top = `${Math.max(pad, top)}px`;
  }

  function closePicker() {
    if (!picker) return;
    picker.hidden = true;
    document.body.classList.remove("slide-layout-picker-open");
  }

  function buildPickerCards() {
    if (!pickerGrid || pickerBuilt) return;
    pickerBuilt = true;

    Object.entries(LAYOUTS).forEach(([recipeId, layout]) => {
      const sample = LAYOUT_SAMPLES[recipeId];
      if (!sample) return;

      const card = document.createElement("button");
      card.type = "button";
      card.className = "slide-layout-picker__card";
      card.dataset.layout = recipeId;

      const preview = document.createElement("div");
      preview.className = "slide-layout-picker__preview";

      const slide = document.createElement("div");
      slide.className = "slide";
      slide.dataset.layout = recipeId;
      slide.dataset.bg = sample.bg;
      slide.dataset.content = JSON.stringify(sample.content);
      const layers = document.createElement("div");
      layers.className = "slide-layers";
      layers.setAttribute("aria-hidden", "true");
      slide.appendChild(layers);
      preview.appendChild(slide);

      const meta = document.createElement("div");
      meta.className = "slide-layout-picker__meta";
      meta.innerHTML = `
        <span class="slide-layout-picker__id">${recipeId}</span>
        <span class="slide-layout-picker__label">${layout.label}</span>
      `;

      card.append(preview, meta);
      pickerGrid.appendChild(card);

      paintSlide(slide);
      const scale = () => fitSlide(slide, preview);
      new ResizeObserver(scale).observe(preview);
      requestAnimationFrame(scale);

      card.addEventListener("click", () => {
        addSlide(recipeId);
        closePicker();
      });
    });
  }

  function openPicker() {
    if (!picker) return;
    closeMenu();
    buildPickerCards();
    picker.hidden = false;
    document.body.classList.add("slide-layout-picker-open");
    refreshImageTitleLayouts(picker);
  }

  function placeAddTile() {
    if (!enableAdd) return;
    let add = board.querySelector(".slide-tile--add");
    if (!add) {
      add = document.createElement("button");
      add.type = "button";
      add.className = "slide-tile slide-tile--add";
      add.setAttribute("aria-label", "Add a new slide");
      add.innerHTML = `
        <div class="slide-tile__stage slide-tile__stage--add">
          <span class="slide-tile__add-plus" aria-hidden="true">+</span>
          <span class="slide-tile__add-label">Add slide</span>
        </div>
        <div class="slide-tile__meta">
          <span class="slide-tile__id">New</span>
          <span class="slide-tile__label">Choose a layout</span>
          <span class="slide-tile__desc">Browse all LY formats</span>
        </div>
      `;
      add.addEventListener("click", openPicker);
    }
    board.appendChild(add);
  }

  function createSlideElement(layoutId, overrides = null) {
    const sample = LAYOUT_SAMPLES[layoutId];
    const layout = LAYOUTS[layoutId];
    if (!sample || !layout) return null;

    const slide = document.createElement("section");
    slide.className = "slide";
    slide.dataset.title = overrides?.title || layout.label;
    slide.dataset.layout = layoutId;
    slide.dataset.bg = overrides?.bg || sample.bg;
    slide.dataset.content = JSON.stringify(overrides?.content ?? sample.content);
    const layers = document.createElement("div");
    layers.className = "slide-layers";
    layers.setAttribute("aria-hidden", "true");
    slide.appendChild(layers);
    return slide;
  }

  function createSlideFromDef(def) {
    const slide = document.createElement("section");
    slide.className = "slide";
    slide.dataset.title = def.title || LAYOUTS[def.layout]?.label || def.layout;
    slide.dataset.layout = def.layout;
    slide.dataset.bg = def.bg;
    slide.dataset.content = JSON.stringify(def.content ?? {});
    const layers = document.createElement("div");
    layers.className = "slide-layers";
    layers.setAttribute("aria-hidden", "true");
    slide.appendChild(layers);
    return slide;
  }

  function mountSlide(slide, insertBefore = null) {
    slide.hidden = false;
    if (!slide.querySelector(".slide-layers")) {
      const layers = document.createElement("div");
      layers.className = "slide-layers";
      layers.setAttribute("aria-hidden", "true");
      slide.prepend(layers);
    }

    const tile = document.createElement("div");
    tile.className = "slide-tile";
    tile.draggable = true;
    tile.tabIndex = 0;
    tile.setAttribute("role", "button");

    const stage = document.createElement("div");
    stage.className = "slide-tile__stage";
    stage.appendChild(slide);

    const meta = document.createElement("div");
    meta.className = "slide-tile__meta";
    meta.innerHTML = `
      <span class="slide-tile__id"></span>
      <span class="slide-tile__label"></span>
      <span class="slide-tile__desc">${desc}</span>
    `;

    tile.append(stage, meta);
    const addTile = board.querySelector(".slide-tile--add");
    if (insertBefore) board.insertBefore(tile, insertBefore);
    else if (addTile) board.insertBefore(tile, addTile);
    else board.appendChild(tile);

    paintSlide(slide);
    new ResizeObserver(() => fitSlide(slide, stage)).observe(stage);
    requestAnimationFrame(() => fitSlide(slide, stage));

    tile.addEventListener("click", () => {
      if (suppressClick) {
        suppressClick = false;
        return;
      }
      syncFromDom();
      const i = entries.findIndex((e) => e.tile === tile);
      if (i >= 0) openHandler?.(i);
    });

    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        syncFromDom();
        const i = entries.findIndex((en) => en.tile === tile);
        if (i >= 0) openHandler?.(i);
      }
    });

    tile.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      openMenu(tile, e.clientX, e.clientY);
    });

    tile.addEventListener("dragstart", (e) => {
      dragTile = tile;
      suppressClick = false;
      tile.classList.add("is-dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", tile.dataset.index || "0");
      closeMenu();
    });

    tile.addEventListener("dragend", () => {
      tile.classList.remove("is-dragging");
      board.querySelectorAll(".slide-tile").forEach((t) => {
        t.classList.remove("is-drag-over");
      });
      if (dragTile) suppressClick = true;
      dragTile = null;
      placeAddTile();
      syncFromDom();
      refreshLabels();
      refreshImageTitleLayouts(board);
    });

    tile.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (!dragTile || dragTile === tile) return;
      tile.classList.add("is-drag-over");

      const rect = tile.getBoundingClientRect();
      const before = e.clientX < rect.left + rect.width / 2;
      board.insertBefore(dragTile, before ? tile : tile.nextSibling);
      placeAddTile();
      syncFromDom();
      refreshLabels();
    });

    tile.addEventListener("dragleave", () => {
      tile.classList.remove("is-drag-over");
    });

    tile.addEventListener("drop", (e) => {
      e.preventDefault();
      tile.classList.remove("is-drag-over");
      placeAddTile();
      syncFromDom();
      refreshLabels();
    });

    return tile;
  }

  function addSlide(layoutId) {
    const slide = createSlideElement(layoutId);
    if (!slide) return;
    mountSlide(slide);
    syncFromDom();
    refreshLabels();
    refreshImageTitleLayouts(board);
  }

  function duplicateTile(tile) {
    syncFromDom();
    const entry = entries.find((e) => e.tile === tile);
    if (!entry) return;

    const clone = entry.slide.cloneNode(true);
    clone.removeAttribute("id");
    clone.querySelectorAll(".slide-content, .ca-footer").forEach((n) => n.remove());
    const layers = clone.querySelector(".slide-layers");
    if (layers) layers.replaceChildren();

    mountSlide(clone, tile.nextSibling);
    syncFromDom();
    refreshLabels();
    refreshImageTitleLayouts(board);
  }

  function deleteTile(tile) {
    syncFromDom();
    if (entries.length <= 1) return;
    tile.remove();
    syncFromDom();
    refreshLabels();
  }

  menu.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn || !menuTarget) return;
    const action = btn.dataset.action;
    const target = menuTarget;
    closeMenu();
    if (action === "duplicate") duplicateTile(target);
    if (action === "delete") deleteTile(target);
  });

  document.addEventListener("pointerdown", (e) => {
    if (!menu.hidden && !menu.contains(e.target)) closeMenu();
  });

  if (picker) {
    picker
      .querySelector(".slide-layout-picker__backdrop")
      .addEventListener("click", closePicker);
    picker
      .querySelector(".slide-layout-picker__close")
      .addEventListener("click", closePicker);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeMenu();
    if (picker && !picker.hidden) closePicker();
  });

  // Initial mount
  const initial = [...slides];
  slides.length = 0;
  board.replaceChildren();
  initial.forEach((slide) => mountSlide(slide));
  placeAddTile();
  syncFromDom();
  refreshLabels();
  refreshImageTitleLayouts(board);

  function setSelectedIndex(i) {
    selectedIndex = i;
    entries.forEach(({ tile }, idx) => {
      tile.classList.toggle("is-selected", idx === i);
    });
  }

  function serialize() {
    syncFromDom();
    return entries.map(({ slide }) => {
      let content = {};
      try {
        content = JSON.parse(slide.dataset.content || "{}");
      } catch {
        content = {};
      }
      return {
        title: slide.dataset.title || "",
        layout: slide.dataset.layout,
        bg: slide.dataset.bg,
        content,
      };
    });
  }

  function load(defs) {
    if (!Array.isArray(defs) || !defs.length) return;
    tileNodes().forEach((t) => t.remove());
    slides.length = 0;
    entries.length = 0;
    defs.forEach((def) => {
      const slide = createSlideFromDef(def);
      mountSlide(slide);
    });
    placeAddTile();
    syncFromDom();
    refreshLabels();
    refreshImageTitleLayouts(board);
    setSelectedIndex(-1);
  }

  function updateSlideContent(index, content) {
    syncFromDom();
    const entry = entries[index];
    if (!entry) return;
    entry.slide.dataset.content = JSON.stringify(content);
    entry.slide.querySelectorAll(".slide-content, .ca-footer").forEach((n) => n.remove());
    const layers = entry.slide.querySelector(".slide-layers");
    if (layers) layers.replaceChildren();
    paintSlide(entry.slide);
    fitSlide(entry.slide, entry.stage);
    refreshImageTitleLayouts(entry.slide);
    refreshLabels();
  }

  function repaintSlide(index) {
    syncFromDom();
    const entry = entries[index];
    if (!entry) return;
    entry.slide.querySelectorAll(".slide-content, .ca-footer").forEach((n) => n.remove());
    const layers = entry.slide.querySelector(".slide-layers");
    if (layers) layers.replaceChildren();
    paintSlide(entry.slide);
    fitSlide(entry.slide, entry.stage);
    refreshImageTitleLayouts(entry.slide);
  }

  return {
    syncFromDom,
    refreshLabels,
    addSlide,
    openPicker,
    serialize,
    load,
    updateSlideContent,
    repaintSlide,
    setOnOpen(fn) {
      openHandler = fn;
    },
    setSelectedIndex,
    getSelectedIndex() {
      return selectedIndex;
    },
    get length() {
      return entries.length;
    },
    fitAll() {
      entries.forEach(({ slide, stage }) => fitSlide(slide, stage));
      refreshImageTitleLayouts(board);
    },
    fitSlide,
    paintSlide,
  };
}
