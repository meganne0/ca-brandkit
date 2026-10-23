import { renderBackground } from "./backgrounds.js?v=50";
import {
  BASE_FIELD,
  buildLayerCatalog,
  channelLabel,
  formatOpacity,
  layerAssetUrl,
  loadLayerDetails,
} from "./background-layers.js?v=12";

export function mountRecipePage({
  groups,
  recipes,
  catalogGroups,
  includeBaseFill = false,
  slideIdTest = () => true,
}) {
      const gallery = document.getElementById("gallery");

      function escapeHtml(value) {
        return String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      }

      function slideUse(layer) {
        return layer.uses.find((use) => slideIdTest(String(use.id))) || layer.uses[0];
      }

      groups.forEach((group) => {
        const section = document.createElement("section");
        section.className = "bg-gallery__section";
        section.innerHTML = `<h2 class="bg-gallery__section-title">${group.title}</h2>`;

        const grid = document.createElement("div");
        grid.className = "bg-gallery__grid";

        Object.entries(recipes)
          .filter(([, recipe]) => recipe.group === group.id)
          .forEach(([id, recipe]) => {
            const card = document.createElement("article");
            card.className = "bg-card";

            const preview = document.createElement("div");
            preview.className = "bg-card__preview";

            const layers = document.createElement("div");
            layers.className = "slide-layers";
            preview.appendChild(layers);

            const meta = document.createElement("div");
            meta.className = "bg-card__meta";
            const field = BASE_FIELD[recipe.base];
            meta.innerHTML = `
              <span class="bg-card__id">${id}</span>
              <span class="bg-card__label">${escapeHtml(recipe.label)}</span>
              <p class="bg-card__desc">${
                recipe.fill
                  ? `Base fill #060817 → #050018 → #040937. Banner base ${escapeHtml(recipe.baseSize)} at ${escapeHtml(recipe.basePosition)}, ${Math.round(recipe.baseOpacity * 100)}%.`
                  : `Field under the overlays: ${escapeHtml(field.hex)}. Pieces are separated below.`
              }</p>
            `;

            card.append(preview, meta);
            grid.appendChild(card);
            renderBackground(layers, id);
          });

        section.appendChild(grid);
        gallery.appendChild(section);
      });

      const sections = buildLayerCatalog(catalogGroups, { includeBaseFill });

      const layersRoot = document.getElementById("layers");
      const dialog = document.getElementById("layer-dialog");
      const stage = document.getElementById("layer-dialog-stage");
      const stageUnder = document.getElementById("layer-dialog-under");
      const stageArt = document.getElementById("layer-dialog-art");
      const dialogBody = document.getElementById("layer-dialog-body");

      function previewClass(kind) {
        if (kind === "Swirls") return " is-swirl";
        if (kind === "Dots") return " is-dots";
        return "";
      }

      function pieceMarkup(layer, caption, opacity = 1, crop) {
        let preview;
        if (layer.kind === "Field") {
          preview = `<span class="layer-card__preview" style="background:${escapeHtml(layer.stops[0].hex)}"></span>`;
        } else if (layer.gradient) {
          preview = `<span class="layer-card__preview" style="background-image:${layer.gradient}"></span>`;
        } else if (layer.kind === "Bases") {
          const fade = opacity < 1 ? `opacity:${opacity};` : "";
          const size = crop?.size ? `background-size:${crop.size};` : "";
          const position = crop?.position ? `background-position:${crop.position};` : "";
          preview = `<span class="layer-card__preview" style="${fade}${size}${position}background-image:url('${layerAssetUrl(layer.asset)}')"></span>`;
        } else {
          const artClass = previewClass(layer.kind);
          preview = `<span class="layer-card__preview is-checker"><span class="layer-card__art is-piece${artClass}" style="background-image:url('${layerAssetUrl(layer.asset)}')"></span></span>`;
        }
        return `
          ${preview}
          <span class="layer-card__name">${escapeHtml(layer.asset)}</span>
          <span class="layer-card__use">${escapeHtml(caption)}</span>
        `;
      }

      function appendPiece(row, layer, caption, opacity = 1, crop) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "layer-card";
        card.innerHTML = pieceMarkup(layer, caption, opacity, crop);
        card.addEventListener("click", () => openLayer(layer));
        row.appendChild(card);
      }

      const breakdown = document.getElementById("breakdown");
      const byAsset = new Map(sections.flatMap((section) => section.layers.map((layer) => [layer.asset, layer])));
      const breakIntro = document.createElement("p");
      breakIntro.className = "layer-catalog__intro";
      breakIntro.textContent =
        "Each recipe split into its pieces. Every thumbnail is one layer on its own, not stacked with the others.";
      breakdown.appendChild(breakIntro);
      const breakTitle = document.createElement("h2");
      breakTitle.className = "bg-gallery__section-title";
      breakTitle.textContent = "Recipe breakdown";
      breakdown.appendChild(breakTitle);

      Object.entries(recipes).forEach(([id, recipe]) => {
        const field = BASE_FIELD[recipe.base];
        const block = document.createElement("section");
        block.className = "recipe-break";
        block.id = `break-${id}`;
        block.innerHTML = `
          <div class="recipe-break__head">
            <h3>${id}</h3>
            <p>${escapeHtml(recipe.label)}</p>
          </div>
        `;
        const row = document.createElement("div");
        row.className = "piece-row";
        if (recipe.fill) {
          appendPiece(row, {
            asset: "#060817 → #050018 → #040937",
            kind: "Base fill",
            gradient: recipe.fill,
            path: "Dark Slides fill",
            sizing: "Full canvas, behind the PNG plate.",
            note: `The middle of the gradient is #050018. The PNG plate on ${id} is at ${Math.round(recipe.baseOpacity * 100)}% opacity, so this fill stays visible.`,
            stops: [
              { offset: "0%", hex: "#060817", opacity: "100%" },
              { offset: "50%", hex: "#050018", opacity: "100%" },
              { offset: "100%", hex: "#040937", opacity: "100%" },
            ],
            uses: [
              {
                id,
                label: recipe.label,
                channel: "slide",
                opacity: 1,
                blend: null,
                placement: "behind the plate",
              },
            ],
          }, "Base fill · #060817 → #050018 → #040937");
        } else {
          appendPiece(row, {
            asset: field.hex,
            kind: "Field",
            gradient: `linear-gradient(${field.hex}, ${field.hex})`,
            path: `Sampled center of ${recipe.base}`,
            sizing: "Flat sample of the plate's dark field. Glows and swirls are separate pieces, painted above the plate.",
            note: `On ${id} the overlays sit on ${recipe.base}. The dark field at the center of that plate is ${field.hex}. Nearby dark pixels cluster around ${field.cluster}.`,
            stops: [{ offset: "center", hex: field.hex, opacity: "100%" }],
            uses: [
              {
                id,
                label: recipe.label,
                channel: "slide",
                opacity: 1,
                blend: null,
                placement: "under the overlays",
              },
            ],
          }, `Field · ${field.hex}`);
        }
        const plateOpacity = recipe.baseOpacity ?? 1;
        const plateCaption = recipe.baseSize
          ? `Banner base · ${recipe.baseSize} · ${recipe.basePosition} · opacity ${plateOpacity}`
          : plateOpacity < 1
            ? `Plate · ${recipe.base} · opacity ${plateOpacity}`
            : `Plate · ${recipe.base}`;
        appendPiece(row, byAsset.get(recipe.base), plateCaption, plateOpacity, {
          size: recipe.baseSize,
          position: recipe.basePosition,
        });
        (recipe.overlays ?? []).forEach((overlay) => {
          const kind = /swirl/i.test(overlay.asset)
            ? "Swirl"
            : /glow/i.test(overlay.asset)
              ? "Glow"
              : "Dots";
          appendPiece(
            row,
            byAsset.get(overlay.asset),
            `${kind} · opacity ${overlay.opacity ?? 1}${overlay.blend ? ` · ${overlay.blend}` : ""}`
          );
        });
        (recipe.dots ?? []).forEach((dot) => {
          appendPiece(
            row,
            byAsset.get(dot.asset),
            `Dots · ${dot.position}${dot.width ? ` · ${dot.width}` : ""}${dot.flip ? " · flipped" : ""}`
          );
        });
        block.appendChild(row);
        breakdown.appendChild(block);
      });

      const intro = document.createElement("p");
      intro.className = "layer-catalog__intro";
      intro.textContent =
        "The same pieces grouped by type. Each one is still a single layer.";
      layersRoot.appendChild(intro);

      sections.forEach((sectionData) => {
        const section = document.createElement("section");
        section.className = "bg-gallery__section";
        section.innerHTML = `<h2 class="bg-gallery__section-title">${sectionData.kind}</h2>`;
        const grid = document.createElement("div");
        grid.className = "layer-grid";

        sectionData.layers.forEach((layer) => {
          const card = document.createElement("button");
          card.type = "button";
          card.className = "layer-card";
          const shown = slideUse(layer);
          const field = BASE_FIELD[layer.kind === "Bases" ? layer.asset : shown?.base];
          const slideUses = layer.uses.filter((use) => slideIdTest(String(use.id)));
          const useLabel = layer.summary
            ? layer.summary
            : layer.kind === "Bases" && field
              ? `Field ${field.hex}`
              : layer.kind === "Dots"
                ? [...new Set(slideUses.map((use) => use.id))].join(", ")
                : slideUses
                    .map((use) => `${use.id} · ${formatOpacity(use.opacity)}`)
                    .join(", ");
          card.innerHTML = pieceMarkup(layer, useLabel);
          card.addEventListener("click", () => openLayer(layer));
          grid.appendChild(card);
        });

        section.appendChild(grid);
        layersRoot.appendChild(section);
      });

      function paintsHtml(details, asset) {
        if (details.kind === "raster") {
          const field = BASE_FIELD[asset];
          if (!field) {
            return `<p class="layer-dialog__note">Raster plate. The color is painted in the PNG, so there is no hex in the recipe.</p>`;
          }
          return `
            <ul class="layer-paints">
              <li class="layer-swatch">
                <span class="layer-swatch__chip" style="background:${escapeHtml(field.hex)}"></span>
                <span>${escapeHtml(field.hex)} at the center of the plate</span>
              </li>
            </ul>
            <p class="layer-dialog__note">This is the color under the glows and swirls. The plate is a PNG, so the field is painted rather than a flat fill. Nearby dark pixels cluster around ${escapeHtml(field.cluster)}.</p>
          `;
        }
        if (!details.paints.length && !details.blurs.length) {
          return `<p class="layer-dialog__note">No fill or stroke colors were found in this SVG.</p>`;
        }
        const colors = details.paints
          .map((paint) => {
            if (paint.type === "solid") {
              return `
                <li class="layer-swatch">
                  <span class="layer-swatch__chip" style="background:${escapeHtml(paint.hex)}"></span>
                  <span>${escapeHtml(paint.hex)} · ${escapeHtml(paint.channel)} opacity ${escapeHtml(paint.fillOpacity)}</span>
                </li>
              `;
            }
            const stops = paint.stops
              .map(
                (stop) => `
                  <li class="layer-gradient__stop">
                    <span class="layer-swatch__chip" style="background:${escapeHtml(stop.hex)}"></span>
                    <span>${escapeHtml(stop.offset)} · ${escapeHtml(stop.hex)} · ${escapeHtml(stop.opacity)}</span>
                  </li>
                `
              )
              .join("");
            return `
              <li>
                <div class="layer-gradient">${paint.channel === "stroke" ? "Stroke gradient" : "Gradient"} · opacity ${escapeHtml(paint.fillOpacity)}</div>
                <ul class="layer-gradient__stops">${stops}</ul>
              </li>
            `;
          })
          .join("");
        const blur = details.blurs.length
          ? `<p class="layer-dialog__note">Gaussian blur, stdDeviation ${escapeHtml(details.blurs.join(", "))}</p>`
          : "";
        return `${blur}<ul class="layer-paints">${colors}</ul>`;
      }

      function usesHtml(layer) {
        const rows = layer.uses
          .map((use) => {
            const opacity =
              layer.kind === "Dots" ? "0.95 CSS" : formatOpacity(use.opacity);
            return `
              <tr>
                <td>${escapeHtml(use.id)}<br>${escapeHtml(use.label)}</td>
                <td>${escapeHtml(channelLabel(use.channel))}</td>
                <td>${escapeHtml(opacity)}</td>
                <td>${escapeHtml(use.blend || "normal")}</td>
                <td>${escapeHtml(use.placement)}</td>
              </tr>
            `;
          })
          .join("");
        return `
          <table class="layer-uses">
            <thead>
              <tr>
                <th>Recipe</th>
                <th>Channel</th>
                <th>Opacity</th>
                <th>Blend</th>
                <th>Placement</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        `;
      }

      let openToken = 0;

      function clearStage() {
        stage.style.backgroundImage = "";
        stage.classList.remove("is-checker");
        stageUnder.style.backgroundImage = "";
        stageArt.style.backgroundImage = "";
        stageArt.style.opacity = "";
        stageArt.className = "layer-dialog__art";
      }

      function underNote(layer) {
        const shown = slideUse(layer);
        if (!shown?.base || layer.kind === "Bases" || layer.gradient) return "";
        const field = BASE_FIELD[shown.base];
        return `
          <p class="layer-dialog__note">This preview is the file on its own. On ${escapeHtml(shown.id)} it is painted over ${escapeHtml(shown.base)}, whose dark field is ${escapeHtml(field.hex)}.</p>
        `;
      }

      function openLayer(layer) {
        const token = ++openToken;
        document.getElementById("layer-dialog-kicker").textContent = layer.kind.replace(/s$/, "");
        document.getElementById("layer-dialog-title").textContent = layer.asset;
        document.getElementById("layer-dialog-path").textContent =
          layer.path || `visual assets/background_assets/${layer.asset}`;
        clearStage();
        stage.classList.toggle("is-checker", !layer.gradient && layer.kind !== "Bases");
        if (layer.gradient) {
          stage.style.backgroundImage = layer.gradient;
        } else if (layer.kind === "Bases") {
          stage.style.backgroundImage = `url('${layerAssetUrl(layer.asset)}')`;
        } else {
          stageArt.style.backgroundImage = `url('${layerAssetUrl(layer.asset)}')`;
          stageArt.classList.add("is-piece");
          if (layer.kind === "Swirls") stageArt.classList.add("is-swirl");
          if (layer.kind === "Dots") stageArt.classList.add("is-dots");
        }
        dialog.showModal();
        if (layer.gradient) {
          const stops = layer.stops
            .map(
              (stop) => `
                <li class="layer-swatch">
                  <span class="layer-swatch__chip" style="background:${escapeHtml(stop.hex)}"></span>
                  <span>${escapeHtml(stop.offset)} · ${escapeHtml(stop.hex)} · ${escapeHtml(stop.opacity)}</span>
                </li>
              `
            )
            .join("");
          dialogBody.innerHTML = `
            <dl class="layer-facts">
              <div><dt>Type</dt><dd>CSS</dd></div>
              <div><dt>Code</dt><dd>${escapeHtml(layer.gradient)}</dd></div>
              <div><dt>Opacity</dt><dd>1 · 100%</dd></div>
              <div><dt>Sizing</dt><dd>${escapeHtml(layer.sizing)}</dd></div>
            </dl>
            <h3>Color</h3>
            <ul class="layer-paints">${stops}</ul>
            <p class="layer-dialog__note">${escapeHtml(layer.note)}</p>
            <h3>Used in</h3>
            ${usesHtml(layer)}
          `;
          return;
        }
        dialogBody.innerHTML = `
          <p class="layer-dialog__status">Reading the file…</p>
          <h3>Used in</h3>
          ${usesHtml(layer)}
        `;
        loadLayerDetails(layer.asset)
          .then((details) => {
            if (token !== openToken) return;
            const size =
              details.width && details.height
                ? `${details.width} × ${details.height}`
                : "—";
            dialogBody.innerHTML = `
              <dl class="layer-facts">
                <div><dt>File</dt><dd>${escapeHtml(layer.asset)}</dd></div>
                <div><dt>Type</dt><dd>${details.kind === "svg" ? "SVG" : "PNG"}</dd></div>
                <div><dt>Size</dt><dd>${escapeHtml(size)}</dd></div>
                <div><dt>Sizing</dt><dd>${escapeHtml(layer.sizing)}</dd></div>
              </dl>
            ${underNote(layer)}
            <h3>Color</h3>
            ${paintsHtml(details, layer.asset)}
              <h3>Used in</h3>
              ${usesHtml(layer)}
            `;
          })
          .catch(() => {
            if (token !== openToken) return;
            dialogBody.innerHTML = `
              <p class="layer-dialog__note">Could not read this file.</p>
              <h3>Used in</h3>
              ${usesHtml(layer)}
            `;
          });
      }

      document.getElementById("layer-dialog-close").addEventListener("click", () => {
        dialog.close();
      });
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    
}
