// @ts-nocheck
// Recovered as an ES module for build 15. Preserve saved-state and replay semantics.
import { SWMissionScout, SWCanPlaceOrnament, Ac, Bc, Cc, El, J, Jc, Ml, Nl, Oc, Pc, SWBuildingCount, SWBuildingLimit, SWCanReceive, SWChapter, SWCity, SWCityRecipes, SWCityRequest, SWCivicLevel, SWCoast, SWPremium, SWPremiumCatalog, SWSagaInput, SWTradeQuote, SWTroopAbilities, SWWalkable, Sl, Uc, Vc, X, Z, el, fl, hl, jc, pl, tl, wc, wl, xl, zc, zl } from "../core/rules.js";
import { A, Ae, As, C, Ce, D, De, Ee, F, Fs, Is, M, N, Ns, O, P, Te, Vs, be, ce, k, ne, oe, re, se, te, we } from "../vendor/runtime.js";
import { SWLandTools, swElement } from "../../client/interface.js";
import { SWDialog, SWFleet } from "../../client/build14/ui.js";
import { SW13BuildingCells, SW13ShipArt, SW13SpriteRects, SW13UtilityKinds, SWDrawUnit13, SWPortrait13 } from "../../client/visual13.js";
import { SWBuildingPortrait13, SWDrawNavalUnit, SWDrawPaintedWorker, SWDrawSculptedBuilding13, SWRigDraw, SWShipPortrait13, lu } from "../../client/build14/render.js";
import {nativeSaveStatus} from "../runtime/native-save-status.js";
import {SWKeepSize17, SWEconomySize17, SWPaintWall17, SWDrawRoads17} from "../../client/build17/world.js";
var Dc = [
    `Timber`,
    `Stonefoot`,
    `Reinforced`,
    `Fortified`,
    `High walls`,
    `Grand`,
    `Citadel`,
    `Royal`,
    `Gilded`,
    `Imperial`,
  ];
function Fc(e) {
  return e >= 300 ? `Crown` : e >= 150 ? `Gold` : e >= 75 ? `Silver` : `Bronze`;
}
function Hc(e, t) {
  let n = Ac.find((e) => e.id === t);
  return n
    ? e.provinces?.some((e) => e.id === t)
      ? `Already part of your kingdom`
      : e.campaign < n.campaign
        ? `Capture ${n.campaign} campaign ${n.campaign === 1 ? `stronghold` : `strongholds`} first`
        : n.requires.length &&
            !n.requires.some((t) => e.provinces?.some((e) => e.id === t))
          ? `Capture ${n.requires.join(` or `)} first`
          : null
    : `Unknown province`;
}
function Yc(e, t) {
  return {
    gold: e.gold * t,
    wood: e.wood * t,
    stone: e.stone * t,
    food: e.food * t,
  };
}
function Xc(e, t) {
  let n = [e],
    r = e.x,
    i = e.y;
  for (
    ;
    (r !== t.x || i !== t.y) &&
    (r === t.x ? (i += Math.sign(t.y - i)) : (r += Math.sign(t.x - r)),
    n.push({ x: r, y: i }),
    !(n.length > 24));

  );
  return n;
}
function Qc(e) {
  return e < 60
    ? `${Math.ceil(e)}s`
    : e < 3600
      ? `${Math.ceil(e / 60)}m`
      : `${(e / 3600).toFixed(1)}h`;
}
function SWNavalEligible(scout) {
  return !!scout && !!scout.defense;
}
function SWTroopAbility(kind,level) {
  return SWTroopAbilities(kind).filter(a=>a.level<=Math.min(10,level)).at(-1)||null;
}
var Cl = [
    `Frontier settlement`,
    `Fortified kingdom`,
    `Regional power`,
    `Marchland`,
    `Duchy`,
    `High kingdom`,
    `Royal domain`,
    `Grand realm`,
    `Imperial seat`,
    `Crown empire`,
  ];
function kl(e, t) {
  return t === `army`
    ? { value: Math.min(6, Nl(e.army)), target: 6 }
    : t === `frontier`
      ? { value: e.campaign, target: 5 }
      : t === `age2`
        ? { value: Math.min(2, Ml(e)), target: 2 }
        : { value: +!!El.find((e) => e.id === t)?.check(e), target: 1 };
}
const SWTradeRates = Object.freeze({wood:2,stone:3,gold:2});
function SWMarketTrade({state,act,busy}) {
  const [resource,setResource]=C.useState('wood'),[payWith,setPayWith]=C.useState('food'),[amount,setAmount]=C.useState(100);
  const quote=SWTradeQuote(state,resource,amount,payWith);
  return swElement('details',{className:'sw-disclosure sw-market'},
    swElement('summary',null,'Trade surplus supplies'),
    swElement('p',{className:'sw-muted'},'Exchange surplus at a loss, never for free. Upgrade producers and stores for lasting growth.'),
    swElement('div',{className:'sw-market-fields'},
      swElement('label',null,'Give',swElement('select',{'aria-label':'Pay with',value:payWith,onChange:e=>{const next=e.target.value;setPayWith(next);if(next===resource)setResource(payWith);}},xl.map(k=>swElement('option',{key:k,value:k},Wu[k])))),
      swElement('label',null,'Receive',swElement('select',{'aria-label':'Trade resource',value:resource,onChange:e=>setResource(e.target.value)},
        xl.filter(k=>k!==payWith).map(k=>swElement('option',{key:k,value:k},Wu[k])))),
      swElement('label',null,'Amount',swElement('select',{'aria-label':'Trade amount',value:amount,onChange:e=>setAmount(Number(e.target.value))},
        [50,100,250].map(n=>swElement('option',{key:n,value:n},n))))),
    swElement('button',{className:'secondary wide',disabled:busy||!!quote.reason,onClick:()=>act({type:'marketTrade',resource,amount,payWith},'Trade complete')},
      quote.reason||'Trade '+quote.payment+' '+Wu[payWith].toLowerCase()+' for '+amount+' '+Wu[resource].toLowerCase()));
}
const SWCivicKinds=['well','storehouse','workshop','tavern'];
function SWCityDialog({open,onClose,state,act,busy,onBuild,onDefense}){
 const [tab,setTab]=C.useState('Residents'),city=SWCity(state),now=Date.now();
 const button=(label,click,disabled=false,cls='secondary')=>swElement('button',{className:cls,onClick:click,disabled:busy||disabled},label);
 const cost=(value)=>swElement(cu,{cost:value});
 const card=(title,body,children)=>swElement('section',{className:'sw-city-card',key:title},swElement('h3',null,title),swElement('p',{className:'sw-muted'},body),children);
 const tabs=['Residents','Infrastructure','Defense'];
 return swElement(SWDialog,{open,onClose,title:'Your city',subtitle:'A living home for your people',className:'sw-city-dialog'},
  swElement('nav',{className:'sw-tabs','aria-label':'City sections'},tabs.map(t=>button(t,()=>setTab(t),false,tab===t?'selected':''))),
  tab==='Residents'&&swElement('div',{className:'sw-city-stack'},
   swElement('div',{className:'sw-city-summary'},city.jobs+' requests fulfilled · '+city.crafted+' goods crafted',swElement('small',null,'Every fifth resident request also earns 3 gems.')),
   [0,1,2].map(slot=>{const task=SWCityRequest(state,slot),wait=Math.max(0,task.readyAt-now);return card(task.name,task.text,[cost(task.cost),swElement('div',{className:'sw-city-reward',key:'reward'},'Earn ',swElement(zu,{reward:task.reward})),button(wait?'New request in '+Qc(wait/1000):!SWCanReceive(state,task.reward,task.cost)?'Make room in storage':'Deliver supplies',()=>act({type:'cityRequest',slot,id:task.id},'Residents supplied'),wait>0||!Z(state,task.cost)||!SWCanReceive(state,task.reward,task.cost),'primary')]);}),
   SWCivicLevel(state,'workshop')?card('Artisan orders','Turn surplus materials into useful goods.',city.craft?[swElement('strong',{key:'current'},SWCityRecipes[city.craft.kind].name),button(city.craft.readyAt>now?'Ready in '+Qc((city.craft.readyAt-now)/1000):'Collect crafted goods',()=>act({type:'collectCraft'},'Crafting complete'),city.craft.readyAt>now,'primary')]:Object.entries(SWCityRecipes).map(([id,r])=>swElement('div',{className:'sw-city-recipe',key:id},swElement('strong',null,r.name),cost(r.cost),swElement(zu,{reward:r.reward}),button('Craft · '+Qc(Math.max(20,r.duration-SWCivicLevel(state,'workshop')*3)),()=>act({type:'startCraft',kind:id},'Artisans are at work'),!Z(state,r.cost))))):card('Open an artisan workshop','Craft stone and trade goods while your army is at home.',button('Build workshop',()=>onBuild('workshop'),Ml(state)<2)),
   card('Town festival',city.festivalUntil>now?'The festival is active. All resource income is 15% higher.':'Share a meal and music in the square. +15% resource income for 10 minutes.',[cost({gold:60,wood:0,stone:0,food:180}),button(!SWCivicLevel(state,'tavern')?'Build a tavern':city.festivalReadyAt>now?'Next festival in '+Qc((city.festivalReadyAt-now)/1000):'Host a festival',()=>SWCivicLevel(state,'tavern')?act({type:'festival'},'The festival has begun'):onBuild('tavern'),!!SWCivicLevel(state,'tavern')&&((city.festivalReadyAt||0)>now||!Z(state,{gold:60,wood:0,stone:0,food:180})))])
  ),
  tab==='Infrastructure'&&swElement('div',{className:'sw-city-stack'},SWCivicKinds.map(kind=>card(Sl[kind].name,Sl[kind].description,[swElement('strong',{key:'benefit'},Sl[kind].benefit),cost(X(kind)),button(SWBuildingCount(state,kind)>=SWBuildingLimit(state,kind)?'Building limit reached':'Build '+Sl[kind].name.toLowerCase(),()=>onBuild(kind),Ml(state)<Sl[kind].unlock||SWBuildingCount(state,kind)>=SWBuildingLimit(state,kind))]))),
  tab==='Defense'&&swElement('div',{className:'sw-city-stack'},
   card('Coastal raiders · wave '+Math.min(10,1+city.raidWins),'Computer enemies attack your actual streets, walls, towers and keep. A stronger layout protects the town and earns a larger bounty.',[
    swElement('div',{className:'sw-city-summary',key:'stats'},city.raidWins+' raids repelled · '+state.buildings.filter(b=>zc(b)&&b.level).length+' wall segments · '+state.buildings.filter(b=>Cc.includes(b.kind)&&b.level).length+' defenses'),
    swElement('p',{className:'sw-muted',key:'risk'},'Protect your stores: 20% of storage capacity is secured. Raiders can steal up to 18% of exposed gold, timber, stone and food, depending on destruction. Holding the Keep earns a bounty and 2 gems. Buildings recover and your home army stays intact. Start a raid when ready.'),
    button((city.raidReadyAt||0)>now?'Scouts return in '+Qc((city.raidReadyAt-now)/1000):'Defend my city',onDefense,!!state.activeBattle||(city.raidReadyAt||0)>now,'primary'),
    button('Build defenses',()=>onBuild('tower'))
   ]),
   card('Beyond the medieval kingdom','Playable upgrades currently stop at level 10.',swElement('p',{className:'sw-muted'},'Planned ages: 10–20 gunpowder, 20–30 industrial and early 1900s, 30–40 modern, 40–50 future. These later ages are not built yet.'))
  )
 );
}
function Rl(e) {
  return El.find((t) => !e.quests.includes(t.id));
}


var Yl = {
    arsenal: [
      [101, 7, 205, 363],
      [490, 97, 211, 260],
      [802, 69, 202, 296],
      [1206, 91, 201, 281],
      [79, 403, 205, 285],
      [465, 413, 205, 273],
      [760, 394, 243, 303],
      [1122, 405, 326, 284],
      [57, 712, 247, 331],
      [430, 692, 250, 355],
      [764, 731, 281, 306],
      [1117, 685, 324, 372],
    ],
    naval: [
      [77, 120, 284, 328],
      [491, 57, 320, 396],
      [914, 57, 384, 401],
      [1386, 57, 366, 400],
      [40, 477, 374, 369],
      [497, 535, 335, 298],
      [904, 546, 403, 309],
      [1350, 520, 408, 330],
    ],
    evolution: [
      [29, 97, 358, 262],
      [410, 68, 364, 285],
      [793, 78, 362, 283],
      [1160, 53, 366, 311],
      [1574, 14, 377, 352],
      [24, 408, 355, 354],
      [403, 378, 354, 388],
      [783, 380, 377, 387],
      [1180, 376, 352, 402],
      [1568, 384, 393, 395],
    ],
  };
var Xl = { arsenal: [1448, 1086], naval: [1774, 887], evolution: [1983, 793] };
var Zl = {
    spearman: 0,
    crossbow: 1,
    shieldbearer: 2,
    scout: 3,
    healer: 4,
    grenadier: 5,
    knight: 6,
    ram: 7,
  };
var Ql = {
    fortifications: [
      [34, 70, 356, 359],
      [415, 78, 333, 362],
      [795, 77, 318, 363],
      [1164, 87, 340, 353],
      [50, 559, 325, 363],
      [437, 556, 313, 384],
      [856, 433, 221, 510],
      [1159, 521, 359, 428],
    ],
    upgrades: [
      [30, 11, 247, 231],
      [322, 27, 274, 214],
      [640, 19, 257, 211],
      [937, 14, 257, 223],
      [1239, 14, 277, 227],
      [21, 263, 269, 212],
      [383, 239, 150, 248],
      [620, 267, 280, 208],
      [961, 262, 207, 219],
      [1235, 263, 285, 212],
      [24, 487, 264, 252],
      [322, 492, 278, 230],
      [625, 497, 267, 233],
      [922, 486, 283, 239],
      [1235, 486, 285, 252],
      [17, 750, 275, 234],
      [382, 722, 160, 273],
      [614, 749, 293, 235],
      [945, 746, 251, 251],
      [1235, 738, 290, 260],
    ],
    commanders: [
      [94, 10, 353, 487],
      [619, 5, 265, 495],
      [1127, 9, 304, 488],
      [96, 516, 365, 482],
      [624, 510, 337, 493],
      [1097, 504, 366, 495],
    ],
  };
function $l(e) {
  if(e.kind===`well`)return {sheet:`well`,rect:[205,45,850,1140]};
  const civicKind={well:`monument`,storehouse:`barracks`,workshop:`forge`,tavern:`cottage`}[e.kind];
  if(civicKind)return $l({...e,kind:civicKind});
  let t,
    n,
    r = [
      `keep`,
      `farm`,
      `lumber`,
      `quarry`,
      `barracks`,
      `forge`,
      `tower`,
      `harbor`,
      `cottage`,
      `market`,
    ];
  if ([`mortar`, `bombtower`, `flame`, `bastion`].includes(e.kind))
    ((t = `arsenal`),
      (n =
        Yl.arsenal[
          8 + [`mortar`, `bombtower`, `flame`, `bastion`].indexOf(e.kind)
        ]));
  else if (
    e.kind === `builder` ||
    e.kind === `wall` ||
    e.kind === `gate` ||
    e.kind === `monument` ||
    e.specialty
  ) {
    t = `fortifications`;
    let r =
      e.kind === `builder`
        ? 0
        : e.kind === `wall`
          ? e.axis === `y`
            ? 2
            : 1
          : e.kind === `gate`
            ? e.axis === `y`
              ? 3
              : 4
            : e.specialty === `ballista`
              ? 5
              : e.specialty === `volley`
                ? 6
                : 7;
    n = Ql.fortifications[r];
  } else if (e.level >= 2)
    ((t = `upgrades`),
      (n = Ql.upgrades[r.indexOf(e.kind) + (e.level >= 3 ? 10 : 0)]));
  else if (e.kind === `cottage` || e.kind === `market`)
    ((t = `civic`), (n = [e.kind === `market` ? 887 : 0, 0, 887, 887]));
  else {
    t = `atlas`;
    let i = r.indexOf(e.kind);
    n = [(i % 4) * 384, Math.floor(i / 4) * 512, 384, 512];
  }
  return { sheet: t, rect: n };
}
function eu({ sheet: e, rect: t, className: n = ``, label: r }) {
  let i = e === `atlas` ? `buildings` : e === `civic` ? `civic-buildings` : e;
  return (0, F.jsx)(`svg`, {
    className: n,
    viewBox: t.join(` `),
    role: r ? `img` : void 0,
    "aria-label": r,
    "aria-hidden": !r,
    preserveAspectRatio: `xMidYMid meet`,
    children: (0, F.jsx)(`svg`, {
      x: t[0],
      y: t[1],
      width: t[2],
      height: t[3],
      viewBox: t.join(` `),
      overflow: `hidden`,
      children: (0, F.jsx)(`image`, {
        href: `/art/${i}.webp`,
        width: Xl[e]?.[0] || (e === `civic` ? 1774 : 1536),
        height: Xl[e]?.[1] || (e === `civic` ? 887 : 1024),
      }),
    }),
  });
}
function tu({ building: e, className: t = `` }) {
  return (0, F.jsx)(SWBuildingPortrait,{building:e,className:t});
}
function nu({id,action=false,className=''}) {return swElement(SWPortrait13,{id,className});}
function ru({ cost: e }) {
  return (0, F.jsx)(`span`, {
    className: `expansion-cost`,
    children: Object.entries(e)
      .filter(([, e]) => e > 0)
      .map(([e, t]) => (0, F.jsxs)(`span`, { children: [t, ` `, e] }, e)),
  });
}
function au({ state: e, act: t, busy: n, onScout: r }) {
  return (0, F.jsxs)(`div`, {
    className: `province-surface`,
    children: [
      (0, F.jsxs)(`div`, {
        className: `province-intro`,
        children: [
          (0, F.jsxs)(`div`, {
            children: [
              (0, F.jsx)(`span`, {
                className: `eyebrow`,
                children: `Expand your borders`,
              }),
              (0, F.jsx)(`h2`, { children: `A kingdom beyond the walls` }),
              (0, F.jsx)(`p`, {
                children: `Every province adds buildable land to your capital and permanent income. Capture one, then develop its outpost.`,
              }),
            ],
          }),
          (0, F.jsxs)(`span`, {
            className: `province-total`,
            children: [
              (0, F.jsx)(se, {}),
              e.provinces?.length || 0,
              (0, F.jsx)(`small`, { children: `of 5 provinces` }),
            ],
          }),
        ],
      }),
      (0, F.jsx)(`div`, {
        className: `province-grid`,
        children: Ac.map((i, a) => {
          let o = e.provinces?.find((e) => e.id === i.id),
            s = Hc(e, i.id);
          return (0, F.jsxs)(
            `section`,
            {
              className: `province-card province-${i.id} ${o ? `owned` : ``} ${!o && s ? `locked` : ``}`,
              children: [
                (0, F.jsxs)(`div`, {
                  className: `province-landscape`,
                  children: [
                    (0, F.jsxs)(`span`, {
                      className: `province-number`,
                      children: [`0`, a + 1],
                    }),
                    (0, F.jsx)(tu, {
                      building: {
                        kind: o
                          ? `monument`
                          : i.id === `highmarch`
                            ? `keep`
                            : i.resource === `food`
                              ? `farm`
                              : i.resource === `wood`
                                ? `lumber`
                                : i.resource === `stone`
                                  ? `quarry`
                                  : `harbor`,
                        level: o?.level || i.level,
                      },
                    }),
                    o &&
                      (0, F.jsxs)(`span`, {
                        className: `province-owned`,
                        children: [
                          (0, F.jsx)(O, { size: 13 }),
                          `Your territory`,
                        ],
                      }),
                  ],
                }),
                (0, F.jsxs)(`div`, {
                  className: `province-copy`,
                  children: [
                    (0, F.jsx)(`span`, {
                      className: `eyebrow`,
                      children: i.terrain,
                    }),
                    (0, F.jsx)(`h3`, { children: i.name }),
                    (0, F.jsx)(`p`, { children: i.description }),
                    (0, F.jsxs)(`div`, {
                      className: `province-benefits`,
                      children: [
                        (0, F.jsxs)(`strong`, {
                          children: [
                            `+`,
                            i.income * (o?.level || 1),
                            ` `,
                            i.resource,
                            ` / min`,
                          ],
                        }),
                        (0, F.jsxs)(`span`, {
                          children: [i.tiles.filter(p=>!Bc(p.x,p.y)).length, ` extra building plots`],
                        }),
                        o &&
                          (0, F.jsxs)(`span`, {
                            children: [`Outpost level `, o.level, ` / 10`],
                          }),
                      ],
                    }),
                    o
                      ? (0, F.jsx)(`button`, {
                          className: `primary wide`,
                          disabled:
                            n ||
                            o.level >= 10 ||
                            o.level >= Ml(e) ||
                            !Z(e, Uc(o.level)),
                          onClick: () =>
                            void t(
                              { type: `developProvince`, id: i.id },
                              `${i.name} outpost expanded`,
                            ),
                          children:
                            o.level >= 10 || o.level >= Ml(e)
                              ? o.level >= 10
                                ? `Province fully developed`
                                : `Upgrade keep first`
                              : (0, F.jsxs)(F.Fragment, {
                                  children: [
                                    `Develop outpost `,
                                    (0, F.jsx)(te, { size: 16 }),
                                  ],
                                }),
                        })
                      : (0, F.jsx)(`button`, {
                          className: `primary wide`,
                          "aria-label": `Scout ${i.name}`,
                          disabled: !!s,
                          onClick: () => r(i.id, Jc(i.id)),
                          children: s
                            ? (0, F.jsxs)(F.Fragment, {
                                children: [
                                  (0, F.jsx)(P, { size: 14 }),
                                  `Route locked`,
                                ],
                              })
                            : (0, F.jsxs)(F.Fragment, {
                                children: [
                                  `Scout province `,
                                  (0, F.jsx)(we, { size: 16 }),
                                ],
                              }),
                        }),
                    o && o.level < 10
                      ? (0, F.jsx)(ru, { cost: Uc(o.level) })
                      : !o && s
                        ? (0, F.jsx)(`small`, {
                            className: `province-requirement`,
                            children: s,
                          })
                        : o
                          ? null
                          : (0, F.jsx)(`small`, {
                              className: `province-requirement`,
                              children: `Win the battle to raise your banner.`,
                            }),
                  ],
                }),
              ],
            },
            i.id,
          );
        }),
      }),
    ],
  });
}
function ou({ state: e, act: t, busy: n, cloud: r, onRivals: i }) {
  let [a, o] = (0, C.useState)(null),
    [s, c] = (0, C.useState)(``);
  (0, C.useEffect)(() => {
    let e = !0;
    return (
      r &&
        window.SWOnline.request('/v1/league')
          .then(n => { const rows=(n.players||[]).map((player,index)=>({...player,rank:index+1}));e&&o({...n,rows,self:rows.find(player=>player.id===window.SWOnline.state().accountId)}); })
          .catch((t) => {
            e && c(t.message);
          }),
      () => {
        e = !1;
      }
    );
  }, [r, e.revision, e.season?.id]);
  let l = a?.season || Pc(),
    u = e.season?.points || 0,
    d = Math.max(1, Math.ceil((l.end - Date.now()) / 864e5));
  return (0, F.jsxs)(`div`, {
    className: `league-surface`,
    children: [
      (0, F.jsxs)(`div`, {
        className: `league-banner`,
        children: [
          (0, F.jsx)(`div`, {
            className: `league-seal`,
            children: (0, F.jsx)(Ee, { size: 42 }),
          }),
          (0, F.jsxs)(`div`, {
            children: [
              (0, F.jsxs)(`span`, {
                className: `eyebrow`,
                children: [`Weekly league · season `, l.number],
              }),
              (0, F.jsxs)(`h2`, { children: [Fc(u), ` league`] }),
              (0, F.jsx)(`p`, {
                children: `Win player battles, climb the table, and bring your colors home.`,
              }),
            ],
          }),
          (0, F.jsxs)(`div`, {
            className: `league-score`,
            children: [
              (0, F.jsx)(`strong`, { children: u }),
              (0, F.jsx)(`span`, { children: `league points` }),
              (0, F.jsxs)(`small`, {
                children: [
                  (0, F.jsx)(k, { size: 13 }),
                  d,
                  ` `,
                  d === 1 ? `day` : `days`,
                  ` remaining`,
                ],
              }),
            ],
          }),
        ],
      }),
      (0, F.jsxs)(`div`, {
        className: `league-columns`,
        children: [
          (0, F.jsxs)(`section`, {
            className: `league-rewards`,
            children: [
              (0, F.jsx)(`h3`, { children: `Your season rewards` }),
              (0, F.jsx)(`p`, {
                children: `Cosmetics stay with your kingdom when the weekly score resets.`,
              }),
              jc.map((r) => {
                let i = e.cosmetics?.includes(r.id);
                return (0, F.jsxs)(
                  `div`,
                  {
                    className: `league-reward reward-${r.id}`,
                    children: [
                      (0, F.jsx)(`span`, {
                        className: `cosmetic-preview`,
                        children:
                          r.id === `monument`
                            ? (0, F.jsx)(oe, {})
                            : (0, F.jsx)(se, {}),
                      }),
                      (0, F.jsxs)(`div`, {
                        children: [
                          (0, F.jsx)(`strong`, { children: r.name }),
                          (0, F.jsx)(`p`, { children: r.description }),
                          (0, F.jsx)(Vs, {
                            value: Math.min(100, (u / r.points) * 100),
                          }),
                          (0, F.jsxs)(`small`, {
                            children: [
                              Math.min(u, r.points),
                              ` / `,
                              r.points,
                              ` points`,
                            ],
                          }),
                        ],
                      }),
                      (0, F.jsx)(`button`, {
                        "aria-label": `${i ? `Equip` : `Claim`} ${r.name}`,
                        className: i
                          ? `secondary`
                          : u >= r.points
                            ? `primary`
                            : `secondary`,
                        disabled:
                          n ||
                          (!i && u < r.points) ||
                          (i && (r.id === `monument` || e.livery === r.id)),
                        onClick: () =>
                          void t(
                            { type: i ? `livery` : `claimCosmetic`, id: r.id },
                            i
                              ? `Kingdom livery changed`
                              : `League reward unlocked`,
                          ),
                        children: i
                          ? r.id === `monument`
                            ? `Unlocked`
                            : e.livery === r.id
                              ? `Equipped`
                              : `Equip`
                          : u >= r.points
                            ? `Claim`
                            : (0, F.jsx)(P, { size: 16 }),
                      }),
                    ],
                  },
                  r.id,
                );
              }),
              e.livery &&
                e.livery !== `default` &&
                (0, F.jsx)(`button`, {
                  className: `text-button`,
                  onClick: () =>
                    void t(
                      { type: `livery`, id: `default` },
                      `Original colors restored`,
                    ),
                  children: `Use original kingdom colors`,
                }),
            ],
          }),
          (0, F.jsxs)(`section`, {
            className: `league-table`,
            children: [
              (0, F.jsxs)(`div`, {
                className: `league-table-heading`,
                children: [
                  (0, F.jsx)(`h3`, { children: `The standings` }),
                  a?.self?.rank
                    ? (0, F.jsxs)(`span`, {
                        children: [`Your rank #`, a.self.rank],
                      })
                    : null,
                ],
              }),
              s
                ? (0, F.jsx)(`p`, { className: `inline-note`, children: s })
                : a?.rows.length
                  ? (0, F.jsx)(`ol`, {
                      children: a.rows.map((e) =>
                        (0, F.jsxs)(
                          `li`,
                          {
                            children: [
                              (0, F.jsx)(`span`, {
                                className: `standing-rank`,
                                children: e.rank,
                              }),
                              (0, F.jsxs)(`div`, {
                                children: [
                                  (0, F.jsx)(`strong`, { children: e.name }),
                                  (0, F.jsxs)(`small`, {
                                    children: [e.wins, ` victories`],
                                  }),
                                ],
                              }),
                              (0, F.jsxs)(`b`, {
                                children: [
                                  e.points,
                                  (0, F.jsx)(`small`, { children: `pts` }),
                                ],
                              }),
                            ],
                          },
                          e.id,
                        ),
                      ),
                    })
                  : (0, F.jsxs)(`div`, {
                      className: `empty-state compact`,
                      children: [
                        (0, F.jsx)(se, { size: 30 }),
                        (0, F.jsx)(`h3`, {
                          children: `The first banner is waiting`,
                        }),
                        (0, F.jsx)(`p`, {
                          children: r
                            ? `Standings fill as real players complete battles this week.`
                            : `Sign in to compete in the weekly league.`,
                        }),
                      ],
                    }),
              (0, F.jsxs)(`button`, {
                className: `primary wide`,
                onClick: i,
                children: [`Find a rival `, (0, F.jsx)(re, { size: 16 })],
              }),
              (0, F.jsx)(`p`, {
                className: `league-rules`,
                children: `Win player battles to earn weekly points. Each season resets the standings.`,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function su({ building: e, state: t, act: n, busy: r }) {
  return e.kind === `tower`
    ? (0, F.jsxs)(`div`, {
        className: `tower-branches`,
        children: [
          (0, F.jsx)(`h3`, {
            children:
              e.level < 2
                ? `Upgrade to level 2 to specialize`
                : `Choose your defense`,
          }),
          (0, F.jsx)(`div`, {
            children: [`ballista`, `volley`].map((i) =>
              (0, F.jsxs)(
                `button`,
                {
                  className: e.specialty === i ? `selected` : ``,
                  disabled:
                    r ||
                    !!e.readyAt ||
                    e.level < 2 ||
                    e.specialty === i ||
                    !Z(t, { gold: 120, wood: 0, stone: 100, food: 0 }),
                  onClick: () =>
                    void n(
                      { type: `specialize`, id: e.id, specialty: i },
                      `Tower specialization complete`,
                    ),
                  children: [
                    (0, F.jsx)(tu, { building: { ...e, specialty: i } }),
                    (0, F.jsx)(`strong`, {
                      children: i === `ballista` ? `Ballista` : `Rapid-fire`,
                    }),
                    (0, F.jsx)(`small`, {
                      children:
                        i === `ballista`
                          ? `Long range · heavy hits`
                          : `Short range · fast volleys`,
                    }),
                    e.specialty === i
                      ? (0, F.jsxs)(`span`, {
                          children: [(0, F.jsx)(O, { size: 12 }), `Selected`],
                        })
                      : (0, F.jsx)(`span`, {
                          children: `120 gold · 100 stone`,
                        }),
                  ],
                },
                i,
              ),
            ),
          }),
        ],
      })
    : null;
}
function cu({ cost: e }) {
  return (0, F.jsx)(`span`, {
    className: `expansion-cost`,
    children: xl
      .filter((t) => e[t] > 0)
      .map((t) => (0, F.jsxs)(`span`, { children: [e[t], ` `, t] }, t)),
  });
}
function uu({kind,level=1}){return swElement(SWShipPortrait13,{kind,level});}
function du({ input: e, selected: t, onSelect: n, onRetreat: r, disabled: i }) {
  let a = hl(e);
  return (0, F.jsxs)(`div`, {
    className: `reserve-panel`,
    children: [
      (0, F.jsxs)(`div`, {
        className: `reserve-caption`,
        children: [
          (0, F.jsxs)(`span`, {
            children: [
              (0, F.jsx)(we, { size: 15 }),
              (0, F.jsx)(`strong`, {
                children: e.orders?.length
                  ? `Send reinforcements`
                  : `Choose a troop. Tap outside the walls.`,
              }),
            ],
          }),
          (0, F.jsx)(`button`, {
            onClick: r,
            disabled: i,
            children: `Retreat`,
          }),
        ],
      }),
      (0, F.jsxs)(`div`, {
        className: `reserve-tray`,
        children: [
          Object.keys(J)
            .filter((t) => e.army[t] > 0)
            .map((r) =>
              (0, F.jsxs)(
                `button`,
                {
                  className: `reserve-card ${t === r ? `selected` : ``} ${a[r] === 0 ? `empty` : ``}`,
                  "aria-label": `Deploy ${J[r].name}, ${a[r]} remaining`,
                  "aria-pressed": t === r,
                  disabled: i || a[r] === 0,
                  onClick: () => n(r),
                  children: [
                    (0, F.jsx)(lu, { kind: r, level: e.unitLevels?.[r] || 1 }),
                    (0, F.jsx)(`strong`, { children: J[r].name }),
                    (0, F.jsxs)(`span`, { children: [`×`, a[r]] }),
                  ],
                },
                r,
              ),
            ),
          e.commander &&
            (0, F.jsxs)(`button`, {
              className: `reserve-card hero-reserve ${t === `hero` ? `selected` : ``}`,
              disabled: i || !a.hero,
              "aria-label": `Deploy commander`,
              onClick: () => n(`hero`),
              children: [
                (0, F.jsx)(nu, { id: e.commander.id }),
                (0, F.jsx)(`strong`, { children: `Commander` }),
                (0, F.jsx)(`span`, { children: a.hero ? `Ready` : `Deployed` }),
              ],
            }),
        ],
      }),
    ],
  });
}
function fu(props) { return swElement(SWLandTools,props); }
function pu({open,onOpenChange,state,act,busy,onBuildPort,onViewCoast}) {
  return swElement(SWFleet,{open,onClose:()=>onOpenChange(false),state,act,busy,onBuildPort,onViewCoast});
}
function mu({ kind: e, state: t, act: n, busy: r }) {
  let i = el(t, e),
    a = t.trainingResearch,
    o = tl(t, e);
  return (0, F.jsxs)(`div`, {
    className: `troop-research`,
    children: [
      (0, F.jsxs)(`span`, {
        children: [
          `Level `,
          i,
          ` / 10 · `,
          Math.round(J[e].hp * (1 + 0.16 * (i - 1))),
          ` health · `,
          Math.round((J[e].heal || J[e].damage) * (1 + 0.14 * (i - 1))),
          J[e].heal ? ` healing per cast` : ` attack`,
        ],
      }),
      a?.kind === e
        ? (0, F.jsxs)(`strong`, {
            children: [
              (0, F.jsx)(k, { size: 13 }),
              `Upgrade ready in `,
              Qc((a.readyAt - Date.now()) / 1e3),
            ],
          })
        : i < 10
          ? (0, F.jsxs)(F.Fragment, {
              children: [
                (0, F.jsx)(cu, { cost: o }),
                (0, F.jsx)(`button`, {
                  className: `text-button`,
                  disabled:
                    r || !!a || i >= Ml(t) || Ml(t) < J[e].unlock || !Z(t, o),
                  onClick: () =>
                    void n(
                      { type: `researchUnit`, kind: e },
                      `Troop upgrade started`,
                    ),
                  children:
                    Ml(t) < J[e].unlock
                      ? `Unlock at Keep ${J[e].unlock}`
                      : i >= Ml(t)
                        ? `Keep ${i + 1} to upgrade`
                        : a
                          ? `Research in progress`
                          : `Upgrade to level ${i + 1} · ${Qc(120 * 1.7 ** (i - 1))}`,
                }),
              ],
            })
          : (0, F.jsxs)(`strong`, {
              children: [(0, F.jsx)(oe, { size: 14 }), `Mastered`],
            }),
    ],
  });
}
function hu({ building: e }) {
  let [t, n] = (0, C.useState)(Math.min(10, e.level + 1));
  return (0, F.jsxs)(`details`, {
    className: `evolution-preview`,
    children: [
      (0, F.jsx)(`summary`, { children: `See all 10 upgrade levels` }),
      (0, F.jsxs)(`div`, {
        className: `evolution-art`,
        children: [
          (0, F.jsx)(tu, { building: { ...e, level: t } }),
          (0, F.jsxs)(`div`, {
            children: [
              (0, F.jsx)(`strong`, { children: Dc[t - 1] }),
              (0, F.jsxs)(`span`, { children: [`Level `, t, ` / 10`] }),
              (0, F.jsx)(`small`, { children: Sl[e.kind].name }),
            ],
          }),
        ],
      }),
      (0, F.jsx)(`input`, {
        type: `range`,
        "aria-label": `Preview upgrade level`,
        min: `1`,
        max: `10`,
        step: `1`,
        value: t,
        onChange: (e) => n(Number(e.target.value)),
      }),
      (0, F.jsxs)(`div`, {
        className: `tier-scale`,
        children: [
          (0, F.jsx)(`span`, { children: `1 · Timber` }),
          (0, F.jsx)(`span`, { children: `10 · Imperial` }),
        ],
      }),
    ],
  });
}
var gu = new Map();
function _u(e) {
  let t = gu.get(e);
  if (t) return t;
  let n = new Promise((t, n) => {
    let r = 0,
      i = () => {
        let a = new Image();
        ((a.decoding = `async`),
          (a.onload = () => t(a)),
          (a.onerror = () => {
            ++r < 3
              ? setTimeout(i, r * 900)
              : (gu.delete(e), n(Error(`Artwork unavailable`)));
          }),
          (a.src = e + (r ? `?retry=${r}` : ``)));
      };
    i();
  });
  return (gu.set(e, n), n);
}
var vu = (e, t) => ({ x: 600 + (e - t) * 52, y: 175 + (e + t) * 27 });
var yu = (e, t) => ({
    x: ((e - 600) / 52 + (t - 175) / 27) / 2,
    y: ((t - 175) / 27 - (e - 600) / 52) / 2,
  });
var bu = [
    `Mira`,
    `Alden`,
    `Tess`,
    `Rowan`,
    `Bran`,
    `Elin`,
    `Hugo`,
    `Wren`,
    `Otto`,
    `Nell`,
    `Reed`,
    `Ada`,
    `Finn`,
    `Mara`,
    `Ivo`,
    `Lena`,
  ];
var xu = wl();
function Su(e, t, n = []) {
  for (let [r, i] of [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
    [1, 1],
    [-1, -1],
  ]) {
    let a = e.x + r,
      o = e.y + i;
    if (
      SWWalkable({ provinces: n }, a, o) &&
      !t.some((e) => e.kind !== `gate` && e.x === a && e.y === o)
    )
      return { x: a, y: o };
  }
  return { x: e.x + 0.6, y: e.y + 0.6 };
}
function Cu(e, t, n, r = []) {
  let i = (e) => `${e.x},${e.y}`,
    a = [e],
    o = new Map([[i(e), null]]);
  for (let e = 0; e < a.length; e++) {
    let s = a[e];
    if (i(s) === i(t)) {
      let e = [],
        t = s;
      for (; t; ) (e.unshift(t), (t = o.get(i(t)) || null));
      return e;
    }
    for (let [e, t] of [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ]) {
      let c = { x: s.x + e, y: s.y + t };
      SWWalkable({ provinces: r }, c.x, c.y) &&
        !o.has(i(c)) &&
        !n.some((e) => e.kind !== `gate` && e.x === c.x && e.y === c.y) &&
        (o.set(i(c), s), a.push(c));
    }
  }
  return [e];
}
function wu(e, t, n = []) {
  let r = e.find((e) => e.kind === `keep`) || e[0];
  if (!r) return [];
  let i = Su(r, e, n),
    a = e.filter((e) => ![`keep`, `wall`, `gate`].includes(e.kind)),
    o = Math.min(42, zl({ buildings: e })),
    s = {
      farm: [0, `Farmer`, `Carrying the harvest`],
      lumber: [1, `Woodcutter`, `Bringing timber to town`],
      quarry: [2, `Stonemason`, `Hauling cut stone`],
      market: [3, `Merchant`, `Trading at the market`],
      cottage: [0, `Villager`, `Walking through the village`],
      forge: [4, `Smith`, `Working at the foundry`],
      harbor: [3, `Trader`, `Unloading supplies`],
      barracks: [5, `Guard`, `Patrolling the barracks`],
      tower: [5, `Guard`, `Watching the approaches`],
    },
    c = [];
  for (let t = 0; t < o; t++) {
    let o = a[t % Math.max(1, a.length)] || r,
      [l, u, d] = o.readyAt
        ? [4, `Builder`, `Building ` + Sl[o.kind].name]
        : s[o.kind] || [0, `Villager`, `Walking through the village`],
      f = Su(o, e, n),
      p = Cu(
        t % 3 == 0 && a.length > 1 ? Su(a[(t + 1) % a.length], e, n) : i,
        f,
        e,
        n,
      );
    c.push({
      id: t,
      name: bu[t % bu.length],
      role: u,
      activity: d,
      sprite: l,
      route: p,
      soldier: !1,
    });
  }
  let l = e.find((e) => e.kind === `barracks` && e.level > 0),
    u = l ? Su(l, e, n) : i,
    d = [];
  for (let t = -1; t < 18; t++)
    for (let r = 0; r < 18; r++)
      Vc({ provinces: n }, t, r) &&
        !e.some((e) => e.x === t && e.y === r) &&
        d.push({ x: t, y: r });
  d.sort(
    (e, t) =>
      Math.hypot(e.x - u.x, e.y - u.y) - Math.hypot(t.x - u.x, t.y - u.y),
  );
  let f = 0;
  for (let [e, n] of Object.entries(t))
    for (let t = 0; t < n; t++) {
      let n = d[Math.floor(f / 4) % d.length] || u;
      (c.push({
        id: o + f,
        name: `${e === `archer` ? `Archer` : e === `cavalry` ? `Rider` : e === `cannon` ? `Artillery crew` : `Soldier`} ${t + 1}`,
        role: `Army`,
        activity: `Ready for deployment`,
        sprite:
          e === `archer` ? 6 : e === `cavalry` ? 7 : e === `cannon` ? 4 : 5,
        route: [
          {
            x: n.x + (f % 2 == 0 ? -0.2 : 0.2),
            y: n.y + (Math.floor(f / 2) % 2 == 0 ? -0.2 : 0.2),
          },
        ],
        soldier: !0,
        unitKind: e,
      }),
        f++);
    }
  return c;
}
function Tu(e, t) {
  if (e.route.length < 2) return { ...e.route[0], moving: !1, flip: !1 };
  let n = 14 + e.id * 0.53,
    r = ((t + e.id * 2.27) % n) / n,
    i = r < 0.42 || (r > 0.55 && r < 0.97),
    a =
      r < 0.42 ? r / 0.42 : r < 0.55 ? 1 : r < 0.97 ? 1 - (r - 0.55) / 0.42 : 0,
    o = Math.min(e.route.length - 1 - 1e-4, a * (e.route.length - 1)),
    s = Math.floor(o),
    c = e.route[s],
    l = e.route[Math.min(s + 1, e.route.length - 1)],
    u = o - s,
    d = r > 0.55 ? -1 : 1;
  return {
    x: c.x + (l.x - c.x) * u + ((e.id % 5) - 2) * 0.23,
    y: c.y + (l.y - c.y) * u + ((e.id % 4) - 1.5) * 0.2,
    moving: i,
    flip: (l.x - l.y - c.x + c.y) * d < 0,
  };
}
function SWStonePrism(ctx, a, b, width, height, base = 0, crenels = false) {
  const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy) || 1;
  const nx = -dy / length * width / 2, ny = dx / length * width / 2;
  const points = [
    vu(a.x + nx, a.y + ny), vu(b.x + nx, b.y + ny),
    vu(b.x - nx, b.y - ny), vu(a.x - nx, a.y - ny),
  ];
  const face = (points, fill) => {
    ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    // Spans meet without a dark outline at every tile boundary.
    ctx.strokeStyle = '#81765b30'; ctx.lineWidth = .35; ctx.stroke();
  };
  const faces = points.map((p, i) => [p, points[(i + 1) % 4]])
    .sort((a, b) => a[0].y + a[1].y - b[0].y - b[1].y);
  for (const [p, q] of faces) {
    face([{x:p.x,y:p.y-base},{x:q.x,y:q.y-base},{x:q.x,y:q.y-base-height},{x:p.x,y:p.y-base-height}],
      q.x > p.x ? '#8f876d' : '#aaa082');
    if (Math.hypot(q.x-p.x,q.y-p.y) > 15 && height > 12) {
      const columns=Math.max(2,Math.ceil(Math.hypot(q.x-p.x,q.y-p.y)/9)), rows=Math.round(height/6);
      for(let row=0;row<rows;row++) {
        const stagger=row%2?.5:0;
        for(let block=-1;block<columns;block++) {
          const from=Math.max(0,(block+stagger)/columns),to=Math.min(1,(block+stagger+1)/columns);
          if(to<=from)continue;
          const seed=Math.abs(Math.sin(a.x*31+a.y*17+row*9+block*71)), top=base+height*(row+1)/rows,bottom=base+height*row/rows;
          const ax=p.x+(q.x-p.x)*from,ay=p.y+(q.y-p.y)*from,bx=p.x+(q.x-p.x)*to,by=p.y+(q.y-p.y)*to;
          ctx.beginPath();ctx.moveTo(ax,ay-bottom);ctx.lineTo(bx,by-bottom);ctx.lineTo(bx,by-top);ctx.lineTo(ax,ay-top);ctx.closePath();
          ctx.fillStyle=seed>.55?`rgba(219,201,156,${.1+seed*.17})`:`rgba(65,64,45,${.05+seed*.17})`;ctx.fill();
          ctx.strokeStyle='#665e4945';ctx.lineWidth=.65;ctx.stroke();
          ctx.strokeStyle='#e6d5a82b';ctx.beginPath();ctx.moveTo(ax+.5,ay-top+1);ctx.lineTo(bx-.5,by-top+1);ctx.stroke();
        }
      }
    }
  }
  face(points.map(p => ({x:p.x,y:p.y-base-height})), '#c3b99a');
  if (crenels) {
    const count=Math.max(1,Math.round(length*4));
    for(let i=0;i<count;i++) {
      const t=(i+.18)/count,u=(i+.65)/count;
      SWStonePrism(ctx,{x:a.x+dx*t,y:a.y+dy*t},{x:a.x+dx*u,y:a.y+dy*u},width,4,base+height);
    }
  }
}
function SWPaintWall(ctx, building, walls, units, opacity = 1) {
  return SWPaintWall17(ctx,building,walls,units,opacity);
}
const SWWallCache = new Map();
function SWDrawWall(ctx, building, walls, units, opacity = 1, collapseAge=2000) {
  const unit=units?.get(building.id), condition=unit?.hp<=0?2:unit&&unit.hp<unit.maxHp*.55?1:0;
  const connections=[[1,0],[-1,0],[0,1],[0,-1]].map(([x,y])=>+walls.has(`${building.x+x},${building.y+y}`)).join('');
  const key=[building.x,building.y,building.kind,building.level,building.axis,connections,condition].join(':');
  let tile=SWWallCache.get(key);
  if(!tile) {
    tile=document.createElement('canvas');tile.width=280;tile.height=224;
    const paint=tile.getContext('2d'),position=vu(building.x,building.y);
    paint.scale(2,2);paint.translate(70-position.x,82-position.y);
    SWPaintWall(paint,building,walls,units);
    if(SWWallCache.size>=128)SWWallCache.delete(SWWallCache.keys().next().value);
    SWWallCache.set(key,tile);
  }
  const position=vu(building.x,building.y);ctx.save();ctx.globalAlpha*=opacity;
  ctx.drawImage(tile,position.x-70,position.y-82,140,112);ctx.restore();
  if(condition===2&&collapseAge<1600){
    if(collapseAge<550){const progress=collapseAge/550,alive=new Map(units);alive.set(building.id,{...unit,hp:unit.maxHp});ctx.save();ctx.translate(0,progress*progress*19);SWDrawWall(ctx,building,walls,alive,opacity*(1-progress));ctx.restore();}
    SWDrawDust(ctx,position,55,45,collapseAge);
  }
}
function SWDrawDeploymentEdge(ctx,defense,scale=1,preview=null) {
  const bounds=fl(defense),inset=.6;
  const corners=[{x:bounds.minX+inset,y:bounds.minY+inset},{x:bounds.maxX-inset,y:bounds.minY+inset},{x:bounds.maxX-inset,y:bounds.maxY-inset},{x:bounds.minX+inset,y:bounds.maxY-inset}].map(p=>vu(p.x,p.y));
  const path=()=>{ctx.beginPath();corners.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath()};
  ctx.save();ctx.lineJoin='round';path();ctx.strokeStyle='#26342880';ctx.lineWidth=6/scale;ctx.stroke();
  ctx.setLineDash([9/scale,7/scale]);path();ctx.strokeStyle='#e0d7a2c9';ctx.lineWidth=1.8/scale;ctx.stroke();ctx.setLineDash([]);
  if(preview){const p=vu(preview.x,preview.y);ctx.strokeStyle='#bde9f6';ctx.lineWidth=2/scale;ctx.fillStyle='#71aeb342';ctx.beginPath();ctx.ellipse(p.x,p.y,15/scale,8/scale,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y-13/scale);ctx.lineTo(p.x,p.y-7/scale);ctx.stroke();}
  ctx.restore();
}
function SWDrawProjectile(ctx, shot, progress, reducedMotion) {
  const a=vu(shot.x,shot.y), b=vu(shot.tx,shot.ty), dx=b.x-a.x, dy=b.y-a.y;
  const melee=['infantry','cavalry','spearman','shieldbearer','scout','knight','ram'].includes(shot.kind);
  const heavy=['cannon','mortar','bombtower','grenadier','naval','trebuchet'].includes(shot.kind);
  const p=Math.max(0,Math.min(1,progress));
  ctx.save();
  if(shot.kind==='heal'){
    ctx.strokeStyle='#a6d6b558';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(a.x,a.y-22);ctx.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2-34,b.x,b.y-22);ctx.stroke();
    for(let i=0;i<3;i++){const t=(p+i*.22)%1,x=a.x+dx*t,y=a.y+dy*t-22-Math.sin(t*Math.PI)*12;ctx.fillStyle='#bde5c3';ctx.beginPath();ctx.arc(x,y,1.8,0,Math.PI*2);ctx.fill()}
    ctx.restore();return;
  }
  if(heavy&&shot.kind!=='trebuchet'&&p<.2&&!reducedMotion){ctx.fillStyle=`rgba(245,198,113,${(1-p/.2)*.7})`;ctx.beginPath();ctx.ellipse(a.x,a.y-22,6+p*25,4+p*12,Math.atan2(dy,dx),0,Math.PI*2);ctx.fill()}
  if(melee) {
    if(p<.55&&!reducedMotion) {
      const angle=Math.atan2(dy,dx), reach=Math.min(21,Math.hypot(dx,dy)*.55);
      ctx.translate(a.x+dx*.62,a.y+dy*.62-18);ctx.rotate(angle);
      ctx.strokeStyle=`rgba(239,219,169,${Math.sin(p/.55*Math.PI)*.75})`;ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(0,0,reach,-.75+p*2,.1+p*2);ctx.stroke();
    }
  } else if(p<.78) {
    const t=p/.78, arc=shot.kind==='trebuchet'?90:heavy?42:18, x=a.x+dx*t, y=a.y-22+dy*t-Math.sin(t*Math.PI)*arc;
    ctx.translate(x,y);ctx.rotate(Math.atan2(dy-Math.cos(t*Math.PI)*Math.PI*arc,dx));
    ctx.strokeStyle=shot.kind==='heal'?'#8cdeb7':heavy?'#ddd0b055':'#ddce9eaa';ctx.lineWidth=heavy?3:1;
    ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(0,0);ctx.stroke();
    if(heavy){ctx.fillStyle='#453a2c';ctx.beginPath();ctx.arc(0,0,shot.kind==='trebuchet'?6.5:3.7,0,Math.PI*2);ctx.fill()}
    else {ctx.strokeStyle=shot.kind==='heal'?'#9fead0':'#f4dfb3';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(4,0);ctx.moveTo(0,-2);ctx.lineTo(4,0);ctx.lineTo(0,2);ctx.stroke()}
  }
  ctx.restore();
  if(p>.68&&!reducedMotion&&!shot.presentationOnly) {
    const t=(p-.68)/.32,water=shot.impact==='ship',radius=(heavy?27:9),groundY=b.y-(water?6:15);
    ctx.save();
    if(heavy&&!water){
      const flare=ctx.createRadialGradient(b.x,groundY,0,b.x,groundY,radius*(.3+t));flare.addColorStop(0,`rgba(255,228,152,${Math.max(0,1-t*2)})`);flare.addColorStop(.35,`rgba(229,119,47,${Math.max(0,.85-t)})`);flare.addColorStop(1,'rgba(194,87,31,0)');ctx.fillStyle=flare;ctx.beginPath();ctx.arc(b.x,groundY,radius*(.3+t),0,Math.PI*2);ctx.fill();
    }
    ctx.strokeStyle=water?`rgba(204,239,235,${(1-t)*.8})`:`rgba(194,175,132,${(1-t)*.38})`;ctx.lineWidth=water?2:3;ctx.beginPath();ctx.ellipse(b.x,groundY+9,radius*t*1.8,radius*t*.58,0,0,Math.PI*2);ctx.stroke();
    for(let i=0;i<(heavy?9:3);i++){
      const angle=i*2.399,spread=(.35+(i%3)*.25)*radius*t,x=b.x+Math.cos(angle)*spread,y=groundY+Math.sin(angle)*spread*.55-Math.sin(t*Math.PI)*(water?29:15);
      if(water){ctx.fillStyle=`rgba(213,239,229,${(1-t)*.8})`;ctx.beginPath();ctx.ellipse(x,y,1.2,3.2,angle,0,Math.PI*2);ctx.fill()}
      else{ctx.fillStyle=`rgba(${i%2?'80,66,47':'141,118,82'},${1-t})`;ctx.save();ctx.translate(x,y);ctx.rotate(angle+t*3);ctx.fillRect(-1.5,-1,3+(i%3),2);ctx.restore();if(heavy){const r=3+t*11,g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(123,112,89,${(1-t)*.3})`);g.addColorStop(1,'rgba(130,119,95,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}}
    }
    ctx.restore();
  }
}
const SWDirectionalKinds=['keep','cottage','barracks','storehouse','harbor'];
const SWDirectionalFiles=Object.fromEntries(SWDirectionalKinds.map(kind=>['direction_'+kind,kind+'-tiers-directions-v11.png']));
const SWAnimationFiles={vanguard17:'build17/vanguard-ranks.png',keepRear17:'build17/keep-rear.png',economy17:'build17/economy-buildings.png',citizens17:'build17/citizens.png',keep17:'build17/keep-levels.png',unitActions13:'unit-actions-v13.png',buildingsRear13:'sculpted-buildings-rear-v13.png',ships13:'ships-v13.png',buildings13:'sculpted-buildings-v13.png',utilities13:'sculpted-utilities-v13.png',units13:'units-v13.png',lighthouse12:'lighthouse-stages-v12.png',workers11:'workers-v11.png',deaths11:'deaths-v11.png',civic11:'civic-v11.png',pikes11:'pikes-v11.png',guards11:'guards-v11.png',missiles11:'missiles-v11.png',engines11:'engines-v11.png'};
const SWAtlasMetadata={"harbor-tiers-directions-v11.png":{"columns":4,"rows":3,"frames":[{"x":35,"y":34,"w":313,"h":288,"maskRects":[[89,0,19,3],[84,3,29,3],[82,6,31,3],[77,9,41,3],[77,12,42,3],[77,15,43,3],[77,18,43,3],[77,21,44,3],[78,24,46,3],[79,27,53,3],[78,30,63,3],[76,33,76,3],[73,36,104,3],[71,39,109,3],[69,42,116,3],[66,45,123,3],[63,48,130,3],[61,51,135,3],[58,54,145,3],[295,54,16,3],[56,57,150,3],[290,57,23,3],[53,60,160,3],[283,60,30,3],[50,63,167,3],[275,63,38,3],[47,66,170,3],[268,66,45,3],[44,69,173,3],[254,69,59,3],[42,72,176,3],[250,72,63,3],[39,75,185,3],[246,75,66,3],[36,78,195,3],[245,78,68,3],[32,81,205,3],[242,81,71,3],[29,84,284,3],[27,87,286,3],[25,90,288,3],[24,93,265,3],[292,93,21,3],[24,96,263,3],[293,96,19,3],[24,99,261,3],[296,99,13,3],[21,102,262,3],[298,102,10,3],[20,105,261,3],[298,105,10,3],[20,108,259,3],[298,108,10,3],[21,111,256,3],[298,111,10,3],[22,114,253,3],[298,114,10,3],[26,117,249,3],[298,117,10,3],[28,120,247,3],[296,120,13,3],[29,123,245,3],[296,123,13,3],[30,126,244,3],[296,126,13,3],[30,129,243,3],[296,129,13,3],[29,132,244,3],[295,132,15,3],[24,135,249,3],[293,135,17,3],[21,138,252,3],[293,138,17,3],[21,141,252,3],[293,141,17,3],[21,144,257,3],[294,144,16,3],[21,147,264,3],[295,147,13,3],[21,150,265,3],[21,153,265,3],[21,156,265,3],[20,159,266,3],[2,162,284,3],[1,165,287,3],[1,168,287,3],[0,171,306,3],[0,174,307,3],[0,177,307,3],[0,180,307,3],[0,183,309,3],[0,186,309,3],[0,189,309,3],[0,192,309,3],[0,195,308,3],[0,198,308,3],[0,201,308,3],[0,204,308,3],[0,207,308,3],[2,210,306,3],[22,213,286,3],[26,216,282,3],[27,219,280,3],[27,222,276,3],[28,225,259,3],[30,228,245,3],[50,231,220,3],[52,234,212,3],[54,237,210,3],[63,240,201,3],[67,243,196,3],[70,246,189,3],[70,249,180,3],[71,252,178,3],[73,255,170,3],[78,258,7,3],[92,258,144,3],[97,261,131,3],[102,264,119,3],[104,267,87,3],[192,267,22,3],[107,270,58,3],[168,270,22,3],[198,270,8,3],[114,273,45,3],[172,273,14,3],[119,276,32,3],[119,279,25,3],[119,282,24,3],[120,285,22,3]]},{"x":397,"y":35,"w":305,"h":292,"maskRects":[[182,0,18,3],[177,3,28,3],[175,6,31,3],[170,9,42,3],[168,12,44,3],[168,15,44,3],[168,18,44,3],[168,21,44,3],[169,24,42,3],[168,27,43,3],[165,30,49,3],[160,33,57,3],[151,36,68,3],[143,39,79,3],[118,42,107,3],[114,45,114,3],[113,48,118,3],[110,51,123,3],[108,54,128,3],[105,57,134,3],[101,60,142,3],[98,63,148,3],[89,66,159,3],[85,69,166,3],[85,72,169,3],[85,75,172,3],[6,78,12,3],[84,78,176,3],[2,81,25,3],[81,81,182,3],[0,84,38,3],[77,84,189,3],[0,87,52,3],[73,87,196,3],[0,90,59,3],[69,90,202,3],[0,93,59,3],[65,93,207,3],[0,96,60,3],[61,96,211,3],[2,99,271,3],[1,102,275,3],[0,105,276,3],[0,108,276,3],[0,111,275,3],[1,114,272,3],[1,117,20,3],[23,117,246,3],[2,120,18,3],[25,120,244,3],[5,123,11,3],[27,123,240,3],[6,126,9,3],[29,126,237,3],[6,129,9,3],[30,129,236,3],[6,132,9,3],[30,132,236,3],[4,135,13,3],[30,135,236,3],[4,138,13,3],[30,138,237,3],[4,141,14,3],[30,141,237,3],[4,144,14,3],[32,144,235,3],[270,144,7,3],[3,147,16,3],[32,147,251,3],[2,150,18,3],[32,150,258,3],[2,153,18,3],[32,153,258,3],[2,156,18,3],[29,156,261,3],[2,159,17,3],[24,159,266,3],[3,162,14,3],[19,162,271,3],[17,165,273,3],[17,168,281,3],[17,171,286,3],[17,174,286,3],[18,177,286,3],[5,180,11,3],[17,180,288,3],[1,183,304,3],[1,186,304,3],[1,189,304,3],[0,192,305,3],[0,195,304,3],[0,198,304,3],[0,201,304,3],[0,204,304,3],[0,207,304,3],[0,210,304,3],[0,213,304,3],[0,216,302,3],[0,219,281,3],[0,222,276,3],[0,225,271,3],[0,228,270,3],[3,231,16,3],[21,231,249,3],[29,234,240,3],[35,237,229,3],[39,240,210,3],[39,243,198,3],[40,246,193,3],[40,249,188,3],[44,252,182,3],[53,255,173,3],[54,258,172,3],[61,261,162,3],[67,264,135,3],[74,267,127,3],[82,270,22,3],[111,270,83,3],[87,273,10,3],[111,273,75,3],[114,276,18,3],[136,276,45,3],[143,279,33,3],[148,282,24,3],[149,285,23,3],[149,288,23,3],[152,291,17,1]]},{"x":767,"y":53,"w":307,"h":276,"maskRects":[[197,0,15,3],[191,3,27,3],[107,6,10,3],[189,6,31,3],[104,9,16,3],[184,9,41,3],[103,12,18,3],[182,12,45,3],[103,15,20,3],[182,15,45,3],[102,18,29,3],[182,18,45,3],[100,21,42,3],[175,21,52,3],[98,24,127,3],[95,27,130,3],[93,30,132,3],[8,33,7,3],[91,33,136,3],[2,36,19,3],[88,36,141,3],[0,39,24,3],[86,39,145,3],[0,42,28,3],[83,42,151,3],[0,45,33,3],[81,45,155,3],[0,48,38,3],[79,48,160,3],[0,51,43,3],[76,51,166,3],[0,54,49,3],[74,54,170,3],[0,57,58,3],[72,57,175,3],[0,60,62,3],[69,60,181,3],[0,63,63,3],[67,63,186,3],[0,66,63,3],[65,66,191,3],[0,69,260,3],[0,72,264,3],[0,75,267,3],[1,78,18,3],[23,78,247,3],[4,81,10,3],[25,81,250,3],[4,84,10,3],[27,84,252,3],[4,87,10,3],[29,87,253,3],[4,90,10,3],[30,90,252,3],[4,93,10,3],[32,93,250,3],[4,96,10,3],[33,96,249,3],[2,99,13,3],[35,99,245,3],[2,102,14,3],[36,102,243,3],[2,105,14,3],[37,105,241,3],[2,108,14,3],[37,108,245,3],[1,111,16,3],[37,111,250,3],[0,114,18,3],[37,114,253,3],[0,117,18,3],[38,117,258,3],[0,120,18,3],[38,120,260,3],[1,123,17,3],[38,123,260,3],[3,126,14,3],[34,126,264,3],[29,129,268,3],[26,132,268,3],[26,135,268,3],[26,138,265,3],[26,141,264,3],[26,144,264,3],[4,147,16,3],[26,147,264,3],[2,150,20,3],[24,150,266,3],[2,153,288,3],[1,156,300,3],[0,159,306,3],[0,162,306,3],[0,165,306,3],[0,168,307,3],[0,171,307,3],[1,174,306,3],[1,177,306,3],[1,180,306,3],[1,183,306,3],[1,186,306,3],[1,189,306,3],[1,192,306,3],[1,195,306,3],[6,198,11,3],[23,198,284,3],[29,201,278,3],[33,204,274,3],[36,207,250,3],[289,207,14,3],[38,210,242,3],[38,213,237,3],[39,216,234,3],[43,219,11,3],[57,219,216,3],[67,222,205,3],[72,225,180,3],[254,225,14,3],[77,228,173,3],[79,231,159,3],[82,234,151,3],[86,237,141,3],[89,240,132,3],[89,243,131,3],[91,246,129,3],[96,249,10,3],[114,249,105,3],[120,252,77,3],[203,252,11,3],[125,255,62,3],[131,258,51,3],[132,261,44,3],[136,264,34,3],[143,267,24,3],[144,270,23,3],[145,273,21,3]]},{"x":1112,"y":35,"w":306,"h":288,"maskRects":[[171,0,18,3],[165,3,29,3],[164,6,31,3],[159,9,41,3],[158,12,44,3],[158,15,44,3],[158,18,44,3],[158,21,44,3],[159,24,41,3],[157,27,44,3],[154,30,48,3],[144,33,61,3],[134,36,74,3],[108,39,101,3],[107,42,104,3],[104,45,110,3],[100,48,116,3],[96,51,123,3],[293,51,5,3],[92,54,130,3],[286,54,20,3],[86,57,138,3],[282,57,24,3],[78,60,148,3],[277,60,29,3],[75,63,154,3],[271,63,35,3],[73,66,158,3],[266,66,40,3],[73,69,161,3],[260,69,46,3],[73,72,163,3],[252,72,54,3],[69,75,170,3],[246,75,60,3],[65,78,176,3],[245,78,61,3],[61,81,183,3],[245,81,61,3],[57,84,249,3],[53,87,253,3],[49,90,257,3],[45,93,261,3],[41,96,242,3],[287,96,18,3],[37,99,244,3],[291,99,11,3],[32,102,248,3],[292,102,10,3],[30,105,248,3],[292,105,10,3],[26,108,250,3],[292,108,10,3],[26,111,249,3],[292,111,10,3],[26,114,247,3],[292,114,10,3],[26,117,246,3],[291,117,12,3],[28,120,243,3],[290,120,14,3],[27,123,244,3],[290,123,14,3],[22,126,249,3],[290,126,14,3],[16,129,255,3],[290,129,14,3],[12,132,258,3],[288,132,18,3],[11,135,259,3],[287,135,19,3],[11,138,259,3],[287,138,19,3],[11,141,261,3],[287,141,19,3],[12,144,265,3],[288,144,16,3],[15,147,263,3],[290,147,11,3],[16,150,262,3],[17,153,261,3],[17,156,261,3],[17,159,261,3],[17,162,261,3],[283,162,12,3],[17,165,282,3],[4,168,295,3],[2,171,298,3],[1,174,300,3],[1,177,301,3],[0,180,302,3],[0,183,302,3],[0,186,302,3],[0,189,301,3],[0,192,301,3],[0,195,301,3],[0,198,301,3],[0,201,301,3],[0,204,301,3],[0,207,301,3],[0,210,300,3],[0,213,278,3],[284,213,11,3],[0,216,273,3],[3,219,17,3],[21,219,246,3],[24,222,242,3],[36,225,230,3],[42,228,223,3],[47,231,197,3],[249,231,11,3],[52,234,187,3],[52,237,186,3],[55,240,172,3],[69,243,152,3],[74,246,141,3],[79,249,130,3],[79,252,129,3],[79,255,129,3],[80,258,128,3],[83,261,16,3],[102,261,84,3],[190,261,14,3],[103,264,80,3],[113,267,65,3],[119,270,49,3],[124,273,39,3],[129,276,29,3],[131,279,23,3],[131,282,23,3],[132,285,21,3]]},{"x":27,"y":337,"w":327,"h":326,"maskRects":[[129,0,20,3],[124,3,30,3],[121,6,35,3],[117,9,43,3],[117,12,43,3],[117,15,43,3],[117,18,43,3],[119,21,39,3],[119,24,39,3],[192,24,14,3],[119,27,41,3],[187,27,21,3],[119,30,47,3],[180,30,29,3],[118,33,92,3],[118,36,95,3],[116,39,99,3],[114,42,103,3],[112,45,107,3],[109,48,113,3],[68,51,16,3],[106,51,118,3],[67,54,20,3],[104,54,122,3],[67,57,26,3],[101,57,127,3],[66,60,165,3],[64,63,169,3],[62,66,173,3],[58,69,179,3],[57,72,183,3],[57,75,185,3],[56,78,188,3],[54,81,193,3],[49,84,200,3],[46,87,205,3],[42,90,211,3],[310,90,10,3],[35,93,220,3],[304,93,22,3],[31,96,227,3],[297,96,30,3],[30,99,231,3],[288,99,39,3],[30,102,233,3],[279,102,48,3],[31,105,296,3],[32,108,295,3],[33,111,293,3],[36,114,290,3],[37,117,290,3],[38,120,289,3],[38,123,289,3],[38,126,289,3],[38,129,265,3],[304,129,23,3],[38,132,263,3],[305,132,22,3],[35,135,264,3],[307,135,18,3],[34,138,264,3],[311,138,11,3],[34,141,262,3],[311,141,11,3],[34,144,260,3],[311,144,11,3],[32,147,260,3],[311,147,10,3],[30,150,261,3],[312,150,9,3],[27,153,262,3],[311,153,10,3],[24,156,265,3],[310,156,13,3],[21,159,268,3],[310,159,13,3],[18,162,271,3],[310,162,13,3],[15,165,274,3],[309,165,14,3],[12,168,276,3],[307,168,17,3],[9,171,278,3],[307,171,18,3],[9,174,278,3],[307,174,18,3],[9,177,278,3],[307,177,17,3],[10,180,277,3],[307,180,17,3],[11,183,276,3],[309,183,12,3],[16,186,274,3],[17,189,275,3],[18,192,279,3],[18,195,281,3],[18,198,281,3],[18,201,281,3],[2,204,297,3],[1,207,298,3],[1,210,313,3],[0,213,315,3],[0,216,315,3],[0,219,316,3],[0,222,317,3],[0,225,317,3],[0,228,317,3],[0,231,317,3],[0,234,317,3],[0,237,316,3],[0,240,316,3],[0,243,316,3],[0,246,316,3],[0,249,316,3],[3,252,313,3],[19,255,297,3],[22,258,293,3],[33,261,261,3],[302,261,8,3],[38,264,250,3],[43,267,239,3],[43,270,236,3],[47,273,232,3],[58,276,221,3],[63,279,214,3],[68,282,197,3],[71,285,194,3],[71,288,193,3],[71,291,186,3],[74,294,176,3],[93,297,150,3],[102,300,134,3],[108,303,80,3],[194,303,21,3],[220,303,10,3],[114,306,66,3],[199,306,10,3],[116,309,62,3],[121,312,49,3],[127,315,30,3],[128,318,23,3],[128,321,23,3],[130,324,18,2]]},{"x":374,"y":339,"w":331,"h":324,"maskRects":[[171,0,19,3],[165,3,30,3],[163,6,34,3],[158,9,44,3],[158,12,45,3],[158,15,45,3],[158,18,45,3],[159,21,43,3],[160,24,41,3],[120,27,14,3],[160,27,41,3],[117,30,20,3],[159,30,42,3],[116,33,28,3],[153,33,49,3],[115,36,88,3],[113,39,92,3],[111,42,97,3],[109,45,105,3],[107,48,112,3],[104,51,119,3],[230,51,10,3],[102,54,142,3],[100,57,145,3],[97,60,149,3],[95,63,153,3],[93,66,158,3],[91,69,163,3],[89,72,168,3],[86,75,173,3],[84,78,179,3],[82,81,185,3],[79,84,191,3],[3,87,18,3],[77,87,196,3],[0,90,25,3],[74,90,202,3],[0,93,30,3],[71,93,209,3],[0,96,38,3],[69,96,216,3],[0,99,44,3],[64,99,225,3],[0,102,50,3],[61,102,231,3],[0,105,292,3],[1,108,291,3],[0,111,290,3],[0,114,289,3],[0,117,287,3],[0,120,285,3],[0,123,284,3],[1,126,283,3],[1,129,21,3],[24,129,260,3],[3,132,16,3],[26,132,258,3],[5,135,10,3],[28,135,259,3],[5,138,10,3],[29,138,259,3],[5,141,10,3],[31,141,259,3],[5,144,10,3],[32,144,261,3],[5,147,10,3],[34,147,262,3],[4,150,12,3],[35,150,264,3],[4,153,13,3],[37,153,264,3],[4,156,13,3],[37,156,267,3],[4,159,13,3],[37,159,270,3],[3,162,15,3],[37,162,274,3],[2,165,17,3],[37,165,276,3],[2,168,17,3],[38,168,278,3],[2,171,17,3],[39,171,279,3],[2,174,17,3],[39,174,280,3],[4,177,14,3],[36,177,283,3],[35,180,284,3],[33,183,284,3],[32,186,284,3],[29,189,286,3],[24,192,290,3],[23,195,291,3],[23,198,291,3],[23,201,306,3],[23,204,307,3],[10,207,320,3],[7,210,324,3],[7,213,324,3],[7,216,324,3],[6,219,325,3],[5,222,326,3],[5,225,326,3],[5,228,326,3],[5,231,326,3],[6,234,325,3],[6,237,325,3],[6,240,325,3],[6,243,325,3],[6,246,325,3],[6,249,323,3],[6,252,305,3],[6,255,301,3],[9,258,298,3],[32,261,275,3],[38,264,266,3],[39,267,245,3],[43,270,235,3],[43,273,231,3],[44,276,227,3],[44,279,215,3],[47,282,207,3],[55,285,197,3],[56,288,196,3],[61,291,189,3],[68,294,161,3],[75,297,149,3],[81,300,135,3],[88,303,15,3],[107,303,103,3],[108,306,22,3],[134,306,70,3],[112,309,13,3],[146,309,56,3],[155,312,40,3],[162,315,27,3],[166,318,23,3],[167,321,21,3]]},{"x":753,"y":363,"w":327,"h":312,"maskRects":[[203,0,18,3],[155,3,15,3],[197,3,30,3],[153,6,20,3],[195,6,34,3],[120,9,17,3],[153,9,26,3],[190,9,43,3],[118,12,20,3],[153,12,31,3],[190,12,44,3],[118,15,25,3],[153,15,35,3],[190,15,44,3],[116,18,118,3],[114,21,120,3],[111,24,122,3],[109,27,124,3],[106,30,128,3],[104,33,132,3],[101,36,138,3],[99,39,141,3],[264,39,11,3],[97,42,143,3],[258,42,24,3],[4,45,15,3],[94,45,148,3],[251,45,32,3],[0,48,24,3],[92,48,193,3],[0,51,27,3],[90,51,198,3],[0,54,32,3],[87,54,204,3],[0,57,36,3],[84,57,210,3],[0,60,41,3],[82,60,213,3],[0,63,45,3],[80,63,216,3],[0,66,50,3],[77,66,219,3],[0,69,57,3],[75,69,221,3],[0,72,63,3],[72,72,224,3],[0,75,65,3],[70,75,225,3],[0,78,66,3],[67,78,227,3],[0,81,294,3],[0,84,295,3],[0,87,295,3],[0,90,298,3],[2,93,17,3],[22,93,281,3],[5,96,10,3],[24,96,281,3],[5,99,10,3],[25,99,283,3],[5,102,10,3],[27,102,281,3],[5,105,10,3],[28,105,279,3],[5,108,10,3],[30,108,276,3],[5,111,10,3],[31,111,274,3],[5,114,10,3],[32,114,269,3],[4,117,12,3],[33,117,30,3],[64,117,237,3],[3,120,14,3],[35,120,28,3],[64,120,235,3],[3,123,14,3],[36,123,262,3],[3,126,14,3],[37,126,261,3],[2,129,15,3],[37,129,261,3],[2,132,17,3],[37,132,261,3],[2,135,18,3],[37,135,262,3],[2,138,18,3],[37,138,264,3],[3,141,17,3],[37,141,266,3],[5,144,13,3],[39,144,267,3],[39,147,271,3],[38,150,274,3],[38,153,278,3],[38,156,281,3],[38,159,282,3],[34,162,286,3],[30,165,290,3],[29,168,290,3],[29,171,289,3],[29,174,286,3],[12,177,15,3],[29,177,286,3],[10,180,305,3],[10,183,305,3],[10,186,310,3],[9,189,317,3],[8,192,318,3],[8,195,318,3],[8,198,319,3],[8,201,319,3],[9,204,318,3],[9,207,318,3],[9,210,318,3],[9,213,318,3],[9,216,318,3],[9,219,318,3],[9,222,318,3],[9,225,318,3],[13,228,314,3],[32,231,295,3],[33,234,294,3],[38,237,288,3],[44,240,264,3],[312,240,10,3],[44,243,259,3],[44,246,254,3],[47,249,248,3],[68,252,223,3],[74,255,217,3],[79,258,211,3],[80,261,208,3],[84,264,180,3],[93,267,165,3],[94,270,161,3],[94,273,157,3],[95,276,146,3],[99,279,12,3],[117,279,117,3],[124,282,105,3],[129,285,99,3],[134,288,94,3],[138,291,88,3],[139,294,63,3],[150,297,46,3],[156,300,34,3],[161,303,23,3],[161,306,23,3],[162,309,21,3]]},{"x":1105,"y":344,"w":323,"h":329,"maskRects":[[185,0,17,3],[180,3,28,3],[178,6,32,3],[173,9,42,3],[173,12,43,3],[173,15,43,3],[173,18,43,3],[174,21,42,3],[101,24,14,3],[173,24,42,3],[99,27,20,3],[167,27,54,3],[98,30,26,3],[162,30,61,3],[96,33,36,3],[154,33,71,3],[94,36,50,3],[145,36,83,3],[91,39,139,3],[89,42,143,3],[86,45,148,3],[84,48,152,3],[81,51,157,3],[78,54,162,3],[76,57,167,3],[73,60,172,3],[303,60,19,3],[48,63,15,3],[70,63,177,3],[298,63,25,3],[46,66,203,3],[295,66,28,3],[45,69,206,3],[292,69,31,3],[42,72,212,3],[287,72,36,3],[39,75,217,3],[283,75,40,3],[36,78,223,3],[278,78,45,3],[35,81,226,3],[274,81,48,3],[34,84,229,3],[266,84,57,3],[32,87,291,3],[30,90,293,3],[28,93,295,3],[27,96,296,3],[27,99,296,3],[28,102,295,3],[29,105,273,3],[303,105,19,3],[29,108,271,3],[306,108,13,3],[28,111,271,3],[309,111,9,3],[25,114,273,3],[309,114,9,3],[23,117,273,3],[309,117,9,3],[22,120,273,3],[309,120,9,3],[22,123,272,3],[309,123,9,3],[20,126,273,3],[309,126,9,3],[20,129,271,3],[307,129,12,3],[20,132,241,3],[262,132,28,3],[307,132,13,3],[21,135,240,3],[262,135,26,3],[307,135,13,3],[23,138,264,3],[307,138,13,3],[28,141,258,3],[305,141,16,3],[28,144,259,3],[304,144,17,3],[30,147,257,3],[304,147,17,3],[31,150,256,3],[304,150,17,3],[31,153,256,3],[304,153,16,3],[31,156,256,3],[306,156,12,3],[30,159,256,3],[28,162,257,3],[25,165,261,3],[22,168,264,3],[20,171,266,3],[17,174,269,3],[14,177,272,3],[11,180,278,3],[9,183,283,3],[9,186,288,3],[9,189,288,3],[9,192,288,3],[10,195,287,3],[10,198,287,3],[12,201,285,3],[303,201,6,3],[3,204,312,3],[1,207,315,3],[1,210,315,3],[0,213,316,3],[0,216,317,3],[0,219,318,3],[0,222,318,3],[0,225,318,3],[0,228,317,3],[0,231,317,3],[0,234,317,3],[0,237,317,3],[0,240,317,3],[0,243,317,3],[0,246,317,3],[0,249,317,3],[0,252,315,3],[2,255,298,3],[301,255,10,3],[23,258,273,3],[25,261,264,3],[28,264,258,3],[38,267,248,3],[38,270,247,3],[38,273,228,3],[268,273,14,3],[40,276,219,3],[46,279,7,3],[61,279,191,3],[67,282,182,3],[70,285,170,3],[71,288,163,3],[77,291,151,3],[87,294,137,3],[91,297,133,3],[91,300,131,3],[91,303,107,3],[95,306,15,3],[113,306,77,3],[120,309,68,3],[125,312,55,3],[129,315,41,3],[131,318,34,3],[138,321,22,3],[138,324,22,3],[140,327,18,2]]},{"x":16,"y":661,"w":340,"h":393,"maskRects":[[108,0,19,3],[103,3,30,3],[101,6,33,3],[223,6,6,3],[96,9,43,3],[218,9,15,3],[96,12,44,3],[217,12,18,3],[96,15,44,3],[215,15,21,3],[96,18,44,3],[210,18,27,3],[96,21,44,3],[205,21,34,3],[98,24,40,3],[199,24,42,3],[98,27,40,3],[194,27,49,3],[52,30,11,3],[98,30,40,3],[187,30,58,3],[50,33,15,3],[96,33,45,3],[179,33,68,3],[50,36,16,3],[90,36,58,3],[173,36,77,3],[50,39,18,3],[78,39,79,3],[166,39,86,3],[51,42,203,3],[51,45,205,3],[49,48,209,3],[47,51,213,3],[46,54,216,3],[44,57,221,3],[42,60,225,3],[40,63,229,3],[38,66,233,3],[36,69,238,3],[34,72,242,3],[32,75,245,3],[30,78,250,3],[28,81,254,3],[26,84,259,3],[24,87,264,3],[22,90,268,3],[20,93,272,3],[17,96,278,3],[15,99,282,3],[13,102,284,3],[11,105,286,3],[11,108,286,3],[11,111,285,3],[321,111,11,3],[11,114,284,3],[313,114,26,3],[12,117,280,3],[308,117,32,3],[14,120,276,3],[302,120,38,3],[19,123,269,3],[295,123,45,3],[20,126,320,3],[22,129,318,3],[22,132,318,3],[22,135,315,3],[23,138,312,3],[23,141,314,3],[23,144,316,3],[22,147,317,3],[20,150,319,3],[20,153,319,3],[20,156,319,3],[20,159,293,3],[314,159,25,3],[20,162,292,3],[315,162,24,3],[20,165,290,3],[316,165,22,3],[17,168,291,3],[318,168,18,3],[16,171,291,3],[323,171,11,3],[15,174,291,3],[323,174,11,3],[15,177,289,3],[323,177,11,3],[15,180,288,3],[323,180,11,3],[15,183,286,3],[323,183,11,3],[16,186,284,3],[323,186,11,3],[16,189,282,3],[323,189,10,3],[17,192,280,3],[323,192,11,3],[18,195,277,3],[322,195,13,3],[17,198,276,3],[321,198,14,3],[17,201,277,3],[321,201,14,3],[17,204,277,3],[321,204,14,3],[17,207,277,3],[321,207,14,3],[17,210,278,3],[319,210,17,3],[17,213,278,3],[319,213,18,3],[17,216,278,3],[319,216,18,3],[17,219,276,3],[319,219,18,3],[17,222,276,3],[319,222,18,3],[13,225,281,3],[320,225,17,3],[7,228,287,3],[323,228,11,3],[4,231,290,3],[4,234,291,3],[4,237,291,3],[4,240,291,3],[4,243,305,3],[4,246,312,3],[4,249,312,3],[4,252,312,3],[5,255,311,3],[5,258,310,3],[4,261,308,3],[1,264,316,3],[1,267,316,3],[1,270,316,3],[0,273,317,3],[0,276,317,3],[0,279,316,3],[0,282,317,3],[320,282,9,3],[0,285,334,3],[0,288,334,3],[0,291,335,3],[0,294,336,3],[0,297,336,3],[0,300,336,3],[0,303,336,3],[0,306,336,3],[5,309,11,3],[18,309,318,3],[22,312,313,3],[36,315,299,3],[41,318,294,3],[43,321,292,3],[44,324,291,3],[44,327,291,3],[48,330,15,3],[67,330,268,3],[73,333,244,3],[318,333,13,3],[75,336,237,3],[79,339,231,3],[80,342,219,3],[80,345,213,3],[83,348,205,3],[88,351,199,3],[88,354,192,3],[95,357,185,3],[102,360,177,3],[109,363,150,3],[260,363,16,3],[116,366,23,3],[145,366,103,3],[123,369,9,3],[146,369,97,3],[168,372,71,3],[181,375,56,3],[188,378,38,3],[190,381,30,3],[195,384,24,3],[195,387,24,3],[197,390,21,3]]},{"x":372,"y":661,"w":343,"h":385,"maskRects":[[210,0,16,3],[204,3,28,3],[115,6,7,3],[202,6,32,3],[112,9,15,3],[197,9,42,3],[110,12,18,3],[196,12,45,3],[110,15,19,3],[196,15,45,3],[109,18,25,3],[196,18,45,3],[107,21,32,3],[196,21,45,3],[105,24,39,3],[199,24,39,3],[102,27,48,3],[199,27,39,3],[100,30,55,3],[199,30,40,3],[272,30,10,3],[98,33,64,3],[198,33,41,3],[269,33,15,3],[96,36,72,3],[194,36,51,3],[268,36,16,3],[94,39,79,3],[188,39,68,3],[267,39,17,3],[92,42,192,3],[90,45,194,3],[87,48,198,3],[85,51,202,3],[83,54,206,3],[81,57,210,3],[79,60,214,3],[77,63,218,3],[74,66,223,3],[72,69,227,3],[70,72,232,3],[68,75,236,3],[66,78,240,3],[63,81,245,3],[61,84,249,3],[59,87,253,3],[56,90,259,3],[54,93,263,3],[52,96,268,3],[52,99,270,3],[52,102,273,3],[52,105,274,3],[11,108,8,3],[53,108,274,3],[3,111,23,3],[54,111,273,3],[1,114,30,3],[57,114,270,3],[0,117,36,3],[59,117,266,3],[0,120,42,3],[60,120,264,3],[0,123,47,3],[60,123,260,3],[0,126,53,3],[60,126,258,3],[0,129,316,3],[2,132,314,3],[5,135,311,3],[3,138,313,3],[2,141,314,3],[1,144,315,3],[1,147,315,3],[1,150,316,3],[1,153,317,3],[1,156,317,3],[1,159,25,3],[28,159,290,3],[2,162,23,3],[29,162,289,3],[4,165,19,3],[30,165,288,3],[8,168,10,3],[32,168,289,3],[8,171,10,3],[33,171,289,3],[8,174,10,3],[35,174,288,3],[8,177,10,3],[36,177,288,3],[8,180,10,3],[38,180,286,3],[8,183,10,3],[39,183,285,3],[8,186,10,3],[41,186,283,3],[6,189,13,3],[42,189,282,3],[6,192,14,3],[43,192,279,3],[6,195,14,3],[43,195,279,3],[6,198,14,3],[43,198,279,3],[6,201,15,3],[43,201,279,3],[4,204,18,3],[43,204,279,3],[4,207,18,3],[43,207,279,3],[4,210,18,3],[43,210,280,3],[4,213,18,3],[45,213,278,3],[4,216,17,3],[44,216,279,3],[7,219,11,3],[44,219,279,3],[44,222,279,3],[44,225,279,3],[43,228,289,3],[43,231,292,3],[43,234,292,3],[42,237,293,3],[42,240,293,3],[42,243,294,3],[31,246,305,3],[23,249,313,3],[23,252,313,3],[23,255,312,3],[23,258,312,3],[24,261,314,3],[21,264,320,3],[21,267,321,3],[21,270,322,3],[21,273,322,3],[23,276,320,3],[15,279,328,3],[12,282,331,3],[11,285,332,3],[10,288,333,3],[10,291,333,3],[10,294,333,3],[10,297,333,3],[10,300,333,3],[10,303,333,3],[10,306,331,3],[11,309,312,3],[11,312,299,3],[11,315,292,3],[11,318,287,3],[11,321,284,3],[11,324,281,3],[15,327,13,3],[29,327,262,3],[37,330,231,3],[275,330,13,3],[43,333,219,3],[46,336,212,3],[48,339,210,3],[54,342,204,3],[54,345,202,3],[54,348,195,3],[58,351,191,3],[83,354,160,3],[89,357,147,3],[94,360,97,3],[193,360,36,3],[99,363,91,3],[199,363,21,3],[101,366,61,3],[173,366,12,3],[205,366,7,3],[105,369,50,3],[114,372,33,3],[116,375,26,3],[116,378,25,3],[117,381,23,3],[122,384,13,1]]},{"x":748,"y":663,"w":335,"h":393,"maskRects":[[123,0,20,3],[118,3,29,3],[117,6,32,3],[112,9,43,3],[111,12,44,3],[111,15,44,3],[227,15,6,3],[111,18,44,3],[222,18,15,3],[112,21,43,3],[220,21,19,3],[114,24,39,3],[219,24,20,3],[114,27,39,3],[215,27,26,3],[114,30,39,3],[208,30,35,3],[114,33,39,3],[170,33,15,3],[201,33,44,3],[114,36,40,3],[169,36,18,3],[196,36,51,3],[113,39,41,3],[169,39,80,3],[111,42,45,3],[167,42,84,3],[109,45,54,3],[164,45,89,3],[98,48,157,3],[96,51,161,3],[96,54,163,3],[96,57,165,3],[96,60,167,3],[96,63,169,3],[95,66,183,3],[92,69,187,3],[89,72,190,3],[86,75,193,3],[83,78,196,3],[80,81,201,3],[77,84,207,3],[296,84,11,3],[74,87,210,3],[293,87,16,3],[71,90,213,3],[292,90,17,3],[68,93,217,3],[290,93,19,3],[62,96,246,3],[9,99,14,3],[59,99,249,3],[1,102,27,3],[57,102,253,3],[1,105,29,3],[57,105,255,3],[0,108,33,3],[57,108,256,3],[0,111,38,3],[58,111,257,3],[0,114,42,3],[59,114,258,3],[0,117,46,3],[61,117,257,3],[0,120,51,3],[65,120,255,3],[1,123,55,3],[66,123,256,3],[2,126,59,3],[67,126,257,3],[5,129,321,3],[4,132,322,3],[3,135,325,3],[3,138,325,3],[3,141,325,3],[3,144,323,3],[3,147,322,3],[4,150,318,3],[5,153,316,3],[6,156,19,3],[27,156,292,3],[8,159,12,3],[29,159,289,3],[10,162,10,3],[30,162,288,3],[10,165,10,3],[31,165,287,3],[10,168,10,3],[32,168,285,3],[10,171,10,3],[34,171,283,3],[10,174,10,3],[35,174,283,3],[10,177,10,3],[36,177,282,3],[9,180,12,3],[37,180,283,3],[8,183,14,3],[39,183,285,3],[8,186,14,3],[40,186,287,3],[8,189,14,3],[41,189,289,3],[8,192,15,3],[39,192,293,3],[6,195,18,3],[39,195,293,3],[6,198,18,3],[39,198,292,3],[6,201,18,3],[39,201,292,3],[6,204,18,3],[39,204,289,3],[6,207,17,3],[40,207,287,3],[9,210,11,3],[41,210,285,3],[40,213,286,3],[40,216,286,3],[40,219,285,3],[31,222,294,3],[25,225,300,3],[24,228,301,3],[24,231,301,3],[24,234,301,3],[24,237,301,3],[24,240,302,3],[24,243,302,3],[21,246,305,3],[20,249,306,3],[20,252,306,3],[20,255,312,3],[10,258,324,3],[5,261,329,3],[5,264,330,3],[5,267,330,3],[3,270,332,3],[3,273,332,3],[3,276,332,3],[3,279,332,3],[3,282,332,3],[4,285,331,3],[4,288,331,3],[4,291,331,3],[4,294,331,3],[4,297,330,3],[4,300,327,3],[4,303,325,3],[5,306,324,3],[11,309,7,3],[24,309,304,3],[27,312,301,3],[38,315,290,3],[42,318,286,3],[45,321,283,3],[48,324,280,3],[48,327,276,3],[49,330,257,3],[54,333,13,3],[70,333,226,3],[79,336,210,3],[84,339,199,3],[90,342,187,3],[96,345,177,3],[97,348,173,3],[105,351,165,3],[107,354,161,3],[107,357,138,3],[254,357,10,3],[108,360,130,3],[114,363,9,3],[135,363,98,3],[140,366,90,3],[146,369,77,3],[147,372,66,3],[151,375,55,3],[163,378,37,3],[168,381,26,3],[168,384,24,3],[168,387,24,3],[170,390,20,3]]},{"x":1102,"y":664,"w":327,"h":388,"maskRects":[[186,0,22,3],[182,3,30,3],[180,6,35,3],[176,9,43,3],[175,12,44,3],[175,15,44,3],[108,18,14,3],[175,18,44,3],[106,21,18,3],[177,21,42,3],[106,24,19,3],[178,24,39,3],[105,27,22,3],[168,27,7,3],[178,27,39,3],[103,30,30,3],[163,30,54,3],[102,33,36,3],[159,33,58,3],[99,36,45,3],[151,36,66,3],[97,39,121,3],[95,42,123,3],[93,45,125,3],[91,48,128,3],[224,48,11,3],[89,51,130,3],[220,51,16,3],[87,54,149,3],[85,57,152,3],[83,60,155,3],[81,63,159,3],[79,66,163,3],[76,69,168,3],[74,72,172,3],[308,72,8,3],[72,75,176,3],[303,75,22,3],[69,78,181,3],[299,78,28,3],[68,81,184,3],[295,81,32,3],[51,84,5,3],[68,84,186,3],[292,84,35,3],[47,87,13,3],[68,87,189,3],[287,87,40,3],[46,90,16,3],[69,90,190,3],[283,90,44,3],[46,93,17,3],[69,93,190,3],[279,93,48,3],[46,96,213,3],[274,96,52,3],[46,99,213,3],[270,99,55,3],[46,102,212,3],[261,102,63,3],[44,105,282,3],[41,108,285,3],[38,111,288,3],[36,114,290,3],[33,117,293,3],[30,120,296,3],[27,123,298,3],[24,126,277,3],[303,126,21,3],[21,129,279,3],[306,129,17,3],[15,132,284,3],[309,132,11,3],[13,135,285,3],[309,135,10,3],[12,138,284,3],[309,138,10,3],[12,141,283,3],[309,141,10,3],[13,144,281,3],[309,144,10,3],[14,147,279,3],[309,147,10,3],[15,150,277,3],[309,150,10,3],[19,153,271,3],[309,153,10,3],[20,156,269,3],[309,156,10,3],[22,159,266,3],[309,159,10,3],[22,162,265,3],[308,162,13,3],[22,165,263,3],[307,165,14,3],[22,168,265,3],[307,168,14,3],[22,171,265,3],[307,171,14,3],[19,174,268,3],[306,174,17,3],[16,177,272,3],[305,177,18,3],[13,180,275,3],[304,180,19,3],[8,183,280,3],[304,183,19,3],[7,186,280,3],[304,186,18,3],[7,189,280,3],[305,189,16,3],[7,192,280,3],[310,192,7,3],[8,195,279,3],[11,198,279,3],[11,201,284,3],[11,204,285,3],[11,207,285,3],[11,210,285,3],[12,213,283,3],[13,216,282,3],[12,219,283,3],[296,219,8,3],[12,222,298,3],[12,225,300,3],[12,228,300,3],[12,231,300,3],[12,234,300,3],[12,237,299,3],[11,240,301,3],[11,243,301,3],[10,246,301,3],[5,249,306,3],[1,252,311,3],[1,255,318,3],[0,258,324,3],[0,261,324,3],[0,264,325,3],[0,267,326,3],[0,270,326,3],[0,273,326,3],[0,276,326,3],[0,279,326,3],[0,282,325,3],[0,285,325,3],[0,288,325,3],[0,291,325,3],[0,294,325,3],[1,297,324,3],[2,300,323,3],[2,303,322,3],[2,306,303,3],[309,306,11,3],[2,309,299,3],[2,312,289,3],[2,315,283,3],[2,318,278,3],[2,321,274,3],[6,324,12,3],[23,324,253,3],[25,327,250,3],[37,330,216,3],[257,330,14,3],[42,333,205,3],[48,336,192,3],[53,339,182,3],[59,342,168,3],[64,345,157,3],[68,348,147,3],[68,351,146,3],[68,354,145,3],[71,357,141,3],[96,360,90,3],[200,360,6,3],[102,363,77,3],[106,366,67,3],[110,369,60,3],[111,372,49,3],[117,375,37,3],[124,378,24,3],[124,381,23,3],[124,384,23,3],[127,387,17,1]]}]},"storehouse-tiers-directions-v11.png":{"columns":4,"rows":3,"frames":[{"x":41,"y":15,"w":309,"h":300,"maskRects":[[216,0,20,3],[213,3,26,3],[211,6,31,3],[210,9,34,3],[205,12,39,3],[199,15,45,3],[193,18,51,3],[188,21,57,3],[183,24,64,3],[176,27,73,3],[171,30,80,3],[165,33,88,3],[159,36,96,3],[153,39,104,3],[147,42,113,3],[142,45,120,3],[136,48,128,3],[131,51,135,3],[124,54,144,3],[119,57,151,3],[113,60,159,3],[107,63,168,3],[100,66,177,3],[94,69,185,3],[76,72,205,3],[71,75,212,3],[68,78,217,3],[66,81,222,3],[65,84,225,3],[65,87,227,3],[65,90,229,3],[65,93,231,3],[61,96,237,3],[57,99,243,3],[53,102,249,3],[49,105,255,3],[45,108,261,3],[40,111,269,3],[36,114,273,3],[32,117,277,3],[28,120,281,3],[24,123,284,3],[19,126,286,3],[14,129,281,3],[9,132,285,3],[5,135,289,3],[0,138,294,3],[0,141,293,3],[0,144,293,3],[0,147,294,3],[2,150,292,3],[4,153,7,3],[12,153,282,3],[12,156,282,3],[12,159,282,3],[12,162,282,3],[12,165,282,3],[11,168,284,3],[11,171,284,3],[10,174,285,3],[10,177,285,3],[10,180,285,3],[10,183,285,3],[10,186,285,3],[9,189,286,3],[9,192,286,3],[9,195,286,3],[9,198,286,3],[8,201,288,3],[8,204,288,3],[7,207,289,3],[7,210,290,3],[6,213,291,3],[6,216,291,3],[6,219,291,3],[5,222,292,3],[5,225,292,3],[5,228,290,3],[4,231,284,3],[4,234,273,3],[4,237,267,3],[3,240,263,3],[3,243,257,3],[3,246,251,3],[3,249,245,3],[8,252,234,3],[16,255,220,3],[28,258,203,3],[36,261,194,3],[46,264,184,3],[53,267,176,3],[62,270,167,3],[70,273,157,3],[78,276,147,3],[86,279,137,3],[95,282,122,3],[103,285,108,3],[112,288,80,3],[119,291,45,3],[166,291,24,3],[127,294,35,3],[134,297,21,3]]},{"x":393,"y":15,"w":309,"h":303,"maskRects":[[72,0,21,3],[69,3,28,3],[67,6,32,3],[66,9,33,3],[66,12,36,3],[66,15,44,3],[66,18,49,3],[64,21,56,3],[62,24,63,3],[60,27,72,3],[57,30,80,3],[55,33,87,3],[53,36,94,3],[51,39,103,3],[49,42,109,3],[46,45,119,3],[44,48,127,3],[42,51,134,3],[40,54,141,3],[38,57,149,3],[35,60,157,3],[33,63,166,3],[31,66,174,3],[29,69,180,3],[26,72,189,3],[24,75,198,3],[226,75,10,3],[22,78,220,3],[20,81,225,3],[18,84,230,3],[15,87,233,3],[13,90,235,3],[11,93,237,3],[8,96,242,3],[6,99,248,3],[4,102,253,3],[2,105,260,3],[0,108,265,3],[0,111,270,3],[0,114,274,3],[0,117,279,3],[3,120,280,3],[7,123,281,3],[16,126,276,3],[18,129,280,3],[18,132,284,3],[18,135,288,3],[19,138,290,3],[19,141,290,3],[18,144,291,3],[18,147,289,3],[18,150,288,3],[18,153,278,3],[18,156,278,3],[18,159,278,3],[18,162,278,3],[17,165,279,3],[17,168,281,3],[17,171,281,3],[17,174,281,3],[17,177,281,3],[16,180,283,3],[16,183,283,3],[16,186,283,3],[16,189,283,3],[16,192,284,3],[15,195,285,3],[15,198,285,3],[15,201,285,3],[15,204,286,3],[15,207,286,3],[14,210,287,3],[14,213,288,3],[14,216,288,3],[14,219,288,3],[14,222,289,3],[15,225,288,3],[21,228,282,3],[26,231,278,3],[38,234,266,3],[43,237,261,3],[49,240,256,3],[54,243,251,3],[61,246,244,3],[66,249,239,3],[72,252,228,3],[77,255,217,3],[83,258,200,3],[89,261,186,3],[95,264,173,3],[98,267,162,3],[98,270,155,3],[98,273,148,3],[98,276,140,3],[101,279,130,3],[105,282,117,3],[110,285,105,3],[115,288,93,3],[120,291,81,3],[131,294,62,3],[152,297,33,3],[158,300,21,3]]},{"x":747,"y":16,"w":304,"h":304,"maskRects":[[212,0,20,3],[208,3,27,3],[206,6,32,3],[206,9,33,3],[203,12,37,3],[196,15,44,3],[192,18,48,3],[185,21,55,3],[179,24,62,3],[174,27,69,3],[168,30,78,3],[163,33,85,3],[157,36,93,3],[151,39,101,3],[146,42,108,3],[138,45,118,3],[133,48,126,3],[127,51,134,3],[121,54,142,3],[115,57,150,3],[110,60,157,3],[103,63,166,3],[98,66,173,3],[91,69,182,3],[85,72,190,3],[63,75,214,3],[59,78,221,3],[57,81,225,3],[55,84,229,3],[55,87,231,3],[55,90,233,3],[55,93,235,3],[53,96,240,3],[49,99,246,3],[45,102,252,3],[41,105,258,3],[37,108,264,3],[32,111,271,3],[27,114,277,3],[23,117,281,3],[19,120,285,3],[15,123,289,3],[10,126,293,3],[6,129,292,3],[1,132,288,3],[0,135,289,3],[0,138,289,3],[0,141,289,3],[1,144,287,3],[3,147,287,3],[12,150,278,3],[13,153,277,3],[13,156,277,3],[13,159,277,3],[12,162,278,3],[11,165,279,3],[11,168,280,3],[11,171,280,3],[11,174,280,3],[11,177,281,3],[11,180,281,3],[11,183,281,3],[11,186,281,3],[11,189,281,3],[10,192,282,3],[10,195,282,3],[9,198,284,3],[9,201,284,3],[9,204,284,3],[9,207,284,3],[9,210,285,3],[8,213,286,3],[8,216,286,3],[8,219,287,3],[8,222,287,3],[7,225,288,3],[7,228,287,3],[7,231,281,3],[7,234,275,3],[6,237,264,3],[6,240,259,3],[7,243,251,3],[13,246,239,3],[19,249,228,3],[33,252,208,3],[39,255,196,3],[44,258,185,3],[51,261,171,3],[58,264,159,3],[62,267,149,3],[62,270,143,3],[63,273,137,3],[64,276,129,3],[67,279,120,3],[71,282,109,3],[71,285,103,3],[72,288,97,3],[77,291,86,3],[84,294,76,3],[90,297,6,3],[106,297,8,3],[121,297,37,3],[128,300,24,3],[135,303,10,1]]},{"x":1106,"y":19,"w":300,"h":293,"maskRects":[[70,0,22,3],[68,3,26,3],[66,6,31,3],[65,9,32,3],[65,12,37,3],[65,15,43,3],[65,18,49,3],[64,21,55,3],[62,24,62,3],[60,27,73,3],[58,30,79,3],[55,33,89,3],[53,36,98,3],[51,39,105,3],[49,42,114,3],[46,45,122,3],[44,48,130,3],[42,51,137,3],[40,54,145,3],[38,57,151,3],[35,60,163,3],[33,63,170,3],[31,66,177,3],[29,69,186,3],[220,69,8,3],[27,72,207,3],[24,75,213,3],[22,78,218,3],[20,81,221,3],[18,84,223,3],[16,87,225,3],[13,90,228,3],[11,93,234,3],[9,96,240,3],[6,99,246,3],[4,102,252,3],[2,105,259,3],[0,108,265,3],[0,111,269,3],[0,114,273,3],[0,117,277,3],[1,120,280,3],[5,123,281,3],[15,126,276,3],[16,129,279,3],[16,132,284,3],[17,135,283,3],[17,138,283,3],[16,141,283,3],[16,144,282,3],[16,147,280,3],[16,150,272,3],[16,153,272,3],[15,156,273,3],[15,159,274,3],[15,162,275,3],[15,165,275,3],[15,168,275,3],[14,171,276,3],[14,174,276,3],[14,177,277,3],[14,180,277,3],[14,183,278,3],[14,186,278,3],[14,189,279,3],[13,192,280,3],[13,195,280,3],[13,198,281,3],[13,201,281,3],[12,204,283,3],[12,207,284,3],[12,210,284,3],[12,213,284,3],[12,216,284,3],[12,219,285,3],[15,222,282,3],[20,225,278,3],[28,228,270,3],[36,231,262,3],[42,234,256,3],[48,237,249,3],[53,240,238,3],[59,243,225,3],[65,246,212,3],[70,249,201,3],[76,252,188,3],[82,255,176,3],[88,258,145,3],[94,261,132,3],[99,264,120,3],[106,267,106,3],[111,270,94,3],[117,273,80,3],[124,276,66,3],[130,279,53,3],[134,282,42,3],[135,285,39,3],[140,288,29,3],[147,291,16,2]]},{"x":26,"y":325,"w":321,"h":333,"maskRects":[[202,0,23,3],[199,3,28,3],[198,6,31,3],[196,9,33,3],[186,12,43,3],[177,15,52,3],[170,18,60,3],[162,21,70,3],[153,24,81,3],[146,27,91,3],[138,30,102,3],[130,33,113,3],[121,36,125,3],[114,39,134,3],[106,42,145,3],[80,45,7,3],[97,45,157,3],[73,48,184,3],[71,51,189,3],[68,54,195,3],[68,57,197,3],[68,60,200,3],[68,63,203,3],[65,66,209,3],[61,69,216,3],[58,72,222,3],[54,75,229,3],[50,78,236,3],[46,81,243,3],[41,84,251,3],[37,87,258,3],[34,90,264,3],[29,93,272,3],[25,96,279,3],[21,99,286,3],[17,102,293,3],[13,105,300,3],[9,108,307,3],[4,111,315,3],[1,114,320,3],[0,117,321,3],[0,120,321,3],[0,123,321,3],[2,126,317,3],[4,129,10,3],[17,129,297,3],[18,132,286,3],[18,135,286,3],[18,138,286,3],[18,141,286,3],[18,144,286,3],[18,147,286,3],[18,150,286,3],[18,153,286,3],[17,156,289,3],[15,159,293,3],[13,162,296,3],[13,165,296,3],[13,168,296,3],[13,171,296,3],[13,174,296,3],[13,177,296,3],[13,180,297,3],[12,183,298,3],[11,186,300,3],[11,189,300,3],[11,192,301,3],[10,195,302,3],[10,198,302,3],[9,201,303,3],[9,204,304,3],[9,207,304,3],[8,210,306,3],[8,213,306,3],[7,216,307,3],[7,219,308,3],[7,222,308,3],[6,225,309,3],[6,228,309,3],[6,231,310,3],[5,234,311,3],[5,237,312,3],[4,240,313,3],[4,243,314,3],[4,246,314,3],[4,249,314,3],[3,252,316,3],[3,255,316,3],[2,258,317,3],[2,261,317,3],[2,264,317,3],[1,267,318,3],[1,270,317,3],[1,273,312,3],[1,276,305,3],[3,279,284,3],[9,282,272,3],[17,285,257,3],[34,288,233,3],[41,291,220,3],[50,294,203,3],[58,297,188,3],[67,300,177,3],[75,303,167,3],[83,306,157,3],[93,309,145,3],[101,312,131,3],[110,315,115,3],[119,318,89,3],[128,321,76,3],[136,324,51,3],[141,327,42,3],[149,330,26,3]]},{"x":387,"y":326,"w":316,"h":331,"maskRects":[[95,0,23,3],[93,3,28,3],[91,6,31,3],[91,9,36,3],[91,12,42,3],[91,15,51,3],[90,18,59,3],[87,21,71,3],[85,24,78,3],[81,27,91,3],[79,30,101,3],[76,33,112,3],[73,36,121,3],[70,39,131,3],[67,42,142,3],[64,45,153,3],[61,48,164,3],[234,48,7,3],[59,51,190,3],[56,54,195,3],[53,57,200,3],[50,60,204,3],[47,63,207,3],[44,66,210,3],[41,69,216,3],[38,72,222,3],[35,75,229,3],[32,78,236,3],[29,81,243,3],[27,84,249,3],[24,87,255,3],[21,90,262,3],[18,93,270,3],[15,96,276,3],[12,99,283,3],[9,102,290,3],[6,105,297,3],[3,108,304,3],[0,111,311,3],[0,114,314,3],[0,117,316,3],[0,120,316,3],[2,123,314,3],[5,126,309,3],[18,129,281,3],[301,129,11,3],[19,132,280,3],[19,135,280,3],[19,138,280,3],[19,141,280,3],[19,144,280,3],[19,147,280,3],[19,150,280,3],[19,153,280,3],[16,156,283,3],[15,159,284,3],[15,162,287,3],[15,165,288,3],[15,168,288,3],[15,171,288,3],[15,174,289,3],[14,177,290,3],[14,180,290,3],[14,183,290,3],[14,186,291,3],[13,189,292,3],[13,192,292,3],[12,195,293,3],[12,198,294,3],[12,201,294,3],[11,204,296,3],[11,207,296,3],[11,210,296,3],[11,213,297,3],[10,216,298,3],[10,219,298,3],[9,222,300,3],[9,225,300,3],[9,228,300,3],[8,231,302,3],[8,234,302,3],[8,237,302,3],[7,240,304,3],[7,243,305,3],[7,246,305,3],[6,249,306,3],[6,252,306,3],[6,255,307,3],[5,258,308,3],[5,261,309,3],[5,264,309,3],[5,267,309,3],[10,270,305,3],[15,273,300,3],[34,276,281,3],[41,279,274,3],[47,282,268,3],[54,285,256,3],[60,288,242,3],[66,291,216,3],[73,294,199,3],[78,297,184,3],[78,300,174,3],[78,303,164,3],[78,306,153,3],[78,309,143,3],[80,312,131,3],[86,315,115,3],[93,318,99,3],[99,321,6,3],[123,321,57,3],[127,324,46,3],[134,327,31,3],[141,330,15,1]]},{"x":743,"y":323,"w":323,"h":331,"maskRects":[[209,0,22,3],[207,3,26,3],[206,6,30,3],[202,9,34,3],[193,12,43,3],[185,15,51,3],[177,18,60,3],[171,21,68,3],[163,24,79,3],[157,27,88,3],[148,30,100,3],[140,33,111,3],[134,36,120,3],[125,39,131,3],[117,42,142,3],[110,45,152,3],[83,48,182,3],[81,51,187,3],[78,54,192,3],[78,57,195,3],[78,60,197,3],[77,63,202,3],[76,66,205,3],[72,69,212,3],[68,72,219,3],[65,75,225,3],[60,78,233,3],[56,81,240,3],[52,84,247,3],[48,87,254,3],[44,90,260,3],[41,93,266,3],[36,96,274,3],[32,99,281,3],[28,102,288,3],[24,105,295,3],[20,108,301,3],[15,111,308,3],[11,114,312,3],[7,117,316,3],[3,120,320,3],[0,123,321,3],[0,126,314,3],[0,129,308,3],[2,132,306,3],[5,135,10,3],[17,135,291,3],[18,138,290,3],[18,141,290,3],[18,144,290,3],[17,147,291,3],[17,150,292,3],[17,153,292,3],[17,156,292,3],[15,159,297,3],[13,162,300,3],[13,165,300,3],[13,168,300,3],[13,171,300,3],[13,174,300,3],[12,177,301,3],[12,180,301,3],[11,183,303,3],[11,186,304,3],[11,189,304,3],[10,192,305,3],[9,195,307,3],[9,198,307,3],[9,201,308,3],[8,204,309,3],[8,207,309,3],[7,210,311,3],[7,213,311,3],[6,216,312,3],[6,219,312,3],[6,222,313,3],[5,225,314,3],[5,228,315,3],[4,231,316,3],[4,234,316,3],[4,237,317,3],[3,240,318,3],[2,243,319,3],[2,246,319,3],[2,249,320,3],[2,252,320,3],[1,255,322,3],[0,258,323,3],[0,261,323,3],[0,264,323,3],[0,267,323,3],[0,270,323,3],[0,273,323,3],[0,276,318,3],[4,279,305,3],[11,282,277,3],[22,285,258,3],[22,288,250,3],[22,291,242,3],[24,294,232,3],[37,297,210,3],[44,300,196,3],[52,303,180,3],[58,306,166,3],[62,309,153,3],[69,312,138,3],[76,315,122,3],[83,318,107,3],[84,321,101,3],[96,324,88,3],[147,327,29,3],[155,330,13,1]]},{"x":1109,"y":331,"w":312,"h":330,"maskRects":[[91,0,22,3],[88,3,28,3],[87,6,30,3],[86,9,34,3],[86,12,42,3],[86,15,50,3],[85,18,58,3],[83,21,68,3],[81,24,81,3],[78,27,91,3],[76,30,101,3],[73,33,113,3],[71,36,124,3],[68,39,136,3],[66,42,148,3],[217,42,15,3],[63,45,174,3],[61,48,179,3],[58,51,183,3],[55,54,186,3],[53,57,188,3],[50,60,192,3],[47,63,198,3],[45,66,204,3],[42,69,210,3],[40,72,217,3],[37,75,223,3],[34,78,230,3],[32,81,236,3],[29,84,243,3],[27,87,249,3],[24,90,256,3],[21,93,262,3],[18,96,269,3],[16,99,275,3],[13,102,282,3],[11,105,288,3],[8,108,295,3],[6,111,301,3],[3,114,308,3],[2,117,309,3],[2,120,309,3],[2,123,307,3],[4,126,303,3],[6,129,287,3],[299,129,6,3],[17,132,276,3],[17,135,276,3],[17,138,276,3],[17,141,276,3],[17,144,276,3],[17,147,276,3],[17,150,276,3],[17,153,276,3],[15,156,280,3],[13,159,284,3],[12,162,285,3],[12,165,286,3],[12,168,286,3],[12,171,286,3],[12,174,286,3],[11,177,288,3],[10,180,289,3],[10,183,290,3],[10,186,290,3],[10,189,291,3],[9,192,293,3],[8,195,294,3],[8,198,295,3],[8,201,295,3],[7,204,296,3],[7,207,297,3],[6,210,299,3],[6,213,299,3],[6,216,299,3],[5,219,301,3],[5,222,301,3],[5,225,302,3],[4,228,303,3],[4,231,303,3],[3,234,305,3],[2,237,307,3],[2,240,307,3],[2,243,307,3],[2,246,308,3],[1,249,309,3],[1,252,310,3],[0,255,312,3],[0,258,312,3],[0,261,312,3],[0,264,312,3],[0,267,312,3],[0,270,312,3],[3,273,309,3],[10,276,302,3],[17,279,7,3],[31,279,276,3],[39,282,260,3],[46,285,242,3],[53,288,234,3],[60,291,223,3],[68,294,196,3],[75,297,187,3],[82,300,175,3],[89,303,153,3],[97,306,114,3],[104,309,100,3],[111,312,85,3],[118,315,70,3],[125,318,54,3],[126,321,48,3],[131,324,40,3],[138,327,25,3]]},{"x":16,"y":663,"w":349,"h":385,"maskRects":[[104,0,23,3],[190,0,20,3],[102,3,28,3],[186,3,27,3],[99,6,32,3],[185,6,30,3],[99,9,32,3],[185,9,30,3],[99,12,37,3],[185,12,31,3],[99,15,47,3],[180,15,36,3],[99,18,54,3],[174,18,42,3],[98,21,63,3],[164,21,52,3],[96,24,120,3],[93,27,125,3],[90,30,130,3],[87,33,135,3],[84,36,140,3],[81,39,145,3],[79,42,148,3],[76,45,153,3],[73,48,158,3],[70,51,169,3],[257,51,15,3],[67,54,179,3],[252,54,26,3],[64,57,215,3],[62,60,219,3],[58,63,224,3],[55,66,227,3],[52,69,230,3],[50,72,232,3],[47,75,237,3],[44,78,245,3],[41,81,252,3],[41,84,256,3],[41,87,261,3],[42,90,264,3],[43,93,268,3],[48,96,268,3],[43,99,278,3],[40,102,285,3],[39,105,291,3],[39,108,296,3],[39,111,301,3],[39,114,301,3],[38,117,302,3],[38,120,300,3],[38,123,298,3],[37,126,289,3],[37,129,288,3],[37,132,288,3],[36,135,289,3],[34,138,291,3],[31,141,294,3],[30,144,295,3],[30,147,295,3],[30,150,295,3],[30,153,295,3],[31,156,294,3],[30,159,297,3],[30,162,298,3],[30,165,299,3],[29,168,300,3],[29,171,300,3],[29,174,300,3],[28,177,302,3],[28,180,303,3],[27,183,306,3],[23,186,312,3],[17,189,318,3],[11,192,324,3],[4,195,331,3],[0,198,335,3],[0,201,335,3],[0,204,335,3],[0,207,335,3],[2,210,333,3],[12,213,323,3],[16,216,320,3],[17,219,319,3],[17,222,319,3],[17,225,320,3],[17,228,320,3],[16,231,321,3],[15,234,322,3],[15,237,323,3],[14,240,324,3],[13,243,325,3],[12,246,326,3],[12,249,327,3],[12,252,327,3],[12,255,327,3],[11,258,328,3],[10,261,329,3],[10,264,330,3],[9,267,333,3],[9,270,334,3],[7,273,338,3],[6,276,340,3],[6,279,340,3],[6,282,340,3],[6,285,340,3],[6,288,341,3],[5,291,342,3],[5,294,342,3],[5,297,343,3],[5,300,343,3],[4,303,344,3],[4,306,345,3],[4,309,345,3],[4,312,345,3],[3,315,346,3],[3,318,346,3],[3,321,346,3],[3,324,346,3],[7,327,342,3],[15,330,329,3],[21,333,317,3],[21,336,281,3],[321,336,9,3],[25,339,270,3],[32,342,23,3],[69,342,219,3],[40,345,7,3],[77,345,203,3],[83,348,191,3],[92,351,182,3],[98,354,175,3],[106,357,165,3],[114,360,149,3],[121,363,138,3],[128,366,124,3],[136,369,108,3],[143,372,32,3],[176,372,62,3],[151,375,15,3],[177,375,60,3],[184,378,45,3],[191,381,31,3],[199,384,14,1]]},{"x":379,"y":666,"w":336,"h":382,"maskRects":[[126,0,23,3],[123,3,28,3],[212,3,19,3],[122,6,31,3],[207,6,27,3],[122,9,31,3],[205,9,31,3],[122,12,34,3],[205,12,31,3],[122,15,42,3],[205,15,32,3],[122,18,49,3],[200,18,37,3],[121,21,59,3],[195,21,42,3],[119,24,118,3],[118,27,119,3],[116,30,123,3],[114,33,127,3],[112,36,132,3],[110,39,136,3],[108,42,141,3],[106,45,146,3],[104,48,150,3],[78,51,14,3],[102,51,155,3],[72,54,26,3],[100,54,160,3],[71,57,192,3],[70,60,196,3],[69,63,200,3],[69,66,203,3],[69,69,205,3],[69,72,208,3],[65,75,216,3],[60,78,223,3],[55,81,231,3],[51,84,238,3],[46,87,246,3],[41,90,254,3],[36,93,260,3],[31,96,265,3],[26,99,269,3],[21,102,272,3],[16,105,273,3],[11,108,284,3],[10,111,287,3],[10,114,287,3],[11,117,287,3],[13,120,285,3],[15,123,6,3],[24,123,275,3],[25,126,274,3],[25,129,274,3],[25,132,275,3],[25,135,275,3],[25,138,275,3],[25,141,276,3],[25,144,279,3],[25,147,281,3],[25,150,282,3],[25,153,283,3],[23,156,285,3],[21,159,287,3],[21,162,287,3],[21,165,287,3],[21,168,288,3],[20,171,289,3],[20,174,290,3],[19,177,291,3],[17,180,294,3],[15,183,296,3],[13,186,299,3],[13,189,299,3],[13,192,300,3],[13,195,300,3],[13,198,305,3],[13,201,310,3],[13,204,315,3],[13,207,316,3],[13,210,316,3],[13,213,315,3],[13,216,313,3],[12,219,308,3],[12,222,306,3],[11,225,307,3],[11,228,308,3],[11,231,308,3],[11,234,309,3],[11,237,309,3],[10,240,311,3],[10,243,314,3],[10,246,316,3],[10,249,318,3],[9,252,320,3],[9,255,320,3],[9,258,320,3],[7,261,323,3],[6,264,324,3],[5,267,326,3],[3,270,328,3],[3,273,329,3],[3,276,329,3],[3,279,330,3],[3,282,330,3],[2,285,331,3],[2,288,332,3],[1,291,334,3],[1,294,334,3],[1,297,334,3],[1,300,334,3],[0,303,335,3],[0,306,335,3],[0,309,336,3],[0,312,336,3],[0,315,336,3],[0,318,336,3],[0,321,336,3],[2,324,334,3],[9,327,327,3],[15,330,19,3],[43,330,291,3],[50,333,279,3],[56,336,268,3],[63,339,228,3],[297,339,19,3],[69,342,204,3],[70,345,196,3],[71,348,187,3],[73,351,177,3],[75,354,167,3],[77,357,156,3],[78,360,147,3],[82,363,135,3],[88,366,121,3],[95,369,106,3],[104,372,88,3],[111,375,76,3],[118,378,34,3],[125,381,17,1]]},{"x":741,"y":664,"w":338,"h":384,"maskRects":[[192,0,21,3],[111,3,5,3],[189,3,27,3],[104,6,22,3],[188,6,29,3],[102,9,27,3],[188,9,31,3],[100,12,30,3],[182,12,37,3],[99,15,32,3],[175,15,44,3],[99,18,33,3],[170,18,49,3],[99,21,39,3],[162,21,58,3],[99,24,47,3],[155,24,68,3],[98,27,127,3],[95,30,134,3],[92,33,139,3],[89,36,145,3],[86,39,151,3],[83,42,156,3],[79,45,163,3],[76,48,169,3],[73,51,175,3],[69,54,182,3],[66,57,188,3],[62,60,195,3],[59,63,201,3],[55,66,208,3],[51,69,215,3],[47,72,219,3],[44,75,222,3],[40,78,225,3],[35,81,228,3],[32,84,227,3],[27,87,228,3],[23,90,232,3],[23,93,232,3],[23,96,232,3],[25,99,230,3],[27,102,229,3],[273,102,10,3],[35,105,223,3],[267,105,23,3],[35,108,225,3],[265,108,27,3],[36,111,227,3],[265,111,27,3],[36,114,256,3],[36,117,256,3],[36,120,256,3],[35,123,257,3],[35,126,258,3],[33,129,260,3],[31,132,263,3],[29,135,270,3],[27,138,278,3],[25,141,285,3],[25,144,292,3],[25,147,297,3],[25,150,300,3],[25,153,300,3],[25,156,299,3],[25,159,297,3],[24,162,297,3],[24,165,288,3],[24,168,289,3],[23,171,290,3],[23,174,292,3],[23,177,292,3],[22,180,294,3],[22,183,294,3],[21,186,295,3],[21,189,295,3],[20,192,297,3],[20,195,297,3],[20,198,298,3],[20,201,298,3],[19,204,299,3],[19,207,300,3],[18,210,301,3],[18,213,302,3],[17,216,303,3],[15,219,305,3],[13,222,308,3],[11,225,310,3],[9,228,312,3],[9,231,313,3],[9,234,313,3],[9,237,313,3],[9,240,314,3],[9,243,314,3],[9,246,315,3],[8,249,316,3],[8,252,317,3],[8,255,320,3],[7,258,323,3],[7,261,325,3],[6,264,326,3],[6,267,326,3],[6,270,327,3],[5,273,328,3],[5,276,329,3],[4,279,330,3],[4,282,330,3],[4,285,331,3],[3,288,333,3],[3,291,333,3],[2,294,334,3],[2,297,335,3],[1,300,336,3],[1,303,337,3],[1,306,337,3],[0,309,338,3],[0,312,338,3],[0,315,338,3],[0,318,338,3],[0,321,338,3],[3,324,333,3],[11,327,317,3],[18,330,13,3],[47,330,275,3],[55,333,261,3],[62,336,254,3],[69,339,247,3],[76,342,235,3],[84,345,193,3],[286,345,18,3],[91,348,180,3],[98,351,165,3],[105,354,154,3],[112,357,146,3],[120,360,137,3],[127,363,124,3],[132,366,112,3],[132,369,101,3],[132,372,97,3],[138,375,51,3],[197,375,22,3],[145,378,36,3],[151,381,23,3]]},{"x":1113,"y":657,"w":320,"h":396,"maskRects":[[177,0,21,3],[174,3,26,3],[173,6,29,3],[172,9,31,3],[164,12,39,3],[100,15,5,3],[156,15,47,3],[92,18,21,3],[149,18,54,3],[89,21,28,3],[138,21,67,3],[88,24,30,3],[128,24,79,3],[88,27,121,3],[88,30,124,3],[88,33,126,3],[88,36,129,3],[86,39,133,3],[83,42,139,3],[79,45,145,3],[75,48,151,3],[71,51,157,3],[67,54,164,3],[242,54,18,3],[63,57,171,3],[239,57,24,3],[60,60,204,3],[55,63,209,3],[52,66,212,3],[47,69,218,3],[43,72,225,3],[40,75,230,3],[35,78,238,3],[31,81,245,3],[30,84,249,3],[30,87,252,3],[30,90,255,3],[32,93,255,3],[34,96,7,3],[42,96,248,3],[42,99,251,3],[42,102,254,3],[42,105,258,3],[42,108,260,3],[42,111,262,3],[42,114,262,3],[42,117,262,3],[39,120,264,3],[34,123,265,3],[28,126,261,3],[24,129,264,3],[24,132,264,3],[24,135,264,3],[26,138,262,3],[28,141,260,3],[35,144,254,3],[36,147,255,3],[35,150,256,3],[35,153,257,3],[33,156,260,3],[32,159,261,3],[31,162,264,3],[30,165,267,3],[29,168,269,3],[29,171,269,3],[28,174,270,3],[28,177,270,3],[27,180,271,3],[24,183,274,3],[22,186,276,3],[20,189,278,3],[20,192,279,3],[20,195,279,3],[20,198,280,3],[21,201,279,3],[21,204,279,3],[20,207,281,3],[20,210,281,3],[20,213,281,3],[19,216,283,3],[19,219,283,3],[19,222,283,3],[18,225,285,3],[18,228,285,3],[17,231,286,3],[17,234,287,3],[17,237,287,3],[16,240,288,3],[16,243,288,3],[16,246,289,3],[15,249,290,3],[15,252,291,3],[14,255,292,3],[14,258,293,3],[12,261,297,3],[10,264,301,3],[8,267,305,3],[7,270,306,3],[6,273,307,3],[6,276,308,3],[6,279,308,3],[6,282,308,3],[5,285,310,3],[5,288,310,3],[5,291,311,3],[4,294,312,3],[4,297,313,3],[3,300,314,3],[3,303,314,3],[3,306,315,3],[2,309,316,3],[2,312,317,3],[1,315,318,3],[1,318,319,3],[0,321,320,3],[0,324,320,3],[0,327,320,3],[0,330,320,3],[0,333,320,3],[0,336,314,3],[2,339,305,3],[9,342,292,3],[14,345,279,3],[20,348,12,3],[52,348,229,3],[59,351,214,3],[65,354,201,3],[72,357,187,3],[78,360,174,3],[84,363,159,3],[91,366,124,3],[216,366,26,3],[98,369,117,3],[104,372,105,3],[109,375,93,3],[109,378,74,3],[109,381,62,3],[111,384,60,3],[117,387,49,3],[123,390,35,3],[129,393,22,3]]}]},"workers-v11.png":{"columns":4,"rows":6,"frames":[{"x":206,"y":5,"w":110,"h":173},{"x":508,"y":4,"w":104,"h":174},{"x":813,"y":5,"w":110,"h":171},{"x":1137,"y":5,"w":102,"h":174},{"x":184,"y":200,"w":155,"h":152},{"x":495,"y":212,"w":156,"h":139},{"x":812,"y":198,"w":142,"h":154},{"x":1133,"y":181,"w":129,"h":168},{"x":200,"y":363,"w":128,"h":178},{"x":498,"y":364,"w":138,"h":180},{"x":808,"y":364,"w":147,"h":175},{"x":1134,"y":364,"w":126,"h":181},{"x":175,"y":549,"w":140,"h":176},{"x":509,"y":564,"w":144,"h":161},{"x":809,"y":571,"w":140,"h":154},{"x":1125,"y":563,"w":137,"h":161},{"x":200,"y":730,"w":114,"h":171},{"x":510,"y":729,"w":104,"h":173},{"x":812,"y":730,"w":105,"h":171},{"x":1137,"y":731,"w":107,"h":171},{"x":200,"y":905,"w":125,"h":178},{"x":499,"y":915,"w":144,"h":168},{"x":807,"y":918,"w":144,"h":166},{"x":1135,"y":909,"w":135,"h":174}]},"guards-v11.png":{"columns":4,"rows":4,"frames":[{"x":89,"y":35,"w":182,"h":273},{"x":402,"y":35,"w":182,"h":272},{"x":711,"y":37,"w":182,"h":270},{"x":1021,"y":35,"w":186,"h":272},{"x":82,"y":347,"w":187,"h":259},{"x":370,"y":326,"w":230,"h":291},{"x":671,"y":358,"w":294,"h":259},{"x":1015,"y":344,"w":186,"h":273},{"x":81,"y":666,"w":186,"h":254},{"x":391,"y":657,"w":180,"h":262},{"x":701,"y":662,"w":181,"h":258},{"x":1014,"y":661,"w":198,"h":260},{"x":83,"y":997,"w":195,"h":208},{"x":380,"y":938,"w":207,"h":272},{"x":684,"y":981,"w":270,"h":233},{"x":1012,"y":982,"w":173,"h":220}]},"missiles-v11.png":{"columns":4,"rows":4,"frames":[{"x":87,"y":19,"w":178,"h":279},{"x":407,"y":20,"w":164,"h":280},{"x":701,"y":21,"w":180,"h":278},{"x":1022,"y":21,"w":179,"h":278},{"x":89,"y":345,"w":185,"h":253},{"x":401,"y":336,"w":170,"h":266},{"x":692,"y":346,"w":219,"h":256},{"x":969,"y":345,"w":197,"h":257},{"x":85,"y":644,"w":163,"h":271},{"x":409,"y":646,"w":151,"h":274},{"x":703,"y":644,"w":171,"h":273},{"x":1012,"y":646,"w":166,"h":276},{"x":85,"y":962,"w":165,"h":255},{"x":377,"y":952,"w":205,"h":269},{"x":677,"y":956,"w":230,"h":263},{"x":992,"y":961,"w":186,"h":257}]},"barracks-directions-v11.png":{"columns":2,"rows":2,"frames":[{"x":52,"y":13,"w":542,"h":547},{"x":669,"y":14,"w":539,"h":545},{"x":37,"y":643,"w":547,"h":539},{"x":678,"y":638,"w":542,"h":544}]},"keep-tiers-directions-v11.png":{"columns":4,"rows":3,"frames":[{"x":77,"y":17,"w":228,"h":310,"maskRects":[[74,0,12,3],[73,3,13,3],[73,6,13,3],[74,9,15,3],[75,12,23,3],[76,15,27,3],[76,18,30,3],[76,21,35,3],[74,24,58,3],[73,27,63,3],[71,30,18,3],[91,30,47,3],[70,33,20,3],[95,33,45,3],[69,36,23,3],[98,36,46,3],[67,39,26,3],[103,39,18,3],[131,39,13,3],[66,42,29,3],[137,42,7,3],[64,45,33,3],[62,48,36,3],[61,51,39,3],[59,54,43,3],[57,57,47,3],[55,60,51,3],[52,63,57,3],[50,66,61,3],[47,69,67,3],[45,72,72,3],[41,75,79,3],[38,78,85,3],[36,81,88,3],[36,84,88,3],[36,87,88,3],[36,90,87,3],[179,90,13,3],[37,93,85,3],[176,93,21,3],[40,96,80,3],[167,96,38,3],[41,99,80,3],[165,99,46,3],[41,102,81,3],[123,102,7,3],[155,102,62,3],[41,105,95,3],[152,105,66,3],[42,108,96,3],[152,108,66,3],[43,111,175,3],[45,114,173,3],[47,117,171,3],[47,120,171,3],[43,123,175,3],[31,126,187,3],[27,129,190,3],[20,132,196,3],[17,135,198,3],[13,138,201,3],[13,141,201,3],[13,144,201,3],[13,147,201,3],[13,150,201,3],[13,153,201,3],[13,156,201,3],[13,159,201,3],[13,162,201,3],[14,165,199,3],[15,168,197,3],[16,171,195,3],[17,174,193,3],[17,177,192,3],[16,180,192,3],[16,183,192,3],[16,186,193,3],[16,189,193,3],[16,192,193,3],[16,195,193,3],[16,198,193,3],[16,201,193,3],[15,204,195,3],[15,207,195,3],[15,210,195,3],[14,213,197,3],[13,216,198,3],[13,219,200,3],[10,222,205,3],[10,225,205,3],[9,228,207,3],[8,231,208,3],[7,234,210,3],[4,237,215,3],[1,240,222,3],[0,243,228,3],[0,246,228,3],[0,249,228,3],[0,252,228,3],[1,255,226,3],[4,258,219,3],[11,261,204,3],[18,264,193,3],[25,267,181,3],[31,270,171,3],[36,273,162,3],[45,276,147,3],[53,279,133,3],[59,282,122,3],[65,285,113,3],[69,288,102,3],[75,291,91,3],[82,294,74,3],[88,297,63,3],[94,300,53,3],[100,303,42,3],[105,306,32,3],[112,309,20,1]]},{"x":425,"y":16,"w":236,"h":306,"maskRects":[[134,0,12,3],[134,3,12,3],[134,6,12,3],[134,9,13,3],[135,12,20,3],[135,15,26,3],[136,18,29,3],[135,21,33,3],[134,24,38,3],[133,27,45,3],[131,30,65,3],[130,33,19,3],[152,33,47,3],[129,36,22,3],[155,36,46,3],[127,39,26,3],[158,39,45,3],[125,42,29,3],[162,42,44,3],[124,45,32,3],[193,45,13,3],[122,48,35,3],[199,48,7,3],[121,51,38,3],[119,54,42,3],[94,57,15,3],[117,57,46,3],[86,60,79,3],[79,63,89,3],[74,66,96,3],[74,69,99,3],[73,72,103,3],[73,75,106,3],[73,78,108,3],[73,81,109,3],[37,84,15,3],[73,84,109,3],[28,87,27,3],[73,87,109,3],[23,90,39,3],[75,90,106,3],[16,93,47,3],[76,93,103,3],[10,96,62,3],[76,96,101,3],[9,99,65,3],[76,99,101,3],[9,102,168,3],[9,105,168,3],[9,108,166,3],[9,111,164,3],[9,114,163,3],[8,117,176,3],[8,120,180,3],[9,123,192,3],[10,126,195,3],[11,129,204,3],[12,132,208,3],[13,135,207,3],[13,138,207,3],[13,141,207,3],[13,144,207,3],[13,147,207,3],[13,150,207,3],[12,153,209,3],[12,156,209,3],[13,159,208,3],[13,162,206,3],[14,165,204,3],[15,168,202,3],[16,171,201,3],[16,174,201,3],[16,177,201,3],[16,180,202,3],[16,183,202,3],[16,186,202,3],[16,189,202,3],[15,192,203,3],[15,195,203,3],[14,198,204,3],[14,201,204,3],[13,204,206,3],[13,207,206,3],[10,210,210,3],[10,213,211,3],[9,216,214,3],[8,219,215,3],[7,222,217,3],[6,225,220,3],[4,228,225,3],[0,231,231,3],[0,234,234,3],[0,237,236,3],[0,240,236,3],[0,243,236,3],[3,246,233,3],[6,249,229,3],[10,252,222,3],[15,255,212,3],[19,258,201,3],[23,261,188,3],[29,264,176,3],[34,267,164,3],[38,270,152,3],[42,273,141,3],[47,276,131,3],[53,279,118,3],[57,282,106,3],[62,285,96,3],[66,288,88,3],[70,291,78,3],[76,294,64,3],[81,297,52,3],[86,300,40,3],[90,303,30,3]]},{"x":791,"y":16,"w":224,"h":314,"maskRects":[[143,0,12,3],[143,3,13,3],[143,6,13,3],[142,9,14,3],[135,12,19,3],[127,15,27,3],[124,18,30,3],[120,21,34,3],[116,24,40,3],[97,27,60,3],[92,30,67,3],[90,33,46,3],[140,33,19,3],[88,36,46,3],[138,36,22,3],[86,39,45,3],[137,39,25,3],[84,42,17,3],[108,42,17,3],[135,42,28,3],[83,45,12,3],[134,45,32,3],[83,48,8,3],[132,48,36,3],[130,51,40,3],[128,54,43,3],[126,57,47,3],[124,60,52,3],[122,63,56,3],[120,66,60,3],[117,69,66,3],[114,72,72,3],[111,75,78,3],[108,78,84,3],[107,81,86,3],[107,84,86,3],[107,87,86,3],[107,90,85,3],[109,93,81,3],[108,96,81,3],[103,99,85,3],[67,102,9,3],[94,102,94,3],[62,105,20,3],[90,105,98,3],[61,108,21,3],[83,108,104,3],[61,111,124,3],[41,114,12,3],[61,114,123,3],[36,117,21,3],[61,117,121,3],[28,120,154,3],[23,123,159,3],[17,126,165,3],[11,129,171,3],[11,132,171,3],[11,135,180,3],[10,138,187,3],[10,141,188,3],[10,144,199,3],[10,147,202,3],[10,150,202,3],[10,153,203,3],[10,156,203,3],[11,159,202,3],[11,162,202,3],[11,165,202,3],[11,168,202,3],[11,171,202,3],[12,174,201,3],[13,177,198,3],[15,180,195,3],[16,183,193,3],[17,186,191,3],[17,189,191,3],[17,192,191,3],[17,195,191,3],[17,198,191,3],[16,201,192,3],[16,204,193,3],[16,207,193,3],[15,210,194,3],[15,213,194,3],[15,216,195,3],[14,219,196,3],[13,222,197,3],[11,225,200,3],[10,228,203,3],[10,231,204,3],[8,234,206,3],[8,237,207,3],[6,240,210,3],[3,243,214,3],[0,246,221,3],[0,249,223,3],[0,252,224,3],[0,255,224,3],[1,258,223,3],[5,261,219,3],[11,264,212,3],[17,267,202,3],[22,270,190,3],[27,273,180,3],[32,276,168,3],[40,279,153,3],[46,282,143,3],[54,285,129,3],[60,288,119,3],[65,291,110,3],[71,294,97,3],[77,297,84,3],[84,300,74,3],[90,303,62,3],[95,306,52,3],[102,309,39,3],[109,312,24,2]]},{"x":1163,"y":16,"w":226,"h":313,"maskRects":[[72,0,11,3],[71,3,13,3],[71,6,13,3],[71,9,13,3],[73,12,18,3],[73,15,22,3],[73,18,25,3],[73,21,28,3],[72,24,32,3],[71,27,38,3],[68,30,52,3],[68,33,55,3],[66,36,59,3],[65,39,61,3],[63,42,29,3],[95,42,32,3],[62,45,31,3],[114,45,15,3],[60,48,35,3],[118,48,12,3],[58,51,39,3],[122,51,8,3],[57,54,41,3],[55,57,45,3],[53,60,50,3],[50,63,55,3],[47,66,61,3],[44,69,67,3],[41,72,73,3],[39,75,78,3],[36,78,83,3],[35,81,84,3],[35,84,84,3],[35,87,84,3],[37,90,81,3],[39,93,77,3],[40,96,80,3],[40,99,84,3],[40,102,95,3],[41,105,96,3],[42,108,104,3],[44,111,107,3],[153,111,16,3],[45,114,127,3],[47,117,126,3],[47,120,126,3],[47,123,126,3],[47,126,143,3],[47,129,147,3],[42,132,159,3],[39,135,165,3],[29,138,184,3],[26,141,188,3],[18,144,196,3],[12,147,202,3],[11,150,203,3],[11,153,203,3],[11,156,204,3],[11,159,204,3],[11,162,204,3],[11,165,203,3],[11,168,203,3],[11,171,203,3],[11,174,203,3],[12,177,202,3],[13,180,199,3],[14,183,197,3],[15,186,195,3],[15,189,194,3],[15,192,194,3],[15,195,194,3],[15,198,194,3],[15,201,194,3],[15,204,195,3],[15,207,195,3],[14,210,196,3],[14,213,196,3],[14,216,197,3],[13,219,198,3],[12,222,200,3],[10,225,205,3],[9,228,206,3],[9,231,207,3],[8,234,209,3],[7,237,211,3],[6,240,215,3],[2,243,222,3],[0,246,226,3],[0,249,226,3],[0,252,226,3],[0,255,226,3],[1,258,224,3],[5,261,215,3],[10,264,204,3],[15,267,194,3],[21,270,184,3],[25,273,175,3],[30,276,162,3],[37,279,149,3],[43,282,135,3],[47,285,127,3],[52,288,115,3],[57,291,104,3],[63,294,91,3],[69,297,77,3],[73,300,67,3],[77,303,56,3],[82,306,45,3],[88,309,33,3],[94,312,18,1]]},{"x":44,"y":343,"w":290,"h":331,"maskRects":[[57,0,10,3],[57,3,10,3],[57,6,14,3],[59,9,20,3],[59,12,24,3],[58,15,30,3],[57,18,44,3],[56,21,47,3],[54,24,17,3],[73,24,33,3],[52,27,21,3],[76,27,30,3],[229,27,8,3],[51,30,24,3],[97,30,9,3],[228,30,10,3],[49,33,27,3],[228,33,10,3],[47,36,31,3],[228,36,16,3],[46,39,34,3],[229,39,22,3],[43,42,39,3],[229,42,27,3],[41,45,43,3],[229,45,45,3],[39,48,48,3],[228,48,51,3],[37,51,52,3],[152,51,16,3],[227,51,54,3],[34,54,58,3],[126,54,6,3],[147,54,25,3],[225,54,16,3],[243,54,41,3],[31,57,64,3],[121,57,18,3],[147,57,25,3],[224,57,18,3],[246,57,40,3],[28,60,70,3],[120,60,25,3],[147,60,25,3],[222,60,22,3],[256,60,6,3],[276,60,10,3],[26,63,74,3],[112,63,60,3],[221,63,24,3],[25,66,75,3],[110,66,62,3],[219,66,28,3],[25,69,75,3],[104,69,67,3],[217,69,32,3],[26,72,149,3],[215,72,35,3],[27,75,152,3],[213,75,40,3],[29,78,163,3],[211,78,44,3],[29,81,166,3],[209,81,48,3],[29,84,230,3],[29,87,233,3],[29,90,236,3],[30,93,238,3],[32,96,238,3],[33,99,238,3],[34,102,237,3],[34,105,237,3],[34,108,237,3],[34,111,235,3],[27,114,241,3],[25,117,243,3],[19,120,249,3],[17,123,251,3],[17,126,251,3],[17,129,250,3],[17,132,251,3],[17,135,255,3],[17,138,256,3],[17,141,256,3],[17,144,256,3],[17,147,256,3],[18,150,255,3],[19,153,254,3],[20,156,253,3],[21,159,252,3],[21,162,250,3],[21,165,249,3],[21,168,248,3],[20,171,248,3],[20,174,248,3],[20,177,248,3],[20,180,248,3],[19,183,249,3],[19,186,249,3],[19,189,249,3],[19,192,250,3],[18,195,251,3],[18,198,251,3],[18,201,252,3],[17,204,253,3],[17,207,253,3],[16,210,255,3],[14,213,257,3],[12,216,260,3],[12,219,260,3],[11,222,264,3],[10,225,266,3],[9,228,268,3],[8,231,270,3],[7,234,272,3],[4,237,276,3],[1,240,280,3],[0,243,283,3],[0,246,286,3],[0,249,288,3],[0,252,290,3],[0,255,290,3],[3,258,287,3],[10,261,280,3],[16,264,274,3],[22,267,264,3],[28,270,253,3],[37,273,241,3],[51,276,221,3],[56,279,211,3],[63,282,201,3],[70,285,191,3],[76,288,178,3],[88,291,159,3],[98,294,140,3],[102,297,130,3],[108,300,122,3],[113,303,116,3],[118,306,109,3],[126,309,95,3],[132,312,85,3],[139,315,74,3],[145,318,63,3],[149,321,54,3],[158,324,41,3],[164,327,30,3],[172,330,17,1]]},{"x":405,"y":343,"w":293,"h":331,"maskRects":[[64,0,10,3],[64,3,10,3],[64,6,16,3],[65,9,21,3],[65,12,25,3],[65,15,39,3],[64,18,43,3],[62,21,47,3],[61,24,17,3],[81,24,28,3],[59,27,21,3],[103,27,6,3],[227,27,8,3],[58,30,23,3],[226,30,10,3],[56,33,27,3],[226,33,10,3],[54,36,30,3],[226,36,15,3],[52,39,34,3],[227,39,22,3],[50,42,38,3],[227,42,26,3],[48,45,43,3],[227,45,31,3],[46,48,47,3],[226,48,49,3],[44,51,51,3],[158,51,5,3],[225,51,53,3],[41,54,57,3],[154,54,15,3],[223,54,16,3],[242,54,39,3],[38,57,63,3],[147,57,26,3],[222,57,18,3],[245,57,39,3],[35,60,69,3],[147,60,26,3],[221,60,20,3],[249,60,16,3],[272,60,12,3],[33,63,72,3],[147,63,26,3],[219,63,24,3],[278,63,6,3],[33,66,72,3],[147,66,26,3],[218,66,26,3],[33,69,72,3],[142,69,31,3],[216,69,30,3],[33,72,72,3],[134,72,38,3],[214,72,34,3],[34,75,69,3],[129,75,49,3],[212,75,38,3],[36,78,66,3],[121,78,6,3],[129,78,55,3],[210,78,42,3],[36,81,66,3],[115,81,76,3],[208,81,46,3],[36,84,66,3],[114,84,82,3],[205,84,51,3],[36,87,161,3],[198,87,60,3],[36,90,225,3],[37,93,228,3],[39,96,228,3],[40,99,229,3],[41,102,228,3],[41,105,228,3],[35,108,234,3],[32,111,235,3],[24,114,241,3],[20,117,245,3],[19,120,246,3],[19,123,253,3],[19,126,256,3],[19,129,256,3],[19,132,256,3],[19,135,256,3],[19,138,256,3],[19,141,257,3],[20,144,256,3],[21,147,255,3],[22,150,254,3],[23,153,252,3],[24,156,250,3],[24,159,248,3],[23,162,248,3],[23,165,248,3],[23,168,248,3],[23,171,248,3],[23,174,248,3],[22,177,249,3],[22,180,250,3],[21,183,251,3],[21,186,251,3],[21,189,251,3],[20,192,253,3],[20,195,253,3],[19,198,254,3],[18,201,256,3],[16,204,258,3],[14,207,261,3],[14,210,262,3],[13,213,265,3],[11,216,268,3],[10,219,270,3],[9,222,272,3],[8,225,274,3],[7,228,276,3],[3,231,281,3],[0,234,285,3],[0,237,288,3],[0,240,291,3],[0,243,293,3],[0,246,293,3],[4,249,289,3],[9,252,284,3],[14,255,278,3],[20,258,269,3],[26,261,260,3],[32,264,251,3],[42,267,238,3],[46,270,231,3],[51,273,222,3],[57,276,209,3],[62,279,199,3],[68,282,189,3],[75,285,178,3],[81,288,166,3],[88,291,153,3],[95,294,140,3],[100,297,128,3],[104,300,118,3],[107,303,107,3],[110,306,99,3],[117,309,88,3],[120,312,80,3],[123,315,73,3],[127,318,65,3],[133,321,54,3],[139,324,41,3],[144,327,31,3],[150,330,20,1]]},{"x":763,"y":352,"w":297,"h":327,"maskRects":[[61,0,10,3],[61,3,10,3],[61,6,17,3],[62,9,22,3],[62,12,26,3],[61,15,40,3],[60,18,46,3],[59,21,49,3],[231,21,8,3],[57,24,18,3],[77,24,34,3],[230,24,11,3],[56,27,21,3],[83,27,13,3],[100,27,11,3],[230,27,11,3],[54,30,24,3],[106,30,5,3],[230,30,14,3],[52,33,29,3],[231,33,21,3],[50,36,33,3],[231,36,26,3],[48,39,37,3],[231,39,31,3],[46,42,41,3],[169,42,12,3],[230,42,49,3],[44,45,45,3],[165,45,20,3],[229,45,53,3],[41,48,51,3],[128,48,8,3],[158,48,34,3],[227,48,16,3],[245,48,40,3],[38,51,56,3],[121,51,21,3],[152,51,46,3],[226,51,18,3],[248,51,38,3],[36,54,61,3],[119,54,25,3],[152,54,47,3],[224,54,22,3],[254,54,12,3],[276,54,10,3],[32,57,68,3],[119,57,89,3],[223,57,24,3],[30,60,72,3],[119,60,92,3],[221,60,28,3],[30,63,73,3],[119,63,132,3],[30,66,73,3],[120,66,133,3],[30,69,73,3],[119,69,136,3],[30,72,71,3],[108,72,148,3],[32,75,68,3],[107,75,152,3],[33,78,228,3],[33,81,231,3],[33,84,234,3],[33,87,237,3],[33,90,238,3],[35,93,236,3],[36,96,235,3],[38,99,232,3],[38,102,231,3],[38,105,230,3],[38,108,230,3],[31,111,237,3],[29,114,239,3],[20,117,248,3],[19,120,248,3],[19,123,249,3],[19,126,254,3],[19,129,257,3],[19,132,257,3],[19,135,257,3],[19,138,257,3],[19,141,257,3],[20,144,257,3],[21,147,256,3],[22,150,255,3],[23,153,253,3],[23,156,252,3],[23,159,250,3],[23,162,249,3],[23,165,249,3],[22,168,250,3],[22,171,250,3],[22,174,250,3],[21,177,252,3],[21,180,252,3],[20,183,253,3],[20,186,253,3],[20,189,254,3],[19,192,255,3],[18,195,256,3],[17,198,258,3],[15,201,260,3],[14,204,262,3],[13,207,263,3],[12,210,265,3],[10,213,270,3],[9,216,272,3],[8,219,274,3],[7,222,276,3],[5,225,279,3],[2,228,283,3],[0,231,287,3],[0,234,288,3],[0,237,293,3],[0,240,296,3],[1,243,296,3],[4,246,293,3],[9,249,288,3],[14,252,283,3],[19,255,277,3],[23,258,267,3],[28,261,259,3],[34,264,251,3],[39,267,244,3],[45,270,234,3],[50,273,224,3],[55,276,214,3],[59,279,206,3],[67,282,191,3],[73,285,178,3],[79,288,155,3],[84,291,140,3],[89,294,133,3],[95,297,126,3],[102,300,117,3],[108,303,109,3],[119,306,92,3],[123,309,84,3],[130,312,73,3],[136,315,61,3],[142,318,51,3],[148,321,39,3],[154,324,28,3]]},{"x":1134,"y":343,"w":278,"h":336,"maskRects":[[205,0,10,3],[205,3,10,3],[202,6,13,3],[196,9,18,3],[191,12,23,3],[187,15,27,3],[181,18,34,3],[172,21,45,3],[170,24,48,3],[168,27,30,3],[200,27,20,3],[167,30,27,3],[198,30,23,3],[167,33,9,3],[196,33,27,3],[56,36,10,3],[194,36,31,3],[55,39,12,3],[193,39,33,3],[55,42,12,3],[190,42,39,3],[46,45,20,3],[188,45,43,3],[40,48,25,3],[186,48,47,3],[37,51,28,3],[111,51,7,3],[184,51,51,3],[30,54,36,3],[106,54,17,3],[181,54,56,3],[15,57,52,3],[98,57,26,3],[146,57,10,3],[178,57,63,3],[12,60,57,3],[93,60,42,3],[140,60,22,3],[175,60,69,3],[11,63,40,3],[52,63,18,3],[86,63,50,3],[139,63,24,3],[173,63,73,3],[8,66,39,3],[51,66,21,3],[82,66,81,3],[173,66,73,3],[8,69,12,3],[29,69,13,3],[49,69,24,3],[82,69,81,3],[173,69,73,3],[8,72,6,3],[47,72,28,3],[82,72,80,3],[173,72,73,3],[45,75,124,3],[174,75,71,3],[43,78,131,3],[176,78,67,3],[41,81,202,3],[40,84,203,3],[38,87,205,3],[35,90,208,3],[32,93,210,3],[29,96,212,3],[26,99,214,3],[24,102,214,3],[23,105,215,3],[23,108,215,3],[23,111,218,3],[24,114,222,3],[25,117,227,3],[26,120,230,3],[27,123,230,3],[27,126,230,3],[27,129,230,3],[27,132,230,3],[23,135,234,3],[20,138,237,3],[20,141,237,3],[20,144,237,3],[20,147,237,3],[20,150,236,3],[19,153,236,3],[19,156,235,3],[19,159,234,3],[20,162,233,3],[21,165,232,3],[22,168,231,3],[23,171,230,3],[24,174,230,3],[23,177,231,3],[23,180,231,3],[23,183,231,3],[23,186,232,3],[22,189,233,3],[22,192,234,3],[22,195,234,3],[21,198,236,3],[21,201,236,3],[21,204,237,3],[20,207,238,3],[20,210,240,3],[19,213,242,3],[18,216,246,3],[17,219,247,3],[14,222,251,3],[13,225,253,3],[13,228,254,3],[12,231,257,3],[10,234,260,3],[9,237,264,3],[8,240,268,3],[7,243,271,3],[5,246,273,3],[1,249,277,3],[0,252,278,3],[0,255,278,3],[0,258,274,3],[0,261,269,3],[3,264,263,3],[6,267,256,3],[8,270,250,3],[10,273,243,3],[11,276,235,3],[13,279,228,3],[18,282,219,3],[22,285,211,3],[27,288,201,3],[33,291,189,3],[38,294,179,3],[43,297,169,3],[62,300,144,3],[68,303,134,3],[76,306,120,3],[85,309,105,3],[87,312,98,3],[89,315,92,3],[94,318,80,3],[99,321,71,3],[104,324,59,3],[110,327,48,3],[115,330,38,3],[119,333,28,3]]},{"x":14,"y":665,"w":338,"h":406,"maskRects":[[121,0,8,3],[121,3,9,3],[121,6,16,3],[121,9,22,3],[122,12,31,3],[120,15,36,3],[118,18,39,3],[117,21,16,3],[136,21,21,3],[116,24,19,3],[114,27,23,3],[275,27,9,3],[112,30,27,3],[275,30,9,3],[111,33,30,3],[275,33,16,3],[109,36,34,3],[276,36,20,3],[106,39,39,3],[276,39,26,3],[104,42,43,3],[275,42,38,3],[101,45,49,3],[274,45,42,3],[98,48,55,3],[273,48,14,3],[288,48,30,3],[96,51,59,3],[271,51,18,3],[293,51,25,3],[94,54,63,3],[269,54,22,3],[48,57,7,3],[94,57,63,3],[267,57,26,3],[47,60,9,3],[94,60,63,3],[171,60,9,3],[265,60,29,3],[47,63,11,3],[95,63,61,3],[166,63,25,3],[263,63,33,3],[47,66,20,3],[97,66,57,3],[163,66,31,3],[261,66,37,3],[48,69,22,3],[97,69,57,3],[156,69,51,3],[214,69,6,3],[259,69,41,3],[48,72,37,3],[97,72,128,3],[257,72,45,3],[47,75,41,3],[97,75,131,3],[255,75,49,3],[45,78,46,3],[97,78,134,3],[252,78,56,3],[44,81,15,3],[62,81,29,3],[98,81,133,3],[249,81,61,3],[42,84,19,3],[85,84,6,3],[100,84,131,3],[246,84,66,3],[41,87,22,3],[101,87,130,3],[245,87,67,3],[39,90,26,3],[101,90,130,3],[245,90,67,3],[37,93,30,3],[101,93,131,3],[245,93,67,3],[36,96,33,3],[101,96,131,3],[236,96,75,3],[34,99,36,3],[101,99,209,3],[32,102,40,3],[98,102,212,3],[30,105,44,3],[93,105,217,3],[28,108,49,3],[89,108,221,3],[25,111,55,3],[89,111,221,3],[22,114,61,3],[89,114,220,3],[19,117,67,3],[89,117,219,3],[17,120,289,3],[15,123,291,3],[15,126,291,3],[15,129,291,3],[16,132,290,3],[17,135,289,3],[18,138,288,3],[18,141,288,3],[19,144,287,3],[19,147,292,3],[19,150,299,3],[20,153,302,3],[21,156,302,3],[23,159,300,3],[24,162,299,3],[24,165,299,3],[24,168,299,3],[24,171,299,3],[24,174,299,3],[23,177,300,3],[19,180,304,3],[16,183,307,3],[15,186,308,3],[15,189,307,3],[15,192,305,3],[15,195,304,3],[15,198,303,3],[15,201,303,3],[15,204,303,3],[15,207,303,3],[15,210,303,3],[16,213,302,3],[18,216,300,3],[19,219,300,3],[20,222,299,3],[21,225,298,3],[21,228,298,3],[21,231,298,3],[21,234,298,3],[21,237,299,3],[21,240,299,3],[21,243,299,3],[21,246,299,3],[21,249,300,3],[20,252,301,3],[20,255,302,3],[19,258,304,3],[19,261,306,3],[18,264,308,3],[16,267,310,3],[15,270,313,3],[14,273,315,3],[13,276,317,3],[12,279,319,3],[11,282,321,3],[10,285,324,3],[9,288,328,3],[7,291,331,3],[3,294,335,3],[1,297,337,3],[0,300,338,3],[0,303,338,3],[0,306,335,3],[0,309,332,3],[2,312,326,3],[5,315,320,3],[5,318,318,3],[6,321,314,3],[10,324,307,3],[16,327,297,3],[23,330,287,3],[30,333,278,3],[35,336,270,3],[41,339,260,3],[60,342,236,3],[65,345,228,3],[70,348,221,3],[78,351,209,3],[84,354,198,3],[96,357,180,3],[108,360,161,3],[115,363,152,3],[123,366,143,3],[127,369,139,3],[131,372,134,3],[139,375,124,3],[145,378,115,3],[153,381,104,3],[161,384,93,3],[166,387,84,3],[173,390,74,3],[181,393,62,3],[188,396,51,3],[194,399,42,3],[201,402,32,3],[209,405,20,1]]},{"x":382,"y":666,"w":336,"h":398,"maskRects":[[134,0,8,3],[134,3,10,3],[134,6,17,3],[135,9,19,3],[134,12,30,3],[133,15,34,3],[131,18,37,3],[130,21,17,3],[148,21,20,3],[129,24,20,3],[127,27,23,3],[125,30,27,3],[123,33,31,3],[49,36,7,3],[121,36,35,3],[279,36,7,3],[48,39,10,3],[119,39,39,3],[278,39,10,3],[48,42,10,3],[116,42,44,3],[278,42,10,3],[48,45,17,3],[114,45,50,3],[278,45,17,3],[49,48,20,3],[111,48,55,3],[279,48,20,3],[49,51,24,3],[108,51,61,3],[279,51,24,3],[48,54,36,3],[107,54,63,3],[278,54,37,3],[47,57,40,3],[107,57,63,3],[277,57,41,3],[45,60,45,3],[107,60,63,3],[176,60,12,3],[275,60,15,3],[291,60,30,3],[44,63,18,3],[64,63,26,3],[108,63,61,3],[171,63,21,3],[215,63,12,3],[273,63,18,3],[294,63,27,3],[43,66,21,3],[82,66,8,3],[110,66,57,3],[171,66,21,3],[209,66,23,3],[272,66,21,3],[314,66,7,3],[41,69,24,3],[110,69,82,3],[202,69,38,3],[270,69,25,3],[39,72,28,3],[110,72,82,3],[200,72,42,3],[268,72,28,3],[38,75,31,3],[104,75,88,3],[200,75,42,3],[266,75,33,3],[36,78,35,3],[100,78,93,3],[200,78,42,3],[264,78,37,3],[34,81,39,3],[100,81,93,3],[200,81,42,3],[262,81,40,3],[32,84,43,3],[100,84,93,3],[200,84,42,3],[261,84,43,3],[29,87,48,3],[100,87,93,3],[200,87,42,3],[259,87,48,3],[27,90,53,3],[100,90,93,3],[200,90,42,3],[256,90,53,3],[24,93,59,3],[99,93,95,3],[202,93,38,3],[253,93,59,3],[21,96,64,3],[99,96,95,3],[200,96,40,3],[250,96,65,3],[19,99,69,3],[99,99,95,3],[197,99,121,3],[17,102,73,3],[95,102,224,3],[17,105,73,3],[91,105,228,3],[17,108,302,3],[17,111,301,3],[19,114,297,3],[20,117,296,3],[20,120,296,3],[20,123,296,3],[20,126,296,3],[20,129,295,3],[22,132,292,3],[23,135,290,3],[24,138,288,3],[25,141,286,3],[26,144,285,3],[26,147,285,3],[26,150,285,3],[26,153,285,3],[26,156,285,3],[26,159,285,3],[26,162,285,3],[26,165,291,3],[25,168,296,3],[19,171,303,3],[15,174,307,3],[15,177,307,3],[15,180,307,3],[15,183,307,3],[15,186,307,3],[15,189,307,3],[15,192,307,3],[15,195,307,3],[15,198,306,3],[15,201,305,3],[16,204,302,3],[18,207,299,3],[19,210,297,3],[20,213,296,3],[21,216,295,3],[21,219,295,3],[21,222,295,3],[21,225,296,3],[21,228,296,3],[21,231,296,3],[20,234,297,3],[20,237,297,3],[20,240,297,3],[20,243,297,3],[19,246,299,3],[19,249,299,3],[19,252,299,3],[19,255,300,3],[18,258,301,3],[17,261,303,3],[17,264,304,3],[15,267,307,3],[14,270,309,3],[13,273,311,3],[12,276,313,3],[11,279,315,3],[10,282,317,3],[9,285,319,3],[7,288,322,3],[3,291,330,3],[1,294,335,3],[0,297,336,3],[0,300,336,3],[0,303,336,3],[0,306,335,3],[2,309,328,3],[5,312,320,3],[10,315,310,3],[16,318,299,3],[21,321,290,3],[27,324,277,3],[33,327,265,3],[39,330,245,3],[47,333,223,3],[56,336,213,3],[64,339,205,3],[70,342,198,3],[76,345,188,3],[81,348,180,3],[86,351,169,3],[90,354,160,3],[96,357,148,3],[99,360,138,3],[104,363,127,3],[111,366,112,3],[114,369,109,3],[116,372,104,3],[120,375,96,3],[126,378,86,3],[131,381,76,3],[135,384,67,3],[140,387,57,3],[146,390,45,3],[152,393,33,3],[157,396,24,2]]},{"x":740,"y":668,"w":341,"h":401,"maskRects":[[139,0,9,3],[139,3,9,3],[139,6,17,3],[140,9,20,3],[140,12,30,3],[139,15,34,3],[137,18,38,3],[136,21,15,3],[152,21,23,3],[134,24,19,3],[170,24,5,3],[133,27,22,3],[131,30,25,3],[129,33,29,3],[127,36,34,3],[285,36,9,3],[126,39,37,3],[285,39,9,3],[123,42,42,3],[285,42,16,3],[121,45,46,3],[286,45,20,3],[118,48,52,3],[286,48,25,3],[47,51,8,3],[115,51,58,3],[285,51,37,3],[46,54,9,3],[113,54,62,3],[178,54,6,3],[284,54,41,3],[46,57,9,3],[112,57,77,3],[190,57,17,3],[282,57,15,3],[298,57,28,3],[46,60,18,3],[112,60,97,3],[281,60,16,3],[302,60,12,3],[315,60,11,3],[47,63,21,3],[113,63,96,3],[279,63,20,3],[47,66,26,3],[114,66,102,3],[278,66,23,3],[46,69,39,3],[115,69,113,3],[276,69,27,3],[45,72,43,3],[115,72,117,3],[274,72,31,3],[43,75,15,3],[60,75,30,3],[115,75,117,3],[272,75,35,3],[42,78,18,3],[64,78,13,3],[80,78,10,3],[115,78,117,3],[270,78,38,3],[40,81,22,3],[116,81,116,3],[268,81,42,3],[38,84,26,3],[117,84,115,3],[266,84,47,3],[37,87,28,3],[119,87,113,3],[263,87,52,3],[35,90,32,3],[119,90,113,3],[260,90,58,3],[32,93,37,3],[104,93,8,3],[119,93,113,3],[257,93,64,3],[31,96,40,3],[98,96,134,3],[255,96,69,3],[29,99,44,3],[95,99,137,3],[253,99,72,3],[27,102,48,3],[95,102,135,3],[244,102,81,3],[24,105,54,3],[94,105,140,3],[239,105,86,3],[21,108,60,3],[94,108,144,3],[239,108,85,3],[18,111,66,3],[94,111,229,3],[16,114,71,3],[93,114,229,3],[14,117,74,3],[89,117,233,3],[14,120,308,3],[14,123,308,3],[15,126,307,3],[16,129,305,3],[17,132,303,3],[17,135,301,3],[17,138,300,3],[17,141,300,3],[18,144,299,3],[19,147,298,3],[20,150,297,3],[22,153,295,3],[23,156,294,3],[19,159,298,3],[17,162,303,3],[17,165,307,3],[17,168,311,3],[16,171,312,3],[13,174,315,3],[12,177,316,3],[12,180,316,3],[12,183,316,3],[12,186,316,3],[12,189,316,3],[12,192,316,3],[12,195,315,3],[12,198,314,3],[12,201,313,3],[13,204,311,3],[15,207,308,3],[16,210,306,3],[18,213,304,3],[18,216,305,3],[18,219,305,3],[18,222,305,3],[18,225,305,3],[18,228,305,3],[18,231,305,3],[18,234,305,3],[18,237,306,3],[18,240,306,3],[18,243,306,3],[17,246,307,3],[17,249,307,3],[17,252,308,3],[17,255,308,3],[16,258,310,3],[16,261,311,3],[15,264,314,3],[13,267,317,3],[12,270,319,3],[12,273,320,3],[11,276,322,3],[10,279,324,3],[9,282,328,3],[8,285,331,3],[4,288,337,3],[1,291,340,3],[0,294,341,3],[0,297,341,3],[0,300,341,3],[0,303,341,3],[0,306,339,3],[1,309,334,3],[6,312,323,3],[11,315,314,3],[15,318,306,3],[20,321,295,3],[27,324,283,3],[31,327,272,3],[36,330,260,3],[42,333,250,3],[47,336,241,3],[54,339,227,3],[61,342,216,3],[66,345,207,3],[71,348,195,3],[76,351,185,3],[80,354,175,3],[87,357,161,3],[93,360,152,3],[103,363,137,3],[109,366,124,3],[112,369,116,3],[114,372,108,3],[116,375,102,3],[119,378,95,3],[124,381,86,3],[128,384,77,3],[134,387,64,3],[139,390,54,3],[144,393,44,3],[148,396,34,3],[154,399,23,2]]},{"x":1110,"y":667,"w":325,"h":401,"maskRects":[[192,0,8,3],[192,3,9,3],[192,6,17,3],[192,9,21,3],[192,12,32,3],[190,15,37,3],[189,18,13,3],[203,18,25,3],[187,21,17,3],[207,21,21,3],[186,24,20,3],[184,27,24,3],[51,30,5,3],[182,30,28,3],[48,33,10,3],[181,33,30,3],[48,36,10,3],[179,36,34,3],[48,39,14,3],[177,39,38,3],[49,42,19,3],[174,42,44,3],[49,45,23,3],[171,45,50,3],[49,48,35,3],[169,48,54,3],[48,51,38,3],[166,51,60,3],[47,54,41,3],[128,54,8,3],[164,54,63,3],[46,57,15,3],[63,57,25,3],[124,57,16,3],[156,57,71,3],[266,57,7,3],[44,60,19,3],[115,60,34,3],[153,60,74,3],[265,60,9,3],[42,63,22,3],[109,63,118,3],[265,63,9,3],[41,66,25,3],[103,66,122,3],[265,66,16,3],[39,69,29,3],[102,69,123,3],[266,69,20,3],[37,72,32,3],[102,72,123,3],[265,72,24,3],[35,75,37,3],[102,75,123,3],[264,75,36,3],[33,78,41,3],[102,78,123,3],[263,78,40,3],[31,81,45,3],[103,81,121,3],[262,81,43,3],[29,84,49,3],[102,84,121,3],[260,84,18,3],[281,84,25,3],[26,87,55,3],[102,87,119,3],[258,87,22,3],[298,87,8,3],[24,90,60,3],[102,90,119,3],[257,90,25,3],[21,93,66,3],[103,93,118,3],[255,93,29,3],[18,96,71,3],[104,96,117,3],[253,96,33,3],[16,99,74,3],[105,99,116,3],[251,99,37,3],[16,102,74,3],[100,102,125,3],[249,102,41,3],[16,105,74,3],[92,105,146,3],[247,105,45,3],[16,108,226,3],[244,108,51,3],[18,111,280,3],[19,114,282,3],[20,117,284,3],[20,120,286,3],[20,123,286,3],[20,126,286,3],[20,129,286,3],[21,132,284,3],[23,135,281,3],[25,138,278,3],[25,141,278,3],[25,144,278,3],[25,147,278,3],[25,150,278,3],[25,153,277,3],[25,156,281,3],[25,159,284,3],[23,162,288,3],[21,165,291,3],[15,168,297,3],[13,171,299,3],[13,174,299,3],[13,177,298,3],[13,180,298,3],[13,183,298,3],[13,186,298,3],[12,189,299,3],[12,192,299,3],[13,195,297,3],[14,198,296,3],[15,201,294,3],[16,204,293,3],[17,207,292,3],[19,210,289,3],[19,213,288,3],[19,216,287,3],[19,219,286,3],[19,222,286,3],[19,225,286,3],[19,228,286,3],[19,231,286,3],[18,234,287,3],[18,237,287,3],[18,240,287,3],[18,243,287,3],[17,246,289,3],[17,249,289,3],[17,252,289,3],[16,255,291,3],[16,258,293,3],[15,261,295,3],[13,264,297,3],[12,267,299,3],[12,270,300,3],[11,273,302,3],[10,276,304,3],[8,279,307,3],[8,282,310,3],[6,285,315,3],[2,288,320,3],[0,291,323,3],[0,294,325,3],[0,297,325,3],[0,300,325,3],[0,303,325,3],[1,306,324,3],[6,309,319,3],[11,312,312,3],[14,315,307,3],[18,318,297,3],[22,321,288,3],[27,324,277,3],[31,327,267,3],[36,330,257,3],[41,333,248,3],[45,336,237,3],[51,339,219,3],[65,342,200,3],[72,345,188,3],[76,348,181,3],[77,351,173,3],[77,354,166,3],[77,357,158,3],[79,360,150,3],[83,363,143,3],[87,366,133,3],[88,369,125,3],[89,372,116,3],[91,375,106,3],[94,378,99,3],[98,381,88,3],[101,384,79,3],[106,387,69,3],[110,390,56,3],[115,393,45,3],[119,396,34,3],[123,399,24,2]]}]},"harbor-directions-v11.png":{"columns":2,"rows":2,"frames":[{"x":39,"y":64,"w":577,"h":525},{"x":667,"y":62,"w":553,"h":529},{"x":33,"y":668,"w":579,"h":519},{"x":662,"y":661,"w":556,"h":536}]},"deaths-v11.png":{"columns":4,"rows":4,"frames":[{"x":51,"y":37,"w":219,"h":247},{"x":377,"y":94,"w":196,"h":190},{"x":645,"y":126,"w":265,"h":172},{"x":953,"y":178,"w":292,"h":124},{"x":42,"y":322,"w":210,"h":274},{"x":380,"y":407,"w":215,"h":187},{"x":644,"y":407,"w":300,"h":201},{"x":965,"y":482,"w":278,"h":131},{"x":12,"y":596,"w":291,"h":333},{"x":357,"y":657,"w":240,"h":272},{"x":635,"y":720,"w":286,"h":207},{"x":944,"y":776,"w":293,"h":152},{"x":33,"y":975,"w":270,"h":248},{"x":329,"y":972,"w":287,"h":258},{"x":640,"y":1053,"w":289,"h":177},{"x":951,"y":1074,"w":288,"h":155}]},"cottage-directions-v11.png":{"columns":2,"rows":2,"frames":[{"x":91,"y":16,"w":513,"h":579},{"x":672,"y":27,"w":516,"h":583},{"x":56,"y":655,"w":526,"h":536},{"x":699,"y":658,"w":509,"h":541}]},"engines-v11.png":{"columns":4,"rows":4,"frames":[{"x":40,"y":17,"w":237,"h":292},{"x":360,"y":19,"w":227,"h":291},{"x":664,"y":19,"w":239,"h":287},{"x":982,"y":12,"w":247,"h":298},{"x":29,"y":321,"w":248,"h":309},{"x":343,"y":345,"w":302,"h":283},{"x":660,"y":346,"w":324,"h":279},{"x":991,"y":340,"w":236,"h":288},{"x":8,"y":634,"w":295,"h":261},{"x":324,"y":640,"w":293,"h":256},{"x":647,"y":635,"w":292,"h":261},{"x":959,"y":638,"w":286,"h":258},{"x":17,"y":934,"w":282,"h":263},{"x":330,"y":933,"w":280,"h":263},{"x":644,"y":934,"w":314,"h":262},{"x":974,"y":934,"w":271,"h":263}]},"barracks-tiers-directions-v11.png":{"columns":4,"rows":3,"frames":[{"x":52,"y":24,"w":294,"h":317,"maskRects":[[73,0,14,3],[62,3,26,3],[61,6,27,3],[61,9,32,3],[56,12,42,3],[50,15,53,3],[46,18,57,3],[46,21,57,3],[46,24,57,3],[46,27,57,3],[47,30,53,3],[49,33,51,3],[50,36,51,3],[50,39,58,3],[50,42,64,3],[50,45,70,3],[49,48,77,3],[48,51,83,3],[47,54,93,3],[45,57,101,3],[190,57,25,3],[43,60,109,3],[189,60,26,3],[42,63,117,3],[189,63,27,3],[40,66,125,3],[186,66,34,3],[38,69,133,3],[182,69,43,3],[36,72,194,3],[34,75,196,3],[32,78,198,3],[30,81,200,3],[28,84,202,3],[26,87,201,3],[24,90,203,3],[22,93,205,3],[20,96,207,3],[18,99,209,3],[16,102,214,3],[13,105,218,3],[11,108,221,3],[10,111,224,3],[6,114,231,3],[5,117,235,3],[3,120,240,3],[3,123,244,3],[3,126,247,3],[3,129,251,3],[3,132,254,3],[5,135,256,3],[9,138,255,3],[13,141,255,3],[13,144,261,3],[13,147,263,3],[13,150,263,3],[12,153,264,3],[9,156,267,3],[7,159,268,3],[7,162,266,3],[7,165,264,3],[7,168,258,3],[7,171,258,3],[8,174,259,3],[8,177,261,3],[8,180,264,3],[8,183,268,3],[8,186,272,3],[7,189,277,3],[7,192,281,3],[7,195,284,3],[7,198,287,3],[6,201,288,3],[6,204,288,3],[5,207,289,3],[4,210,290,3],[2,213,289,3],[0,216,290,3],[0,219,290,3],[0,222,290,3],[0,225,290,3],[0,228,290,3],[0,231,291,3],[0,234,292,3],[0,237,293,3],[0,240,293,3],[3,243,290,3],[8,246,285,3],[13,249,280,3],[29,252,264,3],[36,255,257,3],[42,258,251,3],[45,261,249,3],[47,264,247,3],[48,267,246,3],[50,270,244,3],[56,273,238,3],[59,276,230,3],[62,279,222,3],[68,282,210,3],[74,285,198,3],[81,288,186,3],[88,291,173,3],[93,294,7,3],[107,294,149,3],[113,297,11,3],[139,297,112,3],[145,300,62,3],[211,300,34,3],[153,303,49,3],[219,303,21,3],[159,306,41,3],[226,306,8,3],[162,309,36,3],[167,312,26,3],[173,315,15,2]]},{"x":389,"y":23,"w":287,"h":318,"maskRects":[[198,0,23,3],[198,3,26,3],[197,6,27,3],[192,9,34,3],[186,12,45,3],[183,15,55,3],[183,18,56,3],[183,21,57,3],[183,24,57,3],[183,27,57,3],[186,30,53,3],[186,33,51,3],[183,36,53,3],[176,39,60,3],[171,42,65,3],[165,45,73,3],[158,48,80,3],[153,51,86,3],[145,54,95,3],[61,57,25,3],[139,57,103,3],[61,60,26,3],[133,60,111,3],[61,63,27,3],[125,63,121,3],[58,66,33,3],[120,66,128,3],[53,69,42,3],[113,69,137,3],[47,72,54,3],[107,72,146,3],[47,75,207,3],[47,78,209,3],[47,81,211,3],[47,84,212,3],[49,87,213,3],[50,90,214,3],[50,93,216,3],[50,96,218,3],[50,99,220,3],[48,102,224,3],[45,105,229,3],[45,108,231,3],[44,111,234,3],[41,114,240,3],[38,117,245,3],[34,120,251,3],[31,123,254,3],[27,126,258,3],[24,129,261,3],[20,132,264,3],[16,135,264,3],[12,138,263,3],[7,141,267,3],[2,144,272,3],[1,147,273,3],[1,150,273,3],[1,153,275,3],[1,156,279,3],[4,159,276,3],[5,162,275,3],[11,165,269,3],[13,168,267,3],[9,171,270,3],[6,174,273,3],[6,177,273,3],[6,180,273,3],[6,183,273,3],[7,186,273,3],[8,189,272,3],[8,192,272,3],[8,195,272,3],[8,198,273,3],[7,201,274,3],[7,204,275,3],[7,207,275,3],[7,210,276,3],[7,213,279,3],[6,216,281,3],[6,219,281,3],[5,222,282,3],[2,225,285,3],[0,228,287,3],[0,231,287,3],[0,234,287,3],[0,237,287,3],[0,240,287,3],[0,243,286,3],[0,246,280,3],[0,249,275,3],[0,252,260,3],[3,255,250,3],[8,258,239,3],[13,261,229,3],[29,264,210,3],[33,267,206,3],[39,270,199,3],[44,273,188,3],[49,276,177,3],[54,279,172,3],[59,282,162,3],[63,285,152,3],[66,288,142,3],[69,291,133,3],[74,294,122,3],[78,297,69,3],[161,297,13,3],[80,300,61,3],[81,303,52,3],[81,306,46,3],[82,309,40,3],[87,312,30,3],[92,315,19,3]]},{"x":763,"y":26,"w":297,"h":315,"maskRects":[[76,0,24,3],[74,3,27,3],[74,6,27,3],[73,9,33,3],[68,12,44,3],[61,15,55,3],[59,18,57,3],[59,21,57,3],[59,24,57,3],[59,27,56,3],[60,30,53,3],[62,33,51,3],[62,36,57,3],[63,39,62,3],[63,42,69,3],[61,45,78,3],[61,48,83,3],[59,51,93,3],[57,54,101,3],[56,57,109,3],[54,60,117,3],[52,63,125,3],[225,63,9,3],[50,66,134,3],[213,66,23,3],[48,69,143,3],[212,69,25,3],[46,72,153,3],[211,72,26,3],[44,75,161,3],[207,75,34,3],[42,78,205,3],[40,81,211,3],[38,84,213,3],[36,87,215,3],[34,90,217,3],[32,93,219,3],[30,96,219,3],[28,99,220,3],[26,102,222,3],[24,105,224,3],[22,108,229,3],[19,111,233,3],[18,114,235,3],[16,117,240,3],[15,120,245,3],[15,123,248,3],[16,126,251,3],[16,129,254,3],[20,132,255,3],[26,135,253,3],[26,138,256,3],[26,141,261,3],[26,144,268,3],[26,147,271,3],[24,150,273,3],[21,153,276,3],[21,156,276,3],[21,159,275,3],[21,162,274,3],[21,165,273,3],[22,168,266,3],[21,171,265,3],[17,174,269,3],[13,177,273,3],[9,180,278,3],[5,183,286,3],[1,186,291,3],[0,189,292,3],[0,192,292,3],[0,195,292,3],[0,198,291,3],[1,201,289,3],[3,204,288,3],[3,207,288,3],[3,210,288,3],[3,213,288,3],[3,216,289,3],[2,219,290,3],[2,222,290,3],[2,225,290,3],[2,228,290,3],[2,231,291,3],[2,234,294,3],[2,237,295,3],[2,240,295,3],[2,243,295,3],[1,246,296,3],[1,249,296,3],[1,252,296,3],[1,255,296,3],[3,258,294,3],[8,261,289,3],[14,264,278,3],[21,267,266,3],[27,270,246,3],[32,273,236,3],[38,276,54,3],[102,276,161,3],[42,279,45,3],[108,279,149,3],[48,282,32,3],[115,282,137,3],[54,285,20,3],[118,285,129,3],[60,288,6,3],[120,288,122,3],[127,291,110,3],[135,294,96,3],[135,297,91,3],[140,300,81,3],[147,303,71,3],[153,306,24,3],[178,306,39,3],[159,309,10,3],[181,309,31,3],[187,312,19,3]]},{"x":1110,"y":25,"w":302,"h":316,"maskRects":[[199,0,23,3],[198,3,26,3],[198,6,27,3],[193,9,33,3],[188,12,43,3],[184,15,54,3],[184,18,56,3],[184,21,56,3],[184,24,56,3],[184,27,56,3],[186,30,54,3],[186,33,51,3],[183,36,53,3],[176,39,60,3],[170,42,67,3],[163,45,75,3],[158,48,80,3],[150,51,90,3],[143,54,98,3],[137,57,106,3],[131,60,114,3],[63,63,22,3],[124,63,123,3],[62,66,25,3],[118,66,131,3],[62,69,25,3],[110,69,141,3],[59,72,30,3],[105,72,148,3],[54,75,41,3],[97,75,158,3],[48,78,209,3],[48,81,211,3],[48,84,213,3],[48,87,215,3],[48,90,216,3],[49,93,217,3],[51,96,217,3],[51,99,220,3],[51,102,222,3],[49,105,226,3],[47,108,230,3],[47,111,233,3],[45,114,236,3],[42,117,241,3],[39,120,246,3],[35,123,250,3],[31,126,254,3],[27,129,256,3],[24,132,258,3],[19,135,258,3],[16,138,258,3],[12,141,262,3],[5,144,269,3],[3,147,271,3],[0,150,275,3],[0,153,278,3],[0,156,279,3],[2,159,277,3],[4,162,275,3],[5,165,274,3],[12,168,266,3],[12,171,269,3],[13,174,272,3],[12,177,277,3],[12,180,280,3],[9,183,288,3],[6,186,295,3],[6,189,296,3],[6,192,296,3],[6,195,296,3],[6,198,296,3],[7,201,293,3],[7,204,291,3],[7,207,291,3],[7,210,291,3],[7,213,291,3],[7,216,291,3],[6,219,294,3],[6,222,294,3],[6,225,294,3],[6,228,294,3],[5,231,295,3],[4,234,296,3],[1,237,299,3],[0,240,300,3],[0,243,300,3],[0,246,301,3],[0,249,301,3],[0,252,301,3],[0,255,301,3],[0,258,300,3],[0,261,294,3],[1,264,288,3],[6,267,277,3],[12,270,265,3],[29,273,242,3],[34,276,167,3],[207,276,59,3],[39,279,155,3],[213,279,47,3],[45,282,142,3],[219,282,36,3],[50,285,131,3],[226,285,23,3],[56,288,124,3],[232,288,11,3],[61,291,112,3],[66,294,84,3],[71,297,73,3],[77,300,59,3],[81,303,48,3],[81,306,41,3],[85,309,34,3],[89,312,24,3],[95,315,11,1]]},{"x":32,"y":352,"w":323,"h":332,"maskRects":[[72,0,23,3],[69,3,26,3],[69,6,28,3],[66,9,35,3],[61,12,47,3],[55,15,54,3],[55,18,54,3],[55,21,54,3],[55,24,54,3],[55,27,52,3],[58,30,50,3],[58,33,56,3],[57,36,65,3],[56,39,72,3],[55,42,81,3],[54,45,89,3],[52,48,97,3],[50,51,108,3],[48,54,117,3],[227,54,25,3],[46,57,127,3],[227,57,25,3],[43,60,136,3],[227,60,26,3],[41,63,144,3],[222,63,36,3],[39,66,154,3],[217,66,46,3],[36,69,165,3],[213,69,54,3],[34,72,173,3],[213,72,54,3],[32,75,235,3],[30,78,237,3],[28,81,239,3],[26,84,238,3],[23,87,241,3],[21,90,243,3],[19,93,246,3],[17,96,249,3],[14,99,253,3],[12,102,255,3],[10,105,258,3],[7,108,265,3],[5,111,270,3],[3,114,275,3],[3,117,278,3],[3,120,282,3],[3,123,285,3],[4,126,287,3],[8,129,286,3],[13,132,286,3],[13,135,289,3],[13,138,295,3],[13,141,298,3],[13,144,299,3],[13,147,299,3],[11,150,301,3],[7,153,304,3],[7,156,301,3],[7,159,300,3],[7,162,295,3],[7,165,294,3],[8,168,293,3],[9,171,292,3],[9,174,292,3],[8,177,294,3],[8,180,297,3],[8,183,298,3],[8,186,298,3],[8,189,298,3],[7,192,299,3],[7,195,299,3],[7,198,298,3],[7,201,300,3],[6,204,305,3],[6,207,308,3],[5,210,313,3],[1,213,322,3],[0,216,323,3],[0,219,323,3],[0,222,323,3],[0,225,323,3],[0,228,321,3],[0,231,320,3],[0,234,320,3],[0,237,320,3],[0,240,320,3],[0,243,320,3],[0,246,320,3],[4,249,317,3],[10,252,311,3],[26,255,295,3],[32,258,289,3],[38,261,283,3],[44,264,277,3],[50,267,271,3],[53,270,268,3],[54,273,267,3],[54,276,268,3],[55,279,267,3],[61,282,261,3],[66,285,256,3],[70,288,252,3],[76,291,241,3],[82,294,229,3],[88,297,217,3],[95,300,204,3],[101,303,192,3],[120,306,22,3],[145,306,143,3],[127,309,5,3],[153,309,129,3],[160,312,117,3],[167,315,58,3],[231,315,40,3],[173,318,49,3],[238,318,28,3],[179,321,42,3],[244,321,16,3],[181,324,38,3],[186,327,28,3],[193,330,15,2]]},{"x":366,"y":348,"w":325,"h":335,"maskRects":[[225,0,13,3],[239,0,8,3],[225,3,24,3],[224,6,26,3],[219,9,35,3],[212,12,48,3],[211,15,54,3],[211,18,54,3],[211,21,55,3],[211,24,55,3],[212,27,54,3],[211,30,52,3],[204,33,59,3],[197,36,67,3],[190,39,75,3],[182,42,83,3],[176,45,91,3],[169,48,100,3],[162,51,109,3],[72,54,24,3],[155,54,118,3],[70,57,26,3],[148,57,127,3],[70,60,27,3],[142,60,135,3],[68,63,31,3],[136,63,143,3],[62,66,42,3],[129,66,153,3],[57,69,53,3],[121,69,163,3],[56,72,55,3],[115,72,171,3],[56,75,233,3],[56,78,235,3],[56,81,237,3],[58,84,238,3],[60,87,238,3],[60,90,240,3],[60,93,243,3],[59,96,246,3],[56,99,251,3],[56,102,254,3],[55,105,257,3],[53,108,262,3],[51,111,267,3],[48,114,272,3],[45,117,276,3],[41,120,280,3],[38,123,282,3],[35,126,285,3],[32,129,286,3],[29,132,285,3],[25,135,286,3],[21,138,290,3],[16,141,295,3],[12,144,299,3],[11,147,300,3],[11,150,300,3],[11,153,303,3],[11,156,306,3],[15,159,302,3],[16,162,301,3],[22,165,295,3],[23,168,294,3],[23,171,293,3],[23,174,293,3],[23,177,293,3],[22,180,294,3],[19,183,297,3],[17,186,299,3],[17,189,300,3],[17,192,300,3],[17,195,300,3],[17,198,300,3],[18,201,300,3],[16,204,302,3],[12,207,306,3],[9,210,310,3],[5,213,315,3],[1,216,322,3],[0,219,324,3],[0,222,325,3],[0,225,325,3],[0,228,325,3],[2,231,323,3],[4,234,321,3],[4,237,321,3],[4,240,321,3],[4,243,321,3],[4,246,321,3],[4,249,321,3],[3,252,318,3],[2,255,313,3],[2,258,298,3],[304,258,5,3],[2,261,291,3],[2,264,285,3],[2,267,280,3],[2,270,274,3],[2,273,270,3],[3,276,268,3],[2,279,269,3],[2,282,268,3],[2,285,264,3],[2,288,258,3],[2,291,255,3],[8,294,244,3],[14,297,232,3],[19,300,221,3],[25,303,207,3],[31,306,195,3],[36,309,139,3],[185,309,19,3],[213,309,7,3],[42,312,127,3],[191,312,6,3],[47,315,116,3],[53,318,39,3],[98,318,58,3],[58,321,26,3],[102,321,48,3],[64,324,13,3],[102,324,42,3],[104,327,38,3],[109,330,27,3],[115,333,15,2]]},{"x":756,"y":355,"w":319,"h":329,"maskRects":[[79,0,23,3],[78,3,25,3],[78,6,29,3],[72,9,41,3],[66,12,52,3],[63,15,55,3],[63,18,55,3],[63,21,55,3],[63,24,55,3],[63,27,54,3],[62,30,63,3],[62,33,70,3],[61,36,78,3],[59,39,87,3],[57,42,95,3],[55,45,104,3],[233,45,6,3],[242,45,10,3],[53,48,114,3],[229,48,25,3],[50,51,124,3],[229,51,26,3],[48,54,132,3],[228,54,27,3],[46,57,141,3],[223,57,36,3],[44,60,150,3],[218,60,47,3],[42,63,158,3],[215,63,54,3],[39,66,169,3],[214,66,55,3],[37,69,232,3],[35,72,234,3],[32,75,237,3],[30,78,236,3],[28,81,238,3],[26,84,239,3],[23,87,242,3],[21,90,248,3],[18,93,252,3],[16,96,254,3],[14,99,256,3],[12,102,261,3],[8,105,268,3],[7,108,272,3],[7,111,275,3],[7,114,278,3],[8,117,280,3],[9,120,283,3],[14,123,281,3],[18,126,280,3],[18,129,284,3],[18,132,288,3],[18,135,293,3],[18,138,297,3],[18,141,299,3],[17,144,300,3],[13,147,304,3],[12,150,305,3],[12,153,301,3],[12,156,300,3],[12,159,295,3],[13,162,293,3],[14,165,292,3],[13,168,293,3],[13,171,293,3],[13,174,293,3],[13,177,295,3],[13,180,298,3],[12,183,300,3],[12,186,300,3],[12,189,300,3],[12,192,300,3],[11,195,300,3],[7,198,304,3],[3,201,308,3],[0,204,311,3],[0,207,311,3],[0,210,311,3],[0,213,311,3],[1,216,311,3],[1,219,311,3],[1,222,311,3],[1,225,311,3],[1,228,311,3],[1,231,312,3],[1,234,312,3],[2,237,311,3],[2,240,315,3],[2,243,317,3],[2,246,317,3],[2,249,317,3],[2,252,317,3],[2,255,317,3],[1,258,318,3],[1,261,318,3],[1,264,318,3],[1,267,318,3],[3,270,316,3],[10,273,308,3],[15,276,297,3],[21,279,286,3],[28,282,262,3],[33,285,251,3],[39,288,42,3],[85,288,194,3],[45,291,29,3],[85,291,189,3],[51,294,17,3],[87,294,181,3],[94,297,168,3],[100,300,157,3],[106,303,12,3],[132,303,119,3],[157,306,88,3],[163,309,78,3],[170,312,64,3],[177,315,53,3],[183,318,44,3],[186,321,40,3],[191,324,29,3],[197,327,17,2]]},{"x":1100,"y":355,"w":322,"h":329,"maskRects":[[220,0,14,3],[235,0,7,3],[220,3,25,3],[218,6,28,3],[213,9,36,3],[207,12,47,3],[205,15,55,3],[205,18,55,3],[205,21,55,3],[206,24,54,3],[200,27,60,3],[192,30,66,3],[184,33,73,3],[178,36,81,3],[170,39,89,3],[76,42,10,3],[162,42,98,3],[63,45,25,3],[156,45,106,3],[63,48,25,3],[148,48,116,3],[63,51,25,3],[139,51,127,3],[60,54,31,3],[133,54,135,3],[55,57,41,3],[126,57,144,3],[49,60,53,3],[120,60,152,3],[49,63,54,3],[112,63,162,3],[49,66,54,3],[105,66,171,3],[49,69,229,3],[49,72,231,3],[51,75,231,3],[52,78,232,3],[52,81,234,3],[52,84,236,3],[50,87,240,3],[48,90,245,3],[47,93,248,3],[47,96,251,3],[46,99,254,3],[43,102,259,3],[40,105,264,3],[37,108,269,3],[34,111,274,3],[31,114,277,3],[28,117,280,3],[25,120,283,3],[22,123,285,3],[18,126,285,3],[15,129,283,3],[12,132,286,3],[6,135,292,3],[2,138,296,3],[2,141,296,3],[2,144,296,3],[2,147,298,3],[4,150,299,3],[6,153,297,3],[8,156,295,3],[12,159,291,3],[12,162,291,3],[13,165,289,3],[13,168,289,3],[12,171,290,3],[12,174,290,3],[8,177,294,3],[6,180,297,3],[6,183,297,3],[6,186,297,3],[6,189,300,3],[6,192,304,3],[7,195,307,3],[7,198,310,3],[7,201,314,3],[7,204,315,3],[7,207,315,3],[7,210,315,3],[7,213,315,3],[6,216,312,3],[6,219,312,3],[6,222,312,3],[6,225,312,3],[5,228,313,3],[5,231,313,3],[5,234,314,3],[4,237,315,3],[1,240,318,3],[0,243,319,3],[0,246,319,3],[0,249,319,3],[0,252,319,3],[0,255,319,3],[0,258,320,3],[0,261,320,3],[0,264,320,3],[0,267,320,3],[0,270,318,3],[1,273,312,3],[6,276,300,3],[12,279,210,3],[226,279,74,3],[31,282,183,3],[233,282,60,3],[37,285,171,3],[238,285,50,3],[42,288,161,3],[244,288,39,3],[47,291,151,3],[249,291,27,3],[53,294,140,3],[255,294,15,3],[59,297,133,3],[64,300,123,3],[70,303,100,3],[172,303,8,3],[74,306,87,3],[80,309,75,3],[86,312,61,3],[90,315,51,3],[90,318,46,3],[92,321,39,3],[97,324,29,3],[103,327,17,2]]},{"x":27,"y":687,"w":324,"h":367,"maskRects":[[118,0,20,3],[116,3,23,3],[115,6,26,3],[109,9,38,3],[104,12,49,3],[100,15,53,3],[100,18,53,3],[100,21,53,3],[100,24,53,3],[100,27,52,3],[103,30,48,3],[103,33,48,3],[103,36,53,3],[70,39,17,3],[103,39,61,3],[68,42,19,3],[103,42,68,3],[67,45,21,3],[103,45,73,3],[205,45,9,3],[67,48,21,3],[103,48,80,3],[203,48,12,3],[64,51,29,3],[102,51,86,3],[203,51,13,3],[59,54,36,3],[101,54,94,3],[202,54,14,3],[59,57,37,3],[99,57,118,3],[59,60,37,3],[98,60,121,3],[37,63,11,3],[59,63,162,3],[32,66,20,3],[58,66,164,3],[32,69,21,3],[57,69,167,3],[262,69,18,3],[19,72,208,3],[260,72,23,3],[16,75,213,3],[260,75,23,3],[8,78,222,3],[260,78,23,3],[2,81,230,3],[259,81,27,3],[1,84,234,3],[254,84,37,3],[1,87,242,3],[249,87,48,3],[1,90,300,3],[1,93,300,3],[1,96,300,3],[1,99,300,3],[1,102,300,3],[1,105,297,3],[1,108,297,3],[1,111,297,3],[1,114,297,3],[3,117,295,3],[4,120,294,3],[6,123,292,3],[6,126,293,3],[6,129,293,3],[6,132,293,3],[6,135,294,3],[6,138,296,3],[6,141,297,3],[6,144,299,3],[6,147,301,3],[6,150,302,3],[6,153,305,3],[6,156,306,3],[6,159,308,3],[6,162,309,3],[6,165,311,3],[6,168,314,3],[6,171,315,3],[6,174,315,3],[6,177,315,3],[6,180,311,3],[6,183,307,3],[6,186,306,3],[6,189,306,3],[6,192,306,3],[6,195,306,3],[6,198,306,3],[6,201,306,3],[6,204,306,3],[6,207,306,3],[6,210,307,3],[6,213,310,3],[6,216,311,3],[6,219,311,3],[6,222,311,3],[6,225,311,3],[6,228,310,3],[6,231,309,3],[5,234,310,3],[3,237,313,3],[1,240,315,3],[1,243,315,3],[0,246,316,3],[0,249,316,3],[0,252,316,3],[0,255,317,3],[0,258,317,3],[0,261,317,3],[0,264,317,3],[0,267,318,3],[0,270,320,3],[0,273,323,3],[1,276,323,3],[6,279,318,3],[12,282,312,3],[18,285,306,3],[24,288,300,3],[31,291,293,3],[37,294,15,3],[65,294,259,3],[67,297,257,3],[67,300,257,3],[67,303,257,3],[69,306,251,3],[74,309,241,3],[80,312,229,3],[82,315,213,3],[88,318,200,3],[94,321,188,3],[100,324,177,3],[106,327,166,3],[113,330,153,3],[119,333,6,3],[130,333,133,3],[138,336,19,3],[162,336,99,3],[168,339,90,3],[171,342,86,3],[171,345,86,3],[173,348,80,3],[178,351,70,3],[184,354,58,3],[190,357,47,3],[196,360,35,3],[202,363,24,3],[209,366,11,1]]},{"x":374,"y":685,"w":326,"h":369,"maskRects":[[187,0,13,3],[186,3,24,3],[186,6,24,3],[180,9,33,3],[174,12,45,3],[171,15,53,3],[171,18,54,3],[171,21,54,3],[171,24,54,3],[172,27,53,3],[174,30,49,3],[173,33,49,3],[171,36,51,3],[165,39,57,3],[239,39,10,3],[159,42,63,3],[236,42,18,3],[110,45,11,3],[154,45,68,3],[236,45,20,3],[109,48,13,3],[148,48,74,3],[235,48,21,3],[109,51,13,3],[141,51,81,3],[233,51,23,3],[108,54,15,3],[136,54,87,3],[229,54,33,3],[106,57,20,3],[129,57,96,3],[228,57,36,3],[104,60,161,3],[103,63,162,3],[100,66,165,3],[274,66,16,3],[99,69,167,3],[271,69,22,3],[34,72,22,3],[97,72,196,3],[294,72,7,3],[33,75,23,3],[94,75,213,3],[33,78,23,3],[92,78,217,3],[33,81,25,3],[91,81,228,3],[28,84,35,3],[88,84,236,3],[23,87,43,3],[83,87,241,3],[17,90,55,3],[76,90,249,3],[15,93,310,3],[15,96,310,3],[15,99,310,3],[15,102,310,3],[16,105,309,3],[18,108,307,3],[18,111,307,3],[18,114,307,3],[18,117,307,3],[18,120,305,3],[18,123,303,3],[18,126,301,3],[18,129,301,3],[18,132,301,3],[18,135,301,3],[18,138,301,3],[18,141,301,3],[17,144,302,3],[16,147,303,3],[14,150,305,3],[13,153,306,3],[11,156,309,3],[9,159,311,3],[7,162,313,3],[5,165,315,3],[4,168,316,3],[2,171,318,3],[2,174,318,3],[2,177,318,3],[4,180,316,3],[9,183,311,3],[12,186,308,3],[12,189,308,3],[12,192,308,3],[12,195,308,3],[12,198,308,3],[12,201,308,3],[12,204,308,3],[12,207,308,3],[11,210,309,3],[9,213,311,3],[7,216,313,3],[7,219,313,3],[7,222,313,3],[7,225,313,3],[7,228,313,3],[9,231,311,3],[9,234,311,3],[9,237,312,3],[8,240,316,3],[8,243,318,3],[8,246,318,3],[8,249,318,3],[8,252,318,3],[8,255,318,3],[7,258,319,3],[7,261,319,3],[7,264,319,3],[6,267,320,3],[5,270,321,3],[1,273,325,3],[0,276,326,3],[0,279,325,3],[0,282,320,3],[0,285,315,3],[0,288,309,3],[0,291,303,3],[0,294,297,3],[0,297,265,3],[276,297,15,3],[0,300,258,3],[0,303,257,3],[3,306,254,3],[8,309,247,3],[13,312,237,3],[33,315,213,3],[38,318,203,3],[43,321,192,3],[49,324,180,3],[54,327,169,3],[59,330,159,3],[63,333,149,3],[67,336,128,3],[69,339,92,3],[176,339,10,3],[70,342,88,3],[70,345,87,3],[71,348,85,3],[76,351,76,3],[82,354,64,3],[88,357,53,3],[93,360,42,3],[98,363,31,3],[104,366,21,3]]},{"x":751,"y":687,"w":322,"h":367,"maskRects":[[116,0,21,3],[114,3,24,3],[113,6,29,3],[107,9,41,3],[101,12,52,3],[98,15,55,3],[98,18,55,3],[98,21,55,3],[98,24,55,3],[98,27,53,3],[101,30,50,3],[101,33,51,3],[101,36,56,3],[91,39,8,3],[101,39,64,3],[88,42,82,3],[88,45,89,3],[215,45,10,3],[88,48,95,3],[214,48,12,3],[86,51,102,3],[214,51,12,3],[38,54,11,3],[84,54,112,3],[212,54,15,3],[33,57,21,3],[82,57,120,3],[210,57,18,3],[32,60,23,3],[56,60,5,3],[81,60,149,3],[20,63,47,3],[78,63,153,3],[16,66,54,3],[76,66,156,3],[9,69,6,3],[16,69,55,3],[74,69,160,3],[2,72,234,3],[1,75,237,3],[269,75,23,3],[1,78,238,3],[269,78,23,3],[1,81,240,3],[268,81,29,3],[1,84,246,3],[262,84,40,3],[1,87,252,3],[260,87,48,3],[1,90,314,3],[1,93,314,3],[1,96,315,3],[1,99,315,3],[1,102,315,3],[1,105,315,3],[2,108,314,3],[4,111,312,3],[6,114,310,3],[7,117,309,3],[7,120,309,3],[7,123,308,3],[7,126,307,3],[7,129,305,3],[7,132,304,3],[7,135,304,3],[7,138,304,3],[7,141,304,3],[7,144,304,3],[7,147,304,3],[7,150,304,3],[7,153,304,3],[7,156,304,3],[7,159,304,3],[7,162,304,3],[7,165,305,3],[7,168,307,3],[7,171,308,3],[7,174,309,3],[7,177,309,3],[7,180,308,3],[7,183,307,3],[7,186,304,3],[7,189,304,3],[7,192,304,3],[7,195,304,3],[7,198,304,3],[7,201,304,3],[7,204,304,3],[7,207,304,3],[7,210,304,3],[7,213,304,3],[7,216,305,3],[6,219,309,3],[6,222,309,3],[6,225,309,3],[5,228,310,3],[3,231,312,3],[1,234,313,3],[1,237,313,3],[1,240,313,3],[0,243,314,3],[0,246,314,3],[0,249,315,3],[0,252,315,3],[0,255,315,3],[0,258,315,3],[0,261,316,3],[0,264,316,3],[0,267,316,3],[3,270,315,3],[8,273,314,3],[15,276,307,3],[18,279,304,3],[18,282,304,3],[18,285,304,3],[20,288,302,3],[25,291,297,3],[31,294,291,3],[37,297,285,3],[42,300,280,3],[48,303,273,3],[54,306,43,3],[106,306,209,3],[60,309,30,3],[103,309,207,3],[66,312,18,3],[100,312,196,3],[100,315,188,3],[100,318,182,3],[100,321,177,3],[101,324,170,3],[107,327,158,3],[114,330,146,3],[118,333,22,3],[156,333,99,3],[125,336,7,3],[162,336,89,3],[166,339,84,3],[166,342,84,3],[166,345,84,3],[168,348,81,3],[174,351,70,3],[180,354,58,3],[185,357,47,3],[191,360,35,3],[197,363,23,3],[203,366,12,1]]},{"x":1102,"y":687,"w":319,"h":364,"maskRects":[[181,0,22,3],[181,3,24,3],[178,6,27,3],[172,9,39,3],[167,12,50,3],[166,15,54,3],[166,18,55,3],[166,21,55,3],[166,24,55,3],[168,27,53,3],[168,30,50,3],[168,33,49,3],[164,36,53,3],[157,39,60,3],[151,42,66,3],[226,42,9,3],[99,45,12,3],[146,45,72,3],[224,45,13,3],[99,48,12,3],[140,48,78,3],[224,48,13,3],[99,51,13,3],[134,51,84,3],[223,51,15,3],[97,54,16,3],[128,54,91,3],[221,54,18,3],[272,54,8,3],[96,57,21,3],[121,57,120,3],[265,57,21,3],[94,60,148,3],[265,60,22,3],[93,63,151,3],[254,63,43,3],[91,66,155,3],[250,66,52,3],[90,69,158,3],[249,69,54,3],[37,72,12,3],[88,72,227,3],[28,75,22,3],[86,75,232,3],[27,78,24,3],[84,78,234,3],[23,81,36,3],[80,81,239,3],[19,84,43,3],[75,84,244,3],[12,87,307,3],[6,90,313,3],[6,93,313,3],[6,96,313,3],[6,99,313,3],[5,102,314,3],[5,105,314,3],[5,108,313,3],[5,111,311,3],[5,114,310,3],[5,117,308,3],[5,120,308,3],[6,123,307,3],[8,126,305,3],[10,129,303,3],[11,132,302,3],[11,135,302,3],[11,138,302,3],[11,141,302,3],[11,144,302,3],[11,147,302,3],[11,150,302,3],[11,153,302,3],[11,156,302,3],[11,159,302,3],[10,162,303,3],[8,165,305,3],[6,168,307,3],[6,171,307,3],[6,174,307,3],[6,177,307,3],[7,180,306,3],[10,183,303,3],[11,186,302,3],[11,189,302,3],[11,192,302,3],[11,195,302,3],[11,198,302,3],[11,201,302,3],[11,204,302,3],[11,207,302,3],[10,210,304,3],[10,213,304,3],[8,216,306,3],[6,219,308,3],[6,222,308,3],[6,225,308,3],[6,228,308,3],[6,231,310,3],[7,234,311,3],[7,237,312,3],[7,240,312,3],[7,243,312,3],[7,246,312,3],[6,249,313,3],[6,252,313,3],[6,255,313,3],[6,258,313,3],[5,261,314,3],[5,264,314,3],[4,267,315,3],[0,270,317,3],[0,273,312,3],[0,276,306,3],[0,279,305,3],[0,282,306,3],[0,285,306,3],[0,288,306,3],[0,291,305,3],[0,294,302,3],[0,297,296,3],[0,300,291,3],[4,303,280,3],[9,306,269,3],[14,309,258,3],[32,312,180,3],[223,312,44,3],[38,315,167,3],[229,315,32,3],[43,318,162,3],[235,318,20,3],[49,321,150,3],[241,321,8,3],[54,324,139,3],[59,327,120,3],[64,330,108,3],[67,333,101,3],[68,336,91,3],[69,339,86,3],[69,342,83,3],[71,345,81,3],[75,348,73,3],[81,351,62,3],[87,354,50,3],[92,357,39,3],[98,360,26,3],[103,363,15,1]]}]},"keep-directions-v11.png":{"columns":2,"rows":2,"frames":[{"x":104,"y":21,"w":458,"h":578},{"x":688,"y":20,"w":463,"h":579},{"x":102,"y":636,"w":476,"h":558},{"x":680,"y":637,"w":471,"h":564}]},"pikes-v11.png":{"columns":4,"rows":4,"frames":[{"x":47,"y":38,"w":262,"h":263},{"x":361,"y":42,"w":251,"h":261},{"x":669,"y":41,"w":264,"h":261},{"x":979,"y":38,"w":262,"h":263},{"x":25,"y":352,"w":281,"h":246},{"x":329,"y":352,"w":286,"h":247},{"x":640,"y":371,"w":376,"h":230},{"x":975,"y":353,"w":267,"h":249},{"x":82,"y":645,"w":156,"h":269},{"x":405,"y":644,"w":151,"h":274},{"x":710,"y":643,"w":149,"h":273},{"x":1030,"y":642,"w":139,"h":275},{"x":81,"y":970,"w":126,"h":244},{"x":376,"y":1007,"w":200,"h":196},{"x":685,"y":989,"w":244,"h":212},{"x":1037,"y":946,"w":135,"h":270}]},"storehouse-directions-v11.png":{"columns":2,"rows":2,"frames":[{"x":56,"y":46,"w":554,"h":525},{"x":643,"y":57,"w":553,"h":530},{"x":57,"y":625,"w":552,"h":537},{"x":647,"y":642,"w":553,"h":527}]},"cottage-tiers-directions-v11.png":{"columns":4,"rows":3,"frames":[{"x":49,"y":9,"w":285,"h":266,"maskRects":[[190,0,21,3],[190,3,21,3],[186,6,26,3],[176,9,45,3],[174,12,53,3],[173,15,55,3],[173,18,55,3],[173,21,55,3],[173,24,55,3],[175,27,52,3],[167,30,58,3],[162,33,63,3],[149,36,76,3],[137,39,88,3],[126,42,99,3],[117,45,108,3],[105,48,120,3],[90,51,135,3],[73,54,152,3],[58,57,167,3],[56,60,170,3],[56,63,171,3],[56,66,172,3],[54,69,176,3],[52,72,180,3],[49,75,185,3],[46,78,189,3],[45,81,192,3],[42,84,198,3],[38,87,203,3],[36,90,207,3],[33,93,211,3],[30,96,216,3],[28,99,220,3],[24,102,226,3],[21,105,232,3],[18,108,236,3],[15,111,242,3],[13,114,246,3],[10,117,251,3],[7,120,255,3],[3,123,262,3],[0,126,267,3],[0,129,269,3],[0,132,270,3],[0,135,270,3],[2,138,268,3],[4,141,263,3],[16,144,250,3],[18,147,244,3],[19,150,247,3],[19,153,250,3],[19,156,254,3],[20,159,256,3],[20,162,259,3],[20,165,264,3],[20,168,265,3],[20,171,265,3],[20,174,265,3],[20,177,265,3],[19,180,265,3],[15,183,267,3],[15,186,264,3],[15,189,264,3],[15,192,263,3],[14,195,264,3],[14,198,264,3],[13,201,265,3],[13,204,265,3],[12,207,266,3],[12,210,266,3],[12,213,266,3],[12,216,266,3],[12,219,266,3],[16,222,263,3],[23,225,257,3],[30,228,250,3],[34,231,244,3],[34,234,235,3],[34,237,225,3],[37,240,212,3],[44,243,196,3],[50,246,139,3],[192,246,17,3],[57,249,119,3],[64,252,102,3],[72,255,15,3],[96,255,61,3],[104,258,46,3],[110,261,33,3],[116,264,18,2]]},{"x":397,"y":9,"w":285,"h":264,"maskRects":[[80,0,21,3],[80,3,21,3],[75,6,32,3],[67,9,49,3],[62,12,55,3],[62,15,55,3],[62,18,55,3],[62,21,55,3],[62,24,55,3],[65,27,50,3],[65,30,56,3],[65,33,67,3],[65,36,73,3],[65,39,90,3],[65,42,98,3],[65,45,110,3],[65,48,124,3],[65,51,139,3],[65,54,155,3],[65,57,156,3],[63,60,159,3],[61,63,161,3],[60,66,165,3],[58,69,171,3],[56,72,176,3],[53,75,181,3],[52,78,186,3],[50,81,191,3],[47,84,197,3],[46,87,202,3],[43,90,208,3],[40,93,214,3],[39,96,219,3],[37,99,223,3],[34,102,230,3],[32,105,236,3],[31,108,239,3],[28,111,247,3],[25,114,253,3],[24,117,258,3],[21,120,264,3],[18,123,267,3],[16,126,269,3],[15,129,270,3],[15,132,267,3],[15,135,254,3],[271,135,9,3],[17,138,250,3],[19,141,246,3],[22,144,243,3],[19,147,246,3],[15,150,250,3],[11,153,254,3],[7,156,258,3],[5,159,260,3],[2,162,263,3],[0,165,265,3],[0,168,265,3],[0,171,265,3],[0,174,265,3],[1,177,264,3],[4,180,263,3],[6,183,264,3],[7,186,263,3],[7,189,263,3],[7,192,263,3],[7,195,264,3],[7,198,264,3],[7,201,265,3],[7,204,266,3],[7,207,266,3],[7,210,267,3],[7,213,267,3],[7,216,267,3],[7,219,267,3],[7,222,262,3],[7,225,256,3],[7,228,246,3],[18,231,235,3],[24,234,229,3],[34,237,219,3],[41,240,208,3],[49,243,193,3],[107,246,127,3],[115,249,113,3],[123,252,97,3],[132,255,51,3],[198,255,15,3],[139,258,36,3],[146,261,24,3]]},{"x":764,"y":9,"w":277,"h":269,"maskRects":[[179,0,21,3],[179,3,22,3],[176,6,26,3],[168,9,43,3],[163,12,54,3],[163,15,54,3],[163,18,54,3],[163,21,53,3],[163,24,53,3],[166,27,48,3],[165,30,49,3],[158,33,56,3],[149,36,65,3],[140,39,74,3],[131,42,83,3],[120,45,95,3],[113,48,104,3],[100,51,119,3],[86,54,135,3],[74,57,150,3],[67,60,158,3],[66,63,162,3],[66,66,165,3],[66,69,166,3],[64,72,171,3],[61,75,176,3],[60,78,179,3],[57,81,184,3],[54,84,191,3],[53,87,194,3],[50,90,199,3],[47,93,205,3],[46,96,207,3],[43,99,213,3],[40,102,219,3],[37,105,224,3],[35,108,228,3],[32,111,234,3],[30,114,238,3],[27,117,243,3],[24,120,248,3],[22,123,253,3],[19,126,258,3],[16,129,261,3],[13,132,264,3],[10,135,267,3],[7,138,269,3],[7,141,266,3],[7,144,256,3],[8,147,254,3],[11,150,250,3],[13,153,7,3],[25,153,235,3],[28,156,232,3],[29,159,231,3],[27,162,233,3],[24,165,236,3],[20,168,240,3],[16,171,244,3],[12,174,248,3],[8,177,252,3],[5,180,255,3],[0,183,260,3],[0,186,264,3],[0,189,265,3],[0,192,265,3],[0,195,266,3],[2,198,264,3],[4,201,263,3],[5,204,262,3],[6,207,261,3],[6,210,262,3],[6,213,262,3],[6,216,262,3],[6,219,262,3],[6,222,262,3],[6,225,259,3],[6,228,252,3],[5,231,242,3],[5,234,233,3],[5,237,225,3],[5,240,217,3],[7,243,208,3],[17,246,190,3],[25,249,176,3],[34,252,157,3],[43,255,140,3],[50,258,125,3],[72,261,8,3],[115,261,54,3],[122,264,40,3],[133,267,20,2]]},{"x":1143,"y":10,"w":274,"h":268,"maskRects":[[77,0,20,3],[76,3,22,3],[75,6,26,3],[65,9,44,3],[61,12,52,3],[60,15,53,3],[60,18,53,3],[60,21,53,3],[60,24,53,3],[62,27,49,3],[63,30,50,3],[63,33,57,3],[63,36,66,3],[63,39,72,3],[62,42,82,3],[60,45,94,3],[59,48,103,3],[57,51,113,3],[54,54,127,3],[52,57,141,3],[50,60,154,3],[47,63,159,3],[45,66,161,3],[43,69,163,3],[40,72,167,3],[38,75,172,3],[36,78,175,3],[34,81,180,3],[31,84,186,3],[28,87,191,3],[26,90,196,3],[24,93,200,3],[21,96,205,3],[18,99,211,3],[16,102,215,3],[13,105,221,3],[10,108,227,3],[9,111,230,3],[6,114,236,3],[3,117,242,3],[0,120,248,3],[0,123,249,3],[0,126,253,3],[0,129,255,3],[1,132,257,3],[3,135,258,3],[12,138,252,3],[14,141,250,3],[15,144,249,3],[16,147,245,3],[16,150,244,3],[16,153,229,3],[16,156,227,3],[16,159,228,3],[16,162,232,3],[16,165,237,3],[16,168,241,3],[16,171,246,3],[16,174,250,3],[16,177,254,3],[16,180,258,3],[12,183,262,3],[11,186,263,3],[11,189,263,3],[11,192,262,3],[11,195,260,3],[10,198,259,3],[10,201,258,3],[10,204,258,3],[8,207,260,3],[8,210,260,3],[8,213,260,3],[8,216,260,3],[8,219,260,3],[9,222,259,3],[15,225,253,3],[28,228,241,3],[34,231,237,3],[42,234,229,3],[49,237,221,3],[57,240,209,3],[64,243,193,3],[72,246,178,3],[80,249,162,3],[88,252,144,3],[96,255,128,3],[103,258,59,3],[111,261,43,3],[115,264,32,3],[124,267,13,1]]},{"x":44,"y":280,"w":307,"h":339,"maskRects":[[99,0,20,3],[99,3,20,3],[94,6,30,3],[83,9,49,3],[81,12,55,3],[81,15,55,3],[80,18,56,3],[78,21,58,3],[78,24,58,3],[78,27,57,3],[78,30,57,3],[78,33,60,3],[76,36,68,3],[74,39,79,3],[72,42,91,3],[70,45,104,3],[68,48,111,3],[67,51,123,3],[65,54,137,3],[62,57,152,3],[59,60,161,3],[58,63,164,3],[55,66,167,3],[53,69,169,3],[50,72,174,3],[49,75,178,3],[46,78,182,3],[44,81,187,3],[41,84,192,3],[39,87,197,3],[37,90,202,3],[34,93,207,3],[31,96,213,3],[29,99,218,3],[27,102,221,3],[23,105,229,3],[20,108,235,3],[19,111,239,3],[16,114,244,3],[13,117,250,3],[11,120,254,3],[8,123,260,3],[4,126,267,3],[1,129,273,3],[1,132,276,3],[0,135,280,3],[0,138,283,3],[0,141,287,3],[3,144,285,3],[9,147,279,3],[11,150,277,3],[15,153,271,3],[18,156,249,3],[270,156,12,3],[18,159,246,3],[18,162,244,3],[18,165,244,3],[18,168,244,3],[18,171,244,3],[18,174,244,3],[18,177,244,3],[18,180,244,3],[18,183,246,3],[18,186,248,3],[16,189,254,3],[16,192,257,3],[16,195,262,3],[16,198,265,3],[16,201,269,3],[20,204,269,3],[22,207,271,3],[24,210,272,3],[24,213,276,3],[24,216,280,3],[24,219,283,3],[24,222,283,3],[24,225,283,3],[24,228,283,3],[24,231,283,3],[24,234,279,3],[24,237,278,3],[23,240,275,3],[23,243,274,3],[22,246,275,3],[19,249,278,3],[18,252,279,3],[18,255,279,3],[18,258,279,3],[17,261,280,3],[17,264,280,3],[16,267,281,3],[16,270,281,3],[15,273,282,3],[15,276,282,3],[15,279,282,3],[14,282,283,3],[14,285,284,3],[15,288,284,3],[21,291,278,3],[34,294,264,3],[37,297,260,3],[37,300,251,3],[37,303,244,3],[37,306,237,3],[42,309,223,3],[49,312,210,3],[55,315,184,3],[63,318,167,3],[70,321,26,3],[99,321,115,3],[78,324,7,3],[109,324,77,3],[116,327,63,3],[123,330,48,3],[129,333,36,3],[134,336,26,3]]},{"x":389,"y":280,"w":291,"h":336,"maskRects":[[173,0,20,3],[173,3,20,3],[168,6,29,3],[159,9,48,3],[156,12,55,3],[156,15,55,3],[156,18,55,3],[156,21,57,3],[156,24,58,3],[158,27,56,3],[157,30,57,3],[152,33,62,3],[147,36,68,3],[138,39,80,3],[129,42,90,3],[120,45,101,3],[114,48,110,3],[104,51,121,3],[90,54,137,3],[78,57,152,3],[75,60,157,3],[74,63,160,3],[74,66,163,3],[74,69,166,3],[72,72,169,3],[69,75,175,3],[67,78,180,3],[65,81,184,3],[62,84,189,3],[60,87,194,3],[57,90,200,3],[54,93,204,3],[52,96,209,3],[49,99,215,3],[46,102,220,3],[44,105,224,3],[41,108,230,3],[38,111,236,3],[36,114,240,3],[33,117,246,3],[30,120,252,3],[27,123,256,3],[24,126,263,3],[20,129,269,3],[18,132,273,3],[14,135,277,3],[11,138,280,3],[8,141,283,3],[6,144,284,3],[6,147,282,3],[7,150,273,3],[11,153,266,3],[12,156,11,3],[27,156,247,3],[31,159,243,3],[32,162,242,3],[32,165,242,3],[33,168,241,3],[32,171,242,3],[32,174,242,3],[32,177,242,3],[32,180,242,3],[32,183,242,3],[32,186,242,3],[30,189,245,3],[28,192,247,3],[25,195,250,3],[23,198,252,3],[20,201,255,3],[17,204,255,3],[14,207,256,3],[12,210,257,3],[9,213,260,3],[7,216,262,3],[4,219,265,3],[1,222,268,3],[0,225,269,3],[0,228,269,3],[0,231,269,3],[1,234,268,3],[2,237,267,3],[7,240,262,3],[9,243,260,3],[9,246,260,3],[9,249,263,3],[9,252,264,3],[9,255,265,3],[9,258,265,3],[9,261,265,3],[9,264,266,3],[9,267,266,3],[9,270,267,3],[9,273,267,3],[9,276,268,3],[9,279,268,3],[9,282,269,3],[9,285,269,3],[8,288,270,3],[8,291,265,3],[8,294,258,3],[9,297,247,3],[14,300,242,3],[25,303,231,3],[34,306,222,3],[42,309,212,3],[49,312,197,3],[56,315,183,3],[72,318,160,3],[81,321,113,3],[198,321,27,3],[119,324,66,3],[210,324,6,3],[128,327,50,3],[134,330,36,3],[139,333,27,3]]},{"x":751,"y":284,"w":296,"h":332,"maskRects":[[202,0,20,3],[201,3,21,3],[196,6,30,3],[187,9,48,3],[184,12,55,3],[184,15,55,3],[184,18,55,3],[184,21,55,3],[184,24,54,3],[186,27,50,3],[181,30,55,3],[172,33,64,3],[167,36,69,3],[156,39,80,3],[146,42,90,3],[137,45,99,3],[129,48,107,3],[117,51,119,3],[102,54,137,3],[90,57,151,3],[86,60,157,3],[85,63,160,3],[85,66,162,3],[85,69,164,3],[83,72,169,3],[81,75,172,3],[79,78,176,3],[77,81,181,3],[74,84,186,3],[71,87,191,3],[69,90,196,3],[67,93,200,3],[64,96,205,3],[61,99,211,3],[59,102,216,3],[55,105,221,3],[53,108,225,3],[50,111,231,3],[49,114,233,3],[45,117,240,3],[42,120,246,3],[40,123,250,3],[37,126,255,3],[33,129,262,3],[32,132,264,3],[28,135,268,3],[24,138,272,3],[21,141,275,3],[19,144,277,3],[19,147,275,3],[19,150,270,3],[19,153,263,3],[23,156,255,3],[38,159,240,3],[42,162,236,3],[42,165,236,3],[42,168,236,3],[43,171,235,3],[43,174,234,3],[43,177,234,3],[42,180,236,3],[42,183,236,3],[39,186,239,3],[37,189,241,3],[33,192,245,3],[30,195,249,3],[26,198,253,3],[22,201,257,3],[19,204,259,3],[17,207,261,3],[12,210,261,3],[9,213,263,3],[5,216,265,3],[2,219,268,3],[0,222,270,3],[0,225,270,3],[0,228,270,3],[0,231,270,3],[1,234,269,3],[6,237,264,3],[8,240,262,3],[9,243,261,3],[10,246,260,3],[10,249,260,3],[10,252,261,3],[10,255,265,3],[10,258,265,3],[10,261,265,3],[10,264,266,3],[10,267,266,3],[10,270,266,3],[10,273,267,3],[10,276,267,3],[10,279,268,3],[10,282,268,3],[9,285,269,3],[9,288,269,3],[9,291,269,3],[11,294,266,3],[19,297,249,3],[26,300,230,3],[35,303,212,3],[42,306,196,3],[48,309,183,3],[54,312,169,3],[69,315,35,3],[116,315,98,3],[79,318,10,3],[127,318,78,3],[134,321,62,3],[141,324,46,3],[146,327,35,3],[153,330,21,2]]},{"x":1130,"y":287,"w":297,"h":329,"maskRects":[[81,0,21,3],[80,3,23,3],[77,6,29,3],[69,9,45,3],[64,12,55,3],[63,15,56,3],[63,18,56,3],[63,21,56,3],[63,24,56,3],[66,27,50,3],[66,30,52,3],[66,33,56,3],[66,36,66,3],[66,39,76,3],[66,42,87,3],[66,45,91,3],[65,48,104,3],[63,51,117,3],[61,54,134,3],[59,57,149,3],[57,60,154,3],[56,63,155,3],[54,66,158,3],[51,69,161,3],[48,72,167,3],[47,75,170,3],[44,78,175,3],[41,81,181,3],[39,84,186,3],[37,87,191,3],[34,90,195,3],[32,93,201,3],[29,96,207,3],[27,99,211,3],[25,102,216,3],[22,105,222,3],[19,108,227,3],[18,111,231,3],[15,114,237,3],[11,117,244,3],[9,120,248,3],[7,123,253,3],[4,126,259,3],[1,129,265,3],[0,132,270,3],[0,135,273,3],[0,138,277,3],[0,141,277,3],[0,144,277,3],[3,147,274,3],[6,150,267,3],[17,153,242,3],[262,153,9,3],[20,156,236,3],[20,159,234,3],[20,162,234,3],[20,165,234,3],[20,168,234,3],[20,171,234,3],[20,174,234,3],[20,177,234,3],[20,180,234,3],[20,183,235,3],[20,186,237,3],[20,189,240,3],[19,192,244,3],[19,195,248,3],[19,198,251,3],[19,201,254,3],[19,204,258,3],[25,207,255,3],[25,210,259,3],[27,213,260,3],[27,216,263,3],[27,219,266,3],[27,222,269,3],[27,225,270,3],[27,228,270,3],[27,231,270,3],[27,234,269,3],[27,237,265,3],[27,240,261,3],[27,243,261,3],[27,246,261,3],[26,249,262,3],[23,252,264,3],[23,255,264,3],[22,258,265,3],[22,261,265,3],[22,264,265,3],[21,267,266,3],[21,270,266,3],[21,273,266,3],[20,276,267,3],[20,279,268,3],[20,282,268,3],[19,285,269,3],[19,288,269,3],[23,291,265,3],[29,294,254,3],[42,297,232,3],[51,300,214,3],[59,303,199,3],[67,306,184,3],[75,309,167,3],[82,312,101,3],[187,312,34,3],[91,315,82,3],[100,318,65,3],[107,321,49,3],[115,324,34,3],[121,327,22,2]]},{"x":30,"y":612,"w":310,"h":412,"maskRects":[[76,0,21,3],[76,3,22,3],[74,6,27,3],[65,9,45,3],[63,12,48,3],[63,15,48,3],[63,18,48,3],[63,21,48,3],[63,24,47,3],[194,24,16,3],[66,27,45,3],[191,27,21,3],[66,30,51,3],[191,30,21,3],[66,33,61,3],[188,33,29,3],[66,36,73,3],[179,36,45,3],[66,39,81,3],[178,39,48,3],[66,42,87,3],[178,42,48,3],[65,45,99,3],[178,45,62,3],[65,48,176,3],[65,51,176,3],[63,54,180,3],[61,57,184,3],[60,60,187,3],[58,63,191,3],[56,66,196,3],[54,69,199,3],[52,72,204,3],[50,75,208,3],[49,78,211,3],[48,81,214,3],[45,84,219,3],[42,87,224,3],[40,90,228,3],[39,93,232,3],[36,96,237,3],[34,99,242,3],[32,102,246,3],[30,105,250,3],[28,108,254,3],[25,111,260,3],[24,114,263,3],[21,117,268,3],[19,120,273,3],[16,123,278,3],[15,126,281,3],[12,129,287,3],[10,132,292,3],[8,135,297,3],[5,138,302,3],[2,141,305,3],[0,144,307,3],[0,147,307,3],[0,150,304,3],[0,153,290,3],[295,153,6,3],[0,156,287,3],[1,159,284,3],[13,162,272,3],[15,165,270,3],[18,168,267,3],[19,171,266,3],[19,174,266,3],[19,177,266,3],[19,180,266,3],[19,183,266,3],[19,186,266,3],[19,189,266,3],[19,192,266,3],[19,195,266,3],[19,198,266,3],[19,201,266,3],[19,204,266,3],[19,207,266,3],[19,210,266,3],[19,213,266,3],[18,216,268,3],[18,219,268,3],[18,222,268,3],[18,225,268,3],[18,228,267,3],[20,231,264,3],[21,234,262,3],[23,237,258,3],[24,240,255,3],[25,243,253,3],[26,246,252,3],[26,249,252,3],[26,252,252,3],[26,255,252,3],[25,258,254,3],[25,261,254,3],[25,264,254,3],[25,267,254,3],[25,270,256,3],[25,273,259,3],[25,276,260,3],[25,279,264,3],[25,282,267,3],[25,285,269,3],[25,288,272,3],[24,291,277,3],[24,294,279,3],[24,297,283,3],[24,300,286,3],[24,303,286,3],[24,306,286,3],[23,309,287,3],[23,312,287,3],[23,315,285,3],[23,318,281,3],[23,321,277,3],[19,324,280,3],[19,327,280,3],[18,330,281,3],[18,333,263,3],[282,333,17,3],[18,336,281,3],[17,339,282,3],[17,342,282,3],[17,345,282,3],[16,348,283,3],[16,351,283,3],[16,354,283,3],[15,357,284,3],[15,360,284,3],[15,363,284,3],[22,366,277,3],[32,369,267,3],[39,372,260,3],[48,375,253,3],[56,378,245,3],[64,381,237,3],[70,384,227,3],[70,387,218,3],[70,390,209,3],[71,393,200,3],[79,396,183,3],[86,399,111,3],[242,399,12,3],[94,402,95,3],[101,405,80,3],[109,408,25,3],[139,408,35,3],[118,411,6,1],[151,411,15,1]]},{"x":384,"y":612,"w":311,"h":412,"maskRects":[[218,0,21,3],[218,3,22,3],[214,6,28,3],[205,9,44,3],[204,12,48,3],[204,15,48,3],[96,18,13,3],[204,18,48,3],[92,21,22,3],[204,21,48,3],[92,24,22,3],[206,24,46,3],[90,27,25,3],[199,27,50,3],[80,30,42,3],[192,30,57,3],[79,33,47,3],[186,33,63,3],[79,36,47,3],[175,36,74,3],[79,39,47,3],[164,39,85,3],[79,42,47,3],[154,42,95,3],[71,45,55,3],[148,45,101,3],[69,48,55,3],[134,48,115,3],[68,51,182,3],[66,54,184,3],[64,57,188,3],[62,60,192,3],[60,63,196,3],[57,66,201,3],[56,69,203,3],[53,72,208,3],[50,75,212,3],[49,78,215,3],[46,81,220,3],[44,84,225,3],[41,87,229,3],[39,90,233,3],[37,93,237,3],[35,96,241,3],[32,99,246,3],[30,102,250,3],[27,105,255,3],[25,108,260,3],[23,111,264,3],[20,114,269,3],[17,117,274,3],[15,120,279,3],[13,123,282,3],[10,126,287,3],[7,129,293,3],[4,132,299,3],[2,135,303,3],[2,138,306,3],[2,141,308,3],[3,144,308,3],[6,147,305,3],[8,150,5,3],[20,150,291,3],[23,153,288,3],[24,156,284,3],[24,159,283,3],[24,162,272,3],[24,165,269,3],[24,168,269,3],[24,171,269,3],[24,174,269,3],[24,177,269,3],[24,180,269,3],[24,183,269,3],[24,186,269,3],[24,189,269,3],[24,192,269,3],[24,195,269,3],[24,198,269,3],[24,201,269,3],[24,204,268,3],[24,207,268,3],[24,210,269,3],[24,213,269,3],[24,216,269,3],[24,219,269,3],[24,222,269,3],[24,225,269,3],[26,228,267,3],[27,231,265,3],[29,234,262,3],[31,237,259,3],[31,240,256,3],[31,243,255,3],[31,246,254,3],[31,249,254,3],[31,252,255,3],[31,255,255,3],[31,258,255,3],[31,261,255,3],[31,264,255,3],[29,267,257,3],[26,270,260,3],[23,273,263,3],[19,276,267,3],[17,279,270,3],[14,282,273,3],[10,285,277,3],[9,288,278,3],[5,291,282,3],[1,294,286,3],[0,297,287,3],[0,300,287,3],[0,303,287,3],[0,306,287,3],[1,309,286,3],[5,312,283,3],[7,315,281,3],[11,318,277,3],[11,321,278,3],[11,324,281,3],[11,327,281,3],[11,330,282,3],[11,333,282,3],[11,336,282,3],[11,339,282,3],[11,342,283,3],[11,345,283,3],[11,348,284,3],[11,351,284,3],[11,354,285,3],[11,357,285,3],[11,360,285,3],[11,363,284,3],[11,366,277,3],[10,369,267,3],[8,372,262,3],[8,375,255,3],[8,378,246,3],[15,381,231,3],[23,384,218,3],[31,387,209,3],[39,390,201,3],[45,393,194,3],[52,396,52,3],[108,396,123,3],[82,399,8,3],[116,399,108,3],[123,402,93,3],[130,405,80,3],[136,408,33,3],[170,408,31,3],[145,411,14,1],[186,411,7,1]]},{"x":754,"y":608,"w":304,"h":413,"maskRects":[[200,0,21,3],[199,3,22,3],[195,6,29,3],[187,9,44,3],[185,12,49,3],[185,15,49,3],[185,18,49,3],[185,21,49,3],[179,24,55,3],[171,27,60,3],[88,30,13,3],[167,30,64,3],[86,33,20,3],[156,33,75,3],[85,36,29,3],[147,36,84,3],[85,39,38,3],[139,39,92,3],[83,42,148,3],[81,45,151,3],[79,48,153,3],[78,51,157,3],[76,54,160,3],[74,57,164,3],[71,60,169,3],[68,63,174,3],[66,66,178,3],[64,69,182,3],[62,72,186,3],[60,75,189,3],[58,78,193,3],[56,81,198,3],[54,84,202,3],[51,87,207,3],[49,90,211,3],[47,93,215,3],[44,96,220,3],[42,99,224,3],[40,102,229,3],[37,105,234,3],[35,108,239,3],[33,111,243,3],[30,114,247,3],[28,117,251,3],[26,120,257,3],[23,123,262,3],[20,126,267,3],[18,129,272,3],[16,132,277,3],[13,135,282,3],[10,138,288,3],[8,141,294,3],[5,144,299,3],[5,147,299,3],[5,150,299,3],[7,153,297,3],[9,156,293,3],[25,159,270,3],[27,162,265,3],[28,165,262,3],[28,168,259,3],[28,171,257,3],[28,174,257,3],[28,177,257,3],[28,180,257,3],[28,183,257,3],[28,186,257,3],[28,189,257,3],[28,192,257,3],[28,195,257,3],[28,198,257,3],[28,201,257,3],[28,204,257,3],[28,207,257,3],[27,210,258,3],[27,213,258,3],[27,216,258,3],[27,219,258,3],[27,222,258,3],[28,225,257,3],[28,228,257,3],[30,231,256,3],[31,234,255,3],[33,237,253,3],[33,240,251,3],[33,243,250,3],[33,246,248,3],[33,249,247,3],[31,252,247,3],[27,255,250,3],[25,258,252,3],[21,261,256,3],[18,264,259,3],[15,267,263,3],[10,270,268,3],[8,273,270,3],[5,276,273,3],[1,279,277,3],[0,282,278,3],[0,285,278,3],[0,288,278,3],[0,291,278,3],[1,294,277,3],[3,297,275,3],[8,300,270,3],[9,303,269,3],[10,306,268,3],[10,309,268,3],[10,312,268,3],[10,315,268,3],[10,318,268,3],[10,321,268,3],[10,324,269,3],[10,327,270,3],[10,330,273,3],[10,333,273,3],[10,336,274,3],[10,339,274,3],[10,342,274,3],[10,345,274,3],[9,348,276,3],[5,351,280,3],[1,354,285,3],[0,357,286,3],[0,360,287,3],[0,363,287,3],[5,366,282,3],[12,369,272,3],[17,372,260,3],[24,375,242,3],[30,378,230,3],[37,381,215,3],[44,384,199,3],[50,387,185,3],[56,390,172,3],[63,393,158,3],[68,396,146,3],[93,399,112,3],[102,402,95,3],[147,405,42,3],[154,408,29,3],[160,411,17,2]]},{"x":1119,"y":627,"w":308,"h":392,"maskRects":[[97,0,18,3],[96,3,26,3],[96,6,30,3],[95,9,38,3],[197,9,18,3],[93,12,46,3],[195,12,21,3],[91,15,54,3],[195,15,21,3],[89,18,65,3],[190,18,32,3],[87,21,75,3],[182,21,48,3],[85,24,83,3],[181,24,49,3],[83,27,92,3],[181,27,50,3],[82,30,149,3],[80,33,151,3],[78,36,155,3],[76,39,160,3],[74,42,164,3],[72,45,166,3],[70,48,170,3],[60,51,183,3],[57,54,188,3],[56,57,191,3],[56,60,194,3],[55,63,196,3],[53,66,202,3],[51,69,205,3],[49,72,210,3],[47,75,215,3],[45,78,219,3],[43,81,224,3],[40,84,230,3],[38,87,234,3],[36,90,238,3],[33,93,245,3],[32,96,248,3],[29,99,253,3],[26,102,259,3],[24,105,264,3],[22,108,268,3],[20,111,273,3],[18,114,278,3],[15,117,284,3],[12,120,290,3],[10,123,293,3],[7,126,296,3],[5,129,298,3],[2,132,298,3],[0,135,286,3],[287,135,11,3],[0,138,283,3],[0,141,281,3],[0,144,281,3],[3,147,278,3],[5,150,6,3],[15,150,266,3],[18,153,263,3],[20,156,261,3],[20,159,261,3],[20,162,261,3],[20,165,261,3],[20,168,261,3],[20,171,261,3],[20,174,261,3],[20,177,261,3],[20,180,261,3],[20,183,261,3],[20,186,261,3],[20,189,261,3],[20,192,261,3],[20,195,262,3],[20,198,262,3],[20,201,262,3],[20,204,262,3],[20,207,262,3],[19,210,261,3],[19,213,260,3],[19,216,259,3],[19,219,257,3],[19,222,256,3],[21,225,254,3],[22,228,253,3],[23,231,252,3],[25,234,250,3],[26,237,249,3],[26,240,249,3],[27,243,253,3],[27,246,259,3],[27,249,266,3],[27,252,272,3],[27,255,278,3],[27,258,281,3],[26,261,282,3],[26,264,282,3],[26,267,282,3],[26,270,281,3],[26,273,278,3],[26,276,276,3],[26,279,273,3],[26,282,272,3],[26,285,272,3],[26,288,272,3],[26,291,272,3],[26,294,272,3],[25,297,273,3],[25,300,273,3],[25,303,273,3],[23,306,275,3],[21,309,277,3],[21,312,277,3],[21,315,277,3],[21,318,277,3],[20,321,278,3],[20,324,278,3],[20,327,278,3],[19,330,283,3],[19,333,287,3],[19,336,288,3],[18,339,289,3],[18,342,288,3],[18,345,283,3],[23,348,272,3],[30,351,258,3],[41,354,241,3],[49,357,227,3],[56,360,213,3],[64,363,199,3],[71,366,185,3],[79,369,171,3],[86,372,157,3],[93,375,144,3],[101,378,108,3],[224,378,7,3],[109,381,94,3],[116,384,43,3],[165,384,32,3],[122,387,31,3],[130,390,15,2]]}]}};
const SWAtlasBounds=new WeakMap();
function SWAtlasFrame(image,columns,rows,column,row) {
  const metadata=SWAtlasMetadata[(image.src||'').split('/').pop().split('?')[0]];if(metadata&&metadata.columns===columns&&metadata.rows===rows)return metadata.frames[row*columns+column];
  let formats=SWAtlasBounds.get(image);if(!formats){formats=new Map();SWAtlasBounds.set(image,formats)}
  const key=columns+':'+rows;let frames=formats.get(key);
  if(!frames){
    const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,image.width,image.height).data;frames=[];
    for(let ry=0;ry<rows;ry++)for(let cx=0;cx<columns;cx++){
      const left=Math.floor(cx*image.width/columns),top=Math.floor(ry*image.height/rows),right=Math.floor((cx+1)*image.width/columns),bottom=Math.floor((ry+1)*image.height/rows);let x0=right,y0=bottom,x1=left,y1=top;
      for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)if(pixels[(y*image.width+x)*4+3]>96){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}
      frames.push({x:x0,y:y0,w:Math.max(1,x1-x0+1),h:Math.max(1,y1-y0+1),left,top,bottom});
    }
    formats.set(key,frames);
  }
  return frames[row*columns+column];
}
function SWDrawDirectionalBuilding(ctx,building,images,point,width) {
  const image=images['direction_'+building.kind];if(!image)return false;
  const facing=((building.facing||0)%4+4)%4,tier=Math.min(2,Math.floor((Math.max(1,building.level||1)-1)/3)),frame=SWAtlasFrame(image,4,3,facing,tier);
  const maxWidth=Math.max(...[0,1,2,3].map(i=>SWAtlasFrame(image,4,3,i,tier).w)),scale=width/maxWidth,h=frame.h*scale,w=frame.w*scale;
  ctx.save();ctx.translate(point.x-w/2,point.y-h+12);ctx.scale(scale,scale);if(frame.maskRects){ctx.beginPath();frame.maskRects.forEach(rect=>ctx.rect(...rect));ctx.clip()}ctx.drawImage(image,frame.x,frame.y,frame.w,frame.h,0,0,frame.w,frame.h);ctx.restore();
  const level=Math.max(1,Math.min(10,building.level||1)),side=facing%2?-1:1;
  ctx.save();ctx.translate(point.x,point.y);ctx.scale(side,1);
  // Reinforcement courses, shutters and heraldry add tiers within one occupied plot.
  for(let tier=2;tier<=level;tier++){
    const px=width*(-.23+((tier-2)%3)*.19),py=-h*(.18+Math.floor((tier-2)/3)*.12);
    ctx.strokeStyle=tier>=8?'#b9a170b3':'#7e806da6';ctx.lineWidth=tier>=8?1.2:.85;ctx.beginPath();ctx.moveTo(px-4,py);ctx.lineTo(px+4,py+2);ctx.stroke();
    if(tier>=4){ctx.fillStyle=tier>=9?'#d0b273':'#617584';ctx.fillRect(px-1,py-4,2,3)}
  }
  if(level>=3&&facing<2){const px=width*.19,py=-h*.49;ctx.fillStyle='#325475';ctx.beginPath();ctx.moveTo(px-3,py);ctx.lineTo(px+3,py+1);ctx.lineTo(px+3,py+13);ctx.lineTo(px,py+11);ctx.lineTo(px-3,py+12);ctx.closePath();ctx.fill();if(level>=7){ctx.strokeStyle='#baa36c';ctx.lineWidth=.65;ctx.stroke()}}
  if(level>=6){const px=-width*.25,py=-h*.29;ctx.fillStyle='#ccad6c';ctx.fillRect(px-1,py,2,4);ctx.strokeStyle='#574b39';ctx.lineWidth=.7;ctx.strokeRect(px-2,py-1,4,6)}
  if(level===10){ctx.strokeStyle='#bda16b';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(width*.12,-h*.88);ctx.lineTo(width*.12,-h*.98);ctx.stroke();ctx.fillStyle='#3c6790';ctx.beginPath();ctx.moveTo(width*.12,-h*.98);ctx.lineTo(width*.22,-h*.955);ctx.lineTo(width*.12,-h*.93);ctx.closePath();ctx.fill()}
  ctx.restore();return true;
}
const SWPaintedUnits={spearman:['pikes11',0],healer:['pikes11',2],shieldbearer:['guards11',0],scout:['guards11',2],crossbow:['missiles11',0],grenadier:['missiles11',2],knight:['engines11',0],ram:['engines11',2]};
function SWDrawPaintedUnit(ctx,kind,images,height,time,moving,attacking,phase,reduced=false) {
  const sculpted=['infantry','archer','healer'].indexOf(kind);if(sculpted>=0&&SWDrawUnit13(ctx,sculpted,images,height,time,moving,attacking,phase,reduced))return true;
  const common=['infantry','archer','cavalry','cannon'].indexOf(kind);
  if(common>=0&&images.combat){const image=images.combat,column=(attacking?4:0)+(reduced?0:attacking?Math.min(3,Math.floor(phase*4)):moving?Math.floor(time*8)%4:0),frame=SWAtlasFrame(image,8,4,column,common),reference=Math.max(...[0,1,2,3].map(col=>SWAtlasFrame(image,8,4,col,common).h)),scale=height/reference;ctx.drawImage(image,frame.x,frame.y,frame.w,frame.h,-frame.w*scale/2,-frame.h*scale,frame.w*scale,frame.h*scale);return true;}
  const entry=SWPaintedUnits[kind],image=entry&&images[entry[0]];if(!image)return false;
  const row=entry[1]+(attacking?1:0),column=reduced?0:attacking?Math.min(3,Math.floor(phase*4)):moving?Math.floor(time*7)%4:0;
  const frame=SWAtlasFrame(image,4,4,column,row),reference=Math.max(...[0,1,2,3].map(col=>SWAtlasFrame(image,4,4,col,entry[1]).h)),scale=height/reference;
  ctx.drawImage(image,frame.x,frame.y,frame.w,frame.h,-frame.w*scale/2,-frame.h*scale,frame.w*scale,frame.h*scale);return true;
}
function SWDrawCivicProject(ctx,building,city,images,time=0) {
  if(!images.civic11)return;const entries=Object.entries(city?.projects||{}).filter(([,project])=>project.siteId===building.id&&project.stage>0);
  const cells=[[[18,80,273,283],[365,42,318,328],[690,20,383,351]],[[17,455,299,270],[365,410,310,318],[717,388,360,347]],[[42,886,250,216],[353,821,331,265],[713,746,350,355]],[[32,1191,247,188],[337,1139,360,252],[711,1093,360,323]]];
  for(const[kind,project]of entries){const row=['market','waterfront','homes','gardens'].indexOf(kind);if(row<0)continue;const rect=cells[row][Math.min(3,project.stage)-1],point=vu(building.x,building.y),width=row===0?55:row===1?45:50,height=width*rect[3]/rect[2],side=(building.facing||0)%2?-1:1;
    ctx.save();ctx.translate(point.x+side*(row===3?-21:25),point.y+(row===1?10:23));if(side<0)ctx.scale(-1,1);ctx.drawImage(images.civic11,...rect,-width/2,-height,width,height);ctx.restore();
  }
}
function SWBuildingSize(building) {
  if(building.kind==='keep')return {...SWKeepSize17(building.level,building.facing||0),level:Math.max(1,Math.min(10,building.level||1)),art:$l(building)};
  const economic17=SWEconomySize17(building.kind,building.level);if(economic17)return {...economic17,level:Math.max(1,Math.min(10,building.level||1)),art:$l(building)};
  const art=$l(building), level=Math.max(1,Math.min(10,building.level||1));
  const tier=Math.min(2,Math.floor((level-1)/3)),directional=SWDirectionalKinds.includes(building.kind),width=directional?(building.kind==='keep'?[104,129,147][tier]:[82,94,106][tier])*(1+(level-1-tier*3)*.01):(building.kind==='well'?72:building.kind==='tower'?78:building.kind==='monument'?88:100)*(1+(level-1)*.009);
  const frames=SWAtlasMetadata[building.kind+'-tiers-directions-v11.png']?.frames.slice(tier*4,tier*4+4),ratio=frames?Math.max(...frames.map(f=>f.h))/Math.max(...frames.map(f=>f.w)):art.rect[3]/art.rect[2];
  const sculpted=typeof SW13SpriteRects!=='undefined'&&(SW13BuildingCells[building.kind]?SW13SpriteRects[(building.facing||0)>=2?'rear':'buildings'][SW13BuildingCells[building.kind][tier]]:SW13SpriteRects.utilities[SW13UtilityKinds.indexOf(building.kind)]);
  return {width,height:width*(sculpted?sculpted.h/sculpted.w:ratio),level,art};
}
function SWDrawArchitectureBase(ctx,building,images,point,width) {
  const {level,art}=SWBuildingSize(building),image=images[art.sheet];if(!image)return;
  const height=width*art.rect[3]/art.rect[2],x=point.x,y=point.y;
  if(building.kind==='well'){
    if(images.well){
      ctx.drawImage(images.well,...art.rect,x-width/2,y-height+12,width,height);
      ctx.save();ctx.strokeStyle=level>=8?'#ad9d6f':'#7d8071';ctx.lineWidth=.6;
      for(let i=2;i<=level;i++){const side=i%2?1:-1,px=x+side*width*.26,py=y-height*(.34+Math.floor((i-2)/2)*.05);ctx.beginPath();ctx.moveTo(px-2,py);ctx.lineTo(px+2,py+1);ctx.stroke()}
      if(level>=3)ctx.drawImage(images.well,572,565,160,215,x-width*.45,y-7,9,12);
      if(level>=5)ctx.drawImage(images.well,572,565,160,215,x+width*.32,y-3,8,11);
      if(level>=7){ctx.fillStyle='#3f6079';ctx.beginPath();ctx.moveTo(x-width*.24,y-height*.55);ctx.lineTo(x-width*.15,y-height*.53);ctx.lineTo(x-width*.15,y-height*.42);ctx.lineTo(x-width*.24,y-height*.45);ctx.closePath();ctx.fill()}
      if(level>=9){ctx.strokeStyle='#bea771';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x-width*.24,y-height*.54);ctx.lineTo(x-width*.20,y-height*.44);ctx.stroke()}
      ctx.restore();return;
    }
    SWDrawCivicDetails(ctx,building,point,width);return;
  }
  const annexArt=$l({...building,level:2}),annexImage=images[annexArt.sheet]||image;
  const annex=(side,scale,lift=0)=>{
    const w=width*scale,h=w*annexArt.rect[3]/annexArt.rect[2],px=x+side*width*.29;
    ctx.drawImage(annexImage,...annexArt.rect,px-w/2,y-h+11-lift,w,h);
  };
  // Additions stay within the original plot width so adjacent buildings remain readable.
  // Their painted materials match the building without multiplying its full silhouette.
  ctx.drawImage(image,...art.rect,x-width/2,y-height+15,width,height);
  const special=['builder','monument','mortar','bombtower','flame','bastion'].includes(building.kind);
  if(level>=2&&special)annex(-1,.20);
  if(level>=3&&special)annex(1,.20);
  if(level>=4)annex(-1,.30);
  if(level>=5){
    ctx.save();ctx.strokeStyle='#9c927572';ctx.lineWidth=2;
    for(const side of[-1,1]){ctx.beginPath();ctx.moveTo(x+side*width*.22,y-height*.24);ctx.lineTo(x+side*width*.25,y+5);ctx.stroke()}
    ctx.restore();
  }
  if(level>=6)annex(1,.30);
  if(level>=7){
    ctx.save();ctx.fillStyle='#34587dcc';ctx.strokeStyle='#b6a273';ctx.lineWidth=.7;
    for(const side of[-1,1]){const px=x+side*width*.22,py=y-height*.38;ctx.beginPath();ctx.moveTo(px-3,py);ctx.lineTo(px+3,py);ctx.lineTo(px+3,py+12);ctx.lineTo(px,py+10);ctx.lineTo(px-3,py+12);ctx.closePath();ctx.fill();ctx.stroke()}
    ctx.restore();
  }
  if(level>=8)annex(.15,.24,height*.60);
  if(level>=9){
    ctx.save();ctx.strokeStyle='#81755dbf';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x-width*.30,y+8);ctx.lineTo(x,y+width*.13);ctx.lineTo(x+width*.30,y+8);ctx.stroke();ctx.restore();
  }
  if(level>=10){
    ctx.save();const px=x+width*.08,py=y-height+18;ctx.strokeStyle='#a99561';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px,py+8);ctx.lineTo(px,py-7);ctx.stroke();ctx.fillStyle='#416890';ctx.beginPath();ctx.moveTo(px,py-7);ctx.quadraticCurveTo(px+6,py-10,px+12,py-6);ctx.lineTo(px+9,py-1);ctx.quadraticCurveTo(px+4,py-5,px,py-2);ctx.closePath();ctx.fill();ctx.restore();
  }
  SWDrawCivicDetails(ctx,building,point,width);
}
function SWDrawArchitecture(ctx,building,images,point,width) {
  if(SWDrawSculptedBuilding13(ctx,building,images,point,width))return;
  if(SWDrawDirectionalBuilding(ctx,building,images,point,width))return;
  const facing=((building.facing||0)%4+4)%4,flip=facing===1||facing===2,back=facing>=2;
  ctx.save();ctx.translate(point.x,point.y);
  const dx=[.26,-.26,-.24,.24][facing]*width,dy=[.12,.12,-.13,-.13][facing]*width;
  ctx.save();ctx.translate(dx,dy);ctx.strokeStyle='#786e55';ctx.lineWidth=1;
  for(let i=0;i<3;i++){ctx.fillStyle=['#827b61','#958b6c','#a79a78'][i];ctx.beginPath();ctx.moveTo(-9,-3-i*2);ctx.lineTo(0,-7-i*2);ctx.lineTo(9,-3-i*2);ctx.lineTo(0,1-i*2);ctx.closePath();ctx.fill();ctx.stroke()}ctx.restore();
  if(flip)ctx.scale(-1,1);if(back)ctx.filter='brightness(.93)';
  SWDrawArchitectureBase(ctx,building,images,{x:0,y:0},width);ctx.filter='none';
  // Entrance awnings distinguish the two reverse views without changing the plot.
  if(back&&building.kind!=='well'){
    ctx.strokeStyle='#65553d';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(-width*.24,-width*.14);ctx.lineTo(-width*.24,width*.02);ctx.stroke();
    ctx.fillStyle=facing===2?'#52748a':'#6e7761';ctx.beginPath();ctx.moveTo(-width*.36,-width*.17);ctx.lineTo(-width*.20,-width*.20);ctx.lineTo(-width*.08,-width*.12);ctx.lineTo(-width*.28,-width*.08);ctx.closePath();ctx.fill();
  }
  ctx.restore();
}
const SWBuildingArtCache=new Map();
function SWBuildingTile(building,images) {
  const {width,height}=SWBuildingSize(building),key=[building.kind,building.level,building.specialty,building.facing||0,!!images.keep17,!!images.keepRear17,!!images.economy17,!!images.buildings13,!!images.buildingsRear13,!!images.utilities13,!!images.upgrades,!!images.atlas,!!images.fortifications,!!images.arsenal,!!images.well,!!images['direction_'+building.kind],images.appearance?.palette||'coastal'].join(':');
  let tile=SWBuildingArtCache.get(key);if(tile)return tile;
  tile=document.createElement('canvas');tile.width=640;tile.height=720;
  const ctx=tile.getContext('2d');ctx.scale(2,2);SWDrawArchitecture(ctx,building,images,{x:160,y:320},width);SWColorBuildingTile(ctx,640,720,images.appearance);
  if(SWBuildingArtCache.size>=64)SWBuildingArtCache.delete(SWBuildingArtCache.keys().next().value);
  SWBuildingArtCache.set(key,tile);return tile;
}
function SWDrawRubble(ctx,building,point,width) {
  const seed=building.x*73+building.y*41+building.level*17;
  const noise=i=>{const n=Math.sin(seed+i*91.7)*17431;return n-Math.floor(n)};
  ctx.save();ctx.fillStyle='#3d352b66';ctx.beginPath();ctx.ellipse(point.x,point.y+3,width*.4,width*.15,0,0,Math.PI*2);ctx.fill();
  // Broken foundations remain solid and low on the ground after the dust clears.
  for(let i=0;i<23;i++) {
    const angle=noise(i)*Math.PI*2,r=Math.sqrt(noise(i+60))*width*.34,x=point.x+Math.cos(angle)*r,y=point.y+Math.sin(angle)*r*.42;
    const w=3+noise(i+100)*9,h=2+noise(i+140)*6;
    ctx.fillStyle=['#817963','#a69b7d','#675e4e','#b5a481'][i%4];ctx.beginPath();ctx.moveTo(x-w/2,y);ctx.lineTo(x,y-h);ctx.lineTo(x+w/2,y-h*.35);ctx.lineTo(x+w*.3,y+2);ctx.closePath();ctx.fill();
  }
  ctx.strokeStyle='#514533';ctx.lineWidth=3;
  for(let i=0;i<5;i++){const x=point.x+(noise(i+200)-.5)*width*.6,y=point.y+(noise(i+220)-.5)*width*.16;ctx.beginPath();ctx.moveTo(x-7,y-2);ctx.lineTo(x+8,y+3);ctx.stroke()}
  ctx.restore();
}
const SWCollapseCache=new Map();
function SWCollapseFragments(building,width,height) {
  const key=[building.kind,building.level,width,height].join(':');if(SWCollapseCache.has(key))return SWCollapseCache.get(key);
  const seeds=Array.from({length:15},(_,i)=>({x:Math.sin(i*17.37+2)*width*.43,y:12-(.06+((i*7)%15)/16)*height})),rect=[[-width*.56,-height-8],[width*.56,-height-8],[width*.56,18],[-width*.56,18]];
  const pieces=seeds.map((seed,index)=>{let poly=rect.map(p=>p.slice());for(let j=0;j<seeds.length;j++){if(index===j)continue;const other=seeds[j],nx=other.x-seed.x,ny=other.y-seed.y,c=(other.x*other.x+other.y*other.y-seed.x*seed.x-seed.y*seed.y)/2,next=[];for(let k=0;k<poly.length;k++){const a=poly[k],b=poly[(k+1)%poly.length],da=a[0]*nx+a[1]*ny-c,db=b[0]*nx+b[1]*ny-c;if(da<=0)next.push(a);if((da<=0)!==(db<=0)){const t=da/(da-db);next.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}}poly=next;if(!poly.length)break;}return {seed,poly};}).filter(p=>p.poly.length>2);if(SWCollapseCache.size>48)SWCollapseCache.delete(SWCollapseCache.keys().next().value);SWCollapseCache.set(key,pieces);return pieces;
}
function SWLegacyCollapse13(ctx,building,images,point,age,reduced) {
  const {width,height}=SWBuildingSize(building);SWDrawRubble(ctx,building,point,width);
  if(!reduced&&age<1050){
    const tile=SWBuildingTile(building,images),pieces=SWCollapseFragments(building,width,height);
    pieces.forEach(({seed,poly},i)=>{const delay=(1+seed.y/height)*80,p=Math.max(0,Math.min(1,(age-delay)/760)),fall=Math.max(12,-seed.y+8)*p*p,drift=Math.sin(i*7.21)*width*.18*p,angle=Math.sin(i*3.79)*p*.7;
      ctx.save();ctx.translate(point.x+seed.x+drift,point.y+seed.y+fall);ctx.rotate(angle);ctx.globalAlpha=p<.72?1:Math.max(0,(1-p)/.28);ctx.beginPath();poly.forEach(([x,y],index)=>index?ctx.lineTo(x-seed.x,y-seed.y):ctx.moveTo(x-seed.x,y-seed.y));ctx.closePath();ctx.clip();ctx.drawImage(tile,-160-seed.x,-320-seed.y,320,360);ctx.restore();
    });
  }
  if(!reduced){SWDrawDust(ctx,point,width,height,age);SWDrawCombatEvent(ctx,{id:building.id,type:'breach',kind:'cannon',tx:building.x,ty:building.y},age,false);}
}
function SWDrawDust(ctx,point,width,height,age) {
  if(age>=1600)return;
  const t=Math.max(0,age)/1600;ctx.save();
  for(let i=0;i<11;i++){const angle=i*2.399,r=(12+t*width*.48)*(i%3+1)/3;ctx.fillStyle=`rgba(155,140,111,${(1-t)*.19})`;ctx.beginPath();ctx.ellipse(point.x+Math.cos(angle)*r,point.y+Math.sin(angle)*r*.35-t*height*.22,6+t*19,4+t*13,0,0,Math.PI*2);ctx.fill()}
  ctx.restore();
}
function SWBuildingPortrait({building,className=''}) {
  const ref=C.useRef(null);
  C.useEffect(()=>{
    let alive=true;const images={};
    Promise.all(Object.entries({...SWDirectionalFiles,keepRear17:'build17/keep-rear.png',economy17:'build17/economy-buildings.png',keep17:'build17/keep-levels.png',buildings13:'sculpted-buildings-v13.png',buildingsRear13:'sculpted-buildings-rear-v13.png',utilities13:'sculpted-utilities-v13.png',atlas:'buildings',civic:'civic-buildings',upgrades:'upgrades',fortifications:'fortifications',arsenal:'arsenal',well:'village-well-v1.png'}).map(async([key,file])=>{try{images[key]=await _u('/art/'+file+(file.includes('.')?'':'.webp'))}catch{}})).then(()=>{
      if(!alive||!ref.current)return;
      let tile=SWBuildingTile(building,images);
      if(building.kind==='wall'||building.kind==='gate'){
        tile=document.createElement('canvas');tile.width=640;tile.height=720;
        const draw=tile.getContext('2d');draw.scale(2,2);draw.translate(-440,145);SWPaintWall(draw,{...building,x:0,y:0},new Map(),new Map());
      }
      const pixels=tile.getContext('2d').getImageData(0,0,tile.width,tile.height).data;
      let minX=tile.width,minY=tile.height,maxX=0,maxY=0;
      for(let y=0;y<tile.height;y++)for(let x=0;x<tile.width;x++)if(pixels[(y*tile.width+x)*4+3]>12){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}
      const width=maxX-minX+1,height=maxY-minY+1,scale=Math.min(384/width,424/height),ctx=ref.current.getContext('2d');
      ctx.clearRect(0,0,400,440);if(width>0&&height>0)ctx.drawImage(tile,minX,minY,width,height,(400-width*scale)/2,(440-height*scale)/2,width*scale,height*scale);
    });return()=>{alive=false};
  },[building.kind,building.level,building.specialty,building.facing]);
  return C.createElement('span',{className:'tiered-building '+className},C.createElement('canvas',{ref,width:400,height:440,style:{width:'100%',height:'100%',objectFit:'contain'},role:'img','aria-label':`${Sl[building.kind]?.name||building.kind} level ${building.level||1}`}));
}
const SWOceanExtensionCache=new WeakMap();
function SWDrawWorldTerrain(ctx,image,view={}) {
  // Share the same shoreline projection as harbor berths and naval combat.
  SWDrawCapitalTerrain(ctx,image,view);
}
function SWDrawCapitalTerrain(ctx,image,view={}) {
  if(!image)return;
  // Keep this projection fixed: pinch and pan move terrain, roads and buildings together.
  const left=-1100,top=-140,right=2300,bottom=1900;
  const scale=Math.max((right-left)/1200,(bottom-top)/800,(338-.519*left-top)/338,(bottom-338+.519*left)/462);
  const y=338-338*scale-.519*left,w=1200*scale,h=800*scale;
  const vl=Math.min(left,view.left??left),vt=Math.min(y,view.top??y),vr=Math.max(left+w,view.right??left+w),vb=Math.max(y+h,view.bottom??y+h);
  // Continue distant edge colors beyond the playable region; never repeat or mirror landmarks.
  if(vt<y)ctx.drawImage(image,0,0,image.width,1,left,vt,w,y-vt+1);
  if(vb>y+h)ctx.drawImage(image,0,image.height-1,image.width,1,left,y+h-1,w,vb-y-h+1);
  if(vl<left)ctx.drawImage(image,0,0,1,image.height,vl,y,left-vl+1,h);
  if(vr>left+w)ctx.drawImage(image,image.width-1,0,1,image.height,left+w-1,y,vr-left-w+1,h);
  for(const[x0,x1,sx]of[[vl,left,0],[left+w,vr,image.width-1]])if(x1>x0){if(vt<y)ctx.drawImage(image,sx,0,1,1,x0,vt,x1-x0,y-vt+1);if(vb>y+h)ctx.drawImage(image,sx,image.height-1,1,1,x0,y+h-1,x1-x0,vb-y-h+1)}
  ctx.drawImage(image,left,y,w,h);
}
function SWDrawBattleTerrain(ctx,image,cameraX,cameraY,width,height,baseScale,offset,coastal) {
  if(!image)return;
  const base=Math.max(width/1200,(height+2*Math.abs(offset))/800)/baseScale;
  const left=cameraX-600*base,top=cameraY-400*base,bottom=cameraY+400*base;
  if(!coastal){ctx.drawImage(image,left,top,1200*base,800*base);return;}
  // Keep the diagonal shore in world coordinates while extending one painted view.
  // This retains the ship's water position without mirrored terrain joins.
  const scale=Math.max(base,(338-.519*left-top)/338,(bottom-338+.519*left)/462);
  const y=338-338*scale-.519*left;
  ctx.drawImage(image,left,y,1200*scale,800*scale);
}
function SWDeploymentTarget(defense,world,scale=1,tolerance=42) {
  const tile=yu(world.x,world.y),x=Math.round(tile.x),y=Math.round(tile.y);
  if(pl(defense,x,y))return{x,y};
  const bounds=fl(defense);let best=null,distance=tolerance;
  for(let tx=bounds.minX;tx<=bounds.maxX;tx++)for(let ty=bounds.minY;ty<=bounds.maxY;ty++)if(pl(defense,tx,ty)){
    const p=vu(tx,ty),d=Math.hypot(p.x-world.x,p.y-world.y)*scale;
    if(d<distance){distance=d;best={x:tx,y:ty};}
  }
  return best;
}
function SWDrawTrebuchet(ctx,level,time=0,moving=false,attack=false,phase=0,image=null) {
  if(image){
    ctx.save();const recoil=attack?Math.sin(Math.min(1,phase)*Math.PI):0;
    ctx.translate(recoil*-2,moving?-Math.abs(Math.sin(time*7))*.7:0);ctx.rotate(recoil*-.025);
    const width=78+(level-1)*.55,height=width*image.height/image.width;
    ctx.drawImage(image,-width/2,-height,width,height);
    const metal=level>=9?'#baa268':'#a0aaa5';ctx.strokeStyle=metal;ctx.lineWidth=.9;
    if(level>=2){
      // Iron straps follow the painted A-frame and axle, with a clear first-rank
      // reinforcement that stays attached to the machine during recoil.
      ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(-width*.16,-height*.19);ctx.lineTo(width*.045,-height*.45);ctx.lineTo(width*.21,-height*.15);ctx.stroke();
      ctx.fillStyle='#57625c';ctx.fillRect(-width*.075,-height*.35,width*.11,height*.045);
    }
    if(level>=3){ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-width*.29,-height*.115);ctx.lineTo(width*.23,-height*.045);ctx.stroke();}
    for(let i=2;i<=level;i++){
      const px=width*(.055+(i-2)*.033),py=-height*(.40-(i-2)*.024);
      ctx.beginPath();ctx.moveTo(px-2,py);ctx.lineTo(px+1,py+2);ctx.stroke();
    }
    if(level>=4){ctx.fillStyle='#2e5884';ctx.beginPath();ctx.moveTo(width*.105,-height*.59);ctx.lineTo(width*.19,-height*.56);ctx.lineTo(width*.18,-height*.43);ctx.lineTo(width*.11,-height*.46);ctx.closePath();ctx.fill();ctx.strokeStyle=metal;ctx.stroke();}
    if(level>=5){ctx.fillStyle=metal;for(const x of[-.285,.235]){ctx.beginPath();ctx.ellipse(width*x,-height*(x<0?.14:.07),width*.025,height*.036,0,0,Math.PI*2);ctx.fill();}}
    if(level>=6){ctx.strokeStyle='#c0c7bd';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-width*.16,-height*.19);ctx.lineTo(width*.21,-height*.15);ctx.stroke();}
    if(level>=7){ctx.strokeStyle='#8c794e';ctx.beginPath();ctx.moveTo(width*.20,-height*.38);ctx.lineTo(width*.20,-height*.65);ctx.stroke();ctx.fillStyle='#356899';ctx.beginPath();ctx.moveTo(width*.20,-height*.64);ctx.lineTo(width*.31,-height*.62);ctx.lineTo(width*.20,-height*.57);ctx.closePath();ctx.fill()}
    if(level>=8){ctx.strokeStyle='#b8a879';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(width*.11,-height*.46);ctx.lineTo(width*.18,-height*.43);ctx.lineTo(width*.19,-height*.56);ctx.stroke();}
    if(level>=10){ctx.fillStyle='#d6bd77';ctx.beginPath();ctx.arc(width*.15,-height*.51,1.4,0,Math.PI*2);ctx.fill()}
    ctx.restore();return;
  }
  const wood=ctx.createLinearGradient(-25,-65,25,0),metal=level<5?'#626c69':level<9?'#89938e':'#ac955f';wood.addColorStop(0,'#a88050');wood.addColorStop(.46,level<4?'#79512f':'#80613f');wood.addColorStop(.72,'#9b774b');wood.addColorStop(1,'#604429');
  ctx.save();
  if(moving)ctx.translate(0,-Math.abs(Math.sin(time*8))*.8);
  ctx.fillStyle='#1d241b55';ctx.beginPath();ctx.ellipse(0,0,28,8,0,0,Math.PI*2);ctx.fill();
  for(const x of[-23,20])for(const y of[-2,-12]){ctx.fillStyle='#463c2c';ctx.beginPath();ctx.ellipse(x,y,6,8,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=metal;ctx.lineWidth=1.7;ctx.stroke();ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.moveTo(x,y-6);ctx.lineTo(x,y+6);ctx.stroke()}
  ctx.strokeStyle='#3e3022';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-25,-11);ctx.lineTo(25,-4);ctx.moveTo(-23,-3);ctx.lineTo(25,-15);ctx.stroke();ctx.strokeStyle=wood;ctx.lineWidth=5;ctx.stroke();
  for(const offset of[-7,6]){ctx.strokeStyle='#3d3022';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-17,offset-8);ctx.lineTo(0,offset-45);ctx.lineTo(18,offset-6);ctx.stroke();ctx.strokeStyle=wood;ctx.lineWidth=4;ctx.stroke();}
  ctx.strokeStyle=metal;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-12,-20);ctx.lineTo(12,-20);ctx.moveTo(-3,-35);ctx.lineTo(4,-35);ctx.stroke();
  const swing=attack?Math.sin(Math.min(1,phase)*Math.PI)*1.25:0;
  ctx.save();ctx.translate(0,-42);ctx.rotate(-.42+swing);
  ctx.strokeStyle='#49331f';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-14,10);ctx.lineTo(39,-27);ctx.stroke();ctx.strokeStyle=wood;ctx.lineWidth=3.5;ctx.stroke();
  ctx.fillStyle=level>=6?'#71796c':'#99846b';ctx.beginPath();ctx.moveTo(-20,6);ctx.lineTo(-5,9);ctx.lineTo(-5,25);ctx.lineTo(-20,22);ctx.closePath();ctx.fill();ctx.fillStyle='#494a3f';ctx.beginPath();ctx.moveTo(-5,9);ctx.lineTo(0,5);ctx.lineTo(0,21);ctx.lineTo(-5,25);ctx.fill();ctx.fillStyle='#b0a187';ctx.beginPath();ctx.moveTo(-20,6);ctx.lineTo(-15,2);ctx.lineTo(0,5);ctx.lineTo(-5,9);ctx.fill();ctx.strokeStyle=metal;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(-16,7);ctx.lineTo(-16,22);ctx.moveTo(-8,9);ctx.lineTo(-8,24);ctx.stroke();
  ctx.strokeStyle='#d0bf95';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(38,-26);ctx.quadraticCurveTo(46,-19,51,-19);ctx.stroke();
  if(!attack||phase<.4){ctx.fillStyle='#7d8072';ctx.beginPath();ctx.ellipse(50,-17,5,4,0,0,Math.PI*2);ctx.fill()}
  ctx.restore();
  if(level>=2){ctx.strokeStyle=metal;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-18,-13);ctx.lineTo(18,-29);ctx.stroke()}
  if(level>=3){ctx.fillStyle='#556b81';ctx.fillRect(-5,-33,10,14);ctx.strokeStyle=metal;ctx.strokeRect(-5,-33,10,14)}
  if(level>=4){ctx.strokeStyle=metal;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-16,-5);ctx.lineTo(16,-16);ctx.stroke()}
  if(level>=5){ctx.fillStyle='#8e977e';ctx.fillRect(-25,-15,7,8);ctx.fillRect(20,-14,7,8)}
  if(level>=6){ctx.strokeStyle=metal;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(-13,-18);ctx.lineTo(0,-40);ctx.lineTo(13,-16);ctx.stroke()}
  if(level>=7){ctx.fillStyle='#355980';ctx.beginPath();ctx.moveTo(-4,-40);ctx.lineTo(-4,-62);ctx.lineTo(10,-57);ctx.lineTo(-4,-52);ctx.fill()}
  if(level>=8){ctx.fillStyle='#b9a56e';for(const x of[-23,20]){ctx.beginPath();ctx.arc(x,-3,2.5,0,Math.PI*2);ctx.fill()}}
  if(level>=9){ctx.strokeStyle='#c6ae68';ctx.lineWidth=1.5;ctx.strokeRect(-5,-33,10,14)}
  if(level>=10){ctx.fillStyle='#cfb363';ctx.beginPath();ctx.moveTo(-3,-62);ctx.lineTo(1,-68);ctx.lineTo(4,-61);ctx.fill()}
  ctx.restore();
}
function SWTroopTier() {
 // Compatibility for painted troop call sites. Equipment belongs in authored
 // animation frames; stationary plates and crests float away during attacks.
}
function SWLegacyDrawShip13(ctx,unit,images,time=0,sinkAge=2000,reduced=false) {
  const kind=wc[unit.kind]?unit.kind:'galley',sculpted=SW13ShipArt(kind,unit.level,images),image=sculpted?.image||images.naval;if(!image)return;
  const rect=sculpted?.rect||Yl.naval[wc[kind].sprite],point=vu(unit.x,unit.y),width=(kind==='bombard'?87:76)*(1+(Math.max(1,unit.level)-1)*.015),height=width*rect[3]/rect[2],dead=unit.hp<=0;
  ctx.save();
  if(dead&&sinkAge>=2300){ctx.strokeStyle='#8b714b90';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(point.x-18+i*11,point.y+Math.sin(i)*5);ctx.lineTo(point.x-8+i*11,point.y+3+Math.sin(i)*5);ctx.stroke()}ctx.restore();return;}
  const progress=dead?Math.min(1,sinkAge/2300):0,bob=reduced?0:Math.sin(time*1.5)*1.2,moving=Math.hypot(unit.vx||0,unit.vy||0)>.005,dx=Math.cos(unit.heading||0)-Math.sin(unit.heading||0),dy=(Math.cos(unit.heading||0)+Math.sin(unit.heading||0))*.52;
  if(moving){ctx.strokeStyle='#d4ede46c';ctx.lineWidth=1.5;for(let i=0;i<3;i++){const d=14+i*10+(time*12%10);ctx.beginPath();ctx.ellipse(point.x-dx*d,point.y-dy*d,8+i*3,2.5+i,Math.atan2(dy,dx),0,Math.PI*2);ctx.stroke()}}
  ctx.strokeStyle='#d4eef280';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(point.x,point.y+3,width*.45,7+progress*14,0,0,Math.PI*2);ctx.stroke();
  ctx.translate(point.x,point.y+bob+progress*height*.4);ctx.rotate(dead?progress*.5:reduced?0:Math.sin(time*.8)*.014);ctx.globalAlpha=1-progress;if(unit.heading!==undefined&&dx<0)ctx.scale(-1,1);
  if(unit.side==='defend')ctx.filter='hue-rotate(135deg)';ctx.drawImage(image,...rect,-width/2,-height,width,height);ctx.filter='none';
  if(unit.hp>0&&unit.hp<unit.maxHp*.6){ctx.fillStyle='#3939326b';for(let i=0;i<3;i++){const p=(time*.45+i*.3)%1;ctx.beginPath();ctx.ellipse(-8+Math.sin(i)*7,-height*.48-p*27,4+p*5,3+p*6,0,0,Math.PI*2);ctx.fill()}}
  ctx.restore();
  if(!dead){const appearance=unit.side==='attack'?(images.fleetAppearance||images.appearance):images.appearance;SWDrawSail(ctx,point.x,point.y+bob,width,SWBannerColors[appearance?.sail]||SWBannerColors.linen,time,unit.heading||0,image,rect);}
  if(!dead&&unit.hp<unit.maxHp){ctx.fillStyle='#16232de6';ctx.fillRect(point.x-21,point.y-height-9,42,4);ctx.fillStyle='#85bed1';ctx.fillRect(point.x-21,point.y-height-9,42*Math.max(0,unit.hp/unit.maxHp),4)}
}
const SWRoadTileCache=new Map();
function SWDrawRoads(ctx,terrain,routes=[],appearance={},buildings=[]) {
  return SWDrawRoads17(ctx,terrain,routes,appearance,buildings);
}
function SWDrawCitizen(ctx,person,position,image,time,reduced=false,images={}) {
  if(SWDrawPaintedWorker(ctx,person,position,images,time,reduced))return;
  if(!image)return;const point=vu(position.x,position.y),frameW=image.width/4,frameH=image.height/2,kind=person.sprite%8,height=43,width=height*.75,phase=time*6+person.id*.83,stride=position.moving&&!reduced?Math.sin(phase):0,work=position.working&&!reduced?Math.sin(time*3+person.id):0;
  ctx.save();ctx.translate(point.x,point.y);ctx.fillStyle='#24322543';ctx.beginPath();ctx.ellipse(0,1,7,3,0,0,Math.PI*2);ctx.fill();if(position.flip)ctx.scale(-1,1);ctx.translate(0,-Math.abs(stride)*1.2);ctx.rotate(stride*.018+work*.009);
  const sx=(kind%4)*frameW,sy=Math.floor(kind/4)*frameH;
  if(position.moving&&!reduced){
    for(const side of[-1,1]){const lift=Math.max(0,stride*side)*2.2,shift=stride*side*.7;ctx.drawImage(image,sx+(side>0?frameW/2:0),sy+frameH*.70,frameW/2,frameH*.30,(side>0?0:-width/2)+shift,-height*.30-lift,width/2,height*.30);}
    ctx.drawImage(image,sx,sy,frameW,frameH*.74,-width/2,-height,width,height*.74);
  }else ctx.drawImage(image,sx,sy,frameW,frameH,-width/2,-height,width,height);
  if(position.working&&kind===4){
    const toolAngle=-.6+work*.55;ctx.save();ctx.translate(7,-22);ctx.rotate(toolAngle);ctx.strokeStyle='#765238';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(8,-7);ctx.stroke();ctx.strokeStyle='#a5aaa0';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(6,-9);ctx.lineTo(10,-6);ctx.stroke();ctx.restore();
    if(kind===4&&work>.65){ctx.strokeStyle='#f3bb67';ctx.lineWidth=.8;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(11,-16);ctx.lineTo(11+Math.cos(i*2)*5,-16-Math.sin(i*2)*5);ctx.stroke()}}
  }
  ctx.restore();
}
function SWDrawBuildingDamage(ctx,building,unit,images,point,time,reduced=false) {
  if(!unit||unit.hp<=0||unit.hp>=unit.maxHp*.85)return;
  const ratio=unit.hp/unit.maxHp,{width,height}=SWBuildingSize(building),seed=building.x*17+building.y*29,stage=ratio<.3?3:ratio<.58?2:1;
  ctx.save();ctx.translate(point.x,point.y);
  for(let i=0;i<stage+1;i++){
    const x=Math.sin(seed+i*7)*width*.27,y=-height*(.12+(i%3)*.14);ctx.strokeStyle='#372e267a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-4,y-6);ctx.lineTo(x+1,y-1);ctx.lineTo(x-2,y+4);ctx.lineTo(x+4,y+8);ctx.stroke();
    if(stage>1){const age=(time*.3+i*.31)%1,r=5+age*(stage===3?20:14),g=ctx.createRadialGradient(x+age*6,y-height*.22-age*52,0,x+age*6,y-height*.22-age*52,r);g.addColorStop(0,`rgba(51,48,42,${(1-age)*.64})`);g.addColorStop(1,'rgba(60,56,47,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x+age*6,y-height*.22-age*52,r,0,Math.PI*2);ctx.fill()}
    if(stage===3&&!reduced){const flicker=.7+.3*Math.sin(time*9+i);ctx.fillStyle='#dc7937ad';ctx.beginPath();ctx.moveTo(x-3,y+3);ctx.quadraticCurveTo(x-5,y-2,x+Math.sin(time*7)*2,y-18*flicker);ctx.quadraticCurveTo(x+5,y-1,x+3,y+3);ctx.fill();ctx.fillStyle='#f3bc61c2';ctx.beginPath();ctx.ellipse(x,y,1.5,4*flicker,0,0,Math.PI*2);ctx.fill()}
  }
  ctx.restore();
}
function SWDrawGarden(ctx,terrain,time=0,images={}) {
  const p=vu(terrain.x,terrain.y),variant=terrain.variant||['flowers','hedge','shade'][Math.abs(terrain.x*7+terrain.y*11)%3];ctx.save();ctx.translate(p.x,p.y);
  ctx.fillStyle='#4f59403b';ctx.beginPath();ctx.ellipse(0,2,26,12,0,0,Math.PI*2);ctx.fill();
  if(variant==='shade'&&images.naval){const rect=Yl.naval[4],width=40,height=width*rect[3]/rect[2];ctx.drawImage(images.naval,...rect,-width/2,-height+5,width,height);ctx.restore();return;}
  if(variant==='shade'){
    ctx.strokeStyle='#765b3b';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-27);ctx.stroke();
    for(let i=0;i<7;i++){ctx.fillStyle=['#405d38','#54733e','#78954c'][i%3];ctx.beginPath();ctx.ellipse(Math.cos(i*2.4)*12,-30+Math.sin(i*2.4)*7,12,9,0,0,Math.PI*2);ctx.fill()}
  }else{
    ctx.strokeStyle='#8f8664';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(24,0);ctx.lineTo(0,11);ctx.lineTo(-24,0);ctx.closePath();ctx.stroke();
    for(let i=0;i<18;i++){const angle=i*2.4,r=Math.sqrt((i+.5)/18)*20,x=Math.cos(angle)*r,y=Math.sin(angle)*r*.42;ctx.fillStyle=variant==='hedge'?'#446037':'#4e6b3b';ctx.beginPath();ctx.ellipse(x,y-3,variant==='hedge'?6:3,variant==='hedge'?4:2,0,0,Math.PI*2);ctx.fill();if(variant!=='hedge'){ctx.fillStyle=['#c98b8c','#e9d993','#b4bed0'][i%3];ctx.beginPath();ctx.arc(x,y-5,1.7,0,Math.PI*2);ctx.fill()}}
  }
  ctx.restore();
}
function SWUnitPortrait({kind,level=1,className=''}) {
 // All troop cards share the same asset loader and rank renderer as combat.
 // Keep the legacy wrapper class without maintaining another sprite selector.
 return C.createElement('span',{className:'troop-portrait '+className,style:{display:'block',width:'100%',height:'100%'}},C.createElement(lu,{kind,level}));
}
function SWDrawCivicDetails(ctx,building,point,width) {
  const{x,y}=point,level=Math.max(1,building.level||1);
  if(building.kind==='well'){
    const radius=width*.22;ctx.save();ctx.translate(x,y);
    ctx.fillStyle='#48504455';ctx.beginPath();ctx.ellipse(0,3,radius+8,radius*.52+4,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#8d8975';ctx.beginPath();ctx.ellipse(0,-6,radius,radius*.52,0,0,Math.PI*2);ctx.fill();ctx.fillRect(-radius,-17,radius*2,12);ctx.fillStyle='#b7ae8c';ctx.beginPath();ctx.ellipse(0,-17,radius,radius*.52,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2d5260';ctx.beginPath();ctx.ellipse(0,-17,radius*.7,radius*.34,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#665e48';ctx.lineWidth=1;for(let i=0;i<7;i++){const px=Math.cos(i*Math.PI/6)*radius;ctx.beginPath();ctx.moveTo(px,-12+Math.sin(i*Math.PI/6)*radius*.3);ctx.lineTo(px,-4+Math.sin(i*Math.PI/6)*radius*.2);ctx.stroke()}
    if(level>=2){ctx.strokeStyle='#795638';ctx.lineWidth=4;for(const side of[-1,1]){ctx.beginPath();ctx.moveTo(side*radius*.85,-9);ctx.lineTo(side*radius*.85,-42-level);ctx.stroke()}ctx.strokeStyle='#a2814e';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-radius,-37-level);ctx.lineTo(radius,-37-level);ctx.stroke();ctx.strokeStyle='#b8a77d';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(2,-38-level);ctx.lineTo(2,-16);ctx.stroke()}
    if(level>=3){ctx.fillStyle=level>=7?'#4b6684':'#98603c';ctx.beginPath();ctx.moveTo(-radius-7,-40-level);ctx.lineTo(0,-55-level);ctx.lineTo(radius+7,-40-level);ctx.lineTo(0,-32-level);ctx.closePath();ctx.fill();ctx.strokeStyle='#c9b480';ctx.lineWidth=1;ctx.stroke()}
    for(let i=4;i<=level;i++){ctx.fillStyle=i>=8?'#ccb66c':'#8c7452';ctx.fillRect(-radius-9+(i-4)*6,4,4,4)}ctx.restore();return;
  }
  if(building.kind==='storehouse'){
    for(let i=0;i<Math.min(6,2+Math.floor(level/2));i++){const px=x-width*.32+i*8,py=y+2-(i%2)*5;ctx.fillStyle='#956b3e';ctx.fillRect(px,py-12,10,11);ctx.strokeStyle='#483d2a';ctx.lineWidth=1;ctx.strokeRect(px,py-12,10,11);ctx.beginPath();ctx.moveTo(px,py-12);ctx.lineTo(px+10,py-1);ctx.stroke()}
  }
  if(building.kind==='workshop'){
    const px=x-width*.3,py=y-12;ctx.strokeStyle='#715736';ctx.lineWidth=4;ctx.beginPath();ctx.arc(px,py,11,0,Math.PI*2);ctx.stroke();ctx.lineWidth=2;for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+Math.cos(a)*12,py+Math.sin(a)*12);ctx.stroke()}
    ctx.fillStyle='#9ba9a8';ctx.fillRect(x+width*.12,y-7,18,3);ctx.strokeStyle='#584633';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+width*.13,y-7);ctx.lineTo(x+width*.13,y+4);ctx.stroke();
  }
  if(building.kind==='tavern'){
    ctx.fillStyle='#852e2d';ctx.beginPath();ctx.moveTo(x-width*.2,y-24);ctx.lineTo(x+width*.12,y-21);ctx.lineTo(x+width*.2,y-12);ctx.lineTo(x-width*.24,y-14);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#c6a366';ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(x+width*.3,y-35);ctx.lineTo(x+width*.3,y-12);ctx.stroke();ctx.fillStyle='#7c5935';ctx.fillRect(x+width*.3-6,y-33,13,10);ctx.fillStyle='#e3c78a';ctx.fillRect(x+width*.3-2,y-30,4,5);
    for(const side of[-1,1]){ctx.fillStyle='#815f3c';ctx.beginPath();ctx.ellipse(x+side*width*.3,y+3,8,4,0,0,Math.PI*2);ctx.fill()}
  }
}
const SWAppearanceColors={coastal:{cloth:'#3c6584',trim:'#c2a975'},ember:{cloth:'#8c4340',trim:'#d1aa6b'},forest:{cloth:'#426a57',trim:'#bcb588'},ivory:{cloth:'#d6ceb2',trim:'#987b4e'}};
const SWBannerColors={'beacon-crown':'#3f918b',blue:'#426987',red:'#934b43',green:'#4c735a',ivory:'#d6cdb1',black:'#3c454b',linen:'#d9cfb3'};
function SWRenderAppearance(appearance={}) {return {palette:'coastal',banner:'blue',road:'earth',sail:'linen',commander:'standard',ornaments:[],...appearance};}
function SWColorBuildingTile(ctx,width,height,appearance={}) {
  const a=SWRenderAppearance(appearance);if(a.palette==='coastal')return;const color=SWAppearanceColors[a.palette]?.cloth;if(!color)return;
  const target=parseInt(color.slice(1),16),tr=target>>16,tg=(target>>8)&255,tb=target&255,pixels=ctx.getImageData(0,0,width,height),data=pixels.data;
  for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2];if(data[i+3]<20||b<r*1.12||g<r*1.02||b<g*.92)continue;const strength=Math.min(.8,(b-r)/55),light=(r*.2126+g*.7152+b*.0722)/93;data[i]=r+(Math.min(255,tr*light)-r)*strength;data[i+1]=g+(Math.min(255,tg*light)-g)*strength;data[i+2]=b+(Math.min(255,tb*light)-b)*strength;}
  ctx.putImageData(pixels,0,0);
}
function SWDrawBanner(ctx,x,y,width,height,color,time=0,crest=true) {
  ctx.save();ctx.strokeStyle='#594c37';ctx.lineWidth=Math.max(.7,width*.05);ctx.beginPath();ctx.moveTo(x,y+height*.27);ctx.lineTo(x,y-height);ctx.stroke();
  const wave=Math.sin(time*2+x*.025)*width*.09;ctx.beginPath();ctx.moveTo(x+1,y-height);ctx.bezierCurveTo(x+width*.35,y-height+wave,x+width*.72,y-height-wave,x+width,y-height+3);if(crest==='crown'){ctx.lineTo(x+width*.96,y-height*.48);ctx.lineTo(x+width*.68,y-height*.59);ctx.lineTo(x+width*.43,y-height*.45);}else ctx.lineTo(x+width*.85,y-height*.5);ctx.bezierCurveTo(x+width*.5,y-height*.45-wave,x+width*.3,y-height*.5+wave,x+1,y-height*.48);ctx.closePath();const g=ctx.createLinearGradient(x,y,x+width,y);g.addColorStop(0,SWRigColor(color,.72));g.addColorStop(.43,color);g.addColorStop(1,SWRigColor(color,.85));ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#d1ba7b90';ctx.lineWidth=.6;ctx.stroke();
  if(crest){ctx.strokeStyle='#e1c88f';ctx.lineWidth=Math.max(.7,width*.06);const cx=x+width*.43,cy=y-height*.75;ctx.beginPath();if(crest==='crown'){ctx.moveTo(cx-width*.20,cy-height*.07);ctx.lineTo(cx-width*.12,cy+height*.065);ctx.lineTo(cx+width*.16,cy+height*.065);ctx.lineTo(cx+width*.21,cy-height*.07);ctx.lineTo(cx+width*.065,cy-height*.015);ctx.lineTo(cx,cy-height*.105);ctx.lineTo(cx-width*.065,cy-height*.015);ctx.closePath();ctx.fillStyle='#e8cc84';ctx.fill();}else{ctx.moveTo(cx-width*.12,cy+2);ctx.lineTo(cx-width*.12,cy-3);ctx.lineTo(cx,cy-5);ctx.lineTo(cx+width*.12,cy-3);ctx.lineTo(cx+width*.12,cy+2);ctx.closePath();ctx.stroke();}}ctx.restore();
}
function SWDrawTownAppearance(ctx,building,appearance={},time=0) {
  const a=SWRenderAppearance(appearance),point=vu(building.x,building.y),{width,height}=SWBuildingSize(building),color=SWBannerColors[a.banner]||SWBannerColors.blue;
  if(['keep','barracks','market','harbor','storehouse','tower'].includes(building.kind)){
    const side=(building.facing||0)%2?-1:1;SWDrawBanner(ctx,point.x+width*.24*side,point.y-height*.61,width*.17,height*.25,color,time,a.banner==='beacon-crown'?'crown':true);
  }
  if(a.festival&&['cottage','market','tavern'].includes(building.kind)){
    ctx.save();ctx.strokeStyle='#89764c';ctx.lineWidth=.75;ctx.beginPath();ctx.moveTo(point.x-width*.35,point.y-height*.43);ctx.quadraticCurveTo(point.x,point.y-height*.31,point.x+width*.35,point.y-height*.43);ctx.stroke();for(let i=0;i<7;i++){const t=i/6,x=point.x+(t-.5)*width*.7,y=point.y-height*(.43-.12*Math.sin(t*Math.PI));ctx.fillStyle=i%2?color:'#cbb783';ctx.beginPath();ctx.moveTo(x-2,y);ctx.lineTo(x+3,y+.8);ctx.lineTo(x+1,y+7);ctx.closePath();ctx.fill();}ctx.restore();
  }
}
function SWDrawOrnament(ctx,ornament,appearance={},time=0,ghost=false) {
  const point=vu(ornament.x,ornament.y),a=SWRenderAppearance(appearance),color=SWBannerColors[a.banner]||SWBannerColors.blue;
  ctx.save();if(ghost)ctx.globalAlpha=.7;ctx.fillStyle='#26342b36';ctx.beginPath();ctx.ellipse(point.x,point.y+2,12,5,0,0,Math.PI*2);ctx.fill();
  if(ornament.kind==='standard')SWDrawBanner(ctx,point.x-2,point.y,18,46,color,time,a.banner==='beacon-crown'?'crown':true);
  else if(ornament.kind==='lantern'){
    const m=SWRigMesh();m.cylinder(0,0,0,.15,.1,.12,'stone',8);m.cylinder(0,0,.1,.037,.025,1.1,'metal',8);m.box(0,0,1.15,.25,.25,.27,'gold');m.cylinder(0,0,1.41,.2,.06,.15,'metal',8);SWRigDraw(ctx,m,{x:point.x,y:point.y,scale:27});const g=ctx.createRadialGradient(point.x,point.y-31,1,point.x,point.y-31,17);g.addColorStop(0,'#ffda8660');g.addColorStop(1,'#ffc96b00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(point.x,point.y-31,17,0,Math.PI*2);ctx.fill();
  }else if(ornament.kind==='statue'){
    const m=SWRigMesh();m.box(0,0,0,.8,.7,.15,'stoneDark');m.box(0,0,.15,.56,.5,.55,'stone');SWRigDraw(ctx,m,{x:point.x,y:point.y,scale:24});SWRigDraw(ctx,SWRigSoldier('idle',0,7),{x:point.x,y:point.y-14,scale:18,yaw:(ornament.facing||0)*Math.PI/2,palette:{cloth:'#7d8f83',metal:'#889b8a',steel:'#9aab91',wood:'#6d8375',skin:'#91a28c',leather:'#73897a',gold:'#a1a88b'}});
  }else SWDrawGarden(ctx,{...ornament,kind:'garden',variant:'flowers'},time);
  ctx.restore();
}
const SWLandmarkCache=new Map();
function SWDrawLandmark(ctx,landmark,appearance={},time=0,reduced=false,images={}) {
  if(!landmark||landmark.kind!=='lighthouse'||landmark.stage<1)return;
  const point=vu(landmark.x??-1,landmark.y??7),a=SWRenderAppearance(appearance),palette=SWAppearanceColors[a.palette]||SWAppearanceColors.coastal,key=landmark.stage+':'+a.palette;
  let tile=SWLandmarkCache.get(key+':'+!!images.lighthouse12);if(!tile){tile=document.createElement('canvas');tile.width=280;tile.height=360;const painter=tile.getContext('2d');if(images.lighthouse12){const frame=SWAtlasFrame(images.lighthouse12,3,1,Math.min(3,landmark.stage)-1,0),scale=168/Math.max(...[0,1,2].map(col=>SWAtlasFrame(images.lighthouse12,3,1,col,0).w));painter.drawImage(images.lighthouse12,frame.x,frame.y,frame.w,frame.h,140-frame.w*scale/2,336-frame.h*scale,frame.w*scale,frame.h*scale);SWColorBuildingTile(painter,280,360,a);}else SWRigDraw(painter,SWRigLighthouse(landmark.stage),{x:140,y:336,scale:75,palette:{cloth:palette.cloth}});SWLandmarkCache.set(key+':'+!!images.lighthouse12,tile);}
  ctx.save();ctx.fillStyle='#2835293f';ctx.beginPath();ctx.ellipse(point.x,point.y+3,29,12,0,0,Math.PI*2);ctx.fill();ctx.drawImage(tile,point.x-70,point.y-168,140,180);
  if(landmark.stage>=3){const lantern={x:point.x,y:point.y-117},glow=ctx.createRadialGradient(lantern.x,lantern.y,0,lantern.x,lantern.y,15);glow.addColorStop(0,'#ffecb4a0');glow.addColorStop(.25,'#f9d58938');glow.addColorStop(1,'#f4cc7e00');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(lantern.x,lantern.y,15,0,Math.PI*2);ctx.fill();if(!reduced){const angle=time*.21,dx=Math.cos(angle)*140,dy=Math.sin(angle)*34,g=ctx.createLinearGradient(lantern.x,lantern.y,lantern.x+dx,lantern.y+dy);g.addColorStop(0,'#ffe7aa28');g.addColorStop(1,'#ffe7aa00');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(lantern.x,lantern.y);ctx.lineTo(lantern.x+dx,lantern.y+dy-18);ctx.lineTo(lantern.x+dx,lantern.y+dy+18);ctx.closePath();ctx.fill();}}
  ctx.restore();
}
function SWDrawHarborAppearance(ctx,buildings,fleet,appearance={},time=0,images={}) {
  const a=SWRenderAppearance(appearance);if(typeof SWCoastBoats!=='function')return;for(const boat of SWCoastBoats(buildings,fleet)){const width=boat.ship.kind==='cutter'?56:66,sculpted=SW13ShipArt(boat.ship.kind,boat.ship.level,images);SWDrawSail(ctx,boat.x,boat.y,width,SWBannerColors[a.sail]||SWBannerColors.linen,time,0,sculpted?.image||images.naval,sculpted?.rect||Yl.naval[wc[boat.ship.kind]?.sprite||0]);}
}
const SWNavalTintCache=new Map();
function SWDrawSail(ctx,x,y,width,color,time=0,heading=0,image=null,rect=null) {
  if(color===SWBannerColors.linen||!image||!rect)return;
  const key=(image.src||'')+':'+rect.join(',')+':'+color;let tile=SWNavalTintCache.get(key);
  if(!tile){tile=document.createElement('canvas');tile.width=rect[2];tile.height=rect[3];const p=tile.getContext('2d');p.drawImage(image,...rect,0,0,tile.width,tile.height);const pixels=p.getImageData(0,0,tile.width,tile.height),data=pixels.data,n=parseInt(color.slice(1),16),rgb=[n>>16,(n>>8)&255,n&255];for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2];if(data[i+3]<10||b<r*1.14||b<g*.91)continue;const strength=Math.min(.94,(b-r)/36),light=(r*.21+g*.72+b*.07)/84;for(let j=0;j<3;j++)data[i+j]+=(Math.min(255,rgb[j]*light)-data[i+j])*strength;}p.putImageData(pixels,0,0);if(SWNavalTintCache.size>=32)SWNavalTintCache.delete(SWNavalTintCache.keys().next().value);SWNavalTintCache.set(key,tile);}
  const height=width*rect[3]/rect[2];ctx.save();ctx.translate(x,y);if(Math.cos(heading)-Math.sin(heading)<0)ctx.scale(-1,1);ctx.drawImage(tile,-width/2,-height,width,height);ctx.restore();
}
function SWDrawCommanderAccessory(ctx,point,appearance={},height=57,time=0) {
  const a=SWRenderAppearance(appearance);if(a.commander==='standard')return;ctx.save();ctx.translate(point.x,point.y-height*.80);
  if(a.commander==='laurel'){for(const side of[-1,1])for(let i=0;i<4;i++){ctx.fillStyle=i%2?'#c6ad68':'#a58b51';ctx.beginPath();ctx.ellipse(side*(4+i*.55),-i*1.6,1.7,.75,side*(-.4-i*.1),0,Math.PI*2);ctx.fill();}}
  else{const color=(SWAppearanceColors[a.palette]||SWAppearanceColors.coastal).cloth;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(-4,10);ctx.lineTo(3,12);ctx.quadraticCurveTo(9+Math.sin(time*2)*2,20,4,30);ctx.lineTo(-5,28);ctx.closePath();ctx.fill();ctx.strokeStyle='#c5aa6b';ctx.lineWidth=.8;ctx.stroke();ctx.fillStyle='#c7b37d';ctx.beginPath();ctx.arc(0,12,1.4,0,Math.PI*2);ctx.fill();}ctx.restore();
}
function SWDrawCombatEvent(ctx,event,age,reduced=false) {
  if(age<0||age>1800||!['impact','heal','breach','ability'].includes(event.type))return;const point=vu(event.tx??event.x,event.ty??event.y),heavy=['cannon','mortar','bombtower','grenadier','trebuchet','naval','ram'].includes(event.kind),water=event.impact==='ship'||event.targetNaval,heal=event.type==='heal',p=age/1800,seed=String(event.id||event.kind||'event').split('').reduce((s,c)=>s+c.charCodeAt(0),0);
  ctx.save();const ground=point.y-(water?3:18),radius=heavy?30:10;
  if(heal){const q=Math.min(1,age/700);ctx.strokeStyle=`rgba(151,196,157,${(1-q)*.8})`;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(point.x,point.y,10+q*8,4+q*3,0,0,Math.PI*2);ctx.stroke();ctx.restore();return;}
  if(age<180){const flash=ctx.createRadialGradient(point.x,ground,0,point.x,ground,radius);flash.addColorStop(0,`rgba(255,237,182,${(1-age/180)*.9})`);flash.addColorStop(.32,`rgba(232,163,82,${(1-age/180)*.7})`);flash.addColorStop(1,'#dda24d00');ctx.fillStyle=flash;ctx.beginPath();ctx.arc(point.x,ground,radius,0,Math.PI*2);ctx.fill();}
  if(reduced){ctx.restore();return;}
  if(age<500){const t=age/500;ctx.strokeStyle=water?`rgba(208,235,229,${(1-t)*.6})`:`rgba(183,164,126,${(1-t)*.4})`;ctx.lineWidth=heavy?2:1;ctx.beginPath();ctx.ellipse(point.x,ground+15,radius*t*1.7,radius*t*.5,0,0,Math.PI*2);ctx.stroke();}
  for(let i=0;i<(heavy?14:4);i++){const angle=i*2.399+seed*.07,life=700+(i%4)*180;if(age>life)continue;const t=age/life,speed=(heavy?32:11)*(0.6+(i%4)*.2),x=point.x+Math.cos(angle)*speed*t,y=ground+Math.sin(angle)*speed*t*.45-Math.sin(t*Math.PI)*(heavy?27:11);ctx.globalAlpha=(1-t)*.8;ctx.fillStyle=water?'#d7e9da':['#7d6b50','#b3a280','#655947'][i%3];ctx.save();ctx.translate(x,y);ctx.rotate(angle+t*4);ctx.fillRect(-1,-1,water?1.5:2.4,water?4:1.8);ctx.restore();}
  if(heavy&&!water){ctx.globalAlpha=1;for(let i=0;i<6;i++){const delay=i*75,t=Math.max(0,Math.min(1,(age-delay)/1450));if(age<delay)continue;const x=point.x+Math.sin(seed+i*13)*11+t*17,y=ground-12-t*38-(i%2)*8,r=4+t*18,g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(93,86,70,${(1-t)*.30})`);g.addColorStop(1,'rgba(109,99,78,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}}
  ctx.restore();
}
function SWDrawEscortCue(ctx,unit,objective,time=0,scale=1,reduced=false) {
  if(!unit?.sagaEscort||unit.hp<=0)return;const point=vu(unit.x,unit.y),isShip=!!unit.naval,target=isShip?vu(-3.5,-1.1):vu(-2,3),height=isShip?80:35;
  ctx.save();ctx.strokeStyle=unit.rescued?'#a7d39ebd':'#d9c485b0';ctx.lineWidth=1.3/scale;ctx.beginPath();ctx.ellipse(point.x,point.y+3,isShip?29:12,isShip?9:5,0,0,Math.PI*2);ctx.stroke();
  if(!unit.rescued&&!unit.waitingForBattery){ctx.setLineDash([3/scale,7/scale]);ctx.strokeStyle='#dfd4a347';ctx.lineWidth=1/scale;ctx.beginPath();ctx.moveTo(point.x,point.y);ctx.lineTo(target.x,target.y);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='#d0c58fa0';ctx.beginPath();ctx.moveTo(target.x-5/scale,target.y-3/scale);ctx.lineTo(target.x,target.y);ctx.lineTo(target.x+5/scale,target.y-3/scale);ctx.stroke();}
  const bar=28/scale;ctx.fillStyle='#102524e6';ctx.fillRect(point.x-bar/2,point.y-height-7/scale,bar,3/scale);ctx.fillStyle=unit.hp/unit.maxHp<.35?'#c57864':'#cfbb7a';ctx.fillRect(point.x-bar/2,point.y-height-7/scale,bar*Math.max(0,unit.hp/unit.maxHp),3/scale);ctx.font=`600 ${9/scale}px system-ui`;ctx.textAlign='center';ctx.lineWidth=2.5/scale;ctx.strokeStyle='#17342dcc';ctx.strokeText(isShip?'Repair vessel':'Engineer',point.x,point.y-height-12/scale);ctx.fillStyle='#eee1b8';ctx.fillText(isShip?'Repair vessel':'Engineer',point.x,point.y-height-12/scale);ctx.restore();
}
let SWPreviewAssets17;
function SWCosmeticPreview({state,item,appearance={},animate=false}) {
  const ref=C.useRef(null),a=SWRenderAppearance(appearance),level=state?.buildings?.find(b=>b.kind==='keep')?.level||4,key=JSON.stringify(a)+':'+(item?.id||'')+':'+level;
  C.useEffect(()=>{
    let alive=true,raf=0;
    SWPreviewAssets17 ||= Promise.all(Object.entries({keepRear17:'build17/keep-rear.png',economy17:'build17/economy-buildings.png',keep17:'build17/keep-levels.png',buildings13:'sculpted-buildings-v13.png',utilities13:'sculpted-utilities-v13.png',ships13:'ships-v13.png',coastalShips15:'build15/coastal-ships.png',naval:'naval.webp',commanders:'commanders.webp'}).map(async([name,file])=>[name,await _u('/art/'+file)])).then(Object.fromEntries);
    SWPreviewAssets17.then(assets=>{
      if(!alive||!ref.current)return;
      const images={...assets,appearance:a,fleetAppearance:a},ctx=ref.current.getContext('2d'),start=performance.now(),slot=item?.slot||item?.category||String(item?.id||'').split(':')[0];
      const roads=[{kind:'road',x:0,y:1},{kind:'road',x:1,y:1},{kind:'road',x:2,y:1},{kind:'road',x:2,y:2},{kind:'road',x:2,y:3}],noRoutes=[],noBuildings=[];
      const draw=now=>{
        if(!alive)return;const time=animate?(now-start)/1000:0;
        const sea=slot==='sail'||slot==='ship',background=ctx.createLinearGradient(0,0,0,360);background.addColorStop(0,sea?'#123346':'#173c3b');background.addColorStop(1,sea?'#276476':'#506346');ctx.fillStyle=background;ctx.fillRect(0,0,640,360);
        const glow=ctx.createRadialGradient(320,235,25,320,235,260);glow.addColorStop(0,'#baca7c20');glow.addColorStop(1,'#17332a00');ctx.fillStyle=glow;ctx.fillRect(0,0,640,360);
        const building=(kind,rank,x,y,scale=1.7)=>{const b={id:'preview-'+kind,kind,level:rank,facing:0,x:0,y:0},p=vu(0,0);ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.translate(-p.x,-p.y);ctx.drawImage(SWBuildingTile(b,images),p.x-160,p.y-320,320,360);SWDrawTownAppearance(ctx,b,a,time);ctx.restore();};
        if(sea){
          for(let i=0;i<6;i++){ctx.strokeStyle='#d5eadd20';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(320,280+i*7,80+i*26,15+i*4,-.08,.1,Math.PI-.2);ctx.stroke();}
          ctx.save();ctx.translate(320,310);ctx.scale(2.35,2.35);ctx.translate(-600,-175);SWDrawNavalUnit(ctx,{kind:'galley',x:0,y:0,level:Math.min(10,Math.max(1,level)),hp:100,maxHp:100,side:'attack',heading:0},images,time,0,true);ctx.restore();
        }else if(slot==='commander'||slot==='outfit'){
          const id=Oc[state?.commander]?state.commander:Object.keys(Oc)[0],rect=Ql.commanders[Oc[id].sprite],height=285,width=height*rect[2]/rect[3];ctx.save();ctx.translate(320,333);ctx.drawImage(images.commanders,...rect,-width/2,-height,width,height);SWDrawCommanderAccessory(ctx,{x:0,y:0},a,height,time);ctx.restore();
        }else if(slot==='ornament'){
          building('cottage',3,430,260,1.1);ctx.save();ctx.translate(255,303);ctx.scale(4,4);ctx.translate(-600,-175);SWDrawOrnament(ctx,{kind:item?.value||'standard',x:0,y:0},a,time);ctx.restore();
        }else if(slot==='road'){
          ctx.save();ctx.translate(-655,-210);ctx.scale(1.7,1.7);SWDrawRoads(ctx,roads,noRoutes,a,noBuildings);ctx.restore();building('cottage',3,160,205,.95);building('cottage',3,458,245,.95);
        }else{
          building('cottage',Math.min(level,5),474,288,1.3);building('keep',level,282,322,1.8);
        }
        if(animate)raf=requestAnimationFrame(draw);
      };draw(performance.now());
    }).catch(()=>{});
    return()=>{alive=false;cancelAnimationFrame(raf)};
  },[key,animate]);
  return C.createElement('canvas',{ref,width:640,height:360,className:'cosmetic-preview-canvas',style:{display:'block',width:'100%',height:'100%',objectFit:'contain',borderRadius:'12px'},role:'img','aria-label':`${item?.name||'Town appearance'} preview`});
}
const SWRigSource = {"version":1,"projection":{"azimuth":0.7853981634,"elevation":0.5235987756,"light":[-0.5,-0.6,0.8]},"palette":{"stone":"#b6aa8b","stoneDark":"#877c68","metal":"#8997a0","steel":"#bcc6c8","gold":"#c7aa66","wood":"#765239","woodLight":"#aa8055","cloth":"#375c77","skin":"#c39a77","leather":"#4e4035","sail":"#dbd0ae","shadow":"#263329"},"soldier":{"height":1.84,"hipHeight":0.84,"hipWidth":0.16,"shoulderHeight":1.35,"shoulderWidth":0.26,"upperLeg":0.38,"lowerLeg":0.38,"upperArm":0.3,"lowerArm":0.28,"headRadius":0.15,"states":{"idle":{"duration":2.8,"loop":true,"frames":12},"walk":{"duration":0.8,"loop":true,"frames":12,"stride":0.55},"work":{"duration":1.2,"loop":true,"frames":12},"attack":{"duration":0.72,"loop":false,"frames":12,"keys":[[0,-0.3],[0.27,-2.1],[0.46,0.95],[0.72,0.2],[1,-0.3]],"contact":0.46},"stagger":{"duration":0.36,"loop":false,"frames":8},"death":{"duration":0.85,"loop":false,"frames":12}}},"ship":{"length":3.2,"beam":0.95,"keelDepth":0.35,"deckHeight":0.3,"mastHeight":2.25,"sailWidth":1.45,"sailHeight":1.42,"segments":12},"lighthouse":{"height":3.1,"baseRadius":0.7,"topRadius":0.43,"courses":11,"segments":16,"lanternHeight":0.58,"stages":[0.3,0.68,1]},"export":{"directions":8,"soldierCell":[128,144],"shipCell":[256,240],"buildingCell":[256,320],"alpha":true,"maxLevel":10}};
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
function SWCoastBoats(buildings,fleet,now=Date.now()) {
  const ports=buildings.filter(b=>b.kind==='harbor');
  if(!ports.length) return [];
  return fleet.map((ship,index)=>{
    const port=ports[index%ports.length];
    const berth=vu(port.x-1.8,port.y+0.1+Math.floor(index/ports.length)*0.48);
    const away={x:Math.max(30,berth.x-120),y:Math.max(28,berth.y-70)};
    const voyage=ship.voyage;
    const progress=voyage?Math.max(0,Math.min(1,(now-voyage.startedAt)/(voyage.readyAt-voyage.startedAt))):0;
    const sailing=!!voyage&&voyage.readyAt>now;
    const distance=sailing?Math.sin(progress*Math.PI):0;
    return {ship,index,berth,away,sailing,returned:!!voyage&&!sailing,x:berth.x+(away.x-berth.x)*distance,y:berth.y+(away.y-berth.y)*distance};
  });
}
function SWCoastHit(x,y,buildings,fleet,now=Date.now()) {
  for(const boat of SWCoastBoats(buildings,fleet,now)) if(Math.abs(x-boat.x)<34&&y<boat.y+12&&y>boat.y-72) return {type:'ship',id:boat.ship.id};
  return null;
}
function SWDrawCoast(ctx,{buildings=[],fleet=[],naval,ships13,land,coastLand,time=0,placing}) {
  const shore=[];
  for(let x=-150;x<=950;x+=22) shore.push({x,y:338-x*0.519+Math.sin(x*0.027)*4+Math.cos(x*.013)*3});
  const path=()=>{ctx.beginPath();ctx.moveTo(-150,-350);ctx.lineTo(950,-350);for(let i=shore.length-1;i>=0;i--)ctx.lineTo(shore[i].x,shore[i].y);ctx.closePath()};
  if(!coastLand){
  ctx.save();path();ctx.clip();
  const sea=ctx.createLinearGradient(0,-40,300,380);sea.addColorStop(0,'#285c72');sea.addColorStop(.55,'#337f91');sea.addColorStop(1,'#57a6aa');ctx.fillStyle=sea;ctx.fillRect(-150,-350,1100,950);
  // Reuse the painted sea texture so water belongs to the same illustrated world.
  if(land){ctx.globalAlpha=.52;ctx.drawImage(land,35,4,170,70,-150,-350,1100,800);ctx.globalAlpha=1;}
  for(let i=0;i<42;i++){
    const x=(i*113)%900-90,y=(i*71)%480-100+Math.sin(time*.2+i)*3;
    ctx.strokeStyle=i%3?'#b4e5de22':'#cee9df44';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+13,y+3,x+28,y);ctx.stroke();
  }
  ctx.restore();
  // A continuous rocky bank and promenade connect the three berths to town.
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  for(const [width,color,dy] of [[15,'#69664edd',6],[8,'#b6af8999',3],[2,'#d5f1dfaa',-3]]){
    ctx.beginPath();shore.forEach((p,i)=>i?ctx.lineTo(p.x,p.y+dy):ctx.moveTo(p.x,p.y+dy));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
  }
  for(let i=0;i<shore.length;i++){
    const p=shore[i];
    if(naval){const rect=Yl.naval[5],size=14+(i%4)*4;ctx.save();ctx.filter='saturate(.35)';ctx.drawImage(naval,...rect,p.x-size/2,p.y-size*.4,size,size*.72);ctx.restore();}
  }
  ctx.restore();
  }
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  SWDrawRoads(ctx,[...Array.from({length:6},(_,i)=>({kind:'road',x:-1,y:i+1})),...SWCoast.slots.filter(slot=>buildings.some(b=>b.kind==='harbor'&&b.x===slot.x&&b.y===slot.y)||placing==='harbor').map(slot=>({...slot,kind:'road'}))]);
  for(const slot of SWCoast.slots){
    const p=vu(slot.x,slot.y),end=vu(slot.x-1.6,slot.y),landEnd=vu(-1,slot.y),port=buildings.find(b=>b.kind==='harbor'&&b.x===slot.x&&b.y===slot.y);
    if(!port && placing!=='harbor') continue;
    const side={x:-14,y:7};
    ctx.beginPath();ctx.moveTo(p.x+side.x,p.y+side.y);ctx.lineTo(end.x+side.x,end.y+side.y);ctx.lineTo(end.x-side.x,end.y-side.y);ctx.lineTo(p.x-side.x,p.y-side.y);ctx.closePath();ctx.fillStyle='#756044';ctx.fill();ctx.strokeStyle='#403b2c';ctx.lineWidth=3;ctx.stroke();
    for(let j=0;j<=9;j++){const a=j/9,px=p.x+(end.x-p.x)*a,py=p.y+(end.y-p.y)*a;ctx.beginPath();ctx.moveTo(px+side.x,py+side.y);ctx.lineTo(px-side.x,py-side.y);ctx.strokeStyle=j%2?'#b29a71':'#9b805c';ctx.lineWidth=3;ctx.stroke();}
    for(const q of [p,end]) for(const sign of [-1,1]){ctx.fillStyle='#483e2d';ctx.fillRect(q.x+side.x*sign-2,q.y+side.y*sign-9,4,14);ctx.fillStyle='#d3b782';ctx.fillRect(q.x+side.x*sign-2,q.y+side.y*sign-10,4,3);}
    if(!port){ctx.beginPath();ctx.ellipse(p.x,p.y,24,13,0,0,Math.PI*2);ctx.fillStyle=placing==='harbor'?'#4387bddd':'#314852cc';ctx.fill();ctx.strokeStyle=placing==='harbor'?'#c0e6ff':'#a5b9b999';ctx.lineWidth=2;ctx.stroke();if(placing==='harbor'){ctx.fillStyle='#edf8ff';ctx.font='700 18px system-ui';ctx.textAlign='center';ctx.fillText('+',p.x,p.y+6);}}
  }
  ctx.restore();
  for(const boat of SWCoastBoats(buildings,fleet)){
    const {ship,index,x,y,berth,away,sailing,returned}=boat;
    if(!naval||!wc[ship.kind])continue;
    const sculpted=SW13ShipArt(ship.kind,ship.level,{ships13}),shipImage=sculpted?.image||naval,rect=sculpted?.rect||Yl.naval[wc[ship.kind].sprite],width=ship.kind==='cutter'?56:66,height=width*rect[3]/rect[2],bob=Math.sin(time*1.3+index)*1.5;
    ctx.save();
    if(sailing){ctx.setLineDash([4,9]);ctx.strokeStyle='#acd3d14d';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(berth.x,berth.y);ctx.lineTo(away.x,away.y);ctx.stroke();ctx.setLineDash([]);}
    ctx.beginPath();ctx.ellipse(x,y+2,width*.42,5,0,0,Math.PI*2);ctx.fillStyle='#0d465b66';ctx.fill();ctx.strokeStyle='#d4f6e688';ctx.lineWidth=1;ctx.stroke();
    ctx.globalAlpha=ship.level?1:.65;ctx.drawImage(shipImage,...rect,x-width/2,y-height+bob,width,height);ctx.globalAlpha=1;
    if(returned){ctx.beginPath();ctx.arc(x,y-height-6,7,0,Math.PI*2);ctx.fillStyle='#d3b76a';ctx.fill();ctx.fillStyle='#213a45';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText('✓',x,y-height-2);}
    ctx.restore();
  }
}
var Du = [
  {
    label: `The crossing`,
    title: `Every kingdom begins with a landing.`,
    copy: `Beyond the sea, a new home waits.`,
  },
  {
    label: `The settlement`,
    title: `Give your people a place to stand.`,
    copy: `Raise homes. Gather supplies. Build your first defenses.`,
  },
  {
    label: `Your legacy`,
    title: `A settlement today. A kingdom tomorrow.`,
    copy: `The frontier belongs to those who can hold it.`,
  },
];
function Ou({ onFinish: e, reduced: t }) {
  let [n, r] = (0, C.useState)(0),
    i = (0, C.useRef)(e);
  i.current = e;
  let a = Math.min(2, Math.floor(n / 4e3));
  return (
    (0, C.useEffect)(() => {
      if (t) return;
      let e = performance.now(),
        n = setInterval(() => {
          let t = performance.now(),
            n = Math.min(200, t - e);
          ((e = t), document.hidden || r((e) => Math.min(12e3, e + n)));
        }, 100);
      return () => clearInterval(n);
    }, [t]),
    (0, C.useEffect)(() => {
      n >= 12e3 && i.current();
    }, [n]),
    (0, F.jsx)(As, {
      open: !0,
      onOpenChange: (t) => !t && e(),
      children: (0, F.jsxs)(Ns, {
        showCloseButton: !1,
        className: `opening-sequence translate-x-0 translate-y-0 ${t ? `opening-reduced` : ``}`,
        children: [
          (0, F.jsx)(Fs, { className: `sr-only`, children: `A new beginning` }),
          (0, F.jsx)(Is, {
            className: `sr-only`,
            children: `A short introduction showing a coastal arrival, a growing settlement, and a fortified capital.`,
          }),
          (0, F.jsx)(
            `div`,
            {
              className: `opening-landscape`,
              "data-scene": a,
              "aria-hidden": `true`,
            },
            a,
          ),
          (0, F.jsx)(`div`, {
            className: `opening-shade`,
            "aria-hidden": `true`,
          }),
          (0, F.jsxs)(`button`, {
            autoFocus: !0,
            className: `opening-skip`,
            onClick: e,
            children: [`Skip intro `, (0, F.jsx)(Ce, { size: 17 })],
          }),
          (0, F.jsx)(
            `div`,
            {
              className: `opening-stage scene-${a}`,
              "aria-hidden": `true`,
              children:
                a === 0
                  ? (0, F.jsxs)(F.Fragment, {
                      children: [
                        (0, F.jsx)(`div`, {
                          className: `opening-ship ship-lead`,
                          children: (0, F.jsx)(uu, { kind: `cog` }),
                        }),
                        (0, F.jsx)(`div`, {
                          className: `opening-ship ship-escort`,
                          children: (0, F.jsx)(uu, { kind: `cutter` }),
                        }),
                      ],
                    })
                  : (0, F.jsxs)(F.Fragment, {
                      children: [
                        (0, F.jsx)(`div`, {
                          className: `opening-town`,
                          children: [
                            `cottage`,
                            `lumber`,
                            `keep`,
                            `farm`,
                            `tower`,
                          ].map((e, t) =>
                            (0, F.jsx)(
                              `div`,
                              {
                                className: `opening-building building-${t}`,
                                style: { animationDelay: `${t * 0.35}s` },
                                children: (0, F.jsx)(tu, {
                                  building: { kind: e, level: a === 2 ? 3 : 1 },
                                }),
                              },
                              e,
                            ),
                          ),
                        }),
                        (0, F.jsx)(`div`, {
                          className: `opening-column`,
                          children: Array.from({ length: 5 }, (e, t) =>
                            (0, F.jsx)(
                              `div`,
                              {
                                style: { animationDelay: `${t * 0.13}s` },
                                children: (0, F.jsx)(lu, {
                                  kind: t % 2 ? `spearman` : `infantry`,
                                }),
                              },
                              t,
                            ),
                          ),
                        }),
                        a === 2 &&
                          (0, F.jsx)(`div`, {
                            className: `opening-commander`,
                            children: (0, F.jsx)(nu, { id: `captain` }),
                          }),
                      ],
                    }),
            },
            `stage-${a}`,
          ),
          (0, F.jsxs)(
            `div`,
            {
              className: `opening-caption`,
              children: [
                (0, F.jsx)(`span`, { children: Du[a].label }),
                (0, F.jsx)(`h1`, { children: Du[a].title }),
                (0, F.jsx)(`p`, { children: Du[a].copy }),
              ],
            },
            `caption-${a}`,
          ),
          (0, F.jsxs)(`div`, {
            className: `opening-footer`,
            children: [
              (0, F.jsx)(`div`, {
                className: `opening-timeline`,
                "aria-label": `Introduction chapter ${a + 1} of 3`,
                children: Du.map((e, t) =>
                  (0, F.jsx)(
                    `span`,
                    {
                      children: (0, F.jsx)(`i`, {
                        style: {
                          width: `${Math.max(0, Math.min(100, (n - t * 4e3) / 40))}%`,
                        },
                      }),
                    },
                    e.label,
                  ),
                ),
              }),
              (0, F.jsxs)(`button`, {
                onClick: () => (a === 2 ? e() : r((a + 1) * 4e3)),
                children: [
                  a === 2 ? `Enter your kingdom` : `Continue`,
                  (0, F.jsx)(D, { size: 18 }),
                ],
              }),
            ],
          }),
        ],
      }),
    })
  );
}
var ku = `hearth-device-kingdom-v1`;
function Au() {
  return typeof window > `u`
    ? void 0
    : window.webkit?.messageHandlers?.stonewake;
}
function ju() {
  if (typeof window > `u`) return null;
  let e = window;
  if (Au()) return e.__STONEWAKE_SAVE__ || null;
  try {
    return JSON.parse(
      localStorage.getItem(ku) ||
        localStorage.getItem(ku + `-backup`) ||
        `null`,
    );
  } catch {
    try {
      return JSON.parse(localStorage.getItem(ku + `-backup`) || `null`);
    } catch {
      return null;
    }
  }
}
function Mu(e) {
  let n = Au();
  if (n) {
    const requestId = nativeSaveStatus.begin();
    try {
      const payload = JSON.stringify(e);
      window.__STONEWAKE_SAVE__ = e;
      n.postMessage({ kind: `save`, payload, requestId });
      return `pending`;
    } catch (error) { nativeSaveStatus.failed(requestId); throw error; }
  }
  let t = JSON.stringify(e), r = localStorage.getItem(ku);
  return (
    r && localStorage.setItem(ku + `-backup`, r),
    localStorage.setItem(ku, t),
    `saved`
  );
}
function Nu() {
  if (typeof window > `u`) return !1;
  if (Au()) return !!window.__STONEWAKE_INTRO_SEEN__;
  try {
    return localStorage.getItem(`hearth-opening-v1`) === `seen`;
  } catch {
    return !1;
  }
}
function Pu() {
  if (Au())
    ((window.__STONEWAKE_INTRO_SEEN__ = !0),
      Au().postMessage({ kind: `introSeen` }));
  else
    try {
      localStorage.setItem(`hearth-opening-v1`, `seen`);
    } catch {}
}
var Iu = {
    hammer: N,
    flag: se,
    swords: we,
    castle: ne,
    shield: be,
    crown: oe,
    flame: ce,
    users: De,
    trophy: Ee,
  };
var Lu = { gold: A, wood: Te, stone: M, food: Ae };
function Ru({ value: e, duration: t = 650 }) {
  let [n, r] = (0, C.useState)(e),
    i = (0, C.useRef)(e);
  return (
    (0, C.useEffect)(() => {
      let n = i.current;
      if (
        Math.abs(e - n) < 3 ||
        document.documentElement.dataset.gameMotion === `reduced`
      ) {
        ((i.current = e), r(e));
        return;
      }
      let a = performance.now(),
        o = 0,
        s = (c) => {
          let l = Math.max(0, Math.min(1, (c - a) / Math.max(1,t))),
            u = n + (e - n) * (1 - (1 - l) ** 3);
          ((i.current = u), r(u), l < 1 && (o = requestAnimationFrame(s)));
        };
      return ((o = requestAnimationFrame(s)), () => cancelAnimationFrame(o));
    }, [e, t]),
    (0, F.jsx)(F.Fragment, { children: Math.floor(n).toLocaleString() })
  );
}
function zu({ reward: e, animate: t = !1 }) {
  return (0, F.jsx)(`div`, {
    className: `reward-numbers`,
    children: xl
      .filter((t) => e[t] > 0)
      .map((n, r) => {
        let i = Lu[n];
        return (0, F.jsxs)(
          `div`,
          {
            className: `reward-number reward-${n}`,
            style: { "--delay": `${r * 110}ms` },
            children: [
              (0, F.jsx)(i, { size: 22 }),
              (0, F.jsxs)(`strong`, {
                children: [
                  `+`,
                  t
                    ? (0, F.jsx)(Bu, { value: e[n] })
                    : Math.floor(e[n]).toLocaleString(),
                ],
              }),
              (0, F.jsx)(`span`, {
                children:
                  n === `wood` ? `Timber` : n[0].toUpperCase() + n.slice(1),
              }),
            ],
          },
          n,
        );
      }),
  });
}
function Bu({ value: e }) {
  let [t, n] = (0, C.useState)(0);
  return (
    (0, C.useEffect)(() => {
      n(e);
    }, [e]),
    (0, F.jsx)(Ru, { value: t, duration: 1100 })
  );
}
function Vu({ event: e }) {
  if (!e) return null;
  let t = xl.filter((t) => (e.reward?.[t] || 0) > 0);
  return (0, F.jsxs)(
    `div`,
    {
      className: `reward-effects ${e.grand ? `grand` : ``}`,
      "aria-hidden": `true`,
      children: [
        Array.from({ length: e.grand ? 30 : 14 }, (e, t) =>
          (0, F.jsx)(
            `i`,
            {
              className: `reward-spark`,
              style: {
                "--angle": `${t * 137.5}deg`,
                "--travel": `${90 + (t % 7) * 27}px`,
                "--delay": `${(t % 5) * 40}ms`,
                "--color": [`#ffd67c`, `#83c8ff`, `#ffffff`][t % 3],
              },
            },
            t,
          ),
        ),
        t.map((n, r) => {
          let i = Lu[n];
          return (0, F.jsxs)(
            `div`,
            {
              className: `resource-flight flight-${n}`,
              style: {
                "--flight-x": `${(r - (t.length - 1) / 2) * 60}px`,
                "--delay": `${r * 120}ms`,
              },
              children: [
                (0, F.jsx)(i, { size: 26 }),
                (0, F.jsxs)(`span`, {
                  children: [`+`, Math.floor(e.reward[n])],
                }),
              ],
            },
            n,
          );
        }),
      ],
    },
    e.id,
  );
}
function SWUseMusic(context,enabled,volume){
 const audio=C.useRef(null),settings=C.useRef({context,enabled,volume});settings.current={context,enabled,volume};
 C.useEffect(()=>{
  if(window.webkit?.messageHandlers?.stonewake){window.webkit.messageHandlers.stonewake.postMessage({kind:'musicContext',context,intensity:context==='battle'?.4:0});return;}
  let player=audio.current;
  if(!player){player=new Audio();player.loop=true;player.preload='auto';audio.current=player;}
  const source='/audio/'+(['scout','battle','victory'].includes(context)?context:'kingdom')+'.m4a';
  player.loop=context!=='victory';player.onended=context==='victory'?()=>{if(settings.current.context!=='victory')return;player.src='/audio/kingdom.m4a';player.loop=true;if(settings.current.enabled&&!document.hidden)player.play().catch(()=>{})}:null;
  if(!player.src.endsWith(source)){player.src=source;player.load();}
  player.volume=Math.min(1,volume*.45);
  if(enabled&&!document.hidden)player.play().catch(()=>{});else player.pause();
 },[context,enabled,volume]);
 C.useEffect(()=>{const resume=()=>{const state=settings.current,player=audio.current;if(!player)return;if(state.enabled&&!document.hidden)player.play().catch(()=>{});else player.pause();};document.addEventListener('pointerdown',resume);document.addEventListener('visibilitychange',resume);return()=>{document.removeEventListener('pointerdown',resume);document.removeEventListener('visibilitychange',resume);audio.current?.pause();audio.current=null;};},[]);
}
function Hu() {
  let [e, t] = (0, C.useState)(!0),
    [n, r] = (0, C.useState)(0.55),
    [i, a] = (0, C.useState)(!1),
    [o, s] = (0, C.useState)(null),
    c = (0, C.useRef)({ sound: !0, volume: 0.55 }),
    l = (0, C.useRef)(null),
    u = (0, C.useRef)(null),
    d = (0, C.useRef)(null),
    f = (0, C.useRef)(0),
    p = (0, C.useRef)({ kind: ``, at: 0 }),
    noticeHistory = (0, C.useRef)(new Map()),
    m = (0, C.useCallback)(() => {
      if (!c.current.sound || window.webkit?.messageHandlers?.stonewake)
        return null;
      try {
        return (
          l.current ||
            ((l.current = new AudioContext()),
            (u.current = l.current.createGain()),
            (u.current.gain.value = c.current.volume * 0.32),
            u.current.connect(l.current.destination)),
          (l.current.state === `suspended` ||
            l.current.state === `interrupted`) &&
            l.current.resume().catch(() => {}),
          l.current
        );
      } catch {
        return null;
      }
    }, []);
  (0, C.useEffect)(() => {
    let e = {};
    try {
      e = JSON.parse(localStorage.getItem(`hearth-feedback`) || `{}`);
    } catch {}
    let n = matchMedia(`(prefers-reduced-motion: reduce)`),
      i = e.sound === !1,
      o =
        typeof e.volume == `number` ? Math.max(0, Math.min(1, e.volume)) : 0.55;
    ((c.current = { sound: !i, volume: o }),
      window.webkit?.messageHandlers?.stonewake?.postMessage({
        kind: `soundSettings`,
        enabled: !i,
        volume: o,
      }),
      t(!i),
      r(o),
      a(n.matches || e.reduced === !0));
    let s = () => {
        n.matches && a(!0);
      },
      f = () => {
        document.hidden ? l.current?.suspend().catch(() => {}) : m();
      };
    return (
      document.addEventListener(`pointerdown`, m),
      document.addEventListener(`keydown`, m),
      document.addEventListener(`visibilitychange`, f),
      n.addEventListener(`change`, s),
      () => {
        (document.removeEventListener(`pointerdown`, m),
          document.removeEventListener(`keydown`, m),
          document.removeEventListener(`visibilitychange`, f),
          n.removeEventListener(`change`, s),
          d.current && clearTimeout(d.current),
          l.current?.close().catch(() => {}),
          (l.current = null),
          (u.current = null));
      }
    );
  }, [m]);
  let h = (0, C.useCallback)((e, t, n) => {
    ((c.current = { sound: e, volume: t }),
      window.webkit?.messageHandlers?.stonewake?.postMessage({
        kind: `soundSettings`,
        enabled: e,
        volume: t,
      }),
      u.current &&
        l.current &&
        u.current.gain.setTargetAtTime(
          e ? t * 0.32 : 0,
          l.current.currentTime,
          0.02,
        ));
    try {
      localStorage.setItem(
        `hearth-feedback`,
        JSON.stringify({ sound: e, volume: t, reduced: n }),
      );
    } catch {}
  }, []);
  (0, C.useEffect)(() => {
    ((document.documentElement.dataset.gameMotion = i ? `reduced` : `full`),
      window.dispatchEvent(new Event(`hearth-motion`)));
  }, [i]);
  let g = (0, C.useCallback)(
    async (e = `click`) => {
      if (!c.current.sound || document.hidden) return;
      let t = performance.now();
      if (e === p.current.kind && t - p.current.at < (e === `march` ? 300 : e === `hit` ? 280 : 65))
        return;
      p.current = { kind: e, at: t };
      if (window.webkit?.messageHandlers?.stonewake) {
        window.webkit.messageHandlers.stonewake.postMessage({
          kind: `sound`,
          effect: e,
          volume: c.current.volume,
        });
        return;
      }
      if(['naval-fire','naval-impact','building-destroy','wood-break','water-splash'].includes(e)){const clip=new Audio('/audio/'+e+'.wav');clip.volume=c.current.volume;clip.play().catch(()=>{});return;}
      let n = m();
      if (!n || !u.current) return;
      if (n.state !== `running`) {
        try {
          await n.resume();
        } catch {
          return;
        }
      }
      if (
        n.state !== `running` ||
        document.hidden ||
        !c.current.sound ||
        !u.current
      )
        return;
      let r = n.currentTime + 0.015,
        i = (e, t, i, a = 0.2, o = `triangle`, s) => {
          let c = n.createOscillator(),
            l = n.createGain();
          ((c.type = o),
            c.frequency.setValueAtTime(e, r + t),
            s && c.frequency.exponentialRampToValueAtTime(s, r + t + i),
            l.gain.setValueAtTime(0.001, r + t),
            l.gain.linearRampToValueAtTime(a, r + t + 0.015),
            l.gain.exponentialRampToValueAtTime(0.001, r + t + i),
            c.connect(l),
            l.connect(u.current),
            c.start(r + t),
            c.stop(r + t + i + 0.02),
            (c.onended = () => {
              (c.disconnect(), l.disconnect());
            }));
        },
        a = (e, t, i, a) => {
          let o = n.createBuffer(1, Math.ceil(n.sampleRate * t), n.sampleRate),
            s = o.getChannelData(0);
          for (let e = 0; e < s.length; e++)
            s[e] = (Math.random() * 2 - 1) * (1 - e / s.length) ** 2;
          let c = n.createBufferSource(),
            l = n.createBiquadFilter(),
            d = n.createGain();
          ((c.buffer = o),
            (l.type = `lowpass`),
            (l.frequency.value = a),
            (d.gain.value = i),
            c.connect(l),
            l.connect(d),
            d.connect(u.current),
            c.start(r + e),
            (c.onended = () => {
              (c.disconnect(), l.disconnect(), d.disconnect());
            }));
        };
      if (e === `click`) {
        i(520, 0, 0.065, 0.11, `sine`, 360);
        return;
      }
      if (e === `hit`) {
        (a(0, 0.09, 0.13, 1800), i(900, 0, 0.07, 0.035, `triangle`, 400));
        return;
      }
      if (e === `cannon`) {
        (a(0, 0.3, 0.27, 500), i(90, 0, 0.3, 0.23, `sine`, 30));
        return;
      }
      if (e === `build`) {
        [0, 0.11, 0.23].forEach((e, t) => {
          (a(e, 0.09, 0.12, 700), i(160 + t * 35, e, 0.1, 0.13, `sine`, 70));
        });
        return;
      }
      if (e === `recruit` || e === `march`) {
        ([0, 0.1, 0.24].forEach((e) => i(130, e, 0.15, 0.3, `sine`, 55)),
          i(392, 0.28, 0.25, 0.13),
          i(523, 0.42, 0.3, 0.15));
        return;
      }
      if (e === `defeat`) {
        [392, 330, 262].forEach((e, t) => i(e, t * 0.19, 0.5, 0.15));
        return;
      }
      if (e === `rally`) {
        ([262, 392, 523, 784].forEach((e, t) => i(e, t * 0.08, 0.45, 0.16)),
          a(0, 0.3, 0.09, 900));
        return;
      }
      ((e === `win`
        ? [392, 523, 659, 784, 1047]
        : e === `achievement`
          ? [523, 659, 784, 1047]
          : e === `complete`
            ? [392, 494, 587, 784]
            : [784, 988, 1175, 1568]
      ).forEach((e, t) => {
        (i(e, t * 0.11, 0.46, 0.15), i(e * 2, t * 0.11, 0.23, 0.035, `sine`));
      }),
        (e === `win` || e === `achievement`) &&
          ([262, 330, 392].forEach((e) => i(e, 0.45, 0.85, 0.085)),
          a(0.02, 0.2, 0.065, 1800)));
    },
    [m],
  );
  return {
    sound: e,
    volume: n,
    reduced: i,
    event: o,
    chime: g,
    dismiss: (0, C.useCallback)(() => {
      if (d.current) clearTimeout(d.current);
      d.current = null;
      s(null);
    }, []),
    celebrate: (0, C.useCallback)((e) => {
      if (document.hidden) return;
      const now = Date.now(), previous = noticeHistory.current.get(e.title);
      if (previous && now - previous < 30000 && !e.reward && !e.building) return;
      noticeHistory.current.set(e.title, now);
      if (noticeHistory.current.size > 60) noticeHistory.current.delete(noticeHistory.current.keys().next().value);
      if (d.current) clearTimeout(d.current);
      s({ ...e, id: ++f.current });
      d.current = setTimeout(() => { s(null); d.current = null; }, 1800);
    }, []),
    toggleSound: (0, C.useCallback)(() => {
      let r = !e;
      (t(r), h(r, n, i), r && (m(), g(`complete`)));
    }, [e, n, i, h, m, g]),
    changeVolume: (t) => {
      (r(t), h(e, t, i));
    },
    toggleMotion: () => {
      (a(!i), h(e, n, !i));
    },
  };
}
var Uu = { gold: A, wood: Te, stone: M, food: Ae };
var Wu = { gold: `Gold`, wood: `Timber`, stone: `Stone`, food: `Food` };
var Gu = { gold: 0, wood: 0, stone: 0, food: 0 };
function Ku({ cost: e, available: t }) {
  return (0, F.jsx)(`span`, {
    className: `cost-row`,
    children: xl
      .filter((t) => e[t] > 0)
      .map((n) => {
        let r = Uu[n];
        return (0, F.jsxs)(
          `span`,
          {
            title: Wu[n],
            className: t && t[n] < e[n] ? `unaffordable` : ``,
            children: [(0, F.jsx)(r, { size: 13 }), Math.ceil(e[n])],
          },
          n,
        );
      }),
  });
}
function qu({kind,className='',level=1}){return SW13BuildingCells[kind]||SW13UtilityKinds.includes(kind)?swElement(SWBuildingPortrait13,{kind,level,className:'building-sprite '+className}):swElement(SWBuildingPortrait,{building:{kind,level},className:'building-sprite '+className});}
export { Dc, Fc, Hc, Yc, Xc, Qc, SWNavalEligible, SWTroopAbility, Cl, kl, SWTradeRates, SWMarketTrade, SWCivicKinds, SWCityDialog, Rl, SWMissionScout, SWCanPlaceOrnament, Yl, Xl, Zl, Ql, $l, eu, tu, nu, ru, au, ou, su, cu, uu, du, fu, pu, mu, hu, gu, _u, vu, yu, bu, xu, Su, Cu, wu, Tu, SWStonePrism, SWPaintWall, SWWallCache, SWDrawWall, SWDrawDeploymentEdge, SWDrawProjectile, SWDirectionalKinds, SWDirectionalFiles, SWAnimationFiles, SWAtlasMetadata, SWAtlasBounds, SWAtlasFrame, SWDrawDirectionalBuilding, SWPaintedUnits, SWDrawPaintedUnit, SWDrawCivicProject, SWBuildingSize, SWDrawArchitectureBase, SWDrawArchitecture, SWBuildingArtCache, SWBuildingTile, SWDrawRubble, SWCollapseCache, SWCollapseFragments, SWLegacyCollapse13, SWDrawDust, SWBuildingPortrait, SWOceanExtensionCache, SWDrawWorldTerrain, SWDrawCapitalTerrain, SWDrawBattleTerrain, SWDeploymentTarget, SWDrawTrebuchet, SWTroopTier, SWLegacyDrawShip13, SWRoadTileCache, SWDrawRoads, SWDrawCitizen, SWDrawBuildingDamage, SWDrawGarden, SWUnitPortrait, SWDrawCivicDetails, SWAppearanceColors, SWBannerColors, SWRenderAppearance, SWColorBuildingTile, SWDrawBanner, SWDrawTownAppearance, SWDrawOrnament, SWLandmarkCache, SWDrawLandmark, SWDrawHarborAppearance, SWNavalTintCache, SWDrawSail, SWDrawCommanderAccessory, SWDrawCombatEvent, SWDrawEscortCue, SWCosmeticPreview, SWRigSource, SWRigColor, SWRigMesh, SWRigInterpolate, SWRigSoldier, SWRigShip, SWRigLighthouse, SWRigTileCache, SWDrawRigSoldier, SWCoastBoats, SWCoastHit, SWDrawCoast, Du, Ou, ku, Au, ju, Mu, Nu, Pu, Iu, Lu, Ru, zu, Bu, Vu, SWUseMusic, Hu, Uu, Wu, Gu, Ku, qu };
