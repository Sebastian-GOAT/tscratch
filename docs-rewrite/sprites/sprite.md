# Sprites

Sprites are the main 2D objects in TScratch. Built-in sprites accept common
options for position, direction, scale, scene, visibility, and draw order:

```ts
const player = new Rectangle({
	x: -100, y: 0, dir: 0, size: 1,
	scene: 'main', hidden: false, layer: 0
});
```

Coordinates use a centered stage. Directions are degrees, with `0` pointing
up. Common properties are `x`, `y`, `dir`, `size`, `pivot`, `scene`, `hidden`,
and `layer`.

## Movement and sensing

Use `goTo`, `setX`, `setY`, `changeX`, `changeY`, `move`, `point`, `turn`, and
`pointTowards` to move a sprite. `show`, `hide`, `goToLayer`, and `changeLayer`
control visibility and draw order. `distanceTo(x, y)` measures distance to a
point, and `clone(options?)` creates another sprite of the same type.

## Built-in sprites

The package exports `Line`, `Rectangle`, `Square`, `Oval`, `Circle`, `Arc`,
`RegularPolygon`, `CustomPolygon`, `Text`, `Button`, `Watermark`,
`ImageSprite`, `Pen`, and `Joystick`.

Shape-specific options include `width` and `height` for `Rectangle`,
`sideLength` for `Square`, `radius` for `Circle`, and `vertices: Vec2[]` for
`CustomPolygon`. Shape colors use `color`, `outlineColor`, and `outlineWidth`.
Use each shape's setters, such as `setWidth`, `setHeight`, `setRadius`,
`setVertices`, and `setColor`, to update it.

`Text` accepts `content`, `color`, `fontFamily`, `fontSize`, `align`, and
`baseline`. `Button` adds `backgroundColor`, dimensions, and font settings.
`ImageSprite` accepts image URLs in `costumes`; use `setCostume`,
`nextCostume`, and `previousCostume` to switch images.

`Pen` provides `down`, `up`, `stamp`, `eraseAll`, and `dot` for persistent
drawing. `Joystick` exposes normalized `joyX` and `joyY` values while pressed.

The low-level rendering hooks `draw`, `getPath`, `getBoundingBox`, and
`getCachedPath` are implementation details for rendering and collision, not
normal gameplay APIs.