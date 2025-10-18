# 🐱 tscratch

A **Scratch-inspired 2D game engine** for **TypeScript**.
Type-safe, lightweight, and fun — bring the simplicity of Scratch into real code.

---

## Live showcases

1. [Interactive Inverse Kinematics Simulation](https://tscratch-projects-ik.vercel.app)
2. [Recursive Snowflake Generator](https://tscratch-projects-ik.vercel.app)

## Features

- **Scratch-style API** — `goTo`, `setX`, `move`, etc.
- **TypeScript first** — full type safety & IntelliSense.
- **Canvas rendering** — built on the HTML5 canvas.
- **Sprites system** — extend `Sprite` to create your own shapes.
- **Lightweight** — no heavy dependencies, works in any TypeScript project.

---

## Installation

```sh
npm install tscratch
```

## Quick Start

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

## Scenes

TScratch supports scenes with the `scene` property. In every sprite you create,
you can specify, in which scene you want it to render. TScratch will default it
to 'main' if not specified.

After that, you can switch between scenes by using `engine.changeScene(scene)`.
TScratch will then render only the sprites, that belong in that specific scene.

You can also specify 1 loop per scene using `engine.setLoop(scene, callback)`.
Keep in mind that there is only 1 loop running at a time, which is the one
in the current scene.

## API Overview

### Engine

- `Engine.init()` → get the singleton instance
- `engine.setMaxFramesPerSecond(FPS)`→ sets the maximum FPS
- `engine.setLoop(scene, callback)` → game loop logic
- `engine.changeScene(scene)` → changes the scene, renders only the targeted sprites
- `await engine.wait(ms)` → Wait some time in milliseconds (experimental)
- `engine.toRadians(rad)` → converts degrees to radians
- `engine.toDegrees(deg)` → converts radians to degrees

### Sprite (abstract)

- `goTo(x, y)` → move to coordinates
- `setX(x)` / `setY(y)` → set position
- `changeX(x)` / `changeY(y)` → change position
- `turn(deg)` / `point(deg)` → change / set direction
- `changeX(dX)` / `changeY(dY)` → relative movement

### Rectangle

- Has `width`, `height`, and `color` properties.
- Draws a rectangle centered on `(x, y)`.

### RegularPolygon

- Has `radius`, `sides`, and `color` properties.
- Draws a polygon centered on `(x, y)`.

### Oval

- Has `radA`, `radB`, and `color` properties.
- Draws an oval centered on `(x, y)`.

### Text

- Has `content`, `color`, and other properties specifying the style.
- Draws a label aligned to your preference.

### ImageSprite

- Has `src`, `width`, and `height` properties.
- Draws an image centered on `(x, y)`.

### Pen

- Has `color`, `size`, and `drawing` properties.
- `down()` → starts drawing
- `up()` → stops drawing
- `dot()` → draws a single dot
- Movement methods, such as `move()`, can draw a line based on if `drawing` is true.

### Canvas

- `setScale` → sets the scale of the stage
- `setAspectRatio` → sets the aspect ratio of the stage

## License

MIT © 2025 sebastian-goat, see [LICENSE](./LICENSE)