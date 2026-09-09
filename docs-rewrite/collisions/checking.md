# Collision checking

Use `sprite.touching(other)` to test whether two sprites overlap. The default
precision is pixel-perfect and returns a boolean:

```ts
if (player.touching(enemy))
	enemy.hide();
```

Pass a precision option for a faster test:

```ts
if (player.touching(wall, { precision: 'AABB' }))
	player.changeX(-1);
```

Sprites can check a `SpriteGroup` as well. For many sprites,
`Sprite.touchingPairs` checks each unique pair once:

```ts
Sprite.touchingPairs(enemies, (a, b) => {
	a.hide();
	b.hide();
}, { precision: 'partial' });
```