# Collisions

TScratch provides pixel-accurate collision detection via `sprite.touching(other)`.
The implementation includes performance optimizations to keep collision checks
fast for typical classroom projects:

- Tight axis-aligned bounding boxes (AABB) computed with trigonometry.
- A per-sprite collision canvas sized to the minimal collision rectangle.
- The canvas context uses `willReadFrequently` to reduce GPU↔CPU transfer costs.

Mouse interaction helpers are available on the engine:

- `engine.hovering(sprite)` — whether the cursor is over a sprite.
- `engine.mouseDown`, `engine.mouseX`, `engine.mouseY` — build custom click or
	drag interactions.

Note: collision checks currently do not support rotated pivots — keep sprites
unpivoted for accurate `touching()` results.