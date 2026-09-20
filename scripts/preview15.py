"""Serve an isolated local review origin, optionally seeding a disposable save copy."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse, json
parser=argparse.ArgumentParser()
parser.add_argument('--port',type=int,default=8773)
parser.add_argument('--fixture',type=Path)
parser.add_argument('--seed-id',default='review15')
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
fixture=json.loads(args.fixture.read_text()) if args.fixture else None
if fixture:
    fixture['battle']=None;fixture['input']=None;fixture['time']=0
    fixture['state']['activeBattle']=None
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw):super().__init__(*a,directory=str(root/'Stonewake/Web'),**kw)
    def do_GET(self):
        if self.path.split('?')[0] in ('/','/index.html'):
            html=(root/'Stonewake/Web/index.html').read_text()
            if fixture:
                marker=json.dumps('stonewake-review-seeded-'+args.seed_id)
                boot='<script>if(!localStorage.getItem('+marker+')){localStorage.setItem("hearth-device-kingdom-v1",'+json.dumps(json.dumps(fixture)).replace("<", "\\u003c")+');localStorage.setItem("hearth-opening-v1","seen");localStorage.setItem('+marker+',"true");}</script>'
                html=html.replace('<head>','<head>'+boot)
            data=html.encode();self.send_response(200);self.send_header('Content-Type','text/html');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
        else:super().do_GET()
ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
