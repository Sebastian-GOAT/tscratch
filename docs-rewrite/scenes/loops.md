# How scenes manage the game loops

Register a callback with `engine.setLoop(scene, callback)`. The callback runs
at the engine's configured frame rate:

```ts
const engine = Engine.init();
const player = new Rectangle();

engine.setMaxFPS(60);
engine.setLoop('main', () => {
	player.move(100 * engine.getDeltaTime());
});
```

`maxFPS` is the current frame-rate cap. `setMaxFPS(value)` changes it and
`getDeltaTime()` returns elapsed seconds since the previous update. Use
`pauseLoop()` and `resumeLoop()` to stop and restart the active loop.

The engine also provides asynchronous timing helpers:

```ts
await engine.wait(1);
await engine.waitUntil(() => player.x > 100);
```

Set and retrieve shared values with `setVariable(key, value)` and
`getVariable(key)`.