# Grouping sprites

`SpriteGroup` applies movement and rotation to several sprites while leaving
each sprite available for its own logic.

```ts
const player = new Rectangle({ x: -20, width: 20, height: 20 });
const shield = new Circle({ x: 20, radius: 10 });
const formation = new SpriteGroup({ sprites: [player, shield] });

formation.move(5);
formation.turn([0, 0], 15);
```

Options are `sprites`, `dir`, and `scene`. Public properties are `sprites`,
`dir`, and `scene`.

- `changeX(dx)` and `changeY(dy)` move every member.
- `move(steps)` moves the group in its direction.
- `point(pivot, degrees)` rotates the group to an absolute direction.
- `turn(pivot, degrees)` rotates it by a relative amount.
- `addSprite(sprite)` and `removeSprite(sprite)` manage membership.

`group.touching(sprite, options?)` supports `AABB` and `partial` precision.