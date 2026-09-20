from pathlib import Path
import plistlib
root=Path(__file__).resolve().parents[1]
p=root/'Stonewake/Web/assets/index-BPhrguZ3.js';s=p.read_text()
if 'function SWSettings(' in s:
 raise SystemExit('The build 6 migration is already applied. Do not rerun this one-time script.')
def replace(a,b):
 global s
 assert s.count(a)==1,(a[:80],s.count(a))
 s=s.replace(a,b,1)
replace('function Ju({ deviceOnly: e = !1 } = {}) {', (root/'client/interface.js').read_text()+'\nfunction Ju({ deviceOnly: e = !1 } = {}) {')
replace('    balanceVersion: 2,\n    name:', '    balanceVersion: 2,\n    gemVersion: 1,\n    gems: 100,\n    name:')
replace('  let n = jl(e);\n  if (!n.balanceVersion)', '''  let n = jl(e);
  if (!n.gemVersion) { n.gemVersion = 1; n.gems = 100; }
  n.gems = Number.isSafeInteger(n.gems) && n.gems >= 0 ? n.gems : 0;
  if (!n.balanceVersion)''')
replace('  if (ol(r, t, n)) return (r.revision++, r);','  if (ApplyGemAction(r, t, n)) { r.revision++; return Y(r, n); }\n  if (ol(r, t, n)) return (r.revision++, r);')
replace('(r.quests.push(e.id), Ll(r, e.reward));','(r.quests.push(e.id), Ll(r, e.reward), r.gems += 8);')
replace('((r.honors = [...(r.honors || []), e.id]), Ll(r, e.reward));','((r.honors = [...(r.honors || []), e.id]), Ll(r, e.reward), r.gems += 15);')
replace('? ((s = Tl[n].reward), e.campaign++, (e.rating += n === 4 ? 100 : 20))','? ((s = Tl[n].reward), e.campaign++, (e.gems = (e.gems || 0) + 25), (e.rating += n === 4 ? 100 : 20))')
replace('function Ju({ deviceOnly: e = !1 } = {}) {\n  const [stonewakeMusic', '''function Ju({ deviceOnly: e = !1 } = {}) {
  const [gemShopOpen, setGemShopOpen] = C.useState(false);
  const [musicVolume, setMusicVolume] = C.useState(() => {
    try { const v=localStorage.getItem('stonewake-music-volume'); return v===null?0.12:Math.max(0,Math.min(1,Number(v)||0)); } catch { return 0.12; }
  });
  const [stonewakeMusic''')
replace('      enabled: stonewakeMusic,\n    });','      enabled: stonewakeMusic,\n      volume: musicVolume,\n    });')
replace('      localStorage.setItem(`stonewake-music`, stonewakeMusic ? `on` : `off`);','      localStorage.setItem(`stonewake-music`, stonewakeMusic ? `on` : `off`);\n      localStorage.setItem(`stonewake-music-volume`, String(musicVolume));')
replace('  }, [stonewakeMusic]);','  }, [stonewakeMusic, musicVolume]);')
# Replace the overloaded army, scout and settings screens with compact mobile components.
a=s.index('      (0, F.jsx)(As, {\n        open: b,');b=s.index('      (0, F.jsx)(As, {\n        open: !!I,',a)
s=s[:a]+'''      swElement(SWArmy, {open:b,onClose:()=>x(false),state:V,act:mn,busy:l,onFrontier:()=>{x(false);p('frontier')},onCommander:()=>{x(false);Ut(true)}}),
'''+s[b:]
a=s.index('      (0, F.jsx)(As, {\n        open: !!I,');b=s.index('      (0, F.jsx)(As, {\n        open: !!B,',a)
s=s[:a]+'''      swElement(SWScout, {open:!!I,onClose:()=>rt(null),scout:I,state:V,busy:l,onAttack:()=>void bn(),onTrain:()=>{rt(null);x(true)}}),
'''+s[b:]
a=s.index('      (0, F.jsx)(As, {\n        open: ue,');b=s.index('      (0, F.jsx)(As, {\n        open: Me,',a)
s=s[:a]+'''      swElement(SWSettings, {open:ue,onClose:()=>de(false),busy:l,name:Ie,onName:Le,onSaveName:async()=>{await mn({type:'rename',name:Ie},'Kingdom renamed')},sound:Re,onSound:We,volume:ze,onVolume:Ge,onTest:()=>He('complete'),music:stonewakeMusic,onMusic:()=>setStonewakeMusic(!stonewakeMusic),musicVolume,onMusicVolume:setMusicVolume,reduced:Be,onMotion:Ke,onGuide:()=>{de(false);Ne(true)}}),
      swElement(SWGems, {open:gemShopOpen,onClose:()=>setGemShopOpen(false),state:V,act:mn,busy:l}),
'''+s[b:]
# Gem wallet alongside resources. Menu actions leave the map unobstructed.
a='''          (0, F.jsxs)(`div`, {
            className: `utility-rail`,'''
b='''          swElement('button', {className:'sw-gem-wallet','aria-label':'Gems, '+V.gems+' available',onClick:()=>setGemShopOpen(true)}, swElement('span',null,'◆'),V.gems),
'''+a
replace(a,b)
a='''                              H.readyAt
                                ? (0, F.jsxs)(`div`, {'''
b='''                              H.readyAt && swElement('button', {className:'sw-speedup secondary wide',onClick:()=>setGemShopOpen(true)},'Finish now · '+GemCost(H.readyAt)+' ◆'),
                              H.readyAt
                                ? (0, F.jsxs)(`div`, {'''
replace(a,b)
# Collapsible secondary details instead of a full upgrade preview on every selection.
replace('(0, F.jsx)(hu, { building: H }),','swElement("details", {className:"sw-disclosure"}, swElement("summary",null,"Preview future levels"), swElement(hu, {building:H})),')
# Structured strongholds: defensible perimeter, spaced districts and clear gate lanes.
a=s.index('function cl(e, t, n) {', s.index('function sl(e) {'));b=s.index('\nvar ll =',a)
s=s[:a]+'''function cl(stage, name, level) {
  const buildings=[];
  const put=(kind,x,y,axis='x')=>{if(!buildings.some(b=>b.x===x&&b.y===y))buildings.push({id:`fort-${x}-${y}`,kind,x,y,level,axis})};
  // A two-tile street separates homes, production and the central keep.
  put('keep',4,4); put('tower',2,2); put('tower',6,2);
  put('cottage',2,5); put('market',2,7); put('farm',6,6);
  put('lumber',6,4); put('barracks',4,1); put('quarry',1,3);
  for(let x=0;x<=8;x++){put(x===4?'gate':'wall',x,0,'x');put(x===4?'gate':'wall',x,8,'x')}
  for(let y=1;y<8;y++){put(y===4?'gate':'wall',0,y,'y');put(y===4?'gate':'wall',8,y,'y')}
  if(stage>=1)put('tower',1,7);
  if(stage>=2)put('mortar',6,7);
  if(stage>=3)put('bombtower',7,1);
  if(stage>=4)put('flame',4,6);
  if(stage>=6)put('bastion',1,1);
  if(stage>=8)put('bastion',7,7);
  return {name,level,rating:100+stage*140,buildings};
}
'''+s[b:]
# Fit enemy towns to their projected bounds instead of a hard-coded 700x580 view.
a=s.index('function Eu({');b=s.index('\nvar Du =',a);part=s[a:b]
old='''  let Ne = _
      ? Math.max(0.32, Math.min(M.w / 700, M.h / 580))
      : Math.max(M.w / 1200, M.h / 800),'''
new='''  const townPoints=e.map(b=>vu(b.x,b.y));
  const townBounds={left:Math.min(...townPoints.map(p=>p.x))-100,right:Math.max(...townPoints.map(p=>p.x))+100,top:Math.min(...townPoints.map(p=>p.y))-150,bottom:Math.max(...townPoints.map(p=>p.y))+80};
  const cameraX=_?(townBounds.left+townBounds.right)/2:600, cameraY=_?(townBounds.top+townBounds.bottom)/2:400;
  let Ne = _
      ? Math.max(0.15, Math.min(M.w/(townBounds.right-townBounds.left+50), Math.max(140,M.h-(p?100:10))/(townBounds.bottom-townBounds.top+20)))
      : Math.max(M.w / 1200, M.h / 800),'''
assert old in part;part=part.replace(old,new)
part=part.replace('Pe + 600,','Pe + cameraX,').replace('Pe + 400,','Pe + cameraY,').replace('o.translate(-600, -400)','o.translate(-cameraX, -cameraY)')
# Backdrop always covers the screen; terrain foreground tracks the town camera.
part=part.replace('onClick: () => j((e) => Math.max(0.65, e - 0.2)),','disabled: A <= 1,\n            onClick: () => j((e) => Math.max(1, e - 0.2)),')
part=part.replace('Math.max(0.65,','Math.max(1,')
s=s[:a]+part+s[b:]
p.write_text(s)
# Readable theme in its own file, loaded after the original generated CSS.
p=root/'Stonewake/Web/index.html';html=p.read_text();html=html.replace('</head>','<link rel="stylesheet" href="/mobile-theme.css"></head>');p.write_text(html)
p=root/'Stonewake/Info.plist';d=plistlib.loads(p.read_bytes());d['CFBundleVersion']='6';p.write_bytes(plistlib.dumps(d,sort_keys=False))
# Native music has its own low default, independent of effects volume.
p=root/'Stonewake/StonewakeApp.swift';s=p.read_text().replace('audio.setMusic(enabled: enabled)','audio.setMusic(enabled: enabled, volume: body["volume"] as? Double ?? 0.12)');s=s.replace('private var level: Float = 0.55','private var level: Float = 0.55\n    private var musicLevel: Float = 0.12')
s=s.replace('func setMusic(enabled: Bool) {\n        musicEnabled = enabled','func setMusic(enabled: Bool, volume: Double) {\n        guard volume.isFinite else { return }\n        musicLevel = Float(max(0, min(1, volume)))\n        musicEnabled = enabled')
s=s.replace('guard soundEnabled, musicEnabled, UIApplication.shared.applicationState == .active','guard musicEnabled, UIApplication.shared.applicationState == .active').replace('music?.volume = level * 0.5','music?.volume = musicLevel * 0.45')
p.write_text(s)
print('Applied mobile interface, gem economy, enemy layouts and audio settings')
