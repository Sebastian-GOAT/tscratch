# Multiplayer client

Connect a browser client to a TScratch server with a typed player state:

```ts
type PlayerState = { x: number; y: number; color: string };
const multiplayer = new Multiplayer<PlayerState>('http://localhost:3000');

multiplayer.onRoomJoin(() => {
	console.log(multiplayer.roomId, multiplayer.roomClients);
});
multiplayer.createRoom({ x: 0, y: 0, color: 'red' });
```

The client exposes `id`, `roomId`, and `roomClients`. Use `createRoom`,
`joinRoom`, `leaveRoom`, `updatePlayerState`, `getRoomPlayerState`, and
`disconnect` for room and connection management. Register `onRoomJoin` and
`onRoomLeave` callbacks for lifecycle events.

For custom events, use `emit(eventName, data)` and `on(eventName, callback)`.