# Joystick

`Joystick` is a virtual thumbstick for touch and pointer controls. Its
special option is `radius`; it also accepts common `SpriteOptions`.

```ts
const stick = new Joystick();

engine.setLoop('main', () => {
    player.changeX(stick.joyX * 3);
    player.changeY(stick.joyY * 3);
});
```

`joyX` and `joyY` are normalized values in the range `-1` to `1`. They return
to `0` when the pointer is released. The joystick is positioned near the
bottom-left of the canvas by default; use `setX` and `setY` after construction
when a different placement is needed.

Use `setRadius` to resize it and `setRGB(r, g, b)` to change the translucent
base color. Pointer tracking is handled by the engine, so no separate pointer
listener is required.