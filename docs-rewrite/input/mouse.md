# Mouse and pointer input

The engine tracks the primary pointer in stage coordinates:

```ts
const engine = Engine.init();

engine.setLoop('main', () => {
	if (engine.mouseDown)
		player.goTo(engine.mouseX, engine.mouseY);
});
```

`mouseX` and `mouseY` contain the pointer position, with the stage origin at
the center. `mouseDown` is `true` while the primary pointer is pressed.

Use `hovering(sprite)` to test whether the pointer is over a sprite and
`onPress(callback)` to register a global press callback:

```ts
engine.onPress(() => {
	if (engine.hovering(button))
		button.setContent('Pressed');
});
```

For a sprite-specific interaction, use the sprite's `onPress(callback)`
method. It supports `{ allowHold: false }` when the callback should run only
once per pointer press.