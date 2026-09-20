// Authored rank sprites share one pixel scale and a ground contact anchor.
// The four ranks change actual equipment. Intermediate levels keep their rank art.
export const SWUnitArtBudget17 = Object.freeze({damageTiles: 36, damageExtent: 256, vanguardFrames: 32});
export const SWShipDamageCache17 = new Map();
const level17 = value => Math.max(1, Math.min(10, Math.floor(Number.isFinite(value) ? value : 1)));
export const SWVanguardAnchors17 = Object.freeze([
  130.868,127.623,129.868,138.528,130.245,137.962,86.849,112.302,
  126.679,127.887,125.472,133.717,124.245,130.547,85.66,110.132,
  134.189,137.396,132.981,138,132.377,129.151,94.962,119.887,
  134.83,136.642,137.264,141.887,134.226,130.377,106.264,123.321,
]);
export function SWVanguardPose17(kind, level, images, state, phase) {
  if (kind !== 'infantry' || !images?.vanguard17) return null;
  const rank = Math.floor((level17(level)-1)/3), time = Number.isFinite(phase) ? phase : 0;
  // Use the same normalized strike and walking clock as the combat renderer.
  const column = state === 'attack' ? 4 + Math.min(3,Math.floor(Math.max(0,Math.min(.999,time))*4))
    : state === 'walk' ? Math.floor(((time*6)%4+4)%4) : 0;
  return {image: images.vanguard17, frame: {x: column*256,y: rank*256,w: 256,h: 256},
    reference: 178.717, anchorX: SWVanguardAnchors17[rank*8+column], authored17: true};
}
export function SWShipUpgrade17(kind, level, hp, maxHp) {
  const rank=level17(level),ratio=Number.isFinite(hp)&&Number.isFinite(maxHp)&&maxHp>0?Math.max(0,Math.min(1,hp/maxHp)):1;
  return {rank, tier:Math.min(2,Math.floor((rank-1)/3)), damage:ratio<.3?3:ratio<.58?2:ratio<.83?1:0};
}

export function SWShipDamageArt17(art, kind, level, hp, maxHp, createCanvas = () => document.createElement('canvas')) {
  const profile=SWShipUpgrade17(kind,level,hp,maxHp);if(!art||!profile.damage)return art;
  const key=[art.image.src,...art.rect,kind,profile.rank,profile.damage].join(':'),cached=SWShipDamageCache17.get(key);if(cached)return cached;
  const [x,y,w,h]=art.rect,ratio=Math.min(1,SWUnitArtBudget17.damageExtent/Math.max(w,h)),tile=createCanvas();tile.width=Math.max(1,Math.round(w*ratio));tile.height=Math.max(1,Math.round(h*ratio));
  const ctx=tile.getContext('2d',{willReadFrequently:true});ctx.drawImage(art.image,x,y,w,h,0,0,tile.width,tile.height);
  const pixels=ctx.getImageData(0,0,tile.width,tile.height),data=pixels.data,stage=profile.damage;
  // Tears are cut only from the authored sail cloth. Hull, rigging, faces and
  // open water never receive a rectangular damage texture or background erase.
  for(let row=0;row<tile.height;row++)for(let col=0;col<tile.width;col++){
    const i=(row*tile.width+col)*4;if(data[i+3]<20)continue;
    const u=col/tile.width,v=row/tile.height,r=data[i],g=data[i+1],b=data[i+2],sail=b>r*1.12&&b>g*.88&&v<.73;
    if(sail){
      const tearA=Math.abs((u-.43)*.7+(v-.42)*.25)<(.009+stage*.004)&&v>.30&&v<.48+stage*.03;
      const tearB=stage>=2&&Math.pow((u-.64)/(.037+stage*.013),2)+Math.pow((v-.49)/(.042+stage*.011),2)<1+Math.sin(row*1.4)*.17;
      const tearC=stage>=3&&v>.61+Math.sin(u*39)*.026&&u>.24&&u<.61;
      if(tearA||tearB||tearC){data[i+3]=0;continue;}
      if(stage>=2&&v>.5){data[i]*=.79;data[i+1]*=.83;data[i+2]*=.85;}
    }
    if(v>.66){
      const burn=Math.max(0,1-Math.hypot((u-.55)/(.14+stage*.06),(v-.83)/(.07+stage*.025)));
      const splinter=stage>=2&&Math.abs(v-(.86-(u-.5)*.29))<.008&&u>.26&&u<.72;
      if(burn||splinter){const shade=splinter?.3:1-burn*(.35+stage*.14);data[i]*=shade;data[i+1]*=shade*.98;data[i+2]*=shade*.91;}
    }
  }
  ctx.putImageData(pixels,0,0);tile.src='stonewake-damage17:'+key;
  const result={...art,image:tile,rect:[0,0,tile.width,tile.height],damage17:profile.damage};
  if(SWShipDamageCache17.size>=SWUnitArtBudget17.damageTiles)SWShipDamageCache17.delete(SWShipDamageCache17.keys().next().value);
  SWShipDamageCache17.set(key,result);return result;
}

