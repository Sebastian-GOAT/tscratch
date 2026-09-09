# Room manager

`RoomManager` adds room creation, joining, state synchronization, and access
control to a `Server`:

```ts
type PlayerState = { x: number; y: number };
const rooms = new RoomManager({
	server,
	defaultPlayerState: { x: 0, y: 0 },
	allowedPlayerState: ['x', 'y']
});

rooms.onJoin(client => console.log('joined', client.id));
rooms.onPlayerStateUpdate((client, state) => {
	console.log(client.id, state);
});
```

Import it from `tscratch/server`. Use `rooms` to inspect active rooms,
`updatePlayerState` to update a client, and `enableJoining` or
`disableJoining` to control access. `kick` removes a client and `ban` prevents
the client from joining again. Register `onJoin`, `onLeave`, and
`onPlayerStateUpdate` callbacks for room events.