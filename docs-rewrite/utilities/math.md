`TSCMath` provides degree-based trigonometry and vector helpers. Angles passed
to `sin`, `cos`, and `tan` are degrees, and inverse functions return degrees.

```ts
TSCMath.sin(90); // 1
TSCMath.toRadians(180); // Math.PI

const direction = TSCMath.normalize([3, 4]);
const distance = TSCMath.magnitude([3, 4]);
const alignment = TSCMath.dot([1, 0, 0], [0, 1, 0]);
```

Random and vector methods include `pickRandom`, `magnitude`, `normalize`,
`add`, `subtract`, `multiply`, `dot`, and `cross` (for `Vec3`). Angle methods
include `toRadians`, `toDegrees`, `sin`, `cos`, `tan`, `csc`, `sec`, `cot`,
`asin`, `acos`, `acsc`, and `asec`.

The exported tuple types are `Vec2`, `Vec3`, `Vec4`, `Mat2`, `Mat3`, and
`Mat4`. The instance matrix-multiplication helper is not part of the usable
static API; use the exported static vector operations instead.

## Timer

`Timer` is a paused stopwatch by default:

```ts
const timer = new Timer();
timer.start();
const elapsed = timer.getTime();
timer.lap();
timer.pause();
```

Use `isRunning`, `getLaps`, `reset`, and `addTime(seconds)` for timer state.