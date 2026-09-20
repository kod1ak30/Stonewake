# Build 17 world presentation

The art direction is an original coastal kingdom: ivory and granite architecture, teal cloth, copper fittings, a working waterfront and a restrained dark interface. Reference games informed hierarchy, readability and upgrade recognition; their assets were not copied into this build.

## Accepted authored assets

| Asset | Accepted content | Production handling |
| --- | --- | --- |
| keep-levels.png | Ten distinct Keep level silhouettes | Actual alpha bounds, common world anchor, dimensions derived from each frame |
| keep-rear.png | Matching ten rear views | Front and rear atlases plus mirroring provide four facings |
| economy-buildings.png | Farm, timber works, quarry and storehouse at three milestones | Real row boundaries, twelve isolated crops, full-size draw geometry |
| citizens.png | Farmer, dockworker and mason with walk/work poses | Shared body scale and anchored feet; no replacement stick figures |
| vanguard-ranks.png | Four authored infantry ranks, each with walk and attack frames | See ART.md for exact source, prompts, processing and limitations |

These images were created with the built-in image-generation tool. The Keep brief called for separately authored level 1–10 coastal architecture with visible construction changes. The rear-view edit preserved the same ten designs while showing the back. The citizens brief called for dimensional, clothed working adults and separate walk/work rows. The economy brief called for four production families across three construction milestones. Atlas inspection and cropping were part of the sprite-production workflow, followed by production-render checks. The initial economy row divisions clipped crane tops and were rejected; the accepted divisions are 0, 315, 650 and 1086 pixels.

Accepted source images:

- Keep front: /Users/chrismozer/.codex/generated_images/01a0b74d-c8a4-76e3-9029-e19ff00543ed/exec-cdccfa94-43b9-4339-bb25-437872610901.png
- Keep rear: /Users/chrismozer/.codex/generated_images/01a0b74d-c8a4-76e3-9029-e19ff00543ed/exec-04f6c70e-53e1-41aa-b060-6c1ef83ad7e6.png
- Citizens: /Users/chrismozer/.codex/generated_images/01a0b74d-c8a4-76e3-9029-e19ff00543ed/exec-538c81b2-f947-4cf4-ac53-398d023a3b49.png
- Economic buildings: /Users/chrismozer/.codex/generated_images/01a0b74d-c8a4-76e3-9029-e19ff00543ed/exec-422f966e-ea67-4274-ac7b-fe6ea45bd857.png

## Connected construction

Wall geometry uses each actual neighboring tile, including ends, corners, junctions and gate cross-connections. Ten levels alter materials, height, capstones, reinforcement and beacon details. Damage and ruins use the same geometry. Player-built roads form one joined path with small irregular pavers, avoid occupied building footprints and pass through gates. Automatic citizen routes appear only as faint, narrow earth footpaths; they do not inherit purchased paving or imply a production connection. Only roads the player builds contribute that connection. Geometry caches are bounded and keyed by topology, so recreating arrays during animation does not rebuild every road frame. Tests include isolated and negative-coordinate tiles, mixed levels and all gate directions.

Coastal Crown is a unique, earned-only forked teal banner with a gold crown. Existing medieval-age completion saves receive its ownership once, without another gem award or an equipment change.

## Play and presentation

Campaigns now use ten distinct authored stronghold geometries in each route, with different gates, keep positions and defensive approaches. Scouts show the actual chapter's tactical briefing. Static mission maps paint once when their assets or dimensions change instead of running another full-time village animation.

The store previews the actual appearance renderer for buildings, banners, roads, ships and ornaments. Current and preview appearances are separate. Army portraits share the same troop renderer as battle.

## Remaining art work

Economic buildings have three authored silhouettes, not ten. Vanguard has four authored ranks; other troop families retain older sprites and still need equivalent rank sheets. Ship hulls retain their existing three authored tiers, with new torn-sail and hull-damage presentation. Citizen and infantry walk cycles are modest. These improvements do not establish a finished commercial art library or measured physical-phone frame rate.
