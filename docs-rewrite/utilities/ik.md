`InverseKinematics` solves a chain of links anchored at `[0, 0]`:

```ts
const arm = new InverseKinematics([40, 30, 20], [60, 40]);
arm.computeApproximateAngles(20, 0.5);

const angles = arm.getAngles();
const points = arm.getPoints();
```

The constructor takes link lengths and a target `Vec2`. Public properties are
`links`, `angles`, and `target`. Use `setTarget(x, y)` to change the target,
`computeApproximateAngles(iterations, error)` to solve, and `getAngles()` or
`getPoints()` to read the result.