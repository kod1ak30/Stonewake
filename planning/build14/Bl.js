function Bl(e) {
  let t = e.level || e.targetLevel || 1;
  return (
    {
      keep: `Age ${t} · ${500 + 250*t} base storage`,
      farm: `+${24 * t} food / min`,
      lumber: `+${28 * t} timber / min`,
      quarry: `+${16 * t} stone / min`,
      barracks: `${6 * t} troop slots`,
      forge: `+${10 * t}% army attack`,
      tower: `${e.specialty === `ballista` ? `Ballista` : e.specialty === `volley` ? `Rapid-fire` : `Watchtower`} · ${qc(e).range}-tile range`,
      harbor: `+${4 * t} gold / min · ${Math.min(8,t+1)} ship berths`,
      storehouse: `+${SWStorageContribution(t).toLocaleString()} storage per resource`,
      cottage: `${8 * t} residents · +${4 * t} gold / min`,
      market: `+${10 * t} gold / min`,
      builder: `One crew · +${Math.round(Math.max(0, t - 1) * 2.5)}% build speed`,
      wall: `Level ${t} barrier · troops must go around or breach`,
      gate: `Level ${t} gate · villagers pass through`,
      monument: `A permanent mark of league achievement`,
    }[e.kind] || Sl[e.kind].benefit
  );
}