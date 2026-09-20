// @ts-nocheck
// Recovered as an ES module for build 15. Preserve saved-state and replay semantics.
import { SWAtlasFrame } from "../frontend/legacy/presentation.js";
import { swElement } from "./interface.js";
import { SWBuildingPortrait13, SWPresentationAssets15 } from "./build14/render.js";
import {SWKeepSize17,SWEconomySize17} from "./build17/world.js";
// Stonewake sculpted visual system. Presentation only; no economy or combat rule changes.
const SW13UtilityKinds=['farm','lumber','quarry','forge','market','harbor','builder','workshop','tavern','well','tower','mortar','bombtower','flame','bastion','monument'];
const SW13BuildingCells={keep:[0,1,2],cottage:[3,4,5],barracks:[6,7,8],storehouse:[9,10,11]};
const SW13SpriteRects={"buildings":[{"x":81,"y":102,"w":218,"h":267},{"x":406,"y":82,"w":280,"h":297},{"x":776,"y":61,"w":294,"h":315},{"x":1152,"y":131,"w":231,"h":242},{"x":58,"y":430,"w":271,"h":276},{"x":426,"y":413,"w":278,"h":292},{"x":780,"y":473,"w":266,"h":231},{"x":1132,"y":404,"w":276,"h":300},{"x":54,"y":727,"w":307,"h":305},{"x":427,"y":802,"w":259,"h":218},{"x":771,"y":783,"w":289,"h":247},{"x":1122,"y":738,"w":301,"h":294}],"rear":[{"x":87,"y":104,"w":227,"h":281},{"x":412,"y":78,"w":290,"h":307},{"x":780,"y":56,"w":302,"h":336},{"x":1147,"y":139,"w":253,"h":249},{"x":56,"y":451,"w":292,"h":260},{"x":417,"y":415,"w":301,"h":317},{"x":778,"y":486,"w":294,"h":244},{"x":1132,"y":395,"w":310,"h":329},{"x":50,"y":736,"w":316,"h":315},{"x":422,"y":815,"w":271,"h":233},{"x":763,"y":790,"w":302,"h":259},{"x":1102,"y":751,"w":319,"h":300}],"utilities":[{"x":71,"y":83,"w":208,"h":205},{"x":385,"y":89,"w":207,"h":193},{"x":671,"y":86,"w":204,"h":202},{"x":997,"y":79,"w":187,"h":209},{"x":68,"y":380,"w":220,"h":212},{"x":375,"y":390,"w":217,"h":210},{"x":683,"y":391,"w":188,"h":205},{"x":996,"y":397,"w":195,"h":209},{"x":52,"y":671,"w":226,"h":221},{"x":391,"y":677,"w":166,"h":211},{"x":728,"y":659,"w":138,"h":230},{"x":1009,"y":711,"w":196,"h":177},{"x":72,"y":959,"w":196,"h":226},{"x":396,"y":979,"w":175,"h":197},{"x":667,"y":956,"w":236,"h":225},{"x":1025,"y":952,"w":156,"h":241}],"ships":[{"x":71,"y":95,"w":266,"h":305},{"x":485,"y":37,"w":278,"h":363},{"x":891,"y":27,"w":322,"h":380},{"x":47,"y":507,"w":328,"h":282},{"x":447,"y":480,"w":361,"h":308},{"x":860,"y":442,"w":371,"h":349},{"x":73,"y":886,"w":274,"h":322},{"x":471,"y":873,"w":310,"h":339},{"x":862,"y":838,"w":378,"h":380}],"units":[[{"x":117,"y":141,"w":133,"h":177},{"x":428,"y":138,"w":117,"h":183},{"x":702,"y":143,"w":144,"h":182},{"x":1015,"y":138,"w":119,"h":188}],[{"x":109,"y":424,"w":160,"h":202},{"x":413,"y":425,"w":152,"h":199},{"x":704,"y":428,"w":154,"h":201},{"x":1008,"y":428,"w":148,"h":197}],[{"x":106,"y":722,"w":156,"h":193},{"x":408,"y":720,"w":148,"h":193},{"x":698,"y":719,"w":155,"h":198},{"x":1008,"y":718,"w":148,"h":192}],[{"x":131,"y":1002,"w":116,"h":181},{"x":433,"y":1002,"w":109,"h":181},{"x":726,"y":1001,"w":114,"h":183},{"x":1033,"y":1002,"w":109,"h":181}]],"actions":[[{"x":94,"y":90,"w":198,"h":259},{"x":427,"y":52,"w":223,"h":304},{"x":809,"y":102,"w":268,"h":268},{"x":1185,"y":90,"w":174,"h":266}],[{"x":79,"y":421,"w":231,"h":283},{"x":439,"y":418,"w":259,"h":291},{"x":800,"y":419,"w":238,"h":291},{"x":1165,"y":429,"w":209,"h":280}],[{"x":86,"y":761,"w":208,"h":277},{"x":437,"y":767,"w":223,"h":270},{"x":798,"y":765,"w":251,"h":276},{"x":1167,"y":763,"w":200,"h":274}]]};
function SW13BuildingArt(building,images){
 if(building.kind==='keep'&&images.keep17){const rear=(building.facing||0)>=2&&images.keepRear17,{frame}=SWKeepSize17(building.level,rear?2:0);return {image:rear?images.keepRear17:images.keep17,frame,tier:Math.min(2,Math.floor(((building.level||1)-1)/3)),authored17:true};}
 const economic=SWEconomySize17(building.kind,building.level);if(economic&&images.economy17)return {image:images.economy17,frame:economic.frame,tier:economic.tier,authored17:true};
 const tier=Math.min(2,Math.floor((Math.max(1,building.level||1)-1)/3)),base=SW13BuildingCells[building.kind],index=base?base[tier]:SW13UtilityKinds.indexOf(building.kind),rear=base&&(building.facing||0)>=2&&images.buildingsRear13,image=base?(rear?images.buildingsRear13:images.buildings13):images.utilities13;
 if(!image||index<0)return null;
 const rectangles=SW13SpriteRects[base?(rear?'rear':'buildings'):'utilities'];
 const frame=rectangles?.[index]||SWAtlasFrame(image,4,base?3:4,index%4,Math.floor(index/4));
 return {image,frame,tier};
}
function SWLegacySculpted13(ctx,building,images,point,width){
 const art=SW13BuildingArt(building,images);if(!art)return false;
 const {image,frame}=art,facing=((building.facing||0)%4+4)%4,scale=width/frame.w,height=frame.h*scale;
 ctx.save();ctx.translate(point.x,point.y+7);if(facing===1||facing===2)ctx.scale(-1,1);
 ctx.drawImage(image,frame.x,frame.y,frame.w,frame.h,-width/2,-height,width,height);
 ctx.restore();return true;
}
function SWIllustration13({index=0,className='',style={}}){
 return swElement('span',{'aria-hidden':true,className:'sw-illustration13 '+className,style:{backgroundPosition:(index%4)*100/3+'% '+Math.floor(index/4)*100+'%',...style}});
}
function SWPortrait13({id='captain',className=''}){
 const index={captain:0,engineer:1,ranger:2,voss:3}[id]??0;
 return swElement('span',{'aria-hidden':true,className:'sw-portrait13 commander-portrait '+className,style:{backgroundPosition:index*100/3+'% 50%'}});
}

function SWCatalogArt13({item}){
 return item.slot==='palette'?swElement(SWBuildingPortrait13,{kind:'keep',level:7,palette:item.value}):swElement(SWIllustration13,{index:item.slot==='commander'?6:item.slot==='ornament'?3:5});
}
const SW15CoastalShipFrames=[[72,92,378,403],[557,27,434,473],[1062,17,451,485],[75,606,380,370],[554,536,440,448],[1060,521,463,456]];
function SW13ShipArt(kind,level,images){
 const coastal=images.coastalShips15||SWPresentationAssets15.coastalShips15;
 if(coastal&&(kind==='cog'||kind==='bombard')){const tier=Math.min(2,Math.floor((Math.max(1,level||1)-1)/3));return{image:coastal,rect:SW15CoastalShipFrames[(kind==='bombard'?3:0)+tier]};}
 const row=['cutter','galley','bombard'].indexOf(kind),tier=Math.min(2,Math.floor((Math.max(1,level||1)-1)/3));if(row<0||!images.ships13)return null;
 const f=SW13SpriteRects.ships[row*3+tier];return {image:images.ships13,rect:[f.x,f.y,f.w,f.h]};
}
function SWDrawUnit13(ctx,row,images,height,time,moving,attacking,phase,reduced){
 if(!images.units13)return false;const col=reduced?0:attacking?Math.min(3,Math.floor(phase*4)):moving?Math.floor(time*6)%4:0;
 const action=attacking&&images.unitActions13&&SW13SpriteRects.actions,frames=action?SW13SpriteRects.actions[row]:SW13SpriteRects.units[row],frame=frames[col],scale=height/Math.max(...frames.map(f=>f.h)),image=action?images.unitActions13:images.units13;
 ctx.drawImage(image,frame.x,frame.y,frame.w,frame.h,-frame.w*scale/2,-frame.h*scale,frame.w*scale,frame.h*scale);return true;
}

// End Stonewake sculpted visual system.

export { SW13UtilityKinds, SW13BuildingCells, SW13SpriteRects, SW13BuildingArt, SWLegacySculpted13, SWIllustration13, SWPortrait13, SWCatalogArt13, SW15CoastalShipFrames, SW13ShipArt, SWDrawUnit13 };
