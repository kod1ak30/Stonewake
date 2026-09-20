// Editable model geometry. Z is height; X/Y are ground-plane coordinates.
// All viewpoints and poses share these same vertices, materials and dimensions.
const SWRigSource = {};
function SWRigColor(hex,light=1) {
  const n=parseInt(hex.slice(1),16);return `rgb(${[n>>16,(n>>8)&255,n&255].map(v=>Math.round(Math.min(255,Math.max(0,v*light)))).join(',')})`;
}
function SWRigMesh() {
  const faces=[];
  const face=(points,material,shade=1)=>faces.push({points:points.map(p=>p.slice()),material,shade});
  const box=(x,y,z,w,d,h,material)=>{
    const p=[[x-w/2,y-d/2,z],[x+w/2,y-d/2,z],[x+w/2,y+d/2,z],[x-w/2,y+d/2,z],[x-w/2,y-d/2,z+h],[x+w/2,y-d/2,z+h],[x+w/2,y+d/2,z+h],[x-w/2,y+d/2,z+h]];
    for(const q of [[0,3,2,1],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])face(q.map(i=>p[i]),material);
  };
  const cylinder=(x,y,z,rb,rt,h,material,segments=12,offset=0)=>{
    const bottom=[],top=[];for(let i=0;i<segments;i++){const a=(i/segments)*Math.PI*2+offset;bottom.push([x+Math.cos(a)*rb,y+Math.sin(a)*rb,z]);top.push([x+Math.cos(a)*rt,y+Math.sin(a)*rt,z+h]);}
    for(let i=0;i<segments;i++)face([bottom[i],bottom[(i+1)%segments],top[(i+1)%segments],top[i]],material,1+Math.sin(i*17.21)*.025);face(top,material);
  };
  const ellipsoid=(x,y,z,rx,ry,rz,material,segments=10,rings=5)=>{
    const rows=[];for(let j=0;j<=rings;j++){const lat=-Math.PI/2+Math.PI*j/rings,row=[];for(let i=0;i<segments;i++){const a=i*Math.PI*2/segments;row.push([x+Math.cos(a)*Math.cos(lat)*rx,y+Math.sin(a)*Math.cos(lat)*ry,z+Math.sin(lat)*rz]);}rows.push(row);}
    for(let j=0;j<rings;j++)for(let i=0;i<segments;i++)face([rows[j][i],rows[j][(i+1)%segments],rows[j+1][(i+1)%segments],rows[j+1][i]],material);
  };
  const limb=(a,b,r,material)=>{
    const d=b.map((v,i)=>v-a[i]),len=Math.hypot(...d)||1,n=[d[0]/len,d[1]/len,d[2]/len],u=Math.abs(n[2])<.9?[-n[1],n[0],0]:[0,-n[2],n[1]],ul=Math.hypot(...u);u.forEach((v,i)=>u[i]/=ul);const v=[n[1]*u[2]-n[2]*u[1],n[2]*u[0]-n[0]*u[2],n[0]*u[1]-n[1]*u[0]],rings=[a,b].map(p=>Array.from({length:8},(_,i)=>{const t=i*Math.PI/4;return p.map((value,j)=>value+r*(Math.cos(t)*u[j]+Math.sin(t)*v[j]))}));
    for(let i=0;i<8;i++)face([rings[0][i],rings[0][(i+1)%8],rings[1][(i+1)%8],rings[1][i]],material);face(rings[1],material);
  };
  return {faces,face,box,cylinder,ellipsoid,limb};
}
function SWRigDraw(ctx,mesh,{x=0,y=0,scale=50,yaw=0,palette={},alpha=1,tilt=0}={}) {
  const colors={...SWRigSource.palette,...palette},ca=Math.cos(yaw),sa=Math.sin(yaw),ct=Math.cos(tilt),st=Math.sin(tilt),project=p=>{const px=p[0]*ca-p[1]*sa,py=p[0]*sa+p[1]*ca,pz=p[2]*ct+py*st,yy=py*ct-p[2]*st;return [x+(px-yy)*.7071*scale,y+(px+yy)*.35355*scale-pz*.866*scale,(px+yy)*.7071+pz*.05];},light=SWRigSource.projection.light;
  const projected=mesh.faces.map(f=>{const p=f.points.map(project),a=f.points[0],b=f.points[1],c=f.points[2],u=b.map((v,i)=>v-a[i]),v=c.map((value,i)=>value-a[i]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n)||1,nx=n[0]*ca-n[1]*sa,ny=n[0]*sa+n[1]*ca,diffuse=Math.max(0,(nx*light[0]+ny*light[1]+n[2]*light[2])/len),shade=(.61+diffuse*.52)*f.shade;return {p,depth:p.reduce((s,v)=>s+v[2],0)/p.length,color:SWRigColor(colors[f.material]||f.material,shade)};}).sort((a,b)=>a.depth-b.depth);
  ctx.save();ctx.globalAlpha*=alpha;ctx.lineJoin='round';for(const f of projected){ctx.beginPath();f.p.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();ctx.strokeStyle=f.color;ctx.lineWidth=.35;ctx.stroke();}ctx.restore();
}
function SWRigInterpolate(keys,t) {for(let i=1;i<keys.length;i++)if(t<=keys[i][0]){const p=(t-keys[i-1][0])/(keys[i][0]-keys[i-1][0]);return keys[i-1][1]+(keys[i][1]-keys[i-1][1])*(p*p*(3-2*p));}return keys.at(-1)[1];}
function SWRigSoldier(state='idle',phase=0,level=1) {
  level=Math.max(1,Math.min(10,level));
  const mesh=SWRigMesh(),r=SWRigSource.soldier,walk=state==='walk',attack=state==='attack'||state==='work',death=state==='death',cycle=phase*Math.PI*2,stride=walk?Math.sin(cycle)*r.states.walk.stride:0,fall=death?Math.min(1,phase):0,hip=r.hipHeight-(walk?.045+Math.abs(Math.sin(cycle))*.008:0)-fall*.48,torso=hip+.24,lean=state==='stagger'?Math.sin(phase*Math.PI)*-.14:attack?Math.sin(phase*Math.PI)*.05:0;
  for(const side of [-1,1]){
    const gait=(phase+(side<0?.5:0))%1,swing=gait<.5,progress=swing?gait*2:(gait-.5)*2,footY=walk?(swing?-.22+.44*progress:.22-.44*progress):0,footZ=walk?.08+(swing?Math.sin(progress*Math.PI)*.14:0):hip-r.upperLeg-r.lowerLeg,dy=footY,dz=footZ-hip,distance=Math.min(r.upperLeg+r.lowerLeg-.001,Math.hypot(dy,dz)),bend=Math.sqrt(Math.max(0,r.upperLeg*r.upperLeg-distance*distance/4)),heel=[side*r.hipWidth,footY,footZ],knee=[side*r.hipWidth,footY*.5+dz/(Math.hypot(dy,dz)||1)*bend,(hip+footZ)*.5-dy/(Math.hypot(dy,dz)||1)*bend];
    mesh.limb([side*r.hipWidth,0,hip],knee,.075,level>=4?'metal':'leather');mesh.limb(knee,heel,.057,'leather');mesh.box(heel[0],heel[1]-.052,Math.max(.025,heel[2]-.035),.14,.25,.12,'leather');if(level>=3)mesh.ellipsoid(...knee,.086,.078,.092,'steel',8,3);
  }
  mesh.ellipsoid(0,lean,torso,.225,.14,.3,'metal',12,5);
  for(let i=0;i<10;i++){const a=i*Math.PI/5,b=(i+1)*Math.PI/5;mesh.face([[Math.cos(a)*.20,Math.sin(a)*.13,hip+.13],[Math.cos(b)*.20,Math.sin(b)*.13,hip+.13],[Math.cos(b)*.24,Math.sin(b)*.18,hip-.12],[Math.cos(a)*.24,Math.sin(a)*.18,hip-.12]],i%2?'cloth':'metal');}
  mesh.box(0,lean-.142,torso-.045,.35,.028,.33,'cloth');mesh.box(0,lean-.162,hip+.17,.42,.038,.065,'leather');mesh.box(0,lean-.185,hip+.178,.063,.025,.048,'gold');
  const shoulderZ=hip+(r.shoulderHeight-r.hipHeight),swing=attack?SWRigInterpolate(r.states.attack.keys,phase):-.3-stride*.55;
  for(const side of [-1,1]){
    const shoulder=[side*r.shoulderWidth,lean,shoulderZ],angle=side===1?swing:walk?stride*.4:-.55,elbow=[side*(r.shoulderWidth+.035),lean+Math.sin(angle)*r.upperArm,shoulderZ-Math.cos(angle)*r.upperArm],hand=[elbow[0],elbow[1]-.19,elbow[2]-.19];
    mesh.limb(shoulder,elbow,.075,'metal');mesh.limb(elbow,hand,.055,level>=6?'steel':'leather');mesh.ellipsoid(...hand,.060,.053,.055,'leather',8,3);mesh.ellipsoid(...shoulder,.12,.135,.12,level>=7?'steel':'metal',10,4);
    if(side===1){const tip=[hand[0],hand[1]-.55*Math.cos(swing+.2),hand[2]+.55*Math.sin(-swing+.4)];mesh.limb(hand,tip,.018,'steel');mesh.limb([hand[0]-.075,hand[1],hand[2]],[hand[0]+.075,hand[1],hand[2]],.017,'gold');mesh.face([[tip[0]-.026,tip[1],tip[2]],[tip[0]+.026,tip[1],tip[2]],[tip[0],tip[1]-.10*Math.cos(swing),tip[2]+.10*Math.sin(-swing)]],'steel');}
    else{const x=hand[0]-.035,y=hand[1]-.065,z=hand[2]+.09;mesh.face([[x-.18,y,z+.27],[x+.17,y,z+.27],[x+.17,y-.025,z+.01],[x,y-.03,z-.22],[x-.18,y-.025,z+.01]],'wood');mesh.face([[x-.15,y-.018,z+.24],[x+.14,y-.018,z+.24],[x+.14,y-.045,z+.01],[x,y-.05,z-.18],[x-.15,y-.045,z+.01]],'cloth');mesh.limb([x,y-.055,z-.12],[x,y-.055,z+.21],.011,level>=5?'gold':'steel');mesh.ellipsoid(x,y-.06,z+.07,.045,.026,.05,'steel',8,3);}
  }
  const headZ=shoulderZ+.22;mesh.ellipsoid(0,lean,headZ,.145,.13,.18,'skin',12,5);mesh.cylinder(0,lean,headZ+.01,.164,.135,.13,'metal',12);mesh.ellipsoid(0,lean,headZ+.15,.135,.123,.075,'steel',12,4);mesh.box(0,lean-.132,headZ+.015,.265,.029,.04,'leather');mesh.box(0,lean-.153,headZ-.025,.034,.033,.11,'steel');
  if(level>=4)for(const side of [-1,1])mesh.box(side*.125,lean-.06,headZ-.105,.032,.14,.14,'metal');
  if(level>=7){mesh.limb([0,lean+.02,headZ+.19],[0,lean+.06,headZ+.31],.044,'cloth');mesh.limb([0,lean+.06,headZ+.31],[0,lean+.22,headZ+.25],.052,'cloth');}
  if(level>=9){mesh.box(0,lean-.164,torso+.045,.08,.018,.035,'gold');mesh.box(0,lean-.164,torso+.045,.024,.018,.11,'gold');}
  for(let rank=2;rank<=level;rank++){const side=rank%2?-1:1,z=torso+.10-Math.floor((rank-2)/2)*.052;mesh.box(side*.10,lean-.166,z,.030,.018,.015,rank>=8?'gold':'steel');}
  if(death){const angle=fall*1.48;for(const face of mesh.faces)for(const p of face.points){const y=p[1],z=p[2];p[1]=y*Math.cos(angle)+z*Math.sin(angle);p[2]=Math.max(.05,z*Math.cos(angle)-y*Math.sin(angle));}}
  return mesh;
}
function SWRigShip(time=0,level=1,damage=0) {
  level=Math.max(1,Math.min(10,level));
  const m=SWRigMesh(),r=SWRigSource.ship,n=r.segments,sections=[];
  for(let i=0;i<=n;i++){const y=(i/n-.5)*r.length,beam=Math.pow(Math.sin(i/n*Math.PI),.55)*r.beam;sections.push({y,beam});}
  for(let i=0;i<n;i++){const a=sections[i],b=sections[i+1];for(const side of [-1,1]){m.face([[side*a.beam/2,a.y,r.deckHeight],[side*b.beam/2,b.y,r.deckHeight],[side*b.beam*.34,b.y,-r.keelDepth*.3],[side*a.beam*.34,a.y,-r.keelDepth*.3]],'wood');m.face([[side*a.beam*.34,a.y,-r.keelDepth*.3],[side*b.beam*.34,b.y,-r.keelDepth*.3],[0,b.y,-r.keelDepth],[0,a.y,-r.keelDepth]],'wood');m.limb([side*a.beam/2,a.y,r.deckHeight+.035],[side*b.beam/2,b.y,r.deckHeight+.035],.037,'woodLight');}m.face([[-a.beam/2,a.y,r.deckHeight],[-b.beam/2,b.y,r.deckHeight],[b.beam/2,b.y,r.deckHeight],[a.beam/2,a.y,r.deckHeight]],'woodLight');}
  for(let i=0;i<14;i++){const y=(i/14-.5)*r.length*.9,beam=Math.pow(Math.sin((i/14*.9+.05)*Math.PI),.55)*r.beam;m.limb([-beam/2,y,r.deckHeight+.005],[beam/2,y,r.deckHeight+.005],.012,'wood');}
  m.box(0,.98,r.deckHeight,.68,.58,.18,'wood');m.box(0,1.12,r.deckHeight+.18,.34,.27,.20,'woodLight');
  m.cylinder(0,-.1,r.deckHeight,.047,.029,r.mastHeight,'wood',8);m.limb([-.88,-.1,1.99],[.88,-.1,1.99],.03,'woodLight');
  const sailBottom=.76,top=1.95;for(let i=0;i<8;i++)for(let j=0;j<5;j++){const point=(col,row)=>{const u=col/8,v=row/5,x=(u-.5)*r.sailWidth,wind=Math.sin(u*Math.PI)*Math.sin(v*Math.PI)*(.22+Math.sin(time*1.4)*.04);return [x,-.12-wind,sailBottom+v*(top-sailBottom)]};if(!(damage>.6&&i===7&&j<2))m.face([point(i,j),point(i+1,j),point(i+1,j+1),point(i,j+1)],'sail',i%2?.96:1);}
  m.limb([-.75,-.12,sailBottom],[0,-.1,2.15],.008,'leather');m.limb([.75,-.12,sailBottom],[0,-.1,2.15],.008,'leather');for(const y of[-1.25,1.30])m.limb([0,y,r.deckHeight],[0,-.1,2.28],.008,'leather');
  for(const side of[-1,1])for(let i=0;i<4;i++){const y=-.8+i*.45;m.cylinder(side*.35,y,.33,.055,.055,.18,'metal',8);m.limb([side*.35,y,.40],[side*.65,y,.40],.046,'metal');if(level>=5)m.box(side*.4,y,.23,.12,.15,.07,'gold');}
  for(let rank=2;rank<=level;rank++){const y=-1.1+(rank-2)*.26;for(const side of[-1,1])m.box(side*(.31+Math.sin((rank-2)/9*Math.PI)*.09),y,.24,.06,.09,.045,rank>=7?'gold':'metal');}
  if(level>=7)for(const side of[-1,1]){m.cylinder(side*.27,1.13,.65,.045,.035,.13,'gold',6);m.cylinder(side*.27,1.13,.78,.06,.02,.045,'metal',6);}
  m.face([[0,-.1,2.5],[.45,-.1+Math.sin(time*2)*.035,2.4],[0,-.1,2.28]],'cloth');return m;
}
function SWRigLighthouse(stage=3,time=0) {
  const m=SWRigMesh(),r=SWRigSource.lighthouse,progress=r.stages[Math.max(0,Math.min(2,stage-1))],height=r.height*progress;
  m.cylinder(0,0,-.05,r.baseRadius+.16,r.baseRadius+.12,.19,'stoneDark',16);m.cylinder(0,0,.14,r.baseRadius+.08,r.baseRadius,.18,'stone',16);
  const count=Math.ceil(r.courses*progress);for(let j=0;j<count;j++){const z=.32+j*(height-.32)/count,h=(height-.32)/count-.012,rb=r.baseRadius+(r.topRadius-r.baseRadius)*j/r.courses,rt=r.baseRadius+(r.topRadius-r.baseRadius)*(j+1)/r.courses;for(let i=0;i<r.segments;i++){const a=i*Math.PI*2/r.segments+(j%2)*Math.PI/r.segments,b=(i+1)*Math.PI*2/r.segments+(j%2)*Math.PI/r.segments;m.face([[Math.cos(a)*rb,Math.sin(a)*rb,z],[Math.cos(b)*rb,Math.sin(b)*rb,z],[Math.cos(b)*rt,Math.sin(b)*rt,z+h],[Math.cos(a)*rt,Math.sin(a)*rt,z+h]],(i+j)%5?'stone':'stoneDark',1+Math.sin(i*17+j*23)*.045);}}
  for(let i=0;i<3;i++)m.box(0,-r.baseRadius-.035,.13+i*.065,.42,.21-i*.025,.065,'stone');m.box(0,-r.baseRadius-.008,.34,.23,.025,.43,'wood');m.box(.06,-r.baseRadius-.024,.53,.025,.018,.028,'gold');
  if(stage>=2){for(let z=.94;z<height-.2;z+=.76){const radius=r.baseRadius+(r.topRadius-r.baseRadius)*z/r.height;for(const yaw of[0,Math.PI/2,Math.PI]){const x=Math.sin(yaw)*radius,y=-Math.cos(yaw)*radius;m.box(x,y,z,.055,.055,.21,'leather');}}m.cylinder(0,0,height-.10,r.topRadius+.13,r.topRadius+.17,.14,'stone',16);}
  if(stage>=3){const z=height+.06;m.cylinder(0,0,z,r.topRadius+.17,r.topRadius+.17,.13,'metal',16);for(let i=0;i<8;i++){const a=i*Math.PI/4;m.limb([Math.cos(a)*.43,Math.sin(a)*.43,z+.11],[Math.cos(a)*.43,Math.sin(a)*.43,z+.64],.027,'metal');}m.cylinder(0,0,z+.14,.20,.16,.39,'gold',12);m.cylinder(0,0,z+.66,.58,.12,.36,'cloth',16);m.cylinder(0,0,z+.96,.025,.014,.22,'gold',8);for(let i=0;i<16;i++){const a=i*Math.PI/8;m.limb([Math.cos(a)*.60,Math.sin(a)*.60,z-.05],[Math.cos(a)*.60,Math.sin(a)*.60,z+.28],.015,'metal');}m.cylinder(0,0,z+.25,.61,.61,.035,'metal',16);}
  else{for(const side of[-1,1]){m.limb([side*.83,-.1,0],[side*.83,-.1,height+.45],.045,'wood');m.limb([side*.83,.3,0],[side*.83,.3,height+.45],.045,'wood');}for(let z=.3;z<height+.4;z+=.45)m.limb([-.85,-.1,z],[.85,-.1,z],.04,'woodLight');}
  return m;
}
const SWRigTileCache=new Map();
function SWDrawRigSoldier(ctx,{height=44,state='idle',phase=0,heading=0,level=1,palette={}}={}) {
  const frames=SWRigSource.soldier.states[state]?.frames||12,index=Math.min(frames-1,Math.floor(Math.max(0,phase)*frames)),direction=Math.round(heading/(Math.PI/4)),key=[state,index,direction,Math.min(10,level),palette.cloth||''].join(':');
  let tile=SWRigTileCache.get(key);if(!tile){tile=document.createElement('canvas');tile.width=128;tile.height=144;SWRigDraw(tile.getContext('2d'),SWRigSoldier(state,index/(frames-1),level),{x:64,y:130,scale:64,yaw:direction*Math.PI/4,palette});if(SWRigTileCache.size>=320)SWRigTileCache.delete(SWRigTileCache.keys().next().value);SWRigTileCache.set(key,tile);}const scale=height/116;ctx.drawImage(tile,-64*scale,-130*scale,128*scale,144*scale);
}
