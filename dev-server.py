#!/usr/bin/env python3
"""Serve the brand kit and write Save straight into drafts/ on disk."""

import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PORT = 8765
MAX_BYTES = 20 * 1024 * 1024
ALLOWED = {
    "drafts/dec-7.html",
    "drafts/dec-7.slides.json",
    "drafts/prebreach-intro.html",
    "drafts/prebreach-intro.slides.json",
}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):
        if self.path.split("?", 1)[0] != "/api/save-draft":
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0 or length > MAX_BYTES:
            self.send_error(413)
            return

        try:
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            rel = body["file"]
            content = body["content"]
        except (json.JSONDecodeError, KeyError, UnicodeDecodeError):
            self.send_error(400)
            return

        if rel not in ALLOWED or not isinstance(content, str):
            self.send_error(403)
            return

        target = (ROOT / rel).resolve()
        if ROOT not in target.parents:
            self.send_error(403)
            return

        target.write_text(content, encoding="utf-8")
        payload = b'{"ok":true}'
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"http://127.0.0.1:{PORT}/", flush=True)
    server.serve_forever()
