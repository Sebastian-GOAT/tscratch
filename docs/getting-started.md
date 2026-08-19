# Getting Started

This quick guide shows how to initialize TScratch and create a simple scene.

Quick example

```ts
import { Engine, Rectangle } from 'tscratch';

const engine = Engine.init();

const rect = new Rectangle({ color: 'red' });
rect.goTo(100, 50);

engine.setLoop('main', () => {
  rect.move(1);
  rect.turn(-2);
});
```

Multiple scenes and sprites

```ts
import { Engine, Rectangle } from 'tscratch';

const engine = Engine.init();

const redBox = new Rectangle({ scene: 'primary' });
redBox.setColor('red');
redBox.goTo(-100, 0);

const blueBox = new Rectangle({ scene: 'secondary' });
blueBox.setColor('blue');
blueBox.goTo(100, 0);

engine.setScene('primary');
engine.setLoop('primary', () => redBox.changeX(1));
engine.setLoop('secondary', () => blueBox.changeX(-1));
```

Recommendations

- Organize each scene into its own module. Export the loop function from the
  scene file and register it from your entry point.
- Avoid putting heavy logic in a single frame; prefer small functions for clarity
  and testability.

Example file layout

```ts
// scenes/main.ts
const rect = new Rectangle();
export default function mainLoop() {
  rect.move(1);
}
```

```ts
// index.ts
import { Engine } from 'tscratch';
import mainLoop from './scenes/main';

const engine = Engine.init();
engine.setLoop('main', mainLoop);
```