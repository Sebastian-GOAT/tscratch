# Arc

`Arc` draws a filled circular sector. Its options extend `SpriteOptions` with
`radius`, `angle`, `color`, `outlineColor`, and `outlineWidth`.

```ts
const arc = new Arc({ radius: 40, angle: 120, color: 'gold' });
```

`angle` is measured in degrees. Use `setRadius`, `setAngle`, and `setColor` to
change the arc after construction. Common sprite movement, visibility, layer,
and collision methods are inherited from `Sprite`.