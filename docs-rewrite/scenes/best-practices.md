# Scene best practices

## Keep responsibilities clear

Let scenes coordinate gameplay while sprites own their appearance and local
behavior. A scene loop should update the state of the game and call the
operations needed for that frame; it should not contain every detail of every
sprite.

Use named scenes for distinct screens or modes such as `menu`, `game`, and
`pause`. Give each scene its own loop with `setLoop` and switch between them
with `setScene`.

```ts
const engine = Engine.init();

engine.setLoop('menu', updateMenu);
engine.setLoop('game', updateGame);
engine.setLoop('pause', updatePause);

engine.setScene('menu');
```

## Create sprites with their scene

Assign a sprite to its scene when it is created. This avoids accidentally
showing an object in the wrong screen and makes scene setup easier to follow.

```ts
const playButton = new Button({
	content: 'Play',
	scene: 'menu'
});

const player = new Square({
	scene: 'game',
	sideLength: 32
});
```

Sprites in the `'*'` scene can be used for elements that should remain visible
across scene changes, such as a persistent watermark or shared HUD. Use this
sparingly so that scene-specific state does not leak between screens.

## Keep loops predictable

Keep frame callbacks short and use `getDeltaTime()` when movement should be
independent of the frame-rate cap:

```ts
function updateGame() {
	player.move(100 * engine.getDeltaTime());
}
```

Move setup outside the loop. Do not create new sprites every frame unless they
are intentionally temporary, and pause a loop when its scene is inactive.
Use `pauseLoop()` and `resumeLoop()` when a game needs to stop and continue
without changing scenes.

## Organize larger scenes

For a larger project, keep scene setup, scene updates, and reusable sprite
definitions in focused modules. Register those modules from the application
entry point. This keeps transitions visible in one place without forcing
every scene to know about unrelated scenes.

Use `SpriteGroup` when objects should move or rotate together, and use layers
for draw order. Keep collision checks near the gameplay rule they implement,
rather than scattering the same check across unrelated update functions.