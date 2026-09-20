// Authored chapter geometry. Saved battles retain their own defense snapshot.
const forts = [
  {outline:[[0,0],[8,0],[8,8],[0,8]],gates:[[4,0],[0,5],[6,8]],keep:[4,3],towers:[[2,2],[6,5]],hint:'The western gate leads past the quarry. The eastern tower covers the longer approach.'},
  {outline:[[1,0],[8,0],[8,7],[0,7],[0,2],[1,2]],gates:[[5,0],[0,4],[5,7]],keep:[5,3],towers:[[2,3],[6,5]],hint:'The keep sits behind the eastern battery. The western supply court offers another way in.'},
  {outline:[[0,0],[8,0],[8,8],[2,8],[2,6],[0,6]],gates:[[3,0],[0,3],[6,8]],keep:[5,5],towers:[[2,2],[6,2]],hint:'Two towers cover the northern gate. The recessed southern court gives siege troops a shorter route.'},
  {outline:[[0,0],[6,0],[6,2],[8,2],[8,8],[0,8]],gates:[[3,0],[0,5],[8,5]],keep:[3,5],towers:[[2,2],[6,6]],hint:'A narrow eastern entrance opens beside the workshops. Split the guards before committing your siege crews.'},
  {outline:[[0,0],[8,0],[8,6],[6,6],[6,8],[0,8]],gates:[[5,0],[0,3],[4,8]],keep:[4,3],towers:[[2,5],[6,2]],hint:'The southern bastion shields the keep. Ranged troops can support a breach through either side gate.'},
  {outline:[[0,1],[2,1],[2,0],[8,0],[8,8],[0,8]],gates:[[5,0],[0,5],[5,8]],keep:[5,5],towers:[[3,2],[6,6]],hint:'The northern supply yard is lightly screened. The main gate leads into overlapping defensive fire.'},
  {outline:[[0,0],[8,0],[8,3],[7,3],[7,8],[0,8]],gates:[[3,0],[0,4],[4,8]],keep:[3,3],towers:[[2,6],[6,2]],hint:'The keep is close to the western approach, but the southern battery can punish a crowded landing.'},
  {outline:[[0,0],[8,0],[8,8],[0,8],[0,5],[1,5],[1,2],[0,2]],gates:[[5,0],[8,4],[4,8]],keep:[5,3],towers:[[2,2],[6,6]],hint:'The recessed western wall protects the supply road. Use the eastern gate to draw defenders away from the keep.'},
  {outline:[[0,0],[7,0],[7,2],[8,2],[8,8],[0,8]],gates:[[3,0],[0,5],[5,8]],keep:[3,5],towers:[[2,2],[6,5]],hint:'Kingsfall has a deep southern keep. Open a breach before sending fragile ranged units through the gates.'},
  {outline:[[0,0],[8,0],[8,8],[1,8],[1,6],[0,6]],gates:[[4,0],[0,3],[5,8]],keep:[5,4],towers:[[2,2],[6,6]],hint:'The throne is covered from both flanks. Preserve your siege units and use the commander when the breach opens.'}
];
const seaHints = [
  'The cutter can cover a landing near the harbor. Troops stay safe aboard until you choose the beach.',
  'Protect the relief cutter while the landing force draws the shore defenders inland.',
  'The northern shore battery covers the harbor. Land farther south or silence it with your escort.',
  'A recessed shoreline offers two approaches. Move your transport before choosing the landing point.',
  'The shore battery reaches the northern beach. Draw its fire with an escort and land your siege force farther south.',
  'The flagship must fall as well as the keep. Keep your transport behind its escort until the channel opens.',
  'The relief ship must survive. Divide your fleet between protection and support for the landing force.',
  'The coastal towers cover different beaches. Break one battery to create a safe landing lane.',
  'Three enemy ships contest the coast. Focus your escort fire while the transports choose a separate landing.',
  'The fleet and the beacon stronghold both stand in your way. Preserve enough troops for the final inland push.'
];
/** @param {number} x @param {number} y */
const key = (x,y) => `${x},${y}`;
/** @param {number[]} point @param {number[][]} polygon */
function inside(point,polygon){
  let result=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
    const a=polygon[i],b=polygon[j];
    if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])result=!result;
  }
  return result;
}
/** @param {number} stage @param {string} name @param {number} level @param {{chapter?:number,sea?:boolean}} options */
export function SWCampaignFort17(stage,name,level,options={}){
  const chapter=Math.max(0,Math.min(9,Math.floor(options.chapter??stage))),sea=!!options.sea;
  const plan=forts[sea?(chapter+3)%forts.length:chapter];
  /** @type {{id:string,kind:string,x:number,y:number,level:number,axis:string}[]} */
  const buildings=[];const occupied=new Set();
  /** @param {string} kind @param {number} x @param {number} y @param {string} axis */
  const put=(kind,x,y,axis='x')=>{const id=key(x,y);if(occupied.has(id))return false;occupied.add(id);buildings.push({id:`fort-${x}-${y}`,kind,x,y,level,axis});return true;};
  const gateKeys=new Set(plan.gates.map(([x,y])=>key(x,y)));
  for(let i=0;i<plan.outline.length;i++){
    const a=plan.outline[i],b=plan.outline[(i+1)%plan.outline.length],dx=Math.sign(b[0]-a[0]),dy=Math.sign(b[1]-a[1]),length=Math.abs(b[0]-a[0])+Math.abs(b[1]-a[1]);
    for(let s=0;s<length;s++){const x=a[0]+dx*s,y=a[1]+dy*s;put(gateKeys.has(key(x,y))?'gate':'wall',x,y,dx?'x':'y');}
  }
  /** @type {number[][]} */
  const candidates=[];for(let x=1;x<8;x++)for(let y=1;y<8;y++)if(inside([x,y],plan.outline)&&!occupied.has(key(x,y)))candidates.push([x,y]);
  /** @param {string} kind @param {number[]} preferred */
  const place=(kind,preferred)=>{
    const spots=candidates.filter(([x,y])=>!occupied.has(key(x,y))).toSorted((a,b)=>Math.hypot(a[0]-preferred[0],a[1]-preferred[1])-Math.hypot(b[0]-preferred[0],b[1]-preferred[1]));
    if(spots.length)put(kind,spots[0][0],spots[0][1]);
  };
  place('keep',sea?[6,chapter%2?3:5]:plan.keep);
  place('tower',sea?[2,2]:plan.towers[0]);place('tower',sea?[6,6]:plan.towers[1]);
  // Strongholds retain the same number and levels of defenders. Position, gates
  // and the approach change, instead of silently adding difficulty by statistics.
  /** @type {[string,number,number[]][]} */
  const extras=[['tower',1,[1,7]],['mortar',2,[6,7]],['bombtower',3,[7,1]],['flame',4,[4,6]],['bastion',6,[1,1]],['bastion',8,[7,7]]];
  for(const[kind,at,p]of extras)if(stage>=at)place(kind,sea&&kind==='bastion'?[1,p[1]]:p);
  /** @type {[string,number[]][]} */
  const economic=[['cottage',[2,5]],['market',[2,7]],['farm',[6,6]],['lumber',[6,4]],['barracks',[4,1]],['quarry',[1,3]]];
  for(const[kind,p]of economic){const shifted=chapter%2?[8-p[0],p[1]]:p;place(kind,shifted);}
  return {name,level,rating:100+stage*140,buildings,layoutVersion17:1,tacticalHint17:sea?seaHints[chapter]:plan.hint};
}
