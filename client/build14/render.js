// Shared articulated models for menu previews, world actors, ships and casualties.
const SWRigCache14=new Map();
function SWHumanoid14(kind,state,phase,level){
 const m=SWRigMesh(),ranged=['archer','crossbow'].includes(kind),medic=kind==='healer',worker=kind==='worker',pike=kind==='spearman',heavy=kind==='shieldbearer',attack=state==='attack',walk=state==='walk',fall=state==='death'?Math.min(1,phase):0;
 const cycle=phase*Math.PI*2,bob=walk?Math.abs(Math.sin(cycle))*.035:Math.sin(cycle)*.009,hip=.68+bob,body=.98+bob,skin=worker?'#bc9270':'skin',cloth=medic?'#ded7b8':worker?'#839172':'cloth',armor=level>=7?'steel':level>=3?'metal':level>=2?'leather':cloth;
 for(const side of[-1,1]){const stride=walk?Math.sin(cycle+(side<0?Math.PI:0))*.23:0,z=walk?Math.max(0,Math.cos(cycle+(side<0?Math.PI:0)))*.09:0,foot=[side*.15,stride,.06+z],knee=[side*.16,stride*.5-.05,.35+bob*.4];m.limb([side*.15,0,hip],knee,.083,cloth);m.limb(knee,foot,.07,level>=4?'metal':'leather');m.box(foot[0],foot[1]-.055,foot[2]-.04,.16,.27,.12,'leather');}
 m.ellipsoid(0,0,body,.25,.17,.31,armor,12,6);m.box(0,-.17,body-.16,.33,.035,.32,armor);m.box(0,-.20,body-.04,.055,.02,.14,level>=6?'gold':'cloth');m.cylinder(0,0,hip-.08,.24,.23,.26,cloth,12);m.box(0,-.175,hip+.15,.43,.04,.055,'leather');m.box(0,-.20,hip+.15,.062,.03,.055,level>=6?'gold':'steel');
 if(level>=6&&!worker)m.face([[-.21,.12,1.2],[.21,.12,1.2],[.30,.21,.60],[0,.25,.51],[-.30,.21,.60]],cloth);
 if(level>=8&&!worker)m.face([[-.2,.14,1.25],[.2,.14,1.25],[.32,.29,.3],[-.32,.29,.3]],cloth);
 const headZ=1.39+bob;m.ellipsoid(0,-.025,headZ,.18,.165,.205,skin,12,6);
 if(medic||ranged){m.ellipsoid(0,.035,headZ+.045,.194,.172,.198,cloth,12,5);m.ellipsoid(0,-.132,headZ-.02,.12,.07,.14,skin,10,5);}
 else if(!worker&&level>=3){m.ellipsoid(0,0,headZ+.065,.192,.175,.15,armor,12,5);m.box(0,-.17,headZ+.02,.31,.03,.045,'metal');if(level>=5){m.box(0,-.178,headZ-.06,.055,.04,.14,'steel');for(const side of[-1,1])m.box(side*.145,-.10,headZ-.07,.04,.11,.14,'metal');}}
 else{m.ellipsoid(0,.016,headZ+.12,.17,.158,.10,'#695044',12,4);}
 for(const side of[-1,1])m.box(side*.065,-.183,headZ,.025,.015,.025,'#253333');
 m.ellipsoid(0,-.182,headZ-.035,.038,.047,.047,skin,8,4);for(const side of[-1,1])m.limb([side*.09,-.188,headZ+.035],[side*.045,-.198,headZ+.044],.012,'#684b3b');m.limb([-.045,-.184,headZ-.10],[.045,-.184,headZ-.10],.008,'#895543');
 if(level>=9&&!worker)m.limb([0,.04,headZ+.21],[0,.10,headZ+.38],.055,cloth);
 if(level===10&&!worker){m.cylinder(0,0,headZ+.11,.19,.19,.04,'gold',12);m.box(0,-.181,body+.05,.12,.02,.05,'gold');}
 const swing=attack?SWRigInterpolate([[0,-.3],[.25,-1.8],[.48,.9],[.70,.3],[1,-.3]],phase):walk?Math.sin(cycle)*.35:-.3;
 let hands=[];for(const side of[-1,1]){const angle=side===1?swing:-.35,shoulder=[side*.28,0,1.17+bob],elbow=[side*.32,Math.sin(angle)*.20,1.17-Math.cos(angle)*.20+bob],hand=[side*.30,elbow[1]-.17,elbow[2]-.16];
  if(ranged&&attack){hand[1]=side===-1?-.54:-.17-((phase<.5?phase:.2)*.25);hand[2]=1.08;elbow[2]=1.05;}
  if(medic&&attack){hand[1]=-.25;hand[2]=1.12+Math.sin(phase*Math.PI)*.13;}
  m.limb(shoulder,elbow,.076,cloth);m.limb(elbow,hand,.055,level>=4&&!worker?'metal':skin);m.ellipsoid(...hand,.061,.054,.058,skin,8,4);hands.push(hand);
  if(level>=7&&!worker)m.ellipsoid(...shoulder,.13,.145,.12,'steel',10,4);
 }
 const left=hands[0],right=hands[1];
 if(worker){m.box(0,-.32,.82,.43,.31,.29,'woodLight');for(const x of[-.12,.12])m.box(x,-.49,.82,.04,.025,.29,'wood');}
 else if(medic){m.limb([left[0],left[1],.08],[left[0],left[1],1.83+level*.014],.025,'wood');m.cylinder(left[0],left[1],1.66,.08,.08,.18,level>=3?'gold':'woodLight',8);m.ellipsoid(left[0],left[1],1.85,.07,.07,.085,'#95daca',10,4);m.box(.24,.04,.63,.20,.19,.28,'leather');if(level>=6)m.ellipsoid(right[0],right[1],right[2]-.1,.08,.06,.10,'gold',8,4);}
 else if(kind==='grenadier'){m.ellipsoid(right[0],right[1],right[2]+.09,.12,.12,.14,'#a6794b',10,6);m.limb([right[0],right[1],right[2]+.2],[right[0]+.04,right[1],right[2]+.28],.015,'leather');m.box(.24,.04,.68,.25,.24,.38,level>=6?'metal':'leather');if(level>=3)m.face([[-.18,-.2,1.12],[.18,-.2,1.12],[.23,-.2,.55],[-.23,-.2,.55]],'leather');}
 else if(ranged){const len=.48+level*.013,by=left[1]-.04,z=left[2],curve=kind==='crossbow'?.21:.13;let previous=null;for(let i=0;i<=8;i++){const a=i/8*Math.PI,p=kind==='crossbow'?[left[0]+Math.cos(a)*len,by-Math.sin(a)*curve,z]:[left[0],by-Math.sin(a)*curve,z+Math.cos(a)*len];if(previous)m.limb(previous,p,.024,level>=6?'#aa8757':'wood');previous=p;}m.limb([left[0],by,z-len],[left[0],by+(attack&&phase<.5?.13:0),z+len],.008,'sail');m.cylinder(.17,.16,.66,.09,.09,.48,'leather',8);for(let i=0;i<4;i++)m.limb([.10+i*.04,.18,.80],[.10+i*.04,.18,1.27],.009,'woodLight');}
 else{const weapon=pike?1.5:.56+level*.024,start=right,tip=pike?[right[0],right[1]-.15,1.85]:[right[0],right[1]-weapon*Math.cos(swing+.2),right[2]+weapon*Math.sin(-swing+.4)];m.limb(start,tip,pike?.023:.026,pike?'wood':'steel');m.limb([right[0]-.09,right[1],right[2]],[right[0]+.09,right[1],right[2]],.019,'gold');
  const size=(heavy?.34:.23)+Math.min(7,level)*.009,sy=left[1]-.07,sz=left[2]+.12;m.face([[left[0]-size,sy,sz+size],[left[0]+size,sy,sz+size],[left[0]+size,sy-.02,sz],[left[0],sy-.06,sz-size*1.4],[left[0]-size,sy-.02,sz]],level>=4?'steel':'wood');m.face([[left[0]-size*.8,sy-.027,sz+size*.8],[left[0]+size*.8,sy-.027,sz+size*.8],[left[0],sy-.08,sz-size*1.15]],'cloth');if(level>=2)m.ellipsoid(left[0],sy-.08,sz,.073,.033,.073,level>=8?'gold':'steel',10,4);
 }
 if(level>=2&&!worker)m.box(0,-.18,body,.32,.02,.14,armor);
 if(level>=4&&!worker)for(const hand of hands)m.cylinder(hand[0],hand[1],hand[2],.068,.066,.09,'steel',8);
 if(fall)for(const f of m.faces)for(const p of f.points){const angle=fall*1.43,y=p[1],z=p[2];p[1]=y*Math.cos(angle)+z*Math.sin(angle);p[2]=Math.max(.04,z*Math.cos(angle)-y*Math.sin(angle))*(1-fall*.12);}
 return m;
}
function SWMounted14(kind,state,phase,level){
 const m=SWRigMesh(),walk=state==='walk',cycle=phase*Math.PI*2,bob=walk?Math.sin(cycle*2)*.035:0;
 m.ellipsoid(0,0,.65+bob,.28,.57,.28,'#76533d',12,6);m.ellipsoid(0,-.44,.98+bob,.20,.20,.40,'#80583e',10,6);m.ellipsoid(0,-.58,1.21+bob,.16,.28,.17,'#76533d',10,5);
 for(const side of[-1,1])for(const end of[-1,1]){const gait=walk?Math.sin(cycle+(side*end>0?0:Math.PI))*.2:0;m.limb([side*.18,end*.36,.65+bob],[side*.19,end*.40+gait,.13],.060,'#5e493a');m.box(side*.19,end*.40+gait,.03,.13,.18,.1,'leather');}
 m.limb([0,.5,.72],[0,.8,.28],.055,'#342a25');m.box(0,0,.82,.48,.53,.04,'cloth');
 if(level>=4){m.ellipsoid(0,-.38,.87,.255,.26,.30,level>=7?'steel':'leather',10,5);m.box(0,.12,.83,.49,.45,.09,'metal');}
 const rider=SWHumanoid14('infantry',state==='attack'?'attack':'idle',phase,level);for(const f of rider.faces){const points=f.points.map(p=>[p[0]*.76,p[1]*.76,p[2]*.76+.54]);m.face(points,f.material,f.shade);}
 return m;
}
function SWSiegeRig14(kind,state,phase,level){
 const m=SWRigMesh(),ram=kind==='ram',attack=state==='attack',t=attack?phase:0,arm=attack?SWRigInterpolate([[0,-.7],[.38,-.85],[.53,1.1],[.68,.55],[1,-.7]],t):-.7;
 m.box(0,0,.27,1.05,1.45,.15,'wood');for(const side of[-1,1])for(const end of[-1,1]){m.ellipsoid(side*.61,end*.5,.24,.11,.25,.25,level>=5?'metal':'wood',12,5);m.box(side*.61,end*.5,.10,.04,.05,.30,'woodLight');}
 for(const side of[-1,1])m.limb([side*.43,-.52,.39],[side*.43,0,1.17],.07,'woodLight');
 if(ram){m.limb([0,.65,.62],[0,-.95-(attack?Math.sin(t*Math.PI)*.35:0),.62],.14,'wood');m.ellipsoid(0,-.96-(attack?Math.sin(t*Math.PI)*.35:0),.62,.22,.22,.2,'metal',12,5);m.face([[-.62,-.8,1.03],[.62,-.8,1.03],[.62,.8,1.03],[-.62,.8,1.03]],level>=3?'leather':'wood');}
 else if(kind==='cannon'){m.limb([0,.4,.7],[0,-1.15-level*.02+(attack?Math.sin(t*Math.PI)*.14:0),.91],.19,level>=7?'gold':'metal');m.ellipsoid(0,-1.17-level*.02,.91,.135,.025,.135,'#293d40',12,5);m.box(0,.27,.48,.52,.68,.25,'woodLight');}
 else{const pivot=[0,0,1.12],tip=[0,-Math.cos(arm)*1.18,1.12+Math.sin(arm)*1.18],weight=[0,Math.cos(arm)*.43,1.12-Math.sin(arm)*.43];m.limb(pivot,tip,.05,'woodLight');m.limb(pivot,weight,.07,'woodLight');m.box(weight[0],weight[1],weight[2]-.20,.42,.34,.34,level>=3?'stone':'wood');m.limb(tip,[tip[0],tip[1]-.13,tip[2]-.32],.013,'leather');if(!attack||t<.5)m.ellipsoid(tip[0],tip[1]-.13,tip[2]-.35,.16,.15,.14,'stoneDark',10,5);}
 if(level>=2)for(const side of[-1,1])m.limb([side*.45,-.65,.35],[side*.45,.65,.35],.04,'metal');
 if(level>=4)m.box(0,.55,.45,.65,.31,.2,'woodLight');if(level>=6)m.cylinder(.42,.48,.44,.12,.12,.32,'metal',8);if(level>=8)m.face([[-.52,.63,.46],[.52,.63,.46],[.52,.63,.79],[-.52,.63,.79]],'metal');
 for(const side of[-1,1]){const crew=SWHumanoid14('worker',attack?'attack':state,phase+(side>0?.3:0),1);for(const face of crew.faces)m.face(face.points.map(p=>[p[0]*.48+side*.83,p[1]*.48+.25,p[2]*.48]),face.material,face.shade);}
 if(level>=7){m.limb([.55,.60,.4],[.55,.6,1.45],.018,'wood');m.face([[.55,.6,1.45],[.94,.6,1.37],[.55,.6,1.18]],'cloth');}
 if(state==='death')for(const face of m.faces)for(const p of face.points)p[2]*=1-Math.min(1,phase)*.75;
 return m;
}
function SWDrawTroopRig14(ctx,{kind='infantry',level=1,x=0,y=0,scale=1,heading=0,phase=0,state='idle',enemy=false}){
 const family=SWFamily14(kind)?.id,mounted=family==='riders'&&kind!=='scout',siege=['ram','trebuchet','cannon'].includes(kind),direction=Math.round(heading/(Math.PI/4)),frames=state==='attack'?18:state==='idle'?4:12,normalized=state==='attack'||state==='death'?Math.min(.999,Math.max(0,phase)):((phase*(state==='walk'?1.5:.35))%1+1)%1,index=Math.floor(normalized*frames),key=[kind,level,state,index,direction,enemy].join(':');
 let tile=SWRigCache14.get(key);if(!tile){tile=document.createElement('canvas');tile.width=200;tile.height=190;const mesh=mounted?SWMounted14(kind,state,index/(frames-1),level):siege?SWSiegeRig14(kind,state,index/(frames-1),level):SWHumanoid14(kind,state,index/(frames-1),level);SWRigDraw(tile.getContext('2d'),mesh,{x:100,y:160,scale:siege?66:mounted?69:85,yaw:direction*Math.PI/4,palette:{cloth:enemy?'#bd5347':'#4289ba',skin:'#edb98e',metal:'#8babc0',steel:'#d8e4e8',wood:'#8c5934',woodLight:'#bd8f51',gold:'#eac46c'}});if(SWRigCache14.size>=260)SWRigCache14.delete(SWRigCache14.keys().next().value);SWRigCache14.set(key,tile);}
 const size=scale*.35;ctx.save();ctx.fillStyle='#192c2948';ctx.beginPath();ctx.ellipse(x,y+2,scale*(siege?14:mounted?10:5),scale*(siege?5:2.3),0,0,Math.PI*2);ctx.fill();ctx.drawImage(tile,x-100*size,y-160*size,200*size,190*size);ctx.restore();
}
function lu({kind,level=1}){return swElement(SWUnitPreview14,{kind,level});}
function SWShipMesh14(kind,level,time,damage=0){
 const m=SWRigMesh(),long=kind==='galley',cargo=kind==='cog',siege=kind==='bombard',length=long?3.65:cargo?3.0:siege?3.4:2.35,beam=cargo?1.48:siege?1.32:long?.85:1.0,n=14,deck=.34;
 const section=i=>({y:(i/n-.5)*length,w:Math.pow(Math.sin(i/n*Math.PI),.5)*beam/2});
 for(let i=0;i<n;i++){const a=section(i),b=section(i+1);m.face([[-a.w,a.y,deck],[-b.w,b.y,deck],[b.w,b.y,deck],[a.w,a.y,deck]],'woodLight');for(const side of[-1,1]){m.face([[side*a.w,a.y,deck],[side*b.w,b.y,deck],[side*b.w*.66,b.y,-.12],[side*a.w*.66,a.y,-.12]],'wood');m.limb([side*a.w,a.y,deck+.05],[side*b.w,b.y,deck+.05],.045,level>=5?'metal':'woodLight');if(i%2===0&&level>=2)m.limb([side*a.w,a.y,deck],[side*a.w*.7,a.y,-.10],.024,level>=8?'gold':'metal');}}
 for(let i=0;i<13;i++){const a=section(i+.5);m.limb([-a.w,a.y,deck+.007],[a.w,a.y,deck+.007],.010,'wood');}
 m.box(0,length*.30,deck,beam*.65,.47,.25,'wood');if(level>=3)m.box(0,length*.32,deck+.25,beam*.7,.50,.07,'woodLight');
 if(siege){const catapult=SWSiegeRig14('trebuchet','attack',(time/6.5)%1,level);for(const f of catapult.faces)m.face(f.points.map(p=>[p[0]*.59,p[1]*.60-.36,p[2]*.60+deck]),f.material,f.shade);}
 else if(cargo){for(const side of[-1,1])for(let i=0;i<2;i++)m.box(side*.32,i*.36-.45,deck,.40,.30,.30,'woodLight');}
 if(long)for(const side of[-1,1])for(let i=0;i<7;i++){const y=-1.1+i*.32,stroke=Math.sin(time*3+i*.1)*.15;m.limb([side*.3,y,deck],[side*(.96+stroke),y+.25,-.02],.022,'woodLight');}
 const masts=siege?[.75]:cargo?[-.5,.6]:[.1];for(const my of masts){const height=1.4+level*.032;m.cylinder(0,my,deck,.042,.025,height,'wood',8);const sy=deck+.42,top=deck+height-.12,w=cargo?1.18:.98;for(let u=0;u<8;u++)for(let v=0;v<5;v++){if(damage>.5&&u>5&&v<2)continue;const point=(a,b)=>{const uu=a/8,vv=b/5;return[(uu-.5)*w,my-.13-Math.sin(uu*Math.PI)*Math.sin(vv*Math.PI)*(.2+.03*Math.sin(time)),sy+vv*(top-sy)]};m.face([point(u,v),point(u+1,v),point(u+1,v+1),point(u,v+1)],u===3||u===4?'cloth':'sail');}m.limb([-w/2,my,top],[w/2,my,top],.02,'wood');m.face([[0,my,top+.32],[.38,my,top+.26],[0,my,top+.11]],'cloth');}
 for(const side of[-1,1]){for(let i=2;i<12;i+=2){const a=section(i);m.ellipsoid(side*a.w,a.y,deck-.16,.027,.027,.027,'gold',6,3);}for(let i=0;i<3;i++)m.box(side*beam*.24,length*.31,deck+.045+i*.065,.04,.40,.022,'wood');m.limb([side*beam*.32,length*.24,deck+.27],[side*beam*.32,length*.40,deck+.27],.024,'gold');}for(let i=1;i<=3;i++){const a=section(i),b=section(i+1);m.limb([-a.w,a.y,deck-.12],[-b.w,b.y,deck-.12],.015,'woodLight');m.limb([a.w,a.y,deck-.12],[b.w,b.y,deck-.12],.015,'woodLight');}
 if(cargo){m.box(0,-length*.34,deck+.05,beam*.44,.32,.08,'wood');for(const side of[-1,1])m.limb([side*beam*.24,-length*.30,deck],[side*beam*.24,-length*.44,deck+.3],.028,'leather');}
 if(level>=4)for(const side of[-1,1])m.box(side*beam*.33,length*.28,.55,.05,.28,.20,'metal');
 if(level>=6)m.box(0,length*.34,.65,beam*.60,.25,.05,'gold');
 if(level>=7)for(const side of[-1,1])m.cylinder(side*beam*.25,length*.35,.69,.04,.04,.15,'gold',8);
 if(level>=8)for(const side of[-1,1])m.face([[side*beam*.38,-length*.35,.30],[side*beam*.38,-length*.1,.30],[side*beam*.38,-length*.1,.53],[side*beam*.38,-length*.35,.53]],'cloth');
 if(level>=9)m.limb([0,-length/2,.26],[0,-length/2-.25,.60],.035,'gold');
 if(level===10)m.box(0,length*.36,.72,.42,.28,.07,'gold');return m;
}
const SWShipCache14=new Map();
function SWDrawShipRig14(ctx,ship){
 const {kind,level=1,x=0,y=0,scale=1,heading=0,time=0,side='attack'}=ship,damage=ship.hp===undefined?0:1-ship.hp/ship.maxHp,dir=Math.round(heading/(Math.PI/8)),frame=Math.floor(time*8)%16,band=damage>.65?2:damage>.35?1:0,key=[kind,level,dir,frame,band,side].join(':');
 let tile=SWShipCache14.get(key);if(!tile){tile=document.createElement('canvas');tile.width=256;tile.height=230;SWRigDraw(tile.getContext('2d'),SWShipMesh14(kind,level,frame/8,band*.36),{x:128,y:170,scale:55,yaw:dir*Math.PI/8+Math.PI/2,palette:{cloth:side==='defend'?'#a04940':'#317d8b',sail:side==='defend'?'#d7be9d':'#f3e5c3',wood:'#855335',woodLight:'#c49457',metal:'#94afbb',gold:'#e6ba61'}});if(SWShipCache14.size>=100)SWShipCache14.delete(SWShipCache14.keys().next().value);SWShipCache14.set(key,tile);}
 ctx.save();ctx.translate(x,y);const sunk=ship.hp<=0,p=sunk?Math.min(1,Math.max(0,time-(ship.sunkAt||time))/3):0;ctx.globalAlpha*=1-p;ctx.translate(0,p*22);ctx.rotate(p*.22);const k=.55*scale;ctx.drawImage(tile,-128*k,-170*k,256*k,230*k);ctx.restore();
}
function SWDrawNavalUnit(ctx,ship,images,time,age,reduced){
 const p=vu(ship.x,ship.y);ctx.save();ctx.strokeStyle='#bce7df68';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(p.x,p.y+4+i*2,26+i*7,8+i*3,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
 SWDrawShipRig14(ctx,{...ship,x:p.x,y:p.y,scale:1.10,time:reduced?0:time});
 if(ship.hp>0&&ship.hp<ship.maxHp){ctx.fillStyle='#09252fd9';ctx.fillRect(p.x-22,p.y-79,44,5);ctx.fillStyle=ship.side==='attack'?'#77d3cb':'#e97769';ctx.fillRect(p.x-21,p.y-78,42*ship.hp/ship.maxHp,3);}
 if(ship.hp>0&&ship.hp/ship.maxHp<.45&&!reduced)for(let i=0;i<3;i++){const phase=(time*.6+i/3)%1;ctx.fillStyle='rgba(56,51,43,'+(.26*(1-phase))+')';ctx.beginPath();ctx.ellipse(p.x+Math.sin(i*3)*12+phase*14,p.y-32-phase*45,4+phase*10,5+phase*13,0,0,Math.PI*2);ctx.fill();}
}
function SWShipPortrait13({kind,level=1}){return swElement(SWShipPreview14,{ship:{kind,level}});}
function SWDrawPaintedWorker(ctx,person,position,images,time,reduced=false){const point=vu(position.x,position.y);SWDrawTroopRig14(ctx,{kind:'worker',x:point.x,y:point.y,level:1,scale:.60,heading:position.flip?2.3:-.8,state:position.moving?'walk':position.working?'attack':'idle',phase:reduced?0:time+person.id*.13});return true;}
function SWDrawUnitFall(ctx,event,images,age,reduced=false){const p=vu(event.x,event.y);ctx.save();ctx.globalAlpha=age<1700?1:Math.max(0,1-(age-1700)/700);SWDrawTroopRig14(ctx,{kind:event.unit.kind,level:event.unit.level||1,x:p.x,y:p.y,scale:1,heading:event.flip?2.3:-.8,state:'death',phase:reduced?1:Math.min(1,age/750),enemy:event.enemy});ctx.restore();}
function SWDrawCollapse(ctx,building,images,point,age,reduced){
 const {width,height}=SWBuildingSize(building),timber=['lumber','farm','cottage','market','builder'].includes(building.kind);SWDrawRubble(ctx,building,point,width);
 if(!reduced&&age<800){const tile=SWBuildingTile(building,images),t=Math.min(1,age/800);ctx.save();ctx.globalAlpha=1-Math.max(0,(t-.7)/.3);ctx.translate(point.x,point.y);ctx.beginPath();ctx.rect(-width*.6,-height*1.1,width*1.2,height*1.2);ctx.clip();
  // Roof settles first, followed by the supporting walls. The silhouette stays registered.
  const roofFall=Math.max(0,t-.1)**2*height*.65;ctx.save();ctx.translate(Math.sin(t*28)*(1-t)*1.6,roofFall);ctx.beginPath();ctx.rect(-width,-height*1.2,width*2,height*.65);ctx.clip();ctx.drawImage(tile,-160,-320,320,360);ctx.restore();
  ctx.save();ctx.translate(0,Math.max(0,t-.25)*height*.35);ctx.scale(1,Math.max(.12,1-Math.max(0,t-.25)*1.2));ctx.beginPath();ctx.rect(-width,-height*.55,width*2,height*.8);ctx.clip();ctx.drawImage(tile,-160,-320,320,360);ctx.restore();ctx.restore();
  for(let i=0;i<10;i++){const angle=i*2.399,r=(12+t*width*.35)*(i%3+1)/3,up=Math.sin(t*Math.PI)*(8+i%4*3);ctx.fillStyle=timber?(i%2?'#91643e':'#554435'):(i%2?'#b1a78c':'#7c776c');ctx.save();ctx.translate(point.x+Math.cos(angle)*r,point.y+Math.sin(angle)*r*.3-up);ctx.rotate(t*(i%2?1:-1));ctx.fillRect(-3,-2,timber?10:5,timber?2:5);ctx.restore();}
 }
 if(!reduced)SWDrawDust(ctx,point,width,height,age);
}
function SWDrawSculptedBuilding13(ctx,building,images,point,width){
 const art=SW13BuildingArt(building,images);if(!art)return false;const lv=Math.max(1,Math.min(10,building.level||1)),milestone=Math.floor((lv-1)/3),growth=(lv-1)%3;
 // Keep the authored main building, then add fitted, level-specific working structures.
 SWLegacySculpted13(ctx,building,images,point,width*(SW13BuildingCells[building.kind]?1:.84+lv*.015));
 if(lv<=1)return true;const m=SWRigMesh(),stone=['keep','quarry','tower','forge','bastion','well'].includes(building.kind),wood=['lumber','farm','storehouse','workshop','market'].includes(building.kind),unit=width/95;
 for(let i=0;i<Math.min(3,Math.floor(lv/2));i++){const x=(i%2?1:-1)*.48,y=.35+Math.floor(i/2)*.24;m.box(x,y,0,.24,.24,.15+(wood?lv*.013:0),stone?'stone':'wood');if(wood)m.box(x,y,.16,.23,.23,.03,'woodLight');}
 if(growth>=1||lv>=7){for(const side of[-1,1])m.limb([side*.58,.05,0],[side*.58,.05,.31+milestone*.06],.035,stone?'stoneDark':'wood');m.limb([-.58,.05,.32],[.58,.05,.32],.03,stone?'stone':'woodLight');}
 if(lv>=3){m.limb([.50,.44,0],[.50,.44,.60+lv*.02],.018,'wood');m.face([[.50,.44,.60+lv*.02],[.79,.44,.56+lv*.02],[.50,.44,.37+lv*.02]],'cloth');}
 if(lv>=5&&['quarry','lumber','workshop','harbor'].includes(building.kind)){m.limb([-.62,.05,0],[-.62,.05,.92],.05,'wood');m.limb([-.62,.05,.85],[-.28,-.18,1.13],.045,'wood');m.limb([-.28,-.18,1.13],[-.28,-.18,.38],.010,'leather');m.box(-.28,-.18,.24,.22,.20,.15,'stone');}
 if(lv>=8){for(const side of[-1,1])m.cylinder(side*.48,.38,.3,.04,.04,.14,'gold',8);}
 if(lv===10){m.box(0,.53,.05,.34,.16,.25,'stone');m.box(0,.62,.18,.19,.02,.10,'gold');}
 SWRigDraw(ctx,m,{x:point.x,y:point.y+10,scale:39*unit,yaw:(building.facing||0)*Math.PI/2,palette:{cloth:'#2d758b'}});return true;
}
function SWBuildingPortrait13({kind,level=1,className='',palette='coastal'}){return swElement(SWBuildingPortrait,{building:{kind,level,facing:0},className:'sw-building-portrait13 '+className});}
const SWSeaTexture14={image:null,tile:null};
const SWSeaGroundTexture14={image:null,tile:null};
function SWDrawSeaGround14(ctx,image){
 if(!image)return;
 if(SWSeaGroundTexture14.image!==image){const tile=document.createElement('canvas');tile.width=384;tile.height=256;tile.getContext('2d').drawImage(image,image.width*.62,image.height*.55,image.width*.12,image.height*.12,0,0,384,256);SWSeaGroundTexture14.image=image;SWSeaGroundTexture14.tile=tile;}
 ctx.fillStyle=ctx.createPattern(SWSeaGroundTexture14.tile,'repeat');ctx.fillRect(-6000,-6000,12000,12000);
 const left=-1100,top=-140,right=2300,bottom=1900,scale=Math.max((right-left)/1200,(bottom-top)/800,(338-.519*left-top)/338,(bottom-338+.519*left)/462),y=338-338*scale-.519*left;
 ctx.drawImage(image,left,y,1200*scale,800*scale);
}
function SWDrawLandingEdge14(ctx,input,scale,preview){
 ctx.save();const a=vu(-1,-.35),b=vu(-1,8.35);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle='#59d1bf38';ctx.lineWidth=24;ctx.stroke();ctx.strokeStyle='#b3f3d7';ctx.lineWidth=2/scale;ctx.setLineDash([8/scale,7/scale]);ctx.stroke();ctx.setLineDash([]);
 for(const y of[1,4,7]){const p=vu(-1,y);ctx.fillStyle='#112f39e6';ctx.beginPath();ctx.arc(p.x,p.y,10/scale,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#dceccc';ctx.lineWidth=1.5/scale;ctx.beginPath();ctx.moveTo(p.x-4/scale,p.y-2/scale);ctx.lineTo(p.x,p.y+3/scale);ctx.lineTo(p.x+4/scale,p.y-2/scale);ctx.stroke();}
 if(preview){const p=vu(preview.x,preview.y);ctx.strokeStyle='#ffe5a2';ctx.lineWidth=3/scale;ctx.beginPath();ctx.ellipse(p.x,p.y,36,18,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
}
function SWDrawSea14(ctx,time,defense,image){
 const shore=[];for(let y=-70;y<=70;y+=.3)shore.push(vu(-2.18+Math.sin(y*1.6)*.09+Math.sin(y*3.7)*.04,y));
 ctx.save();ctx.beginPath();const far=vu(-200,-70);ctx.moveTo(far.x,far.y);for(const p of shore)ctx.lineTo(p.x,p.y);const end=vu(-200,70);ctx.lineTo(end.x,end.y);ctx.closePath();ctx.clip();
 ctx.fillStyle='#235e77';ctx.fillRect(-16000,-16000,32000,32000);
 if(image){if(SWSeaTexture14.image!==image){const tile=document.createElement('canvas');tile.width=512;tile.height=256;const c=tile.getContext('2d');c.drawImage(image,190,5,350,130,0,0,512,256);SWSeaTexture14.image=image;SWSeaTexture14.tile=tile;}ctx.globalAlpha=.55;ctx.fillStyle=ctx.createPattern(SWSeaTexture14.tile,'repeat');ctx.fillRect(-5000,-5000,10000,10000);ctx.globalAlpha=1;}
 for(let i=0;i<100;i++){const x=-14+(i*7.137)%12,y=-8+(i*3.739)%25,p=vu(x,y),wave=Math.sin(time*.9+i)*2;ctx.strokeStyle=i%3?'#90c7c730':'#def3df55';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(p.x-9,p.y+wave);ctx.quadraticCurveTo(p.x,p.y+wave-3,p.x+15,p.y+wave);ctx.stroke();}ctx.restore();
 ctx.save();ctx.lineJoin='round';ctx.lineCap='round';const edge=()=>{ctx.beginPath();shore.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));};edge();ctx.strokeStyle='#c9c59aa0';ctx.lineWidth=18;ctx.stroke();edge();ctx.strokeStyle='#decea4';ctx.lineWidth=9;ctx.stroke();edge();ctx.strokeStyle='#e3efe0b0';ctx.lineWidth=2;ctx.stroke();
 for(const y of[1,4,7]){const p=vu(-1,y);ctx.fillStyle='#d7bd7960';ctx.beginPath();ctx.ellipse(p.x,p.y,28,14,-.48,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e6d5a9c0';ctx.lineWidth=1.4;ctx.stroke();}
 const shoal=vu(-6.2,4.45);for(let i=0;i<5;i++){ctx.fillStyle=['#8c9788','#b0b29b','#667f7a'][i%3];ctx.beginPath();ctx.ellipse(shoal.x+Math.sin(i*2.4)*10,shoal.y+Math.cos(i*2.4)*15,7+i%3*3,11+i%2*4,-.5,0,Math.PI*2);ctx.fill();}ctx.restore();
}
function SWDrawLayoutOverlay14(ctx,state,overlay){
 const stats=SWLandStats(state),connected=new Set(stats.connectedIds),path=(x,y)=>{const p=vu(x,y);ctx.beginPath();ctx.moveTo(p.x,p.y-24);ctx.lineTo(p.x+47,p.y);ctx.lineTo(p.x,p.y+24);ctx.lineTo(p.x-47,p.y);ctx.closePath();};ctx.save();
 if(overlay==='plots')for(let x=-1;x<=20;x++)for(let y=-1;y<=20;y++)if(SWWalkable(state,x,y)&&!state.buildings.some(b=>b.x===x&&b.y===y)){path(x,y);ctx.strokeStyle='#e6e9b74d';ctx.lineWidth=.8;ctx.stroke();}
 if(overlay==='roads'){for(const t of state.terrain||[])if(t.kind==='road'){path(t.x,t.y);ctx.fillStyle='#78d0c044';ctx.fill();}for(const b of state.buildings){if(b.kind==='keep'||connected.has(b.id)){path(b.x,b.y);ctx.strokeStyle='#c9eab8';ctx.lineWidth=2;ctx.stroke();}}}
 if(overlay==='defense')for(const b of state.buildings)if(Cc.includes(b.kind)){const p=vu(b.x,b.y),range=sl(b).range;ctx.beginPath();ctx.ellipse(p.x,p.y,range*73,range*38,0,0,Math.PI*2);ctx.fillStyle='#cd8a4420';ctx.fill();ctx.strokeStyle='#edc68b8c';ctx.lineWidth=1.4;ctx.stroke();}
 if(overlay==='harbor'){for(let y=1;y<=6;y++){path(-1,y);ctx.fillStyle='#8ccbc84a';ctx.fill();}for(const slot of SWCoast.slots){path(slot.x,slot.y);ctx.fillStyle='#d8ba6d70';ctx.fill();ctx.strokeStyle='#f2daa0';ctx.stroke();}}
 ctx.restore();
}

function SWRigDraw(ctx,mesh,{x=0,y=0,scale=50,yaw=0,palette={},alpha=1,tilt=0}={}) {
  const colors={...SWRigSource.palette,...palette},ca=Math.cos(yaw),sa=Math.sin(yaw),ct=Math.cos(tilt),st=Math.sin(tilt),project=p=>{const px=p[0]*ca-p[1]*sa,py=p[0]*sa+p[1]*ca,pz=p[2]*ct+py*st,yy=py*ct-p[2]*st;return [x+(px-yy)*.7071*scale,y+(px+yy)*.35355*scale-pz*.866*scale,(px+yy)*.612372+pz*.5];},light=SWRigSource.projection.light;
  const projected=mesh.faces.map(f=>{const p=f.points.map(project),a=f.points[0],b=f.points[1],c=f.points[2],u=b.map((v,i)=>v-a[i]),v=c.map((value,i)=>value-a[i]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n)||1,nx=n[0]*ca-n[1]*sa,ny=n[0]*sa+n[1]*ca,diffuse=Math.max(0,(nx*light[0]+ny*light[1]+n[2]*light[2])/len),shade=(.66+diffuse*.51)*f.shade;return {p,depth:p.reduce((s,v)=>s+v[2],0)/p.length,color:SWRigColor(colors[f.material]||f.material,shade)};}).sort((a,b)=>a.depth-b.depth);
  ctx.save();ctx.globalAlpha*=alpha;ctx.lineJoin='round';for(const f of projected){ctx.beginPath();f.p.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();ctx.strokeStyle=f.color;ctx.lineWidth=.35;ctx.stroke();}ctx.restore();
}
