# SolidRenderer3D

`SolidRenderer3D` renders filled faces with ambient and directional lighting.
It uses the same constructor and frame-loop pattern as `Renderer3D`:

```ts
const renderer = new SolidRenderer3D({ objects: [cube], camera });
engine.setLoop('main', () => renderer.render());
```

Tune `AMBIENT_LIGHT_INTENSITY`, `DIRECTED_LIGHT_INTENSITY`, and
`DIRECTED_LIGHT_DIR` (`Vec3`) to change the lighting. The static
`stringToHSL(color)` helper converts a CSS color to HSL components.