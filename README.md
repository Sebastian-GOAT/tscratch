# 🐱 tscratch

A **Scratch-inspired 2D game engine** for **TypeScript**.  
Type-safe, lightweight, and fun — bring the simplicity of Scratch into real code.

---

## ✨ Features

- 🎮 **Scratch-style API** — `goTo`, `setX`, `moveSteps`, etc.  
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
rect.goTo(0, 0);

// Add it to the engine
engine.addSprite(rect);

// Animate in the game loop
engine.loop = () => {
  rect.setX(rect.x + 2); // move right every frame
};
```
## 🎨 Example: Multiple Sprites

```ts
import { Engine, Rectangle } from 'tscratch';

const engine = Engine.init();

const redBox = new Rectangle();
redBox.color = 'red';
redBox.goTo(-100, 0);

const blueBox = new Rectangle();
blueBox.color = 'blue';
blueBox.goTo(100, 0);

engine.addSprite(redBox);
engine.addSprite(blueBox);

engine.loop = () => {
  redBox.setX(redBox.x + 1);
  blueBox.setX(blueBox.x - 1);
};
```

## 🛠️ API Overview

### Engine

- `Engine.init()` → get the singleton instance  
- `engine.addSprite(sprite)` → add a sprite to the stage  
- `engine.loop = () => { ... }` → game loop logic  
- `engine.refreshAll()` → redraw all sprites  

### Sprite (abstract)

- `goTo(x, y)` → move to coordinates  
- `setX(x)` / `setY(y)` → set position  
- `changeXBy(dx)` / `changeYBy(dy)` → relative movement  
- `show()` / `hide()` → toggle visibility  

### Rectangle (example sprite)

- Has `width`, `height`, and `color` properties  
- Draws a rectangle centered on `(x, y)`

## License

MIT © 2025 sebastian-goat, see [LICENSE](./LICENSE)