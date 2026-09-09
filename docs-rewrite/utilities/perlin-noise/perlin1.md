`Perlin1D` generates smooth one-dimensional noise:

```ts
const noise = new Perlin1D();
noise.amplitude = 0.5;
noise.gradientCount = 64;
noise.regen();

const value = noise.get(2.5);
```

`get(x)` samples the noise. `amplitude` controls its scale and
`gradientCount` controls the repeating gradient map. Call `regen()` after
changing the gradient count to generate a new map.