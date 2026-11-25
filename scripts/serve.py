#!/usr/bin/env python3
"""Live preview of the site, for testing on this computer and on your phone.

Run it from the project folder:

    python3 scripts/serve.py

Then open the address it prints. On your phone, use the "Phone" address
(the phone must be on the same Wi-Fi). Every time you save a file, open
pages reload themselves. Press Control-C to stop it.

It works like the live site: addresses without ".html" work
(/ceramics opens ceramics.html). It only runs on your computer; it is
never published (scripts/ is left out of the site by scripts/build.sh).
"""
import http.server
import os
import socket
import socketserver
import sys
import time

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8123
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = {".git", "_site", "_originals", "node_modules"}
WATCH = {".html", ".css", ".js", ".svg", ".avif", ".webp", ".jpg", ".jpeg", ".png"}

# Added to every page: asks the server every second whether anything has
# changed, and reloads the page when it has.
RELOAD = b"""
<script>
(function () {
  var last = null;
  setInterval(function () {
    fetch("/__changed", { cache: "no-store" }).then(function (r) { return r.text(); }).then(function (t) {
      if (last !== null && t !== last) location.reload();
      last = t;
    }).catch(function () {});
  }, 1000);
})();
</script>
"""


def latest_change():
    newest = 0
    for folder, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP and not d.startswith(".")]
        for name in files:
            if os.path.splitext(name)[1].lower() in WATCH:
                try:
                    newest = max(newest, os.path.getmtime(os.path.join(folder, name)))
                except OSError:
                    pass
    return str(newest)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        # Never keep old copies, so a reload always shows the latest files
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *args):
        pass  # keep the window quiet

    def do_GET(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if path == "/__changed":
            body = latest_change().encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        # Clean addresses, like GitHub Pages: /ceramics -> ceramics.html
        local = self.translate_path(path)
        # (a page wins over a folder of the same name, as on the live site:
        # /ceramics is ceramics.html, not the ceramics/ folder)
        if not path.endswith("/") and os.path.isfile(local + ".html"):
            path += ".html"
            local += ".html"
        if os.path.isdir(local):
            local = os.path.join(local, "index.html")
        if local.endswith(".html") and os.path.isfile(local):
            with open(local, "rb") as f:
                page = f.read()
            page = page.replace(b"</body>", RELOAD + b"</body>", 1) if b"</body>" in page else page + RELOAD
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(page)))
            self.end_headers()
            self.wfile.write(page)
            return
        self.path = path
        super().do_GET()


def phone_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("10.255.255.255", 1))  # no data is sent; this just picks the Wi-Fi address
        return s.getsockname()[0]
    except OSError:
        return None
    finally:
        s.close()


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    with Server(("0.0.0.0", PORT), Handler) as server:
        ip = phone_address()
        print("Live preview is running. Pages reload when you save.")
        print("  This computer:  http://localhost:%d" % PORT)
        if ip:
            print("  Phone:          http://%s:%d   (same Wi-Fi)" % (ip, PORT))
        print("Press Control-C to stop.")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
