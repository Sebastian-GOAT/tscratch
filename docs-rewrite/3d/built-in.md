# Built-in 3D objects

TScratch includes ready-to-use models: `Tetrahedron`, `Cube`, `Octahedron`,
`Icosahedron`, `Icosphere`, `Monkey`, and `Cuboid`.

```ts
const cube = new Cube({ z: 4, color: 'tomato', size: 1 });
const box = new Cuboid({ width: 2, height: 1, length: 3, z: 5 });
```

The polyhedra accept the common `Object3DOptions` values. `Cuboid` also
accepts `width`, `height`, and `length`; update them with `setWidth`,
`setHeight`, and `setLength`.