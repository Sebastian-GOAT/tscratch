# Multiplayer

TScratch includes a lightweight multiplayer system that lets projects communicate in real time using simple event-based messaging. Instead of dealing with raw sockets or complex networking logic, you can think in terms of sending and receiving named events. Both the client and server share the same mental model: **broadcast something**, or **listen for something**. This makes it easy to add collaborative features, shared game worlds, or synchronized state across multiple players.

## Example

### Client

```ts
import { Multiplayer } from 'tscratch';

const connection = Multiplayer.connect('http://localhost:8080'); // Assuming the server runs on localhost:8080

connection.on('welcome', data => {
    console.log(`The server says: ${data}`);
});
```

### Server

```ts
import Server from 'tscratch/server';

const server = new Server({ port: 8080 }); // Runs on localhost:8080

server.onJoin(client => {
    server.broadcast('welcome', 'Welcome to our server!', [client]);
});
```