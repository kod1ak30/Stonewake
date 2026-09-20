const fs=require('fs'),acorn=require('../backend/node_modules/acorn'),base=fs.readFileSync('client/build14/engine13.js','utf8'),opts={ecmaVersion:2022,sourceType:'module'},node=acorn.parse(base,opts).body.find(n=>n.type==='FunctionDeclaration'&&n.id.name==='Eu');let s=base.slice(node.start,node.end);
function replace(a,b){if(!s.includes(a))throw Error('Missing map anchor '+a.slice(0,90));s=s.replace(a,b)}
replace('ornamentGhost = null,','ornamentGhost = null, battleInput14=null,navalTool14=null,onNavalMap14,layoutOverlay14=null,');
replace('label: String(t.label || `Complete!`),','label: String(t.label ?? `Complete!`),');
replace('const navalPresent=!!navalSupport',"const navalPresent=battleInput14?.campaignType==='sea'||!!navalSupport");
replace("if(_&&navalPresent)for(const tile of[{x:-5,y:0},{x:-5,y:3},{x:-3,y:3}])", "if(_&&navalPresent)for(const tile of(battleInput14?.campaignType==='sea'?[{x:-12,y:-2},{x:-12,y:11},{x:-2.4,y:11}]:[{x:-5,y:0},{x:-5,y:3},{x:-3,y:3}]))");
replace('ee = (e, t, n, r, i, a, s = !1, c, l = !1, u, d = 1, swAttackPhase = 0) => {',`ee = (e, t, n, r, i, a, s = !1, c, l = !1, u, d = 1, swAttackPhase = 0) => {
        if(a&&u&&J[u]){const point=vu(e.x,e.y);SWDrawTroopRig14(o,{kind:u,level:d,x:point.x+(e.swHit?.x||0),y:point.y,scale:['ram','trebuchet','cannon'].includes(u)?1.25:1,heading:e.heading??(i?2.3:-.8),phase:ve.current?0:s?swAttackPhase:n,state:s?'attack':r?'walk':'idle',enemy:l});if(c!==undefined&&c<.85){o.fillStyle='#102936';o.fillRect(point.x-10,point.y-55,20,3);o.fillStyle=l?'#dc7368':'#7dcfc3';o.fillRect(point.x-10,point.y-55,20*Math.max(0,c),3)}return;}`);
replace('const hit=(a.events||[]).find',"r.heading=o?Math.atan2(o.ty-t.y,o.tx-t.x):i?Math.atan2(n.y-t.y,n.x-t.x):previous?.heading??-.8;\n            const hit=(a.events||[]).find");
replace('const navalUnits=a?.units.filter(unit=>unit.naval)||[];',"if(battleInput14?.campaignType==='sea')SWDrawSea14(o,j,battleInput14.defense);\n        const navalUnits=a?.units.filter(unit=>unit.naval)||[];");
replace('if(navalSupport&&!navalUnits.length',"if(navalSupport&&battleInput14?.campaignType!=='sea'&&!navalUnits.length");
// Register a live target surface; the pointer controller uses current camera and reserve state.
replace('return (0, F.jsxs)(`div`, {\n    ref: re,',`SWInstallPointers14();
  const bridge14=C.useRef(null);bridge14.current={
    active:()=>swDeploymentState.current.active,
    target:(x,y)=>{const rect=O.current?.getBoundingClientRect();if(!rect||x<rect.left||x>rect.right||y<rect.top||y>rect.bottom||document.elementFromPoint(x,y)!==O.current)return null;return SWDeploymentTarget14(battleInput14,Ue,We(x,y),Pe)},
    fire:(target,kind)=>{const accepted=swDeploy.current?.(target.x,target.y,{silent:true,kind});if(accepted)swOrderAck.current={...target,born:performance.now()};return accepted},
    preview:target=>{swPreview.current=target;}
  };
  C.useEffect(()=>{if(T){SWGestureBridge14.surface=bridge14.current;return()=>{if(SWGestureBridge14.surface===bridge14.current)SWGestureBridge14.surface=null}}},[T]);
  if(T)SWGestureBridge14.surface=bridge14.current;
  return (0, F.jsxs)(\`div\`, {
    ref: re,`);
replace('ge.current.set(event.pointerId,{x:event.clientX,y:event.clientY});',`ge.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
          if(SWGestureBridge14.points.size>=2)for(const[id,point]of SWGestureBridge14.points)ge.current.set(id,point);`);
replace('const world=We(event.clientX,event.clientY),tile=yu(world.x,world.y),target=T?SWDeploymentTarget(Ue,world,Pe):null;',`if(navalTool14){const world=We(event.clientX,event.clientY),tile=yu(world.x,world.y);if(navalTool14.type==='focus'){const target=p?.units.filter(u=>u.side==='defend'&&u.hp>0).sort((a,b)=>Math.hypot(a.x-tile.x,a.y-tile.y)-Math.hypot(b.x-tile.x,b.y-tile.y))[0];if(target)onNavalMap14?.(tile.x,tile.y,target.id)}else onNavalMap14?.(Math.max(-12,Math.min(-2.4,tile.x)),Math.max(-2,Math.min(11,tile.y)));swGesture.current.mode='cancelled';return;}
          if(T&&SWBeginPointer14(event,selectedTroop,'map')){swGesture.current.mode='shared-deploy';me.current=null;return;}
          const world=We(event.clientX,event.clientY),tile=yu(world.x,world.y),target=null;`);
replace('if(swGesture.current.multi){\n            if(ge.current.size<2',"if(swGesture.current.mode==='shared-deploy')return;\n          if(swGesture.current.multi){\n            if(ge.current.size<2");
// Old deployment branches are unreachable for new sessions, but remove release-time trail dumping entirely.
const trailStart=s.indexOf('const path=gesture.path.filter('),trailEnd=s.indexOf('}else if(!gesture.held)',trailStart);if(trailStart>=0)s=s.slice(0,trailStart)+"// Placements commit under the finger; release adds no trail.\n              "+s.slice(trailEnd);
replace('if(me.current.moved)se({x:',`if(S&&w&&me.current.moved){const world=We(event.clientX,event.clientY),tile=yu(world.x,world.y),key=Math.round(tile.x)+','+Math.round(tile.y);if(swGesture.current.paint14!==key){swGesture.current.paint14=key;w(Math.round(tile.x),Math.round(tile.y))}return;}
            if(me.current.moved)se({x:`);
// Draw only the selected layout overlay; never leave a green deployment grid over a battle.
replace('const navalUnits=a?.units.filter(unit=>unit.naval)||[];',`if(layoutOverlay14)SWDrawLayoutOverlay14(o,{buildings:e,provinces:t,terrain:b},layoutOverlay14);
        const navalUnits=a?.units.filter(unit=>unit.naval)||[];`);
acorn.parse(s,opts);fs.writeFileSync('client/build14/Eu.js',s);console.log('Map integrations prepared');
