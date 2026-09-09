# Oval

`Oval` draws an ellipse. Its options are `radX`, `radY`, `color`,
`outlineColor`, and `outlineWidth`, plus common `SpriteOptions`.

```ts
const body = new Oval({ radX: 50, radY: 25, color: 'purple' });
body.setRadX(60);
body.setRadY(30);
```

Use `setRadX`, `setRadY`, and `setColor` to update the oval. `radX` and `radY`
are the horizontal and vertical radii.