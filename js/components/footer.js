/**
 * SlideFooter — brand bar for non-cover slides.
 * Logo left + tagline. Full-width translucent black strip.
 */
export const FOOTER_LOGO_SRC =
  "/visual%20assets/logo/logo-horizontal-white-orange.svg";
export const FOOTER_TAGLINE = "Proactive defense. Prebreach technology.";

export function SlideFooter({
  logoSrc = FOOTER_LOGO_SRC,
  tagline = FOOTER_TAGLINE,
} = {}) {
  const footer = document.createElement("footer");
  footer.className = "ca-footer";
  footer.setAttribute("data-component", "SlideFooter");

  footer.innerHTML = `
    <div class="ca-footer__inner">
      <img class="ca-footer__logo" src="${logoSrc}" alt="CyberArmor" />
      <p class="type-numeral type-numeral--sm ca-footer__tagline">${tagline}</p>
    </div>
  `;

  return footer;
}

export function mountSlideFooter(slide, options) {
  slide.querySelector('[data-component="SlideFooter"]')?.remove();
  slide.classList.add("slide--with-footer");
  const footer = SlideFooter(options);
  slide.appendChild(footer);
  return footer;
}
