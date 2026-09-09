# Square

`Square` draws a filled square. Its options are `sideLength`, `color`,
`outlineColor`, and `outlineWidth`, along with common `SpriteOptions`.

```ts
const tile = new Square({ sideLength: 40, color: 'seagreen' });
tile.setSideLength(50);
```

Use `setSideLength` and `setColor` to update the square.