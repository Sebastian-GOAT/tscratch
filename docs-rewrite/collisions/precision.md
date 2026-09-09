# Collision precision

`touching` has three precision modes:

- `AABB`: axis-aligned bounding boxes. Fastest, returns `boolean`.
- `partial`: pixel-perfect overlap. Returns `boolean` and is the default.
- `full`: pixel-perfect overlap plus contact information. Use this with two
	individual sprites.

```ts
const collision = player.touching(enemy, { precision: 'full' });
if (collision) {
		const { contact, normal, displacement } = collision;
		player.changeX(normal[0] * displacement);
		player.changeY(normal[1] * displacement);
}
```

`CollisionData` contains `contact: Vec2`, `normal: Vec2`, and
`displacement: number`. Full precision is not available for groups. Results
can be unpredictable for `Text`, `Watermark`, and `Button` sprites.