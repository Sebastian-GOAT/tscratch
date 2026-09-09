# CustomPolygon

`CustomPolygon` draws a polygon from your own `Vec2` vertices. Its options are
`vertices`, `color`, `outlineColor`, and `outlineWidth`, plus common sprite
options.

```ts
const triangle = new CustomPolygon({
    vertices: [[0, 40], [-40, -30], [40, -30]],
    color: 'royalblue',
    outlineWidth: 2
});
```

Use `setVertices` and `setColor` to update the polygon. Vertices are local to
the sprite and are affected by its position, direction, and size.