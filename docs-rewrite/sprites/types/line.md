# Line

`Line` draws a filled rectangular line. Its options are `color`, `length`, and
`width`, along with common `SpriteOptions`.

```ts
const beam = new Line({ length: 100, width: 4, color: 'white' });
beam.point(90);
beam.setLength(140);
```

Use `setColor`, `setLength`, and `setWidth` to update it. Rotate the line with
the inherited `point` and `turn` methods.