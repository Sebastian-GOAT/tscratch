import type { Vec3 } from '@ctypes/Vectors.ts';

const phi = (1 + Math.sqrt(5)) / 2;
const a = 0.5 / phi;
const b = 0.5;

const icosahedronVertices: Vec3[] = [
    // (0, ±1, ±φ)
    [0, -b, -a * phi], [0, -b, a * phi], [0, b, -a * phi], [0, b, a * phi],
    // (±1, ±φ, 0)
    [-b, -a * phi, 0], [-b, a * phi, 0], [b, -a * phi, 0], [b, a * phi, 0],
    // (±φ, 0, ±1)
    [-a * phi, 0, -b], [a * phi, 0, -b], [-a * phi, 0, b], [a * phi, 0, b]
];

export default icosahedronVertices;