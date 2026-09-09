# RegularPolygon

`RegularPolygon` draws a regular polygon. Its options are `sides`, `radius`,
`color`, `outlineColor`, and `outlineWidth`, plus common `SpriteOptions`.

```ts
const hexagon = new RegularPolygon({
    sides: 6,
    radius: 35,
    color: 'coral'
});
```

Use `setSides`, `setRadius`, and `setColor` to update the polygon.