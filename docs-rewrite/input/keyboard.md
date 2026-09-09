# Keyboard input

Keyboard state and callbacks are available through the engine singleton:

```ts
const engine = Engine.init();

engine.setLoop('main', () => {

	if (engine.keyPressed('left')) player.changeX(-2);
	if (engine.keyPressed('right')) player.changeX(2);
});
```

`keyPressed(key)` returns `true` while a key is held. Arrow keys are normalized
to `up`, `down`, `left`, and `right`; the space bar is `space`. Regular key
values such as `a`, `w`, and `Enter` can be passed by name. Use `any` to test
whether any key is currently held.

Use `onKeyPress` for callbacks:

```ts
engine.onKeyPress('space', () => {
	player.jump();
}, { allowHold: false });
```

Callbacks run once per frame while the key is held by default. Pass
`{ allowHold: false }` to run only on the initial press. Held-key callbacks
are processed by the active engine loop.