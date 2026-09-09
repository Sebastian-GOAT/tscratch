# Rectangle

`Rectangle` draws a filled rectangle. Its options are `width`, `height`,
`color`, `outlineColor`, and `outlineWidth`, along with common `SpriteOptions`.

```ts
const wall = new Rectangle({
    width: 200,
    height: 20,
    color: 'gray',
    outlineWidth: 2
});

wall.setWidth(240);
wall.setColor('slategray');
```

Use `setWidth`, `setHeight`, and `setColor` to update the rectangle.