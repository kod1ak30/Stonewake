import {SWKeepFrames17, SWKeepRearFrames17, SWEconomyFrames17} from './art-metadata.js';

const levelOf = level => Math.max(1, Math.min(10, Math.round(level || 1)));
export function SWKeepSize17(level, facing=0) {
  const rank = levelOf(level), frame = (facing>=2?SWKeepRearFrames17:SWKeepFrames17)[rank - 1];
  const width = [101, 108, 113, 120, 126, 132, 137, 142, 147, 153][rank - 1];
  return {width, height: width * frame.h / frame.w, frame};
}
export function SWEconomySize17(kind,level){
  const column=['farm','lumber','quarry','storehouse'].indexOf(kind);if(column<0)return null;
  const rank=levelOf(level),tier=Math.min(2,Math.floor((rank-1)/3)),frame=SWEconomyFrames17[tier*4+column],width=[84,96,108][tier]+(rank-1-tier*3)*1.8;
  return {width,height:width*frame.h/frame.w,frame,tier};
}

export const SWWallMaterials17 = [
  {name:'Oak palisade', wood:true, height:22, width:.17, top:'#c7a274', light:'#a78054', dark:'#6f5135', trim:'#523e2d'},
  {name:'Bound oak', wood:true, height:25, width:.19, top:'#c9ab7c', light:'#ad895e', dark:'#795738', trim:'#4e6062'},
  {name:'Stonefoot rampart', wood:true, height:29, width:.23, top:'#c6ba99', light:'#a9916b', dark:'#76654b', trim:'#64747b'},
  {name:'Sandstone curtain', height:31, width:.24, top:'#dfd1ad', light:'#b6a889', dark:'#877b64', trim:'#b8ab8b'},
  {name:'Buttressed curtain', height:34, width:.26, top:'#e2d4b7', light:'#baaf95', dark:'#8c826e', trim:'#9ba7a6'},
  {name:'Harbor bastion', height:37, width:.28, top:'#d5d1bf', light:'#9da8a7', dark:'#69787e', trim:'#b88a57'},
  {name:'Granite bulwark', height:40, width:.30, top:'#abb8bd', light:'#7c909b', dark:'#4c6271', trim:'#c2925c'},
  {name:'Copperbound bulwark', height:43, width:.31, top:'#c2cacc', light:'#849ba4', dark:'#526b78', trim:'#cf9d60'},
  {name:'Crownstone rampart', height:46, width:.32, top:'#e0d8bf', light:'#b6bba9', dark:'#748b8d', trim:'#dcbb70'},
  {name:'Beacon rampart', height:49, width:.33, top:'#eee4c9', light:'#c4cbc0', dark:'#839fa0', trim:'#4da4b1'}
];
const directions = [[1,0], [0,1], [-1,0], [0,-1]];
const keyOf = (x,y) => `${x},${y}`;
const project = (x,y) => ({x:600+(x-y)*52,y:175+(x+y)*27});

/** One half-span per neighbour. Every adjoining tile meets exactly at its shared edge. */
export function SWWallPlan17(building, walls) {
  const level = levelOf(building.level), material = SWWallMaterials17[level - 1];
  let links = directions.filter(([dx,dy])=>walls.has(keyOf(building.x+dx,building.y+dy)));
  if (!links.length) links = building.axis === 'y' ? [[0,-1],[0,1]] : [[-1,0],[1,0]];
  const corner = links.some(([x])=>x) && links.some(([,y])=>y);
  return {level, material, links, corner, junction:corner || links.length === 1 || links.length > 2};
}

function face(ctx, points, fill) {
  ctx.beginPath(); points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
  ctx.closePath(); ctx.fillStyle=fill; ctx.fill();
}
function prism(ctx,a,b,width,height,base,material,masonry=true) {
  const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1,nx=-dy/length*width/2,ny=dx/length*width/2;
  const p=[project(a.x+nx,a.y+ny),project(b.x+nx,b.y+ny),project(b.x-nx,b.y-ny),project(a.x-nx,a.y-ny)];
  const edges=p.map((v,i)=>[v,p[(i+1)%4]]).sort((u,v)=>u[0].y+u[1].y-v[0].y-v[1].y);
  for(const [u,v] of edges){
    face(ctx,[{x:u.x,y:u.y-base},{x:v.x,y:v.y-base},{x:v.x,y:v.y-base-height},{x:u.x,y:u.y-base-height}],v.x>u.x?material.dark:material.light);
    const extent=Math.hypot(v.x-u.x,v.y-u.y);
    if(masonry&&extent>10&&height>10){
      ctx.strokeStyle='#293d3e38';ctx.lineWidth=.65;
      const courses=Math.max(2,Math.round(height/7)),columns=Math.max(1,Math.round(extent/14));
      for(let row=0;row<courses;row++){
        const z=base+height*row/courses;
        ctx.beginPath();ctx.moveTo(u.x,u.y-z);ctx.lineTo(v.x,v.y-z);ctx.stroke();
        for(let col=0;col<columns;col++){
          const t=(col+(row%2?.5:1))/columns;if(t>=1)continue;
          const x=u.x+(v.x-u.x)*t,y=u.y+(v.y-u.y)*t-z;
          ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-height/courses);ctx.stroke();
        }
      }
    }
  }
  face(ctx,p.map(v=>({x:v.x,y:v.y-base-height})),material.top);
}
function wallSpan(ctx,a,b,material,level,height=material.height){
  if(material.wood){
    if(level===3)prism(ctx,a,b,material.width+.05,9,0,SWWallMaterials17[3]);
    const count=Math.max(2,Math.round(Math.hypot(b.x-a.x,b.y-a.y)*9));
    for(let i=0;i<count;i++){
      const t=i/count,u=(i+.97)/count,pa={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t},pb={x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u};
      prism(ctx,pa,pb,material.width,height-2,level===3?6:0,material,false);
      const m=project((pa.x+pb.x)/2,(pa.y+pb.y)/2);face(ctx,[{x:m.x-3,y:m.y-height+2},{x:m.x,y:m.y-height-3},{x:m.x+3,y:m.y-height+2}],material.top);
    }
    const p=project(a.x,a.y),q=project(b.x,b.y);ctx.strokeStyle=material.trim;ctx.lineWidth=level===1?1.8:2.6;
    for(const fraction of [.26,.70]){ctx.beginPath();ctx.moveTo(p.x,p.y-height*fraction);ctx.lineTo(q.x,q.y-height*fraction);ctx.stroke();}
  }else{
    prism(ctx,a,b,material.width+.055,5,0,material);
    prism(ctx,a,b,material.width,height-5,5,material);
    prism(ctx,a,b,material.width+.045,2,height-1,{...material,light:material.top,dark:material.light},false);
    const count=Math.max(1,Math.round(Math.hypot(b.x-a.x,b.y-a.y)*4));
    for(let i=0;i<count;i++){
      const t=(i+.13)/count,u=(i+.67)/count;
      prism(ctx,{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t},{x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u},material.width+.025,5,height,material,false);
    }
    if(level>=6)prism(ctx,a,b,material.width+.015,1.8,height*.64,{...material,light:material.trim,dark:material.trim,top:material.trim},false);
  }
}
export function SWPaintWall17(ctx,building,walls,units,opacity=1){
  const {x,y}=building,{level,material,links,junction}=SWWallPlan17(building,walls),point=project(x,y),unit=units?.get(building.id);
  ctx.save();ctx.globalAlpha*=opacity*(building.level===0?.55:1);
  if(unit?.hp<=0){
    for(let i=0;i<7;i++){const a={x:x+(i%3-1)*.13,y:y+(Math.floor(i/3)-1)*.13};prism(ctx,a,{x:a.x+.12,y:a.y},.12,3+i%3*2,0,material,false);}
    ctx.restore();return;
  }
  if(building.kind==='gate'){
    const axis=building.axis==='y'?{x:0,y:1}:{x:1,y:0};
    for(const [dx,dy]of links)if(dx*axis.x+dy*axis.y===0)wallSpan(ctx,{x,y},{x:x+dx*.501,y:y+dy*.501},material,level);
    for(const sign of[-1,1])wallSpan(ctx,{x:x+axis.x*.23*sign,y:y+axis.y*.23*sign},{x:x+axis.x*.5*sign,y:y+axis.y*.5*sign},material,level,material.height+5);
    const a={x:x-axis.x*.23,y:y-axis.y*.23},b={x:x+axis.x*.23,y:y+axis.y*.23};
    prism(ctx,a,b,material.width,6,material.height-2,material,false);
    const p=project(a.x,a.y),q=project(b.x,b.y);
    face(ctx,[p,q,{x:q.x,y:q.y-material.height+5},{x:p.x,y:p.y-material.height+5}],'#584735');
    ctx.strokeStyle=material.trim;ctx.lineWidth=1.4;
    for(let i=1;i<6;i++){const t=i/6,px=p.x+(q.x-p.x)*t,py=p.y+(q.y-p.y)*t;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py-material.height+5);ctx.stroke();}
  }else{
    for(const [dx,dy]of links.toSorted((a,b)=>a[0]+a[1]-b[0]-b[1]))wallSpan(ctx,{x,y},{x:x+dx*.501,y:y+dy*.501},material,level);
    if(junction){
      const w=material.width+(level>=5?.07:.03);prism(ctx,{x:x-w/2,y},{x:x+w/2,y},w,material.height+3,0,material,!material.wood);
      if(level>=8)prism(ctx,{x:x-w/2-.015,y},{x:x+w/2+.015,y},w+.03,2,material.height+3,{...material,top:material.trim},false);
    }
    if(level>=5){const a={x:x-.075,y:y+material.width*.5},b={x:x+.075,y:y+material.width*.5};prism(ctx,a,b,.13,material.height*.48,0,material);}
    if(level===10&&junction){ctx.fillStyle='#7ed5dc';ctx.beginPath();ctx.ellipse(point.x,point.y-material.height-2,2.5,4,0,0,Math.PI*2);ctx.fill();}
  }
  if(unit&&unit.hp<unit.maxHp*.55){ctx.strokeStyle='#273337aa';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(point.x-2,point.y-material.height+4);ctx.lineTo(point.x+3,point.y-material.height*.5);ctx.lineTo(point.x-2,point.y-5);ctx.stroke();}
  ctx.restore();
}

export function SWRoadNetwork17(terrain=[],routes=[],buildings=[]){
  const occupied=new Set(buildings.filter(b=>b.kind!=='gate').map(b=>keyOf(b.x,b.y)));
  const tiles=new Map();
  for(const t of [...terrain.filter(t=>t.kind==='road'),...routes.flat()])if(Number.isInteger(t.x)&&Number.isInteger(t.y)&&!occupied.has(keyOf(t.x,t.y)))tiles.set(keyOf(t.x,t.y),{x:t.x,y:t.y});
  const segments=[];
  for(const t of tiles.values()){
    const links=directions.filter(([dx,dy])=>tiles.has(keyOf(t.x+dx,t.y+dy)));
    for(const [dx,dy]of links)if(dx>0||dy>0)segments.push([t,{x:t.x+dx,y:t.y+dy}]);
    if(!links.length)segments.push([{x:t.x-.12,y:t.y},{x:t.x+.12,y:t.y}]);
  }
  return {tiles:[...tiles.values()],segments};
}
const roadNetworks=new Map();
export function SWDrawRoads17(ctx,terrain=[],routes=[],appearance={},buildings=[]){
  // Citizen routes are worn footpaths. Only roads the player actually builds
  // receive purchased paving, matching their connectivity/production benefit.
  if(routes.length&&appearance.road!=='footpath'){
    SWDrawRoads17(ctx,[],routes,{road:'footpath'},buildings);
    if(terrain.some(tile=>tile.kind==='road'))SWDrawRoads17(ctx,terrain,[],appearance,buildings);
    return;
  }
  const topology=terrain.filter(t=>t.kind==='road').map(t=>keyOf(t.x,t.y)).join(';')+'|'+routes.flat().map(t=>keyOf(t.x,t.y)).join(';')+'|'+buildings.filter(b=>b.kind!=='gate').map(b=>keyOf(b.x,b.y)).join(';');
  let cached=roadNetworks.get(topology);
  if(!cached){
    const network=SWRoadNetwork17(terrain,routes,buildings),path=new Path2D(),pavers=new Path2D(),stones=[new Path2D(),new Path2D(),new Path2D()];
    for(const [a,b]of network.segments){
      path.moveTo(a.x,a.y);path.lineTo(b.x,b.y);
      const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1;
      for(let i=1;i<=5;i++){const t=i/6,x=a.x+dx*t,y=a.y+dy*t;pavers.moveTo(x-dy/length*.155,y+dx/length*.155);pavers.lineTo(x+dy/length*.155,y-dx/length*.155);}
      for(let i=0;i<6;i++)for(let lane=0;lane<2;lane++){
        const t=(i+.5)/6,cross=(lane-.5)*.145,x=a.x+dx*t-dy/length*cross,y=a.y+dy*t+dx/length*cross,stone=stones[Math.abs(Math.round(a.x*7+a.y*11)+i+lane)%3];
        const points=[[-.070,-.061],[.059,-.068],[.074,.053],[-.057,.066]];
        points.forEach(([along,across],index)=>{const px=x+dx/length*along-dy/length*across,py=y+dy/length*along+dx/length*across;if(index)stone.lineTo(px,py);else stone.moveTo(px,py);});stone.closePath();
      }
    }
    cached={path,pavers,stones};if(roadNetworks.size>=32)roadNetworks.delete(roadNetworks.keys().next().value);roadNetworks.set(topology,cached);
  }
  const style=appearance.road||'earth',footpath=style==='footpath',stone=!['earth','footpath'].includes(style),colors=style==='royal'?['#6c74553d','#98885e','#c3b68b']:style==='stone'?['#59664d35','#878d80','#afb3a0']:footpath?['#69734512','#887a4628','#af996047']:['#66744b24','#8f81594d','#b39a6d99'];
  ctx.save();ctx.transform(52,27,-52,27,600,175);ctx.lineCap='round';ctx.lineJoin='round';
  for(const [width,color]of [[footpath?.29:.49,colors[0]],[footpath?.22:.39,colors[1]],[footpath?.16:.31,colors[2]]]){ctx.lineWidth=width;ctx.strokeStyle=color;ctx.stroke(cached.path);}
  if(stone){
    const shades=style==='royal'?['#c8b991','#b5a57b','#d0c298']:['#b8b9a9','#a2a895','#c1c2b1'];
    cached.stones.forEach((path,index)=>{ctx.fillStyle=shades[index];ctx.fill(path);});
    ctx.lineWidth=.007;ctx.strokeStyle=style==='royal'?'#6e66452c':'#5664553c';ctx.stroke(cached.pavers);
  }
  ctx.restore();
}
