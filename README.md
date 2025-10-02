# 🐱 tscratch

A **Scratch-inspired 2D game engine** for **TypeScript**.
Type-safe, lightweight, and fun — bring the simplicity of Scratch into real code.

---

## ✨ Features

- 🎮 **Scratch-style API** — `goTo`, `setX`, `move`, etc.
- ⚡ **TypeScript first** — full type safety & IntelliSense.
- 🖼️ **Canvas rendering** — built on the HTML5 canvas.
- 🧩 **Sprites system** — extend `Sprite` to create your own shapes.
- 🛠️ **Lightweight** — no heavy dependencies, works in any TypeScript project.

---

## 📦 Installation

```sh
npm install tscratch
```

## 🚀 Quick Start

```ts
import { Engine, Rectangle } from 'tscratch';

// Initialize engine
const engine = Engine.init();

// Create a rectangle sprite
const rect = new Rectangle();
// Add it to the engine
engine.addSprites(rect);

// Move it to the center
rect.goTo(0, 0);

// Animate in the game loop
engine.loop = () => {
  rect.changeX(2); // move right every frame
};
```
## 🎨 Example: Multiple Sprites

```ts
import { Engine, Rectangle } from 'tscratch';

const engine = Engine.init();

const redBox = new Rectangle();
engine.addSprite(redBox);

redBox.setColor('red');
redBox.goTo(-100, 0);

const blueBox = new Rectangle();
engine.addSprite(blueBox);

blueBox.setColor('blue');
blueBox.goTo(100, 0);

engine.loop = () => {
  redBox.changeX(1);
  blueBox.changeX(-1);
};
```

## 🛠️ API Overview

### Engine

- `Engine.init()` → get the singleton instance
- `engine.addSprites(...sprites)` → add sprites to the stage
- `engine.removeSprites(...sprites)` → removes sprites from the stage
- `engine.setFramesPerSecond(FPS)`→ sets the update time
- `engine.loop = () => { ... }` → game loop logic
- `engine.refresh()` → redraw all sprites
- `engine.toRadians` → converts degrees to radians
- `engine.toDegrees` → converts radians to degrees

### Sprite (abstract)

- `goTo(x, y)` → move to coordinates
- `setX(x)` / `setY(y)` → set position
- `changeX(x)` / `changeY(y)` → change position
- `turn(deg)` / `point(deg)` → change / set direction
- `changeX(dX)` / `changeY(dY)` → relative movement

### Rectangle (example sprite)

- Has `width`, `height`, and `color` properties
- Draws a rectangle centered on `(x, y)`

### Pen

- `down()` → starts drawing
- `up()` → stops drawing
- `dot()` → draws a single dot

### Canvas

- `setScale` → sets the scale of the stage
- `setAspectRatio` → sets the aspect ratio of the stage

## License

MIT © 2025 sebastian-goat, see [LICENSE](./LICENSE)