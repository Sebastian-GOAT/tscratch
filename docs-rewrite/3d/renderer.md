# 3D Renderers

Renderers draw an array of `Object3D` instances from a `Camera3D`:

```ts
const renderer = new WireframeRenderer3D({
	objects: [cube],
	camera,
	color: 'white'
});

engine.setLoop('main', () => {
	renderer.registerControls();
	renderer.render();
});
```

`Renderer3DOptions` includes `objects` and `camera`, plus the inherited pen
options. Public settings include `FOV`, `ASPECT`, `Z_NEAR`, `SPEED`, and
`SENSITIVITY`. Subclasses implement `render()`; call it once per frame.
`registerControls()` provides keyboard camera controls.