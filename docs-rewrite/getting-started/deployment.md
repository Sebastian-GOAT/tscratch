# Deploy TScratch projects

Build TScratch projects with the same toolchain you use for other TypeScript
applications. The browser bundle must include the client package and the
server process must run separately when multiplayer is enabled.

Before deploying, check that:

- `Engine.init()` is called at least once at the start of your app;
- assets used by `ImageSprite` are available at their deployed URLs;
- the multiplayer client connects to the public server URL, not `localhost`;
- the server CORS origin allows the deployed browser origin.

For a static client, publish the generated HTML, JavaScript, and image/audio
assets to any static host. For multiplayer, deploy the server separately and
use `new Multiplayer('https://your-server.example')` in the client.