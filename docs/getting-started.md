# Getting Started

## Quick Showcase

```ts
import { Engine, Rectangle } from 'tscratch';

// Initialize engine
const engine = Engine.init();

// Create a rectangle sprite
const rect = new Rectangle({ color: 'red' });
// Move it to x: 100, y: 50
rect.goTo(100, 50);

// Animate in the game loop
engine.setLoop('main', () => {
  rect.move(1);
  rect.turn(-2);
});
```
## Example: Multiple Sprites

```ts
import { Engine, Rectangle } from 'tscratch';

// Setup
const engine = Engine.init();

const redBox = new Rectangle({ scene: 'primary' });

redBox.setColor('red');
redBox.goTo(-100, 0);

const blueBox = new Rectangle({ scene: 'secondary' });

blueBox.setColor('blue');
blueBox.goTo(100, 0);

// Scenes & loops
engine.changeScene('primary');

engine.setLoop('primary', () => redBox.changeX(1));
engine.setLoop('secondary', () => blueBox.changeX(-1));
```

The recommended way of managing multiple scenes is to seperate your code into
1 file per scene, export the loop function and set the loops inside index.ts
(your entry file).

```ts
// scenes/main.ts

const rect = new Rectangle();

// Export the loop
export default () => rect.move(1);
```

```ts
// index.ts

import { Engine } from 'tscratch';
import main from './scenes/main.ts';

const engine = Engine.init();

// No need for changeScene() here, since we're in the 'main' scene
engine.setLoop('main', main);
```