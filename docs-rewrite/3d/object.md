# Object3D

`Object3D` stores vertices and faces for a 3D model:

```ts
const object = new Object3D({
	vertices: [[-1, -1, 0], [1, -1, 0], [0, 1, 0]],
	faces: [[0, 1, 2]],
	z: 3,
	color: 'orange'
});
```

Options require `vertices` and `faces`; `x`, `y`, `z`, `dirX`, `dirY`,
`dirZ`, `color`, and `size` are optional. Use `rotateX`, `rotateY`,
`rotateZ`, `pointX`, `pointY`, and `pointZ` to modify model orientation.

`Object3D.loadObj(data)` parses vertex and face lines from Wavefront OBJ text
and returns `{ vertices, faces }`, which can be passed into the constructor.