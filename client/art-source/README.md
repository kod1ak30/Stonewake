# Stonewake canonical asset proof

`stonewake-rigs-v12.json` is the editable specification for dimensions, materials, camera, lighting, animation durations, contact position and level limits. `canonical-models.js` constructs shared three-dimensional meshes, articulated joint poses and an orthographic renderer. No animation frame is generated independently.

Run `node scripts/export-canonical12.cjs` from the project root to reproduce the transparent directional atlases and their cell, pivot and timing manifest in `Stonewake/Web/art/canonical-v12`. The model gallery is exported alongside them. The source renderer can also pose the models continuously, independent of the atlas frame count.

The proof includes an armored soldier, a ship and a lighthouse. The soldier has eight directions with authored walk, work, attack, stagger and defeat poses; idle currently uses a held pose. The ship has shared hull, deck, rigging, sail and armament geometry. The lighthouse has three construction stages. Level parameters clamp to 1–10.

These models demonstrate consistency and reproducibility. Their miniature polygon finish has not passed the same visual quality gate as the painted Stonewake roster. They therefore do not replace the existing combat soldiers or ships. The bronze commemorative statue uses the source soldier geometry at a small scale. The town lighthouse uses the polished painted derivative listed below.

`lighthouse-stages-v12.png` was created with the built-in imagegen tool using the canonical model gallery as a geometry reference. Its transparent raster remains unmodified. The game reads its three cells at runtime. This is a painted production asset, not a claim that a painted texture has been recovered into an editable three-dimensional model.

`node scripts/sync-renderer12.cjs` embeds the model specification and presentation helpers into only the existing renderer section. No rules, replay calculations, UI components, backend or native code are included in that synchronization.
