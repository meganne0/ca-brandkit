/**
 * Client-side password gate for the CyberArmor brand kit.
 * Not cryptographic security — stops casual visitors only.
 */
(function () {
  const AUTH_KEY = "ca-brandkit-auth-v1";
  const PASS_HASH =
    "64a198352c8bb9049a88e05c47ec5a79395d84fa197a89acc5d2520d8522280e";

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buf)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function isAuthed() {
    try {
      return sessionStorage.getItem(AUTH_KEY) === PASS_HASH;
    } catch {
      return false;
    }
  }

  function setAuthed() {
    try {
      sessionStorage.setItem(AUTH_KEY, PASS_HASH);
    } catch {
      /* ignore */
    }
  }

  if (isAuthed()) return;

  document.documentElement.classList.add("ca-auth-locked");

  const style = document.createElement("style");
  style.textContent = `
    html.ca-auth-locked body > *:not(#ca-auth-gate) { display: none !important; }
    #ca-auth-gate {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: grid;
      place-items: center;
      padding: 24px;
      background:
        radial-gradient(90% 80% at 50% 0%, rgba(242, 88, 53, 0.22), transparent 55%),
        #05030d;
      color: #fff;
      font-family: Inter, system-ui, sans-serif;
    }
    #ca-auth-gate .ca-auth-card {
      width: min(100%, 420px);
      padding: 32px 28px;
      border-radius: 18px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(18, 11, 28, 0.96);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
    }
    #ca-auth-gate .ca-auth-eyebrow {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #f25835;
    }
    #ca-auth-gate h1 {
      margin: 0 0 8px;
      font-size: 26px;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    #ca-auth-gate p {
      margin: 0 0 20px;
      font-size: 14px;
      line-height: 1.45;
      color: rgba(255, 255, 255, 0.55);
    }
    #ca-auth-gate label {
      display: block;
      margin-bottom: 8px;
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.55);
    }
    #ca-auth-gate input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(0, 0, 0, 0.35);
      color: #fff;
      font: inherit;
      font-size: 15px;
    }
    #ca-auth-gate input:focus {
      outline: 2px solid rgba(242, 88, 53, 0.55);
      outline-offset: 1px;
    }
    #ca-auth-gate button {
      appearance: none;
      width: 100%;
      margin-top: 14px;
      padding: 12px 14px;
      border: 0;
      border-radius: 10px;
      background: #f25835;
      color: #12040a;
      font: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
    #ca-auth-gate button:hover { filter: brightness(1.06); }
    #ca-auth-gate .ca-auth-error {
      display: none;
      margin: 12px 0 0;
      font-size: 13px;
      color: #ff8f8f;
    }
    #ca-auth-gate.is-error .ca-auth-error { display: block; }
  `;
  document.documentElement.appendChild(style);

  function mountGate() {
    if (document.getElementById("ca-auth-gate")) return;
    const gate = document.createElement("div");
    gate.id = "ca-auth-gate";
    gate.innerHTML = `
      <form class="ca-auth-card" id="ca-auth-form" autocomplete="current-password">
        <p class="ca-auth-eyebrow">CyberArmor</p>
        <h1>Brand kit access</h1>
        <p>Enter the password to open the brand kit.</p>
        <label for="ca-auth-password">Password</label>
        <input
          id="ca-auth-password"
          name="password"
          type="password"
          required
          autofocus
          spellcheck="false"
        />
        <button type="submit">Unlock</button>
        <p class="ca-auth-error" role="alert">Incorrect password. Try again.</p>
      </form>
    `;
    document.body.appendChild(gate);

    const form = gate.querySelector("#ca-auth-form");
    const input = gate.querySelector("#ca-auth-password");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      gate.classList.remove("is-error");
      const hash = await sha256Hex(input.value.trim());
      if (hash !== PASS_HASH) {
        gate.classList.add("is-error");
        input.select();
        return;
      }
      setAuthed();
      document.documentElement.classList.remove("ca-auth-locked");
      gate.remove();
      style.remove();
    });
  }

  if (document.body) mountGate();
  else document.addEventListener("DOMContentLoaded", mountGate);
})();
