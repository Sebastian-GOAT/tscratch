# Collisions

Sprites have a `touching(sprite)` method, which can detect pixel perfect
collisions. This method uses the following optimizations:

- Tight Axis-Aligned Bounding Boxes using trigonometric functions
- 1 per-sprite collision canvas
- The collision canvas is the minimum size needed (only the collision box)
- `willReadFrequently` flag on the collision canvas rendering context to minimize GPU-CPU data transfer

TScratch also has methods for mouse interactions! You can use the
`Engine.isHovering(sprite)` method to check, if the user is hovering a
specific sprite. By combining this with `Engine.mouseDown`, you can
create click events. You can also make your own custom events using
`Engine.mouseX` and `Engine.mouseY`.

Remember that `touching(sprite)` doesn't work with pivots yet.