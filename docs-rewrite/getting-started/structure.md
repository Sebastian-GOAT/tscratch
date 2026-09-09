# Project structure

The application entry point initializes the engine and registers the behavior
needed by the application. The engine stores named scenes, each with its own
sprites and optional loop.

```ts
const engine = Engine.init();
engine.setLoop('main', () => player.move(1));
engine.setScene('main');
```

Sprites use the `main` scene by default. A sprite can use a different `scene`
when it belongs to another screen.