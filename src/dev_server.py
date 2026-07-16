from __future__ import annotations

import functools
import http.server
import socketserver
from build import build

PORT = 3000

if __name__ == "__main__":
    build("dist", production=False)
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory="dist")
    with socketserver.TCPServer(("127.0.0.1", PORT), handler) as server:
        print(f"Serving zurayq.xyz at http://127.0.0.1:{PORT}")
        try: server.serve_forever()
        except KeyboardInterrupt: pass
