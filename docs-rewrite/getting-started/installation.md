# Installation

Create a Vite + TypeScript starter using the official helper:

```bash
npx create-tscratch-app@latest my-project
cd my-project
npm install
```

Import the client API from `tscratch`:

```ts
import { Engine, Rectangle } from 'tscratch';

const engine = Engine.init();
const player = new Rectangle({ color: 'royalblue' });

engine.setLoop('main', () => {
	player.move(1);
});
```

Server applications import the server entry point:

```ts
import { Server, RoomManager } from 'tscratch/server';
```

Run client code in a browser environment with DOM and canvas support. Keep
server code out of the browser bundle and client code out of the server entry
point.