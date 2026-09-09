# Collisions

TScratch provides pixel-accurate collision detection via `sprite.touching(other)`.
You can also check with sprite groups: `sprite.touching(spriteGroup)` (note: this method only supports AABB and partial precision modes).
The implementation includes performance optimizations to keep collision checks
fast for typical classroom projects:

> Collision results may be unpredictable for `Text`, `Watermark` and `Button` sprites.

- Tight axis-aligned bounding boxes (AABB) computed with trigonometry.
- A per-sprite collision canvas sized to the minimal collision rectangle.
- The canvas context uses `willReadFrequently` to reduce GPU↔CPU transfer costs.
- Only two `getImageData()` calls for any number of sprites in a group

## Precision Levels

`touching()` supports three precision modes:

- `precision: 'AABB'` — only bounding box check (fastest, boolean result).
- `precision: 'partial'` — pixel-perfect but early exit on first overlap (default, boolean result).
- `precision: 'full'` — pixel-perfect with collision data (normal, contact point, displacement).

Example:

```typescript
// Bounding box only
if (sprite1.touching(sprite2, { precision: 'AABB' })) { ... }

// Pixel-perfect boolean
if (sprite1.touching(sprite2, { precision: 'partial' })) { ... }
if (sprite1.touching(sprite2)) { ... } // Simplified

// Full collision info
const collision = sprite1.touching(sprite2, { precision: 'full' });
if (collision) {
    console.log(collision.contact, collision.normal, collision.displacement);
}
```

## Batch Collision Checking

For checking collisions among multiple sprites in one pass:

- `Sprite.touchingPairs(sprites, handler, options)` — iterate all unique sprite pairs
    and call `handler(sprite1, sprite2)` for each collision.

Example:

```typescript
Sprite.touchingPairs(
    [playerSprite, enemyA, enemyB, wall],
    (a, b) => console.log(`${a.discriminant} hit ${b.discriminant}`),
    { precision: 'AABB' } // or 'partial' (default), full is not available
);
```

Mouse interaction helpers are available on the engine:

- `engine.hovering(sprite)` — whether the cursor is over a sprite.
- `engine.mouseDown`, `engine.mouseX`, `engine.mouseY` — build custom click or drag interactions.