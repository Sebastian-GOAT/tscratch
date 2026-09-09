# Multiplayer server

Create a Socket.IO-backed server from the server entry point:

```ts
import { Server } from 'tscratch/server';

const server = new Server({ port: 3000, corsOrigin: 'http://localhost:5173' });
server.onJoin(client => console.log('joined', client.id));
server.onLeave(client => console.log('left', client.id));
server.on('chat', (message, client) => {
	server.broadcast('chat', message, [client]);
});
```

`Server` exposes readonly `port`, `corsOrigin`, and `clients`. Use `on` for
typed client events, `onJoin` and `onLeave` for connection lifecycle, and
`broadcast` or `broadcastExcept` to send events.