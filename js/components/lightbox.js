/**
 * ImageLightbox — expand slide images full-size on click; close on click or Esc.
 */
export function ImageLightbox() {
  const root = document.createElement("div");
  root.className = "ca-lightbox";
  root.setAttribute("data-component", "ImageLightbox");
  root.hidden = true;
  root.innerHTML = `
    <button type="button" class="ca-lightbox__backdrop" aria-label="Close image"></button>
    <img class="ca-lightbox__image" alt="" />
  `;

  const img = root.querySelector(".ca-lightbox__image");
  const backdrop = root.querySelector(".ca-lightbox__backdrop");

  function open(src, alt = "") {
    img.src = src;
    img.alt = alt;
    root.hidden = false;
    document.body.classList.add("lightbox-open");
  }

  function close() {
    root.hidden = true;
    img.removeAttribute("src");
    img.alt = "";
    document.body.classList.remove("lightbox-open");
  }

  function isOpen() {
    return !root.hidden;
  }

  backdrop.addEventListener("click", close);
  img.addEventListener("click", close);

  return { root, open, close, isOpen };
}

const SKIP_SELECTOR =
  ".logo, .logo--cover, .ca-footer__logo, .ca-lightbox__image";

export function initImageLightbox(root = document) {
  let lightbox = document.querySelector('[data-component="ImageLightbox"]');
  let api;

  if (!lightbox) {
    api = ImageLightbox();
    document.body.appendChild(api.root);
  } else {
    api = {
      open(src, alt) {
        const img = lightbox.querySelector(".ca-lightbox__image");
        img.src = src;
        img.alt = alt || "";
        lightbox.hidden = false;
        document.body.classList.add("lightbox-open");
      },
      close() {
        const img = lightbox.querySelector(".ca-lightbox__image");
        lightbox.hidden = true;
        img.removeAttribute("src");
        document.body.classList.remove("lightbox-open");
      },
      isOpen() {
        return !lightbox.hidden;
      },
    };
  }

  root.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (target.closest(SKIP_SELECTOR) || target.matches(SKIP_SELECTOR)) return;
    if (!target.closest(".slide")) return;

    e.preventDefault();
    e.stopPropagation();

    if (api.isOpen() && api.root?.querySelector(".ca-lightbox__image")?.src === target.currentSrc) {
      api.close();
      return;
    }

    api.open(target.currentSrc || target.src, target.alt || "");
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && api.isOpen()) {
      e.preventDefault();
      api.close();
    }
  });

  return api;
}
