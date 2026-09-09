# Pen

`Pen` draws onto the persistent pen canvas as it moves. Its options are
`drawing`, `penSize`, and `color`, plus common `SpriteOptions`.

```ts
const pen = new Pen({ penSize: 3, color: 'blue' });

pen.down();

pen.move(50);
pen.turn(90);
pen.move(50);

pen.up();
```

Use `down()` and `up()` to control line drawing, `dot()` to draw a dot, and
`eraseAll()` to clear the pen canvas. `stamp(sprite)` draws a sprite onto the
pen canvas. `Pen.drawSprite(SpriteClass, options?)` provides a one-shot stamp
for a sprite class.