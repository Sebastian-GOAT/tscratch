# How scenes work

Scenes are named collections of sprites with an optional game loop:

```ts
const engine = Engine.init();
const menu = new Text({ content: 'Press start', scene: 'menu' });
const player = new Rectangle({ scene: 'game' });

engine.setLoop('menu', () => {
	// menu logic
});
engine.setLoop('game', () => player.move(1));
engine.setScene('menu');
```

`setScene(name)` switches the active scene. Only sprites in that scene and
sprites assigned to `'*'` are drawn. `currentScene` contains the active name.
`setLoop(name, callback)` registers or replaces a scene loop.

Sprites use `scene: 'main'` by default. The engine is a singleton, so call
`Engine.init()` wherever you need access to it instead of constructing it.

## 2D camera

The shared camera is available as `engine.camera`. Its properties are `x`,
`y`, `zoom`, and `rotation`. Use `goTo`, `setX`, `setY`, `changeX`, `changeY`,
`move`, `point`, `turn`, `setZoom`, and `changeZoom` to control the view.