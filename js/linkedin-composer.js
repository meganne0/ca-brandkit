/**
 * Freeform LinkedIn composer — stackable components, live preview, assets.
 */
import { mountSlideFooter } from "./components/footer.js?v=9";

const LOGO_SRC = "/visual%20assets/logo/logo-horizontal-white-orange.svg";

export const COMPOSER_COMPONENT_TYPES = [
  { type: "eyebrow", label: "Eyebrow" },
  { type: "title", label: "Title" },
  { type: "body", label: "Body text" },
  { type: "image", label: "Image" },
  { type: "cards-2x2", label: "2×2 cards" },
  { type: "columns-3", label: "3 columns" },
  { type: "metric", label: "Statistic" },
  { type: "person", label: "Avatar / person" },
];

let uidSeq = 0;
function uid(prefix = "c") {
  uidSeq += 1;
  return `${prefix}-${Date.now().toString(36)}-${uidSeq}`;
}

function withBreaks(text) {
  return String(text ?? "").replace(/\r\n|\r|\n/g, "<br>");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function defaultBgForFormat(formatId, backgrounds) {
  const match = Object.entries(backgrounds).find(
    ([, recipe]) => recipe.format === formatId,
  );
  return match?.[0] ?? Object.keys(backgrounds)[0] ?? "";
}

export function backgroundsForFormat(formatId, backgrounds) {
  return Object.entries(backgrounds)
    .filter(([, recipe]) => recipe.format === formatId)
    .map(([id, recipe]) => ({ id, label: recipe.label || id }));
}

export function createComponent(type, seed = {}) {
  const id = seed.id || uid(type);
  switch (type) {
    case "eyebrow":
      return { id, type, text: seed.text ?? "PreBreach Intelligence" };
    case "title":
      return {
        id,
        type,
        text: seed.text ?? "See the compromise before the breach.",
        size: seed.size ?? "lg",
      };
    case "body":
      return {
        id,
        type,
        text:
          seed.text ??
          "Credentials are collected in the open, long before they show up on the dark web.",
      };
    case "image":
      return {
        id,
        type,
        src: seed.src ?? "",
        alt: seed.alt ?? "",
        fit: seed.fit ?? "cover",
      };
    case "cards-2x2":
      return {
        id,
        type,
        cards: seed.cards ?? [
          { label: "Attack", body: "Describe the attack." },
          { label: "Result", body: "Describe the result." },
          { label: "Method", body: "Describe the method." },
          { label: "Impact", body: "Describe the impact." },
        ],
      };
    case "columns-3":
      return {
        id,
        type,
        heading: seed.heading ?? "",
        columns: seed.columns ?? [
          { number: "01", title: "Monitor", body: "Get alerted when your data is found in an active campaign." },
          { number: "02", title: "Hunt", body: "Full data platform access for hunting and investigating." },
          { number: "03", title: "Features", body: "Monitoring vs full hunt and investigation." },
        ],
      };
    case "metric":
      return {
        id,
        type,
        value: seed.value ?? "30%",
        text: seed.text ?? "of attacks involved abuse of user identities as the initial entry point",
        source: seed.source ?? "IBM",
        sourceUrl: seed.sourceUrl ?? "",
      };
    case "person":
      return {
        id,
        type,
        name: seed.name ?? "Name",
        role: seed.role ?? "Role",
        avatar: seed.avatar ?? "",
      };
    default:
      return { id, type: "body", text: "" };
  }
}

export function createComposerState({
  format = "square",
  backgrounds = {},
} = {}) {
  return {
    format,
    bg: defaultBgForFormat(format, backgrounds),
    decor: "",
    footer: true,
    logo: true,
    components: [
      createComponent("eyebrow"),
      createComponent("title"),
      createComponent("body"),
    ],
  };
}

function renderComponent(component) {
  const wrap = document.createElement("div");
  wrap.className = `li-composer-block li-composer-block--${component.type}`;
  wrap.dataset.componentId = component.id;

  if (component.type === "eyebrow") {
    wrap.innerHTML = `<p class="type-label">${withBreaks(component.text)}</p>`;
  } else if (component.type === "title") {
    const size = ["sm", "md", "lg", "xl"].includes(component.size)
      ? component.size
      : "lg";
    wrap.innerHTML = `<h2 class="type-h2 li-composer-block__title li-composer-block__title--${size}">${withBreaks(component.text)}</h2>`;
  } else if (component.type === "body") {
    wrap.innerHTML = `<p class="type-body">${withBreaks(component.text)}</p>`;
  } else if (component.type === "image") {
    if (component.src) {
      wrap.innerHTML = `<img class="li-composer-block__image" src="${escapeHtml(component.src)}" alt="${escapeHtml(component.alt)}" style="object-fit:${escapeHtml(component.fit || "cover")}" />`;
    } else {
      wrap.innerHTML = `<div class="li-composer-block__image-empty">Add an image</div>`;
    }
  } else if (component.type === "cards-2x2") {
    const cards = (component.cards ?? []).slice(0, 4);
    wrap.innerHTML = `
      <div class="li-layout-cards__grid li-composer-block__cards">
        ${cards
          .map(
            (card) => `
              <article class="li-layout-cards__card">
                ${card.label ? `<p class="type-label">${withBreaks(card.label)}</p>` : ""}
                ${card.body ? `<p class="type-body">${withBreaks(card.body)}</p>` : ""}
              </article>
            `,
          )
          .join("")}
      </div>
    `;
  } else if (component.type === "columns-3") {
    const columns = (component.columns ?? []).slice(0, 3);
    wrap.innerHTML = `
      ${component.heading ? `<h2 class="type-h2 li-layout-columns__heading">${withBreaks(component.heading)}</h2>` : ""}
      <div class="li-layout-columns__grid">
        ${columns
          .map(
            (col) => `
              <article class="li-layout-columns__col">
                <p class="type-numeral type-numeral--xl li-layout-columns__num">${withBreaks(col.number ?? "")}</p>
                ${col.title ? `<h3 class="type-h5 li-layout-columns__title">${withBreaks(col.title)}</h3>` : ""}
                ${col.body ? `<p class="type-body li-layout-columns__body">${withBreaks(col.body)}</p>` : ""}
              </article>
            `,
          )
          .join("")}
      </div>
    `;
  } else if (component.type === "metric") {
    wrap.innerHTML = `
      <article class="li-composer-block__metric">
        <p class="type-metric li-composer-block__metric-value">${withBreaks(component.value)}</p>
        <p class="type-body">${withBreaks(component.text)}</p>
        ${component.source ? `<p class="type-label">${withBreaks(component.source)}</p>` : ""}
      </article>
    `;
  } else if (component.type === "person") {
    wrap.innerHTML = `
      <article class="li-composer-block__person">
        ${component.avatar ? `<img class="li-composer-block__avatar" src="${escapeHtml(component.avatar)}" alt="" />` : `<div class="li-composer-block__avatar li-composer-block__avatar--empty"></div>`}
        <div>
          <p class="type-h5">${withBreaks(component.name)}</p>
          <p class="type-label">${withBreaks(component.role)}</p>
        </div>
      </article>
    `;
  }
  return wrap;
}

/**
 * Paint a freeform composer state onto a LinkedIn canvas element.
 */
export function paintComposerCanvas(canvas, state, {
  formats,
  renderBackground,
  renderDecor,
  includeBackground = true,
} = {}) {
  const format = formats[state.format] ?? formats.square;
  canvas.replaceChildren();
  canvas.className = `canvas ${format.className}`;
  if (state.footer) canvas.classList.add("canvas--with-footer", "slide--with-footer");
  else canvas.classList.remove("canvas--with-footer", "slide--with-footer");

  if (includeBackground) {
    const layers = document.createElement("div");
    layers.className = "slide-layers";
    layers.setAttribute("aria-hidden", "true");
    canvas.appendChild(layers);
    renderBackground?.(layers, state.bg);
  } else {
    canvas.style.background = "transparent";
  }

  if (state.decor && renderDecor) {
    // Decor inserts before .li-content; create a placeholder first
    const placeholder = document.createElement("div");
    placeholder.className = "li-content";
    canvas.appendChild(placeholder);
    renderDecor(canvas, state.decor);
    placeholder.remove();
  }

  const content = document.createElement("div");
  content.className = "li-content li-layout-composer";
  if (state.logo) content.classList.add("li-layout-composer--with-logo");
  (state.components ?? []).forEach((component) => {
    content.appendChild(renderComponent(component));
  });
  canvas.appendChild(content);

  if (state.logo) {
    const logo = document.createElement("img");
    logo.className = "li-composer-logo";
    logo.src = LOGO_SRC;
    logo.alt = "CyberArmor";
    canvas.appendChild(logo);
  }

  if (state.footer) mountSlideFooter(canvas);
}

export function moveComponent(components, id, dir) {
  const list = [...components];
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) return list;
  const next = index + dir;
  if (next < 0 || next >= list.length) return list;
  const [item] = list.splice(index, 1);
  list.splice(next, 0, item);
  return list;
}

export function removeComponent(components, id) {
  return components.filter((item) => item.id !== id);
}

export function updateComponent(components, id, patch) {
  return components.map((item) =>
    item.id === id ? { ...item, ...patch } : item,
  );
}

export function componentFromAsset(asset, kind) {
  if (kind === "person" || asset.name) {
    return createComponent("person", {
      name: asset.name,
      role: asset.role,
      avatar: asset.avatar,
    });
  }
  if (kind === "metric" || asset.value) {
    return createComponent("metric", {
      value: asset.value,
      text: asset.text,
      source: asset.source,
      sourceUrl: asset.sourceUrl,
    });
  }
  if (kind === "image" || asset.src) {
    return createComponent("image", {
      src: asset.src,
      alt: asset.label || "",
    });
  }
  if (asset.kind === "steps" && Array.isArray(asset.content?.steps)) {
    const steps = asset.content.steps;
    return createComponent("columns-3", {
      heading: asset.label || "",
      columns: steps.map((step, i) => ({
        number: String(i + 1).padStart(2, "0"),
        title: step.title ?? "",
        body: step.description ?? "",
      })),
    });
  }
  if (asset.kind === "team" && Array.isArray(asset.content?.people)) {
    // Insert first person; caller can add more
    const person = asset.content.people[0];
    return createComponent("person", person);
  }
  return createComponent("body", { text: asset.label || asset.description || "" });
}
