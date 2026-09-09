# Camera3D

`Camera3D` stores the position and orientation used by a 3D renderer:

```ts
const camera = new Camera3D({ z: 0, dirX: 0, dirY: 20, dirZ: 0 });
```

Its public properties are `x`, `y`, `z`, `dirX`, `dirY`, and `dirZ`. Values are
degrees for directions and world units for position.