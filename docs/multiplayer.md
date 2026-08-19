# Multiplayer

TScratch exposes a simple, event-driven multiplayer layer suitable for
lightweight real-time games. The API abstracts sockets into named events:
emit events to the server and listen for events from the server.

Client example

```ts
import { Multiplayer } from 'tscratch';

const connection = new Multiplayer('http://localhost:8080');
connection.on('welcome', (data) => {
    console.log('Server:', data);
});
```

Server example

```ts
import { Server } from 'tscratch/server';

const server = new Server({ port: 8080 });
server.onJoin((client) => {
    server.broadcast('welcome', 'Welcome to our server!', [client]);
});
```

Room features (see API):
- create/join/leave rooms
- per-player state updates and room-wide broadcasts
- optional room passwords and basic room management helpers

The multiplayer system is intentionally small and opinionated to keep it
easy to reason about in classroom settings. For production-scale networking,
consider integrating a dedicated backend.