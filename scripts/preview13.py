"""Local review server with a separate, disposable copy of the playtest kingdom."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
fixture=json.loads((Path.home()/'Library/Developer/Stonewake-backups/post-install-build12-physical-20260919.json').read_text())
fixture['battle']=None;fixture['input']=None;fixture['time']=0
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw): super().__init__(*a,directory=str(root/'Stonewake/Web'),**kw)
 def do_GET(self):
  if self.path in ('/','/index.html'):
   html=(root/'Stonewake/Web/index.html').read_text()
   boot='<script>if(!localStorage.getItem("stonewake-review13-seeded")){localStorage.setItem("hearth-device-kingdom-v1",'+json.dumps(json.dumps(fixture))+');localStorage.setItem("hearth-intro-seen-v1","true");localStorage.setItem("stonewake-review13-seeded","true");}</script>'
   data=html.replace('<head>','<head>'+boot).encode();self.send_response(200);self.send_header('Content-Type','text/html');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
  else:super().do_GET()
ThreadingHTTPServer(('127.0.0.1',8769),Handler).serve_forever()
