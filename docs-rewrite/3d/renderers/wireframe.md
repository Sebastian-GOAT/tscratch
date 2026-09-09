# WireframeRenderer3D

`WireframeRenderer3D` projects every model face as a pen path. Construct it
with `objects` and a `Camera3D`, then call `render()` from a game loop:

```ts
const renderer = new WireframeRenderer3D({
	objects: [cube],
	camera,
	color: 'white'
});

engine.setLoop('main', () => renderer.render());
```

It inherits renderer settings such as `FOV`, `Z_NEAR`, `SPEED`, and
`SENSITIVITY`, as well as `registerControls()`.