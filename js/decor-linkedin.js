/**
 * LinkedIn decor recipes (LI-DX …)
 * Optional atmosphere layers between BG and layout. None shipped currently.
 */

export const LINKEDIN_DECORS = {};

/**
 * Render a decor recipe onto a canvas (between BG layers and layout content).
 * @param {HTMLElement} canvas
 * @param {string} decorId
 */
export function renderLinkedInDecor(canvas, decorId) {
  canvas.querySelector(".li-decor")?.remove();
  if (!decorId) {
    delete canvas.dataset.decor;
    return;
  }

  // No decor recipes registered — clear any requested id
  delete canvas.dataset.decor;
  if (decorId) {
    console.warn(`Unknown LinkedIn decor: ${decorId}`);
  }
}
