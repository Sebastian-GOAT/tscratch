# What is TScratch?

TScratch is a Scratch-inspired 2D game engine for TypeScript. It provides
typed sprites, scenes, collision checks, drawing tools, sound, multiplayer,
procedural utilities, and a small 3D renderer API.

The main client entry point is `tscratch`:

```ts
import { Engine, Rectangle } from 'tscratch';

const engine = Engine.init();
const sprite = new Rectangle({ color: 'red' });

engine.setLoop('main', () => sprite.move(1));
```

Server-only multiplayer code is available from `tscratch/server`. TScratch is
designed to keep the path from block-based ideas to typed game code direct:
create objects, put them in scenes, and update them in a loop.