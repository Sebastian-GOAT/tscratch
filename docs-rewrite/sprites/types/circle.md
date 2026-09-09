# Circle

`Circle` draws a filled circle. Its options are `radius`, `color`,
`outlineColor`, and `outlineWidth`, in addition to common `SpriteOptions`.

```ts
const ball = new Circle({ radius: 25, color: 'tomato' });
ball.setRadius(30);
ball.setColor('orange');
```

Use `setRadius` and `setColor` to update the circle. Movement, visibility,
layering, and collision methods come from `Sprite`.