`PathFinder` searches the canvas grid for a route around sprite obstacles.
Construct it with a target sprite and optional obstacles:

```ts
const finder = new PathFinder(target, [wallA, wallB]);
finder.setTileSize(25);

const path = finder.search(player.x, player.y);
if (path) {
	const [nextX, nextY] = path[1] ?? path[0]!;
	player.goTo(nextX, nextY);
}
```

`search(startX, startY)` returns a `Vec2[]` of grid points or `null` when no
route is found. Use `setTileSize`, `setObstacles`, and `setTarget` to update
the search configuration. Obstacles and the target are regular sprites and
are checked with the engine's collision system.