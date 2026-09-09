`Perlin2D` generates smooth two-dimensional noise:

```ts
const noise = new Perlin2D();
noise.amplitude = 0.5;
noise.gradientCount = 64;
noise.regen();

const value = noise.get(2.5, 1.25);
```

`get(x, y)` samples the noise. `amplitude` controls its scale and
`gradientCount` controls the repeating gradient grid. Call `regen()` after
changing the gradient count to generate a new grid.