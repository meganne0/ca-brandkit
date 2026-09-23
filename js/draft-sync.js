/**
 * Persist draft slides to localStorage + a repo file so commit/push ships edits.
 * Uses File System Access API when available (Chrome/Edge); falls back to download.
 */

const HANDLE_DB = "ca-brandkit-draft-files";
const HANDLE_STORE = "handles";

function openHandleDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(HANDLE_DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(HANDLE_STORE)) {
        db.createObjectStore(HANDLE_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(key) {
  const db = await openHandleDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HANDLE_STORE, "readonly");
    const req = tx.objectStore(HANDLE_STORE).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, value) {
  const db = await openHandleDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HANDLE_STORE, "readwrite");
    tx.objectStore(HANDLE_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;");
}

/** Build #slide-source inner markup from serialized slide defs. */
export function slidesToSourceHtml(slides) {
  return (slides ?? [])
    .map((slide, index) => {
      const title = escapeAttr(slide.title || `Slide ${index + 1}`);
      const layout = escapeAttr(slide.layout || "");
      const bg = escapeAttr(slide.bg || "");
      const content = escapeAttr(JSON.stringify(slide.content ?? {}));
      return `        <!-- ${index + 1}. ${title} -->
        <section
          class="slide"
          data-title="${title}"
          data-layout="${layout}"
          data-bg="${bg}"
          data-content='${content}'
        >
          <div class="slide-layers" aria-hidden="true"></div>
        </section>`;
    })
    .join("\n\n");
}

export function injectSlideSource(html, slides) {
  const inner = slidesToSourceHtml(slides);
  const replaced = html.replace(
    /(<div\s+id="slide-source"[^>]*>)([\s\S]*?)(<\/div>)/i,
    `$1\n${inner}\n      $3`,
  );
  if (replaced === html) {
    throw new Error("Could not find #slide-source in draft HTML");
  }
  return replaced;
}

function downloadText(filename, text, type = "application/json") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function ensurePermission(handle, mode = "readwrite") {
  const opts = { mode };
  if ((await handle.queryPermission(opts)) === "granted") return true;
  if ((await handle.requestPermission(opts)) === "granted") return true;
  return false;
}

/**
 * @param {string} key - idb key for this draft's file handle
 * @param {string} suggestedName
 * @param {{ description: string, accept: Record<string, string[]> }} type
 */
async function getWritableHandle(key, suggestedName, type) {
  let handle = await idbGet(key);
  if (handle) {
    try {
      if (await ensurePermission(handle)) return handle;
    } catch {
      handle = null;
    }
  }

  if (!window.showSaveFilePicker) return null;

  handle = await window.showSaveFilePicker({
    suggestedName,
    types: [type],
  });
  await idbSet(key, handle);
  return handle;
}

async function writeTextToHandle(handle, text) {
  const writable = await handle.createWritable();
  await writable.write(text);
  await writable.close();
}

/**
 * Persist slides into the draft HTML on disk (so git commit ships them).
 * @returns {"written"|"download"|"unavailable"}
 */
export async function persistDraftHtml({
  draftKey,
  htmlFileName = "prebreach-intro.html",
  slides,
  fetchHtml,
}) {
  const sourceHtml = await fetchHtml();
  const nextHtml = injectSlideSource(sourceHtml, slides);

  try {
    const handle = await getWritableHandle(
      `${draftKey}:html`,
      htmlFileName,
      {
        description: "Draft HTML",
        accept: { "text/html": [".html"] },
      },
    );
    if (handle) {
      await writeTextToHandle(handle, nextHtml);
      return "written";
    }
  } catch (err) {
    if (err?.name === "AbortError") return "unavailable";
    console.warn("File System Access write failed, downloading instead", err);
  }

  downloadText(htmlFileName, nextHtml, "text/html");
  return "download";
}

/**
 * Also keep a JSON sidecar for reliable loading on the live site.
 * @returns {"written"|"download"|"unavailable"}
 */
export async function persistDraftJson({
  draftKey,
  jsonFileName = "prebreach-intro.slides.json",
  payload,
}) {
  const text = `${JSON.stringify(payload, null, 2)}\n`;
  try {
    const handle = await getWritableHandle(
      `${draftKey}:json`,
      jsonFileName,
      {
        description: "Slides JSON",
        accept: { "application/json": [".json"] },
      },
    );
    if (handle) {
      await writeTextToHandle(handle, text);
      return "written";
    }
  } catch (err) {
    if (err?.name === "AbortError") return "unavailable";
    console.warn("JSON write failed, downloading instead", err);
  }

  downloadText(jsonFileName, text, "application/json");
  return "download";
}

/** Load committed slides JSON (live site / fresh browsers). */
export async function fetchDraftJson(url) {
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data?.slides)) return data;
    if (Array.isArray(data)) return { savedAt: null, slides: data };
    return null;
  } catch {
    return null;
  }
}
